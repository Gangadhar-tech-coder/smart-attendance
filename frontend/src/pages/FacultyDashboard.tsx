import { LogOut, User, FileText, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { FacultyProfile } from '../components/faculty/FacultyProfileComponent';
import { FacultyAttendanceComponent } from '../components/faculty/FacultyAttendanceComponent';
import { AttendanceLive } from '../components/faculty/AttendanceLiveComponent';
import { FacultyStatistics } from '../components/faculty/FacultyStatisticsComponent';

interface FacultyDashboardProps {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  photo: string | null;
  department: string;
  courseCode: string;
  duration: string;
  attendanceDepartment?: string;
  section?: string;
  statsDepartment?: string;
  statsSection?: string;
  error: string;
  currentView: 'dashboard' | 'profile' | 'attendance' | 'live' | 'statistics';
  timerMinutes: number;
  timerSeconds: number;
  liveStudents: any[];
  statsCourseCode: string;
  monthlyData: any[];
  onCourseCodeChange: (code: string) => void;
  onDurationChange: (duration: string) => void;
  onAttendanceDepartmentChange?: (department: string) => void;
  onSectionChange?: (section: string) => void;
  onStartAttendance: () => void;
  onStopAttendance: () => void;
  onViewChange: (view: string) => void;
  onStatsCourseChange: (code: string) => void;
  onStatsDepartmentChange?: (department: string) => void;
  onStatsSectionChange?: (section: string) => void;
  onLoadStatistics: () => void;
  onLogout: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  name,
  employeeId,
  email,
  phone,
  photo,
  department,
  courseCode,
  duration,
  attendanceDepartment = '',
  section = '',
  statsDepartment = '',
  statsSection = '',
  error,
  currentView,
  timerMinutes,
  timerSeconds,
  liveStudents,
  statsCourseCode,
  monthlyData,
  onCourseCodeChange,
  onDurationChange,
  onAttendanceDepartmentChange,
  onSectionChange,
  onStartAttendance,
  onStopAttendance,
  onViewChange,
  onStatsCourseChange,
  onStatsDepartmentChange,
  onStatsSectionChange,
  onLoadStatistics,
  onLogout
}) => {
  const [localAttendanceDept, setLocalAttendanceDept] = useState(attendanceDepartment || '');
  const [localSection, setLocalSection] = useState(section || '');
  const [localStatsDept, setLocalStatsDept] = useState(statsDepartment || '');
  const [localStatsSection, setLocalStatsSection] = useState(statsSection || '');

  const handleAttendanceDeptChange = (value: string) => {
    setLocalAttendanceDept(value);
    onAttendanceDepartmentChange?.(value);
  };

  const handleSectionChange = (value: string) => {
    setLocalSection(value);
    onSectionChange?.(value);
  };

  const handleStatsDeptChange = (value: string) => {
    setLocalStatsDept(value);
    onStatsDepartmentChange?.(value);
  };

  const handleStatsSecChange = (value: string) => {
    setLocalStatsSection(value);
    onStatsSectionChange?.(value);
  };

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
        <div style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>Faculty - {department}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome {name}</span>
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
              gap: '5px',
              fontWeight: 'bold'
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
              color: 'black',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              if (currentView !== 'profile') {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseLeave={e => {
              if (currentView !== 'profile') {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <User size={18} />
            Faculty Profile
          </div>
          <div
            onClick={() => onViewChange('attendance')}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              backgroundColor: currentView === 'attendance' ? '#e9ecef' : 'transparent',
              borderLeft: currentView === 'attendance' ? '4px solid #003366' : '4px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'black',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              if (currentView !== 'attendance') {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseLeave={e => {
              if (currentView !== 'attendance') {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <FileText size={18} />
            Attendance
          </div>
          <div
            onClick={() => onViewChange('statistics')}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              backgroundColor: currentView === 'statistics' ? '#e9ecef' : 'transparent',
              borderLeft: currentView === 'statistics' ? '4px solid #003366' : '4px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'black',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e9ecef';
            }}
            onMouseLeave={e => {
              if (currentView !== 'statistics') {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <BarChart3 size={18} />
            Statistics
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          {currentView === 'profile' && (
            <FacultyProfile
              name={name}
              employeeId={employeeId}
              department="Computer Science & Engineering"
              email={email}
              phone={phone}
              photo={photo}
            />
          )}

          {currentView === 'attendance' && (
            <FacultyAttendanceComponent
              courseCode={courseCode}
              duration={duration}
              department={localAttendanceDept}
              section={localSection}
              error={error}
              onCourseCodeChange={onCourseCodeChange}
              onDurationChange={onDurationChange}
              onDepartmentChange={handleAttendanceDeptChange}
              onSectionChange={handleSectionChange}
              onStartAttendance={onStartAttendance}
            />
          )}

          {currentView === 'live' && (
            <AttendanceLive
              courseCode={courseCode}
              students={liveStudents}
              timerMinutes={timerMinutes}
              timerSeconds={timerSeconds}
              onStopAttendance={onStopAttendance}
            />
          )}

          {currentView === 'statistics' && (
            <FacultyStatistics
              courseCode={statsCourseCode}
              department={localStatsDept}
              section={localStatsSection}
              monthlyData={monthlyData}
              onCourseCodeChange={onStatsCourseChange}
              onDepartmentChange={handleStatsDeptChange}
              onSectionChange={handleStatsSecChange}
              onLoadStatistics={onLoadStatistics}
            />
          )}
        </div>
      </div>
    </div>
  );
};
