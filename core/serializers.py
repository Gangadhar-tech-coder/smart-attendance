from rest_framework import serializers
from .models import AttendanceRecord

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['session', 'student', 'captured_image', 'gps_lat', 'gps_long']
        read_only_fields = ['student']