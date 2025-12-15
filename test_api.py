import requests

# 1. SETUP: Your details
URL = 'http://127.0.0.1:8000/api/mark-attendance/'
USERNAME = 'Gangu'  # Change this to your student username
PASSWORD = 'Gangu@2005' # Change this to your student password

# 2. DATA: Mimic the phone's GPS
data = {
    'session': 2,         # The ID of the session you just created (likely 1)
    'gps_lat': 17.5538,   # Use the SAME Lat/Long you put in the Session
    'gps_long':  78.4368,
    'student': 5 # Just passing ID (though backend uses logged-in user)
}

# 3. FILE: Load the selfie
files = {
    'captured_image': open('selfie.jpg', 'rb')
}

# 4. SEND: Hit the Server
print(f"🚀 Sending request to {URL}...")
try:
    response = requests.post(URL, data=data, files=files, auth=(USERNAME, PASSWORD))
    
    # 5. RESULT
    print(f"Status Code: {response.status_code}")
    print("Server Response:", response.json())
except Exception as e:
    print("Error:", e)