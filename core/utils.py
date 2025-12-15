from geopy.distance import geodesic

# --- TEMPORARY: Comment out the AI library ---
# import face_recognition
# import numpy as np

# 1. Location Checker (This still works!)
def is_within_radius(student_loc, college_loc, radius_meters):
    distance = geodesic(student_loc, college_loc).meters
    return distance <= radius_meters

# 2. Face Matcher (BYPASS MODE)
def check_face_match(profile_image_path, captured_image_path):
    """
    TEMPORARY BYPASS:
    Since the AI library is stuck installing, we will just return True.
    This lets you build the frontend and test the flow.
    """
    print("⚠️ WARNING: AI Face Check is skipped (Library disabled)")
    return True