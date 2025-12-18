from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course,AttendanceSession, AttendanceRecord
from .serializers import AttendanceSerializer
from .utils import is_within_radius, check_face_match
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from .models import User
from django.db.models import Count
import base64
from django.core.files.base import ContentFile
class HomeView(APIView):
    def get(self, request):
        # Fetch counts for the graphs
        student_count = User.objects.filter(role='STUDENT').count()
        faculty_count = User.objects.filter(role='FACULTY').count()
        admin_count = User.objects.filter(role='ADMIN').count()
        
        context = {
            'student_count': student_count,
            'faculty_count': faculty_count,
            'admin_count': admin_count
        }
        return render(request, 'core/home.html', context)
from datetime import timedelta # Import this at top
# ...

# core/views.py
from datetime import timedelta
from django.utils import timezone
from .utils import check_face_match, is_within_radius # Ensure this is imported

# core/views.py

class MarkAttendanceView(APIView):
    def post(self, request):
        # 1. Get Data Manually (Since we aren't using serializer to save yet)
        session_id = request.data.get('session')
        gps_lat = float(request.data.get('gps_lat'))
        gps_long = float(request.data.get('gps_long'))
        live_image = request.FILES.get('captured_image') # The file in RAM
        student = request.user

        # 0. BASIC CHECKS
        if not live_image:
            return Response({"error": "No image uploaded!"}, status=400)
        
        if not student.reference_image:
             return Response({"error": "Security Scan missing! Please re-register."}, status=400)

        try:
            session = AttendanceSession.objects.get(id=session_id)
        except AttendanceSession.DoesNotExist:
            return Response({"error": "Session ID invalid"}, status=400)

        # ---------------------------------------------------------
        # 1. PRIORITY CHECK: FACE RECOGNITION (In Memory) 👁️
        # ---------------------------------------------------------
        print("🤖 Verifying Face in Memory (No Save)...")
        
        # We pass the 'live_image' file object directly to utils
        is_match = check_face_match(student.reference_image.path, live_image)
        
        if not is_match:
            return Response({"error": "Face mismatch! Identity verification failed."}, status=400)

        # ---------------------------------------------------------
        # 2. DURATION CHECK ⏳
        # ---------------------------------------------------------
        if not session.is_active:
            return Response({"error": "Time is up! Class has ended."}, status=400)

        # ---------------------------------------------------------
        # 3. 1-HOUR COOLDOWN CHECK 🕐
        # ---------------------------------------------------------
        last_record = AttendanceRecord.objects.filter(student=student).order_by('-timestamp').first()
        if last_record:
            time_since_last = timezone.now() - last_record.timestamp
            if time_since_last < timedelta(hours=1):
                wait_time = 60 - int(time_since_last.total_seconds() / 60)
                return Response({"error": f"You marked attendance recently. Please wait {wait_time} minutes."}, status=400)

        # ---------------------------------------------------------
        # 4. LOCATION CHECK 📍
        # ---------------------------------------------------------
        student_loc = (gps_lat, gps_long)
        college_loc = (session.latitude, session.longitude)
        
        if not is_within_radius(student_loc, college_loc, session.radius_meters):
             return Response({"error": "You are outside the class radius!"}, status=400)

        # ---------------------------------------------------------
        # 5. SUCCESS: CREATE RECORD (Without Image) ✅
        # ---------------------------------------------------------
        AttendanceRecord.objects.create(
            session=session,
            student=student,
            gps_lat=gps_lat,
            gps_long=gps_long,
            status="PRESENT",
            captured_image=None  # Explicitly saving NO image
        )

        return Response({
            "message": "Attendance Marked!",
            "class_name": session.course.name,
            "faculty_name": session.course.faculty.username,
            "topic": session.topic
        }, status=201)


# core/views.py
from django.utils import timezone

