import face_recognition
from geopy.distance import geodesic

def is_within_radius(student_loc, college_loc, radius_meters):
    distance = geodesic(student_loc, college_loc).meters
    print(f"📍 GPS Debug: Dist={distance}m (Allowed={radius_meters}m)")
    return distance <= radius_meters

def check_face_match(profile_image_path, captured_image_path):
    print(f"🤖 AI Debug: Comparing images...")
    print(f"   - Profile: {profile_image_path}")
    print(f"   - Capture: {captured_image_path}")

    try:
        # Load Profile
        known_image = face_recognition.load_image_file(profile_image_path)
        known_encodings = face_recognition.face_encodings(known_image)
        if len(known_encodings) == 0:
            print("❌ AI Fail: No face in Profile Image")
            return False # STRICT FAIL

        # Load Capture
        unknown_image = face_recognition.load_image_file(captured_image_path)
        unknown_encodings = face_recognition.face_encodings(unknown_image)
        if len(unknown_encodings) == 0:
            print("❌ AI Fail: No face in Captured Selfie")
            return False # STRICT FAIL

        # Compare
        distance = face_recognition.face_distance([known_encodings[0]], unknown_encodings[0])[0]
        print(f"📉 AI Debug: Similarity Score = {distance} (Threshold 0.5)")

        if distance < 0.5:
            print("✅ AI Result: MATCH")
            return True
        else:
            print("⛔ AI Result: MISMATCH")
            return False

    except Exception as e:
        print(f"❌ CRITICAL AI ERROR: {e}")
        return False # Fail on any error