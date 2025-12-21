import React, { useState } from 'react';
import { User, Save } from 'lucide-react';

interface FacultyProfileProps {
  name: string;
  employeeId: string;
  department: string;
  email: string;
  phone: string;
  photo: string | null;
}

export const FacultyProfile: React.FC<FacultyProfileProps> = ({
  name,
  employeeId,
  department,
  email,
  phone,
  photo
}) => {
  const [formData, setFormData] = useState({
    name,
    employeeId,
    department,
    email,
    phone
  });

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
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Faculty Profile
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Left: Profile Information */}
        <div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#666',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '5px'
            }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                boxSizing: 'border-box',
                color: 'black'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#666',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '5px'
            }}>
              Employee ID
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={e => handleChange('employeeId', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                boxSizing: 'border-box',
                color: 'black'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#666',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '5px'
            }}>
              Department
            </label>
            <select
              value={formData.department}
              onChange={e => handleChange('department', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '3px',
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
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#666',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '5px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                boxSizing: 'border-box',
                color: 'black'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#666',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '5px'
            }}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                boxSizing: 'border-box',
                color: 'black'
              }}
            />
          </div>
        </div>

        {/* Right: Photo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            width: '250px',
            height: '250px',
            borderRadius: '4px',
            border: '2px solid #ddd',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px',
            overflow: 'hidden'
          }}>
            {photo ? (
              <img
                src={photo}
                alt={formData.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <User size={80} color="#999" strokeWidth={1} />
            )}
          </div>
          <p style={{
            color: '#666',
            fontSize: '12px',
            margin: '0',
            textAlign: 'center'
          }}>
            Faculty Photo
          </p>
        </div>
      </div>
    </div>
  );
};
