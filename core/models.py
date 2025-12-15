# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

# 1. Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('FACULTY', 'Faculty'),
        ('ADMIN', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    device_id = models.CharField(max_length=100, blank=True, null=True)

# 2. Course Model
class Course(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'FACULTY'})

    def __str__(self):
        return self.name

# 3. Attendance Session (With your new 'topic' field)
class AttendanceSession(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    duration_minutes = models.IntegerField(default=10)
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius_meters = models.IntegerField(default=200)
    
    # The new field you requested
    topic = models.CharField(max_length=200, default="General Class")

    @property
    def is_active(self):
        return timezone.now() < self.start_time + timedelta(minutes=self.duration_minutes)

    def __str__(self):
        return f"{self.course.name} ({self.start_time.date()})"

# 4. Attendance Record (Links to Session)
class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    timestamp = models.DateTimeField(auto_now_add=True)
    captured_image = models.ImageField(upload_to='attendance_captures/')
    gps_lat = models.FloatField()
    gps_long = models.FloatField()
    status = models.CharField(max_length=20, default='PRESENT') # PRESENT or REJECTED