class FacultyDashboardView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return redirect('login')
        
        # 1. Check if this Faculty already has an ACTIVE session running
        # We look for a session created by this faculty that is still valid (time-wise)
        faculty_courses = Course.objects.filter(faculty=request.user)
        active_session = None
        
        # Find the first session that hasn't expired
        for session in AttendanceSession.objects.filter(course__in=faculty_courses):
            if session.is_active:
                active_session = session
                break
        
        context = {}
        
        if active_session:
            # STATE A: Class is Running -> Show the Live Table
            records = AttendanceRecord.objects.filter(session=active_session).order_by('-timestamp')
            context = {
                'is_active': True,
                'session': active_session,
                'records': records,
                'student_count': records.count()
            }
        else:
            # STATE B: No Class -> Show the Start Form
            # Auto-select the first course (Constraint: "Only one faculty having allocated subject")
            course = faculty_courses.first() 
            context = {
                'is_active': False,
                'my_course': course  # Pass single course to display name
            }

        return render(request, 'core/dashboard.html', context)

    def post(self, request):
        if not request.user.is_authenticated:
            return redirect('login')
            
        # Handle "Stop Session" if requested
        if 'stop_session' in request.POST:
            # In a real app, we would set a flag in DB. 
            # For now, we rely on time, so we can't easily "stop" it without DB changes.
            # But the user didn't ask for Stop logic yet, so let's focus on START.
            pass

        # Handle "Start Session"
        # 1. Get the Faculty's Course (Auto-select)
        course = Course.objects.filter(faculty=request.user).first()
        if not course:
             return render(request, 'core/dashboard.html', {'error': "You are not assigned to any course!"})

        # 2. Get Form Data
        duration = int(request.POST.get('duration', 10))
        # Extra fields (Department, Block, Room) - We accept them but don't save them yet
        dept = request.POST.get('department') 
        block = request.POST.get('block')
        room = request.POST.get('room_no')

        # 3. Create Session
        AttendanceSession.objects.create(
            course=course,
            duration_minutes=duration,
            latitude=17.3850, # Hardcoded for now (or get from request)
            longitude=78.4867
        )
        
        return redirect('faculty_dashboard')

# core/views.py

class StudentPortalView(LoginRequiredMixin, TemplateView):
    template_name = 'core/student_attendance.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # 1. Find ALL active sessions
        # Logic: Get all sessions where 'is_active' is True (we check time in Python)
        active_sessions = []
        all_sessions = AttendanceSession.objects.all()
        
        for session in all_sessions:
            if session.is_active:
                active_sessions.append(session)
        
        context['active_sessions'] = active_sessions
        return context


def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        role = request.POST.get('role')
        
        # 1. Get the Files
        photo_file = request.FILES.get('profile_image')       # The Uploaded File
        live_image_data = request.POST.get('live_image_data') # The Live Capture Base64

        if not photo_file or not live_image_data:
             return render(request, 'core/signup.html', {'error': "Both Profile Photo and Live Scan are required!"})

        try:
            user = User.objects.create_user(username=username, password=password)
            user.role = role
            
            # A. Save Display Photo
            user.profile_image = photo_file
            
            # B. Save Security Reference (Convert Base64)
            format, imgstr = live_image_data.split(';base64,') 
            ext = format.split('/')[-1]
            file_data = ContentFile(base64.b64decode(imgstr), name=f'{username}_security_ref.{ext}')
            
            user.reference_image = file_data # <--- SAVED TO NEW FIELD

            user.save()
            login(request, user)
            
            if role == 'STUDENT':
                return redirect('student_portal')
            return redirect('faculty_dashboard')
            
        except Exception as e:
            return render(request, 'core/signup.html', {'error': str(e)})

    return render(request, 'core/signup.html')
# core/views.py

def login_view(request):
    if request.method == 'POST':
        # 1. Get Data from Form
        u_name = request.POST.get('username')
        pass_word = request.POST.get('password')
        selected_role = request.POST.get('role') # <--- Get the dropdown value

        # 2. Standard Django Authentication
        user = authenticate(username=u_name, password=pass_word)

        if user is not None:
            # 3. CUSTOM CONDITION: Check Role Match
            # We compare the role in Database (user.role) vs Dropdown (selected_role)
            if user.role != selected_role:
                # Mismatch! Deny access.
                return render(request, 'core/login.html', {
                    'error': f"Access Denied: You are not registered as a {selected_role.capitalize()}."
                })

            # 4. Success - Log them in
            login(request, user)

            # 5. Redirect based on role
            if user.role == 'STUDENT':
                return redirect('student_portal')
            elif user.role == 'FACULTY':
                return redirect('faculty_dashboard')
            elif user.role == 'ADMIN':
                return redirect('/admin/')
            
        else:
            # Authentication failed (Wrong Username/Password)
            return render(request, 'core/login.html', {'error': "Invalid Username or Password."})

    return render(request, 'core/login.html')

# 3. NEW HELPER: Redirect already logged-in users
def login_redirect_view(request):
    """
    Helper function: If a user clicks 'Dashboard' from the home page,
    this sends them to the correct place based on their role.
    """
    if not request.user.is_authenticated:
        return redirect('login')
        
    if request.user.role == 'STUDENT':
        return redirect('student_portal')
    elif request.user.role == 'FACULTY':
        return redirect('faculty_dashboard')
    else:
        return redirect('/admin/')

def logout_view(request):
    logout(request)
    return redirect('login')