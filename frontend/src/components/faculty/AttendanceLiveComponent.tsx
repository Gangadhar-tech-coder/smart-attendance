import React from 'react';
import { Clock } from 'lucide-react';

interface Student {
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent';
}

interface AttendanceLiveProps {
  courseCode: string;
  students: Student[];
  timerMinutes: number;
  timerSeconds: number;
  onStopAttendance: () => void;
}

export const AttendanceLive: React.FC<AttendanceLiveProps> = ({
  courseCode,
  students,
  timerMinutes,
  timerSeconds,
  onStopAttendance
}) => {
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '30px',
      minHeight: '100vh'
    }}>
      {/* Header with Timer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #003366'
      }}>
        <h2 style={{
          margin: 0,
          color: '#333',
          fontSize: '22px'
        }}>
          Live Attendance - {courseCode}
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          padding: '10px 20px',
          borderRadius: '4px',
          border: '2px solid #d32f2f'
        }}>
          <Clock size={28} />
          <span>{String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Students */}
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196f3',
          padding: '25px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#2196f3',
            marginBottom: '8px'
          }}>
            {students.length}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            Total Students
          </div>
        </div>

        {/* Present Students */}
        <div style={{
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          padding: '25px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#4caf50',
            marginBottom: '8px'
          }}>
            {presentCount}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            Present
          </div>
        </div>

        {/* Absent Students */}
        <div style={{
          backgroundColor: '#ffebee',
          border: '2px solid #f44336',
          padding: '25px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#f44336',
            marginBottom: '8px'
          }}>
            {absentCount}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            Absent
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#003366',
              color: 'white'
            }}>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontWeight: 'bold',
                borderRight: '1px solid #ddd'
              }}>
                Roll Number
              </th>
              <th style={{
                padding: '15px',
                textAlign: 'left',
                fontWeight: 'bold',
                borderRight: '1px solid #ddd'
              }}>
                Student Name
              </th>
              <th style={{
                padding: '15px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.filter(s => s.status === 'Present').map((student, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                  borderBottom: '1px solid #ddd',
                  transition: 'background-color 0.3s',
                  color: 'black'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#e8f5e9';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5';
                }}
              >
                <td style={{
                  padding: '15px',
                  borderRight: '1px solid #ddd',
                  fontWeight: '500',
                  color: 'black'
                }}>
                  {student.rollNo}
                </td>
                <td style={{
                  padding: '15px',
                  borderRight: '1px solid #ddd',
                  color: 'black'
                }}>
                  {student.name}
                </td>
                <td style={{
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: student.status === 'Present' ? '#c8e6c9' : '#ffcdd2',
                    color: student.status === 'Present' ? '#2e7d32' : '#c62828'
                  }}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stop Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
      }}>
        <button
          onClick={onStopAttendance}
          style={{
            padding: '14px 40px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#da190b';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f44336';
          }}
        >
          STOP ATTENDANCE
        </button>
      </div>
    </div>
  );
};
