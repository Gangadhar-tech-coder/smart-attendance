import { useState, useRef, useEffect } from 'react';
import { MOCK_STUDENTS_DATA, getActiveAttendanceSession, setActiveAttendanceSession, clearActiveAttendanceSession } from '../data/mockData';

interface Student {
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent';
}

interface AttendanceSession {
  courseCode: string;
  duration: number;
  startTime: string;
  location: { lat: number; lng: number };
  faculty: string;
}

const LOCATION_TOLERANCE_METERS = 500; // 500 meters radius for attendance

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

export const useFacultyState = () => {
  const [courseCode, setCourseCode] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [selectedFacultyCourse, setSelectedFacultyCourse] = useState<string | null>(null);
  const [facultyStudents, setFacultyStudents] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseError, setCourseError] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'attendance' | 'live' | 'statistics'>('attendance');
  
  // Attendance Live state
  const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
  const [liveStudents, setLiveStudents] = useState<Student[]>([]);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Statistics state
  const [statsCourseCode, setStatsCourseCode] = useState('');

  // Initialize from localStorage ReturnType<typeof setInterval>
  useEffect(() => {
    const sessionData = getActiveAttendanceSession();
    if (sessionData) {
      setAttendanceSession(sessionData);
      initializeLiveSession(sessionData);
      setCurrentView('live');
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (attendanceSession && (timerMinutes > 0 || timerSeconds > 0)) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev > 0) {
            return prev - 1;
          } else if (timerMinutes > 0) {
            setTimerMinutes(prev => prev - 1);
            return 59;
          } else {
            stopAttendance();
            return 0;
          }
        });
      }, 1000);
      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [attendanceSession, timerMinutes, timerSeconds]);

  const initializeLiveSession = (session: AttendanceSession) => {
    const students = MOCK_STUDENTS_DATA[session.courseCode] || [];
    const liveStudentsList: Student[] = students.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      status: 'Absent'
    }));
    setLiveStudents(liveStudentsList);
  };

  const handleCourseSubmit = () => {
    const codeUpper = courseCode.toUpperCase().trim();
    const durationNum = parseInt(duration);

    if (!codeUpper) {
      setError('Please enter course code');
      return;
    }
    if (!durationNum || durationNum <= 0) {
      setError('Please enter valid duration');
      return;
    }
    if (!MOCK_STUDENTS_DATA[codeUpper]) {
      setError('Invalid course code');
      return;
    }

    // Get faculty location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const session: AttendanceSession = {
            courseCode: codeUpper,
            duration: durationNum,
            startTime: new Date().toISOString(),
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            faculty: 'Dr. Ramesh Kumar'
          };

          setAttendanceSession(session);
          setActiveAttendanceSession(session);
          initializeLiveSession(session);
          setTimerMinutes(durationNum);
          setTimerSeconds(0);
          setError('');
          setCurrentView('live');
          setCourseCode('');
          setDuration('');
        },
        (error) => {
          setError('Failed to get location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const stopAttendance = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    clearActiveAttendanceSession();
    setAttendanceSession(null);
    setLiveStudents([]);
    setTimerMinutes(0);
    setTimerSeconds(0);
    setCurrentView('attendance');
  };

  // Check student location and update attendance
  const markStudentAttendance = (rollNo: string, studentLat: number, studentLng: number): boolean => {
    if (!attendanceSession) return false;

    const distance = calculateDistance(
      attendanceSession.location.lat,
      attendanceSession.location.lng,
      studentLat,
      studentLng
    );

    if (distance <= LOCATION_TOLERANCE_METERS) {
      setLiveStudents(prev =>
        prev.map(s =>
          s.rollNo === rollNo ? { ...s, status: 'Present' } : s
        )
      );
      return true;
    }
    return false;
  };

  const loadStatistics = () => {
    const codeUpper = statsCourseCode.toUpperCase().trim();
    if (!codeUpper) return;
    if (!MOCK_STUDENTS_DATA[codeUpper]) {
      setError('Invalid course code');
      return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({
      month: m,
      percentage: Math.round(75 + Math.random() * 20)
    }));
    setMonthlyData(data);
    setError('');
  };

  const reset = () => {
    setCourseCode('');
    setDuration('');
    setError('');
    setStatsCourseCode('');
    setMonthlyData([]);
    stopAttendance();
  };

  return {
    courseCode,
    setCourseCode,
    duration,
    setDuration,
    error,
    setError,
    selectedFacultyCourse,
    setSelectedFacultyCourse,
    facultyStudents,
    setFacultyStudents,
    monthlyData,
    setMonthlyData,
    searchQuery,
    setSearchQuery,
    courseError,
    setCourseError,
    currentView,
    setCurrentView,
    attendanceSession,
    liveStudents,
    setLiveStudents,
    timerMinutes,
    timerSeconds,
    statsCourseCode,
    setStatsCourseCode,
    handleCourseSubmit,
    stopAttendance,
    markStudentAttendance,
    loadStatistics,
    reset
  };
};
