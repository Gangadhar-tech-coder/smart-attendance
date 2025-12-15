import face_recognition

print("--- STARTING AI TEST ---")

# 1. Load Image A
print("Loading Person A...")
try:
    img_a = face_recognition.load_image_file("selfie.jpg")
    enc_a = face_recognition.face_encodings(img_a)[0]
except Exception as e:
    print(f"❌ Error loading Person A: {e}")
    exit()

# 2. Load Image B
print("Loading Person B...")
try:
    img_b = face_recognition.load_image_file("yash.jpeg")
    enc_b = face_recognition.face_encodings(img_b)[0]
except Exception as e:
    print(f"❌ Error loading Person B: {e}")
    exit()

# 3. Compare
print("Comparing...")
# Calculate the distance (Lower = More Similar)
distance = face_recognition.face_distance([enc_a], enc_b)[0]
print(f"📉 Face Distance: {distance}")

# 4. Result
if distance < 0.5:
    print("❌ RESULT: MATCH (System thinks they are the same person)")
else:
    print("✅ RESULT: MISMATCH (System correctly sees they are different)")

print("--- END TEST ---")