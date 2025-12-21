import { MonthlyChart } from '../charts/MonthlyChart';
import { StudentChart } from '../charts/StudentChart';
import { calculateFacultyCourseAttendance, getAttendanceStatus, filterStudents } from '../../utils/attendanceUtils';

interface FacultyStatisticsProps {
  selectedFacultyCourse: string | null;
  facultyStudents: any[];
  monthlyData: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FacultyStatistics = ({
  selectedFacultyCourse,
  facultyStudents,
  monthlyData,
  searchQuery,
  onSearchChange
}: FacultyStatisticsProps) => {
  if (!selectedFacultyCourse) return null;

  const filtered = filterStudents(facultyStudents, searchQuery);

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#003366', marginBottom: '10px' }}>
          Statistics for Course: {selectedFacultyCourse}
        </h2>
        <p style={{ color: '#666' }}>
          Students Enrolled: {facultyStudents.length} | Overall Attendance: {calculateFacultyCourseAttendance(facultyStudents)}%
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #003366', fontSize: '16px' }}>
            Student Attendance - {selectedFacultyCourse}
          </h3>
          {facultyStudents.length > 0 ? (
            <StudentChart data={facultyStudents} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No student data available</div>
          )}
        </div>
        
        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #003366', fontSize: '16px' }}>
            Monthly Attendance - {selectedFacultyCourse}
          </h3>
          {monthlyData.length > 0 ? (
            <MonthlyChart data={monthlyData} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No monthly data available</div>
          )}
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '30px', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #003366', fontSize: '16px' }}>
          Student Details
        </h3>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)} 
          placeholder="Search by Name or Roll..." 
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '3px', 
            fontSize: '14px', 
            boxSizing: 'border-box', 
            marginBottom: '20px', 
            color: 'black' 
          }} 
        />
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
              {['Roll Number', 'Student Name', 'Attended', 'Total', 'Attendance %', 'Status'].map((h, i) => (
                <th key={i} style={{ padding: '12px', border: '1px solid #ddd', textAlign: i < 2 ? 'left' : 'center' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s, i) => {
                const pct = Math.round((s.attended / s.total) * 100);
                const status = getAttendanceStatus(pct);
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{s.rollNo}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{s.name}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                      {s.attended}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                      {s.total}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold', color: pct >= 75 ? '#28a745' : '#dc3545' }}>
                      {pct}%
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '3px', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        backgroundColor: status === 'GOOD' ? '#d4edda' : '#f8d7da', 
                        color: status === 'GOOD' ? '#155724' : '#721c24' 
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
          Showing {filtered.length} of {facultyStudents.length} students
        </div>
      </div>
    </>
  );
};
