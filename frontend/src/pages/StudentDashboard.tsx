import { LogOut, User, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { MOCK_STUDENT, MONTHLY_ATTENDANCE } from '../data/mockData';
import { StudentProfile } from '../components/student/StudentProfile';
import { StudentCourses } from '../components/student/StudentCourses';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { calculateOverallAttendance, getTopFaculty, generateDynamicMonthlyData } from '../utils/attendanceUtils';

interface StudentDashboardProps {
  courses: any[];
  attendanceRecords: Record<string, any>;
  currentView: string;
  onViewChange: (view: string) => void;
  onStartCamera: (course: any) => void;
  onLogout: () => void;
  blinkingSession?: any | null;
}

export const StudentDashboard = ({
  courses,
  attendanceRecords,
  currentView,
  onViewChange,
  onStartCamera,
  onLogout,
  blinkingSession
}: StudentDashboardProps) => {
  const [studentSection, setStudentSection] = useState('');
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#003366',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Malla Reddy University</div>
        <div style={{ fontSize: '14px' }}>B.Tech - Computer Science & Engineering</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome {MOCK_STUDENT.rollNo}</span>
          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '6px 15px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '220px',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #ddd',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px 0'
        }}>
          <div
            onClick={() => onViewChange('profile')}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              backgroundColor: currentView === 'profile' ? '#e9ecef' : 'transparent',
              borderLeft: currentView === 'profile' ? '4px solid #003366' : '4px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'black'
            }}
          >
            <User size={18} />
            Student Profile
          </div>
          <div
            onClick={() => onViewChange('courses')}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              backgroundColor: currentView === 'courses' ? '#e9ecef' : 'transparent',
              borderLeft: currentView === 'courses' ? '4px solid #003366' : '4px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'black'
            }}
          >
            <BookOpen size={18} />
            View Courses
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          {currentView === 'dashboard' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px'
            }}>
            </div>
          )}

          {currentView === 'profile' && <StudentProfile courses={courses} />}

          {currentView === 'courses' && (
            <StudentCourses 
              courses={courses} 
              attendanceRecords={attendanceRecords}
              onStartCamera={onStartCamera}
              blinkingSession={blinkingSession}
              studentSection={studentSection}
            />
          )}
        </div>
      </div>
    </div>
  );
};
