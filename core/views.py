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
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.http import JsonResponse
class HomeView(TemplateView):
    template_name = 'core/home.html'

from datetime import timedelta # Import this at top
# ...

# core/views.py
from datetime import timedelta
from django.utils import timezone
from .utils import check_face_match, is_within_radius # Ensure this is imported

@method_decorator(csrf_exempt, name='dispatch')
class MarkAttendanceView(APIView):
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            student = request.user
            session_id = request.data.get('session')

            # 0. BASIC VALIDATION (Before saving anything)
            if not student.profile_image:
                 return Response({"error": "You don't have a profile photo set!"}, status=400)
            
            session = None
            # If session id provided, prefer it
            if session_id:
                try:
                    session = AttendanceSession.objects.get(id=session_id)
                except AttendanceSession.DoesNotExist:
                    return Response({"error": "Session ID does not exist"}, status=400)
            else:
                # Fallback: pick first active session
                for s in AttendanceSession.objects.all():
                    if s.is_active:
                        session = s
                        break
                if not session:
                    return Response({"error": "No active attendance session found"}, status=400)

            # ---------------------------------------------------------
            # 1. SAVE RECORD TEMPORARILY
            # (We must save it to disk first so the AI library can read the file path)
            # ---------------------------------------------------------
            record = serializer.save(student=student)

            # ---------------------------------------------------------
            # 2. PRIORITY CHECK: FACE RECOGNITION 👁️
            # ---------------------------------------------------------
            # Prefer using the profile image as the persistent reference (uploaded at signup)
            print("🤖 Starting AI Face Check against profile image...")
            ref_path = None
            if student.profile_image:
                try:
                    ref_path = student.profile_image.path
                except Exception:
                    ref_path = None

            if not ref_path and student.reference_image:
                try:
                    ref_path = student.reference_image.path
                except Exception:
                    ref_path = None

            if not ref_path:
                record.delete()
                return Response({"error": "No reference image available for this account."}, status=400)

            is_match = check_face_match(ref_path, record.captured_image.path)
            if not is_match:
                record.delete()
                return Response({"error": "Face not recognized. Keep your face clearly in frame."}, status=400)

            # ---------------------------------------------------------
            # 3. SECOND CHECK: CLASS DURATION ⏳
            # ---------------------------------------------------------
            if not session.is_active:
                record.delete() # ❌ Delete logic
                return Response({"error": "Time is up! Class has ended."}, status=400)

            # ---------------------------------------------------------
            # 4. THIRD CHECK: 1-HOUR COOLDOWN 🕐
            # ---------------------------------------------------------
            # We verify the *previous* record (excluding the one we just saved)
            last_record = AttendanceRecord.objects.filter(student=student).exclude(id=record.id).order_by('-timestamp').first()
            
            if last_record:
                time_since_last = timezone.now() - last_record.timestamp
                if time_since_last < timedelta(hours=1):
                    wait_time = 60 - int(time_since_last.total_seconds() / 60)
                    record.delete() # ❌ Delete logic
                    return Response(
                        {"error": f"You marked attendance recently. Please wait {wait_time} minutes."}, 
                        status=400
                    )

            # ---------------------------------------------------------
            # 5. FINAL CHECK: LOCATION (GPS) 📍
            # ---------------------------------------------------------
            student_loc = (float(request.data.get('gps_lat')), float(request.data.get('gps_long')))
            college_loc = (session.latitude, session.longitude)
            # ... inside post method ...

            # ---------------------------------------------------------
            # 4. FACE CHECK LOGIC (Updated)
            # ---------------------------------------------------------
            
              # Location check
              if not is_within_radius(student_loc, college_loc, session.radius_meters):
                  record.delete()
                  return Response({"error": "Out of range"}, status=400)

            # ---------------------------------------------------------
            # 6. SUCCESS: FINALIZE RECORD ✅
            # ---------------------------------------------------------
            record.status = "PRESENT"
            record.save()

            return Response({
                "message": "Attendance Marked!",
                "class_name": session.course.name,
                "faculty_name": session.course.faculty.username,
                "topic": session.topic
            }, status=201)

        return Response(serializer.errors, status=400)


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

            # Save names and department if provided
            first_name = request.POST.get('first_name') or request.POST.get('firstName')
            last_name = request.POST.get('last_name') or request.POST.get('lastName')
            dept = request.POST.get('department')
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if dept:
                try:
                    user.department = dept
                except Exception:
                    pass

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
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            # --- THE CONSTRAINT LOGIC ---
            if user.role == 'STUDENT':
                return redirect('student_portal')
            elif user.role == 'FACULTY':
                return redirect('faculty_dashboard')
            elif user.role == 'ADMIN' or user.is_superuser:
                return redirect('/admin/') # Send Admins to Django Admin Panel
            else:
                return redirect('home') # Fallback
            # ---------------------------
    else:
        form = AuthenticationForm()
    
    return render(request, 'core/login.html', {'form': form})

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
from django.http import JsonResponse

def home_stats_api(request):
    students = User.objects.filter(role='STUDENT').count()
    faculty = User.objects.filter(role='FACULTY').count()
    admins = User.objects.filter(role='ADMIN').count()

    return JsonResponse({
        "students": students,
        "faculty": faculty,
        "admins": admins,
        "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
        "attendance": [12, 18, 15, 22, 19]  # dummy for now
    })


def current_user_api(request):
    """Return minimal JSON for the currently authenticated user."""
    user = request.user
    if not user or not user.is_authenticated:
        return JsonResponse({'error': 'Unauthenticated'}, status=401)

    profile_url = None
    try:
        if user.profile_image:
            profile_url = user.profile_image.url
    except Exception:
        profile_url = None

    return JsonResponse({
        'username': user.username,
        'name': user.get_full_name() or user.username,
        'role': user.role,
        'email': user.email,
        'profile_image': profile_url
    })
