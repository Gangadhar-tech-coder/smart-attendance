from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course,AttendanceSession, AttendanceRecord
from .serializers import AttendanceSerializer
from .utils import is_within_radius, check_face_match
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
class MarkAttendanceView(APIView):
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            session_id = request.data.get('session')
            student = request.user # The user logged in via the script
            lat = float(request.data.get('gps_lat'))
            long = float(request.data.get('gps_long'))
            
            # --- 1. SAFETY CHECK: Does the student have a profile photo? ---
            if not student.profile_image:
                return Response(
                    {"error": "Profile image missing! Please ask Admin to upload your photo."}, 
                    status=400
                )
            # -------------------------------------------------------------

            # 2. Check if Session is Active
            try:
                session = AttendanceSession.objects.get(id=session_id)
            except AttendanceSession.DoesNotExist:
                return Response({"error": "Session ID does not exist"}, status=400)
                
            if not session.is_active:
                return Response({"error": "Time is up!"}, status=400)

            # 3. Check Location
            college_loc = (session.latitude, session.longitude)
            student_loc = (lat, long)
            if not is_within_radius(student_loc, college_loc, session.radius_meters):
                return Response({"error": "You are outside the college!"}, status=400)

            # 4. Save & Verify Face
            record = serializer.save(student=student) # Force save to current user
            
            # Match faces (The student.profile_image.path will now definitely exist)
            match = check_face_match(student.profile_image.path, record.captured_image.path)
            
            if not match:
                record.status = "REJECTED"
                record.save()
                return Response({"error": "Face mismatch!"}, status=400)

            return Response({"message": "Attendance Marked!"}, status=201)
        
        return Response(serializer.errors, status=400)




class FacultyDashboardView(LoginRequiredMixin, APIView):
    # This prevents students from seeing the dashboard
    def get(self, request):
        # 1. Get courses taught by this user
        # (For testing, we get ALL courses if you are Admin)
        if request.user.is_superuser:
            courses = Course.objects.all()
        else:
            courses = Course.objects.filter(faculty=request.user)

        # 2. Get recent attendance records
        recent_records = AttendanceRecord.objects.all().order_by('-timestamp')[:10]

        context = {
            'courses': courses,
            'recent_records': recent_records
        }
        return render(request, 'core/dashboard.html', context)

    def post(self, request):
        # This handles the "Start Attendance" button
        course_id = request.POST.get('course_id')
        duration = int(request.POST.get('duration'))
        
        # Create the session
        course = Course.objects.get(id=course_id)
        # Use hardcoded Lat/Long for now (College Center)
        session = AttendanceSession.objects.create(
            course=course,
            duration_minutes=duration,
            latitude=17.3850, # Update this to your location if needed
            longitude=78.4867
        )
        
        return redirect('dashboard')


class StudentPortalView(LoginRequiredMixin, TemplateView):
    template_name = 'core/student_attendance.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Find the most recent active session to help the template
        # In a real app, we'd list all active sessions
        active_session = AttendanceSession.objects.last()
        if active_session and active_session.is_active:
            context['session_id'] = active_session.id
        return context