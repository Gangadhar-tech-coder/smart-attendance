from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from core.views import MarkAttendanceView, FacultyDashboardView, StudentPortalView

def home(request):
    return HttpResponse("<h1>Smart Attendance System is Running! 🚀</h1>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/mark-attendance/', MarkAttendanceView.as_view(), name='mark-attendance'),
    path('', FacultyDashboardView.as_view(), name='dashboard'),
    path('student/', StudentPortalView.as_view(), name='student_portal'),
]

# This allows Django to serve images (like profile pics) during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)