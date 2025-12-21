import { CameraModal } from './components/student/CameraModal';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { useAuth } from './hooks/useAuth';
import type { SignupData } from './hooks/useAuth';
import { useStudentState } from './hooks/useStudentState';
import { useFacultyState } from './hooks/useFacultyState';

const App = () => {
  const auth = useAuth();
  const student = useStudentState();
  const faculty = useFacultyState();

  // Student Camera Logic
  const handleCaptureAttendance = () => {
    student.captureAttendance();
  };

  // Logout handler
  const handleLogout = () => {
    auth.handleLogout();
    student.stopCamera();
    faculty.reset();
  };

  // Handle Signup
  const handleSignup = (signupData: SignupData) => {
    auth.handleSignup(signupData);
  };

  // Camera Modal Active
  if (student.cameraActive) {
    return (
      <CameraModal
        isActive={student.cameraActive}
        selectedCourse={student.selectedCourse}
        videoRef={student.videoRef}
        onCapture={handleCaptureAttendance}
        onCancel={student.stopCamera}
      />
    );
  }

  // Signup View
  if (auth.showSignup) {
    return (
      <SignupPage
        onSignup={handleSignup}
        onBackToLogin={() => auth.setShowSignup(false)}
        signupError={auth.signupError}
      />
    );
  }

  // Login View
  if (!auth.isLoggedIn) {
    return (
      <LoginPage
        username={auth.username}
        password={auth.password}
        loginError={auth.loginError}
        onUsernameChange={auth.setUsername}
        onPasswordChange={auth.setPassword}
        onLogin={auth.handleLogin}
        onShowSignup={() => auth.setShowSignup(true)}
      />
    );
  }

  // Student Dashboard
  if (auth.userType === 'student') {
    return (
      <StudentDashboard
        courses={student.courses}
        attendanceRecords={student.attendanceRecords}
        currentView={student.currentView}
        onViewChange={student.setCurrentView}
        onStartCamera={student.startCamera}
        onLogout={handleLogout}
            blinkingSession={student.activeAttendanceSession}
      />
    );
  }

  // Faculty Dashboard
  if (auth.userType === 'faculty') {
    return (
      <FacultyDashboard
        name={auth.currentUser?.name || 'Dr. Ramesh Kumar'}
        employeeId={auth.currentUser?.employeeId || 'FAC2024001'}
        email={auth.currentUser?.email || 'ramesh.kumar@mrec.ac.in'}
        phone={auth.currentUser?.phone || '+91 98765 12345'}
        photo={auth.currentUser?.photo || null}
        department={auth.currentUser?.department || 'Computer Science & Engineering'}
        courseCode={faculty.courseCode}
        duration={faculty.duration}
        error={faculty.error}
        currentView={faculty.currentView as 'dashboard' | 'profile' | 'attendance' | 'live' | 'statistics'}
        timerMinutes={faculty.timerMinutes}
        timerSeconds={faculty.timerSeconds}
        liveStudents={faculty.liveStudents}
        statsCourseCode={faculty.statsCourseCode}
        monthlyData={faculty.monthlyData}
        onCourseCodeChange={faculty.setCourseCode}
        onDurationChange={faculty.setDuration}
        onStartAttendance={faculty.handleCourseSubmit}
        onStopAttendance={faculty.stopAttendance}
        onViewChange={(view) => faculty.setCurrentView(view as 'dashboard' | 'profile' | 'attendance' | 'live' | 'statistics')}
        onStatsCourseChange={faculty.setStatsCourseCode}
        onLoadStatistics={faculty.loadStatistics}
        onLogout={handleLogout}
      />
    );
  }

  return null;
};

export default App;
