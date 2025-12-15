from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Course, AttendanceSession, AttendanceRecord

# Define how the User should look in Admin
class CustomUserAdmin(UserAdmin):
    model = User
    # Add our custom fields to the "Edit User" page
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'profile_image', 'device_id')}),
    )
    # Add our custom fields to the "Add User" page
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'profile_image', 'device_id')}),
    )

# Register the User with the special Admin class
admin.site.register(User, CustomUserAdmin)
admin.site.register(Course)
admin.site.register(AttendanceSession)
admin.site.register(AttendanceRecord)