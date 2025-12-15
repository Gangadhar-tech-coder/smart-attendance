from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from core.views import (
    HomeView,              # <--- New
    FacultyDashboardView, 
    StudentPortalView, 
    login_view, 
    signup_view, 
    logout_view, 
    MarkAttendanceView,
    login_redirect_view    # <--- New
)
urlpatterns = [
    # 1. The Public Home Page (Root URL)
    path('', HomeView.as_view(), name='home'),

    # 2. The Role-Based Dashboards (Separated)
    path('faculty/', FacultyDashboardView.as_view(), name='faculty_dashboard'), # Moved to /faculty/
    path('student/', StudentPortalView.as_view(), name='student_portal'),
    
    # 3. Authentication
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('logout/', logout_view, name='logout'),
    path('dashboard-redirect/', login_redirect_view, name='login_redirect'), # Helper link
    
    # 4. Admin & API
    path('admin/', admin.site.urls),
    path('api/mark-attendance/', MarkAttendanceView.as_view(), name='mark-attendance'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)