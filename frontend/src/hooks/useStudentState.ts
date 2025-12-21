import { useState, useRef, useEffect } from 'react';
import { MOCK_COURSES, getActiveAttendanceSession } from '../data/mockData';

interface AttendanceSession {
  courseCode: string;
  duration: number;
  startTime: string;
  location: { lat: number; lng: number };
  faculty: string;
}

const LOCATION_TOLERANCE_METERS = 500;

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useStudentState = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, any>>({});
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeAttendanceSession, setActiveAttendanceSession] = useState<AttendanceSession | null>(null);
  const [blinkingCourse, setBlinkingCourse] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Monitor for active attendance sessions
  useEffect(() => {
    sessionCheckRef.current = setInterval(() => {
      const session = getActiveAttendanceSession();
      if (session) {
        setActiveAttendanceSession(session);
        setBlinkingCourse(session.courseCode);
      } else {
        setActiveAttendanceSession(null);
        setBlinkingCourse(null);
      }
    }, 1000);

    return () => {
      if (sessionCheckRef.current) clearInterval(sessionCheckRef.current);
    };
  }, []);

  const startCamera = async (course: any) => {
    const today = new Date().toDateString();
    const recordKey = `${course.code}-${today}`;
    
    if (attendanceRecords[recordKey]) {
      alert('Attendance already marked for this course today!');
      return;
    }

    // Check if there's an active attendance session for this course
    const session = getActiveAttendanceSession();
    if (!session || session.courseCode !== course.code) {
      alert('Faculty has not started attendance for this course. Wait for faculty to initiate.');
      return;
    }

    setSelectedCourse(course);
    setCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or not available');
      setCameraActive(false);
    }
  };

  const captureAttendance = () => {
    if (!selectedCourse || !activeAttendanceSession) return;

    if (!navigator.geolocation) {
      alert('Geolocation not supported on this device');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const distance = calculateDistance(
        activeAttendanceSession.location.lat,
        activeAttendanceSession.location.lng,
        position.coords.latitude,
        position.coords.longitude
      );

      // Capture frame from video
      if (!videoRef.current) {
        alert('Camera not available');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('Failed to capture image');
        return;
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Failed to capture image. Keep your face clearly in frame.');
          return;
        }

        const form = new FormData();
        form.append('captured_image', blob, `${selectedCourse.code}_capture.jpg`);
        form.append('gps_lat', String(position.coords.latitude));
        form.append('gps_long', String(position.coords.longitude));
        // session id not available in frontend mock, backend will pick active session

        try {
          const resp = await fetch('/api/mark-attendance/', {
            method: 'POST',
            body: form,
            credentials: 'include'
          });

          const data = await resp.json().catch(() => ({}));
          if (resp.ok) {
            const today = new Date().toDateString();
            const recordKey = `${selectedCourse.code}-${today}`;
            setAttendanceRecords(prev => ({
              ...prev,
              [recordKey]: {
                courseCode: selectedCourse.code,
                date: today,
                time: new Date().toLocaleTimeString(),
                studentLat: position.coords.latitude,
                studentLng: position.coords.longitude
              }
            }));

            setCourses(prev => prev.map(c => 
              c.code === selectedCourse.code 
                ? { ...c, attended: c.attended + 1, total: c.total + 1 }
                : c
            ));

            alert(data.message || `Attendance marked successfully for ${selectedCourse.code}!`);
            stopCamera();
          } else {
            const err = data.error || 'Attendance could not be marked';
            alert(err);
          }
        } catch (e) {
          console.error(e);
          alert('Failed to send attendance to server');
        }
      }, 'image/jpeg');
    }, (error) => {
      alert('Failed to get your location: ' + error.message);
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setSelectedCourse(null);
  };

  return {
    courses,
    setCourses,
    cameraActive,
    setCameraActive,
    selectedCourse,
    setSelectedCourse,
    attendanceRecords,
    setAttendanceRecords,
    currentView,
    setCurrentView,
    videoRef,
    streamRef,
    activeAttendanceSession,
    blinkingCourse,
    startCamera,
    captureAttendance,
    stopCamera
  };
};
