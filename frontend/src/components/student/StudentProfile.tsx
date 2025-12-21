import { useState, useEffect } from 'react';
import { MOCK_STUDENT } from '../../data/mockData';
import { Save } from 'lucide-react';
import { calculateOverallAttendance } from '../../utils/attendanceUtils';

interface StudentProfileProps {
  courses?: any[];
}

export const StudentProfile = ({ courses = [] }: StudentProfileProps) => {
  const [formData, setFormData] = useState({
    department: '',
    name: '',
    fatherName: '',
    motherName: '',
    parentMobile: '',
    section: ''
  });
  const [profileUrl, setProfileUrl] = useState<string | null>(MOCK_STUDENT.photo || null);

  useEffect(() => {
    // Try to fetch authenticated user profile from backend
    (async () => {
      try {
        const res = await fetch('/api/current-user/', { credentials: 'include' });
        if (res.ok) {
          const j = await res.json();
          setFormData(prev => ({
            ...prev,
            department: j.role === 'STUDENT' ? (j.department || '') : (j.department || ''),
            name: j.name || '',
            parentMobile: j.parentMobile || '',
            section: j.section || ''
          }));
          if (j.profile_image) setProfileUrl(j.profile_image);
        } else {
          // fallback to mock data
          setFormData({
            department: MOCK_STUDENT.department,
            name: MOCK_STUDENT.name,
            fatherName: MOCK_STUDENT.fatherName,
            motherName: MOCK_STUDENT.motherName,
            parentMobile: MOCK_STUDENT.parentMobile,
            section: ''
          });
          setProfileUrl(MOCK_STUDENT.photo || null);
        }
      } catch (e) {
        setFormData({
          department: MOCK_STUDENT.department,
          name: MOCK_STUDENT.name,
          fatherName: MOCK_STUDENT.fatherName,
          motherName: MOCK_STUDENT.motherName,
          parentMobile: MOCK_STUDENT.parentMobile,
          section: ''
        });
        setProfileUrl(MOCK_STUDENT.photo || null);
      }
    })();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };
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
        borderBottom: '2px solid #003366',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Student Profile
        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          <Save size={16} /> Save
        </button>
      </h2>
      <div style={{ display: 'flex', gap: '40px' }}>
        <table style={{ flex: 1, borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Department', 'department'],
              ['Section', 'section'],
              ['Student Name', 'name'],
              ['Father Name', 'fatherName'],
              ['Mother Name', 'motherName'],
              ['Parent Mobile', 'parentMobile'],
              ['Attendance', 'attendance']
            ].map(([label, field], i) => (
              <tr key={i}>
                <td style={{ padding: '12px', backgroundColor: '#f8f9fa', fontWeight: 'bold', width: '40%', border: '1px solid #ddd', color: 'black' }}>{label}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>
                  {field === 'attendance' ? (
                    <div style={{
                      padding: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#28a745'
                    }}>
                      {calculateOverallAttendance(courses)}%
                    </div>
                  ) : field === 'department' ? (
                    <select
                      value={formData[field as keyof typeof formData]}
                      onChange={e => handleChange(field, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        color: 'black'
                      }}
                    >
                      <option value="AIML">AIML</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="DS">DS</option>
                      <option value="MECH">MECH</option>
                    </select>
                  ) : field === 'section' ? (
                    <select
                      value={formData[field as keyof typeof formData]}
                      onChange={e => handleChange(field, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        color: 'black'
                      }}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field as keyof typeof formData]}
                      onChange={e => handleChange(field, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        color: 'black'
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            border: '2px solid #003366',
            padding: '5px',
            backgroundColor: 'white',
            width: '150px',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            {profileUrl ? (
              <img src={profileUrl} alt="Student" style={{ width: '140px', height: '170px', objectFit: 'cover' }} />
            ) : (
              'Student Photo'
            )}
          </div>
          <div style={{ 
            marginTop: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {MOCK_STUDENT.rollNo}
          </div>
        </div>
      </div>
    </div>
  );
};
