# core/utils.py
import face_recognition
from geopy.distance import geodesic

# Location check remains same...
def is_within_radius(student_loc, college_loc, radius_meters):
    distance = geodesic(student_loc, college_loc).meters
    return distance <= radius_meters

# UPDATED FACE CHECKER
def check_face_match(reference_image_path, captured_image_file):
    try:
        # 1. Load Reference (From Disk - The Saved Scan)
        known_image = face_recognition.load_image_file(reference_image_path)
        known_encodings = face_recognition.face_encodings(known_image)
        
        if len(known_encodings) == 0:
            return False 
        
        known_encoding = known_encodings[0]

        # 2. Load Captured (From Memory - The Live Upload)
        # We can pass the file object directly!
        unknown_image = face_recognition.load_image_file(captured_image_file)
        unknown_encodings = face_recognition.face_encodings(unknown_image)

        if len(unknown_encodings) == 0:
            return False

        # 3. Compare
        distance = face_recognition.face_distance([known_encoding], unknown_encodings[0])[0]
        
        # 0.5 is the strictness threshold
        return distance < 0.5

    except Exception as e:
        print(f"❌ AI Error: {e}")
        return False