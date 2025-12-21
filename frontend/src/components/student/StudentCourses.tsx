import { Camera } from 'lucide-react';
import { useState, useMemo } from 'react';
import { MonthlyChart } from '../charts/MonthlyChart';
import { MONTHLY_ATTENDANCE } from '../../data/mockData';
import { calculateOverallAttendance, getTopFaculty, generateDynamicMonthlyData } from '../../utils/attendanceUtils';

interface AttendanceSession {
  courseCode: string;
  duration: number;
  startTime: string;
  location: { lat: number; lng: number };
  faculty: string;
  section?: string;
}

interface StudentCoursesProps {
  courses: any[];
  attendanceRecords: Record<string, any>;
  onStartCamera: (course: any) => void;
  blinkingSession?: AttendanceSession | null;
  studentSection?: string;
}

export const StudentCourses = ({ courses, attendanceRecords, onStartCamera, blinkingSession, studentSection = '' }: StudentCoursesProps) => {
  const today = new Date().toDateString();

  // CSS for blinking animation
  const blinkingStyle = `
    @keyframes blink {
      0%, 50% { color: #28a745; opacity: 1; }
      51%, 100% { color: #20c997; opacity: 0.3; }
    }
    .blinking-text {
      animation: blink 1s infinite;
      font-weight: bold;
    }
  `;

  return (
    <>
      <style>{blinkingStyle}</style>
      
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        padding: '30px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 25px 0',
          paddingBottom: '15px',
          borderBottom: '2px solid #003366'
        }}>
          View Courses
        </h2>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
              {['Academic Year', 'Semester', 'Course Code', 'Course Name', 'Faculty', 'Mark Attendance'].map((h, i) => (
                <th key={i} style={{ padding: '12px', border: '1px solid #ddd', textAlign: i < 4 ? 'left' : 'center' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => {
              const recordKey = `${course.code}-${today}`;
              const isMarked = attendanceRecords[recordKey];
              // Check if blinking session matches: section, course code, and faculty name
              const isBlinking = !!(
                blinkingSession && 
                blinkingSession.courseCode === course.code && 
                blinkingSession.faculty === course.faculty &&
                (!studentSection || blinkingSession.section === studentSection)
              );
              
              return (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{course.year}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{course.semester}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{course.code}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{course.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{course.faculty}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {isMarked ? (
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Marked</span>
                    ) : isBlinking ? (
                      <div className="blinking-text" style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', cursor: 'pointer' }}>
                        <Camera size={16} />
                        Mark Attendance
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartCamera(course)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#003366',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          margin: '0 auto',
                          textDecoration: 'underline'
                        }}
                      >
                        <Camera size={16} />Mark Attendance
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        padding: '30px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 25px 0',
          paddingBottom: '15px',
          borderBottom: '2px solid #003366'
        }}>
          Marked Attendance (Stack)
        </h2>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
              {['Course Code', 'Course Name', 'Faculty', 'Marked Date', 'Time', 'Status'].map((h, i) => (
                <th key={i} style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendanceRecords).length > 0 ? (
              Object.entries(attendanceRecords).map(([key, record], idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                    {key.split('-')[0]}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                    {typeof record === 'string' ? record : 'Course'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                    Faculty
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                    {key.split('-').slice(1).join('-')}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', color: 'black' }}>
                    {new Date().toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Marked</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No marked attendance yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
