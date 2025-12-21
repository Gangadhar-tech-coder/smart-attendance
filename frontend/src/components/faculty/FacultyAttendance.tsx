import { COURSE_NAMES } from '../../data/mockData';
import { calculateFacultyCourseAttendance } from '../../utils/attendanceUtils';

interface FacultyAttendanceProps {
  courseCode: string;
  courseError: string;
  selectedFacultyCourse: string | null;
  facultyStudents: any[];
  onCourseCodeChange: (code: string) => void;
  onSubmit: () => void;
  onViewStatistics: () => void;
}

export const FacultyAttendance = ({
  courseCode,
  courseError,
  selectedFacultyCourse,
  facultyStudents,
  onCourseCodeChange,
  onSubmit,
  onViewStatistics
}: FacultyAttendanceProps) => {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      padding: '30px',
      borderRadius: '4px'
    }}>
      <h2 style={{ 
        margin: '0 0 25px 0',
        paddingBottom: '15px',
        borderBottom: '2px solid #003366'
      }}>
        Course Attendance
      </h2>
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
            Enter Course Code
          </label>
          <input 
            type="text" 
            value={courseCode} 
            onChange={e => onCourseCodeChange(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && onSubmit()} 
            placeholder="e.g., C0511, C0512, C0513" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '3px', 
              fontSize: '14px', 
              boxSizing: 'border-box', 
              color: 'black' 
            }} 
          />
        </div>
        <button 
          onClick={onSubmit} 
          style={{ 
            padding: '10px 30px', 
            backgroundColor: '#003366', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: 'bold' 
          }}
        >
          Submit
        </button>
        {courseError && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '3px', 
            color: '#721c24', 
            fontSize: '14px' 
          }}>
            {courseError}
          </div>
        )}
        {selectedFacultyCourse && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb', 
            borderRadius: '3px' 
          }}>
            <div style={{ fontSize: '14px', color: '#155724', fontWeight: 'bold' }}>
              Course: {selectedFacultyCourse}
            </div>
            <div style={{ fontSize: '13px', color: '#155724', marginTop: '5px' }}>
              {COURSE_NAMES[selectedFacultyCourse] || 'Course'}
            </div>
            <div style={{ fontSize: '13px', color: '#155724', marginTop: '10px' }}>
              Students: {facultyStudents.length} | Overall: {calculateFacultyCourseAttendance(facultyStudents)}%
            </div>
            <button 
              onClick={onViewStatistics} 
              style={{ 
                marginTop: '15px', 
                padding: '8px 20px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                cursor: 'pointer', 
                fontSize: '13px', 
                fontWeight: 'bold' 
              }}
            >
              View Statistics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
