from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone

# 1. Custom User Model (Handles Students, Faculty, Admin)
class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('FACULTY', 'Faculty'),
        ('ADMIN', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    device_id = models.CharField(max_length=100, blank=True, null=True) # For security

# 2. The Course (e.g., Python 101)
class Course(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'FACULTY'})

    def __str__(self):
        return self.name

# 3. The Active Class Session (Created by Faculty)
class AttendanceSession(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    duration_minutes = models.IntegerField(default=10)
    latitude = models.FloatField()  # Faculty's location (College center)
    longitude = models.FloatField()
    radius_meters = models.IntegerField(default=200) # Allowed distance

    @property
    def is_active(self):
        return timezone.now() < self.start_time + timedelta(minutes=self.duration_minutes)

# 4. The Attendance Record (Marked by Student)
class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    timestamp = models.DateTimeField(auto_now_add=True)
    captured_image = models.ImageField(upload_to='attendance_captures/')
    gps_lat = models.FloatField()
    gps_long = models.FloatField()
    status = models.CharField(max_length=20, default='PRESENT') # PRESENT or REJECTED