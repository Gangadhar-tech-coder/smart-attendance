import React from 'react';
import { BarChart3, Users } from 'lucide-react';
import { MonthlyChart } from '../charts/MonthlyChart';
import { MOCK_STUDENTS_DATA } from '../../data/mockData';

interface MonthlyData {
  month: string;
  percentage: number;
}

interface FacultyStatisticsProps {
  courseCode: string;
  department?: string;
  section?: string;
  monthlyData: MonthlyData[];
  onCourseCodeChange: (value: string) => void;
  onDepartmentChange?: (value: string) => void;
  onSectionChange?: (value: string) => void;
  onLoadStatistics: () => void;
}

export const FacultyStatistics: React.FC<FacultyStatisticsProps> = ({
  courseCode,
  department = '',
  section = '',
  monthlyData,
  onCourseCodeChange,
  onDepartmentChange,
  onSectionChange,
  onLoadStatistics
}) => {
  const validCourses = ['C0511', 'C0512', 'C0513', 'C0514', 'C0515'];
  const departments = ['AIML', 'CSE', 'ECE', 'DS', 'MECH'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseCode.trim() && department && section) {
      onLoadStatistics();
    }
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
        paddingBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <BarChart3 size={24} />
        Statistics
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Left: Chart */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Select Department
            </label>
            <select
              value={department}
              onChange={e => onDepartmentChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: 'black',
                marginBottom: '15px'
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
              Select Section
            </label>
            <select
              value={section}
              onChange={e => onSectionChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Arial',
                color: 'black',
                marginBottom: '15px'
              }}
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
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
              Select Course Code
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={courseCode}
                onChange={e => onCourseCodeChange(e.target.value.toUpperCase())}
                placeholder="e.g., C0511"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Arial',
                  color: 'black'
                }}
              />
              <button
                onClick={handleLoad}
                disabled={!courseCode.trim() || !department || !section}
                style={{
                  padding: '10px 20px',
                  backgroundColor: courseCode.trim() && department && section ? '#007bff' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: courseCode.trim() && department && section ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
                onMouseEnter={e => {
                  if (courseCode.trim() && department && section) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0056b3';
                  }
                }}
                onMouseLeave={e => {
                  if (courseCode.trim() && department && section) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#007bff';
                  }
                }}
              >
                Load
              </button>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '5px'
            }}>
              Valid courses: {validCourses.join(', ')}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minHeight: '300px'
          }}>
            {monthlyData.length > 0 ? (
              <div>
                <h4 style={{
                  margin: '0 0 15px 0',
                  color: '#333',
                  fontSize: '16px'
                }}>
                  Monthly Attendance Pattern - {courseCode}
                </h4>
                <MonthlyChart data={monthlyData} />
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#999',
                fontSize: '14px'
              }}>
                Select department, section, course code and click Load to view statistics
              </div>
            )}
          </div>
        </div>

        {/* Right: Attendance Statistics */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {courseCode.trim() && department && section && MOCK_STUDENTS_DATA[courseCode] ? (
            <>
              {/* Overall Statistics Box */}
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '25px',
                borderRadius: '8px',
                border: '2px solid #003366',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <Users size={20} color="#003366" />
                  <h4 style={{
                    margin: 0,
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    Attendance Summary - {courseCode} | Section: {section} | {department}
                  </h4>
                </div>

                {/* Statistics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}>
                  {/* Total Students */}
                  <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      margin: '0 0 10px 0',
                      color: '#999',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Total Students
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '42px',
                      fontWeight: 'bold',
                      color: '#003366'
                    }}>
                      {MOCK_STUDENTS_DATA[courseCode].length}
                    </p>
                  </div>

                  {/* Students Present */}
                  <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      margin: '0 0 10px 0',
                      color: '#999',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Present Today
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '42px',
                      fontWeight: 'bold',
                      color: '#28a745'
                    }}>
                      {MOCK_STUDENTS_DATA[courseCode].filter(s => s.attended > 0).length}
                    </p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '6px',
                  border: '1px solid #4caf50'
                }}>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#2e7d32',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    📊 Today's Attendance Rate
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#1b5e20',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {Math.round((MOCK_STUDENTS_DATA[courseCode].filter(s => s.attended > 0).length / MOCK_STUDENTS_DATA[courseCode].length) * 100)}%
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '40px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              textAlign: 'center',
              minHeight: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              <Users size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
              <p style={{
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#666'
              }}>
                Select a Course
              </p>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#999'
              }}>
                Enter a valid course code (e.g., C0511) and click Load to view attendance statistics
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
