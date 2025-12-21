import React from 'react';

interface FacultyAttendanceProps {
  courseCode: string;
  duration: string;
  department?: string;
  section?: string;
  error: string;
  onCourseCodeChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onDepartmentChange?: (value: string) => void;
  onSectionChange?: (value: string) => void;
  onStartAttendance: () => void;
}

export const FacultyAttendanceComponent: React.FC<FacultyAttendanceProps> = ({
  courseCode,
  duration,
  department = '',
  section = '',
  error,
  onCourseCodeChange,
  onDurationChange,
  onDepartmentChange,
  onSectionChange,
  onStartAttendance
}) => {
  const validCourses = ['C0511', 'C0512', 'C0513', 'C0514', 'C0515'];
  const departments = ['AIML', 'CSE', 'ECE', 'DS', 'MECH'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim()) {
      return;
    }
    if (!duration || parseInt(duration) <= 0) {
      return;
    }
    if (!department) {
      return;
    }
    if (!section) {
      return;
    }
    onStartAttendance();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '30px',
      minHeight: '600px'
    }}>
      <h2 style={{
        margin: '0 0 30px 0',
        color: '#333',
        fontSize: '22px',
        borderBottom: '2px solid #003366',
        paddingBottom: '10px'
      }}>
        Start Attendance
      </h2>

      <div style={{
        maxWidth: '600px',
        margin: '40px 0'
      }}>
        <form onSubmit={handleStart}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Course Code
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={e => onCourseCodeChange(e.target.value.toUpperCase())}
              placeholder="e.g., C0511"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial',
                color: 'black'
              }}
            />
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '5px'
            }}>
              Valid courses: {validCourses.join(', ')}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Department
            </label>
            <select
              value={department}
              onChange={e => onDepartmentChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial',
                color: 'black'
              }}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={e => onDurationChange(e.target.value)}
              placeholder="e.g., 50"
              min="1"
              max="180"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial',
                color: 'black'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Section
            </label>
            <select
              value={section}
              onChange={e => onSectionChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial',
                color: 'black'
              }}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!courseCode.trim() || !duration || !department || !section}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: courseCode.trim() && duration && department && section ? '#28a745' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: courseCode.trim() && duration && department && section ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={e => {
              if (courseCode.trim() && duration && department && section) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#218838';
              }
            }}
            onMouseLeave={e => {
              if (courseCode.trim() && duration && department && section) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#28a745';
              }
            }}
          >
            START ATTENDANCE
          </button>
        </form>
      </div>
    </div>
  );
};
