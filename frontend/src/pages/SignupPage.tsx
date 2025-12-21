import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import '../index.css';

interface SignupData {
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty';
  photo: string | null;
  department: string;
}

interface SignupPageProps {
  onSignup: (data: SignupData) => void;
  onBackToLogin: () => void;
  signupError: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onBackToLogin, signupError }) => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    role: 'student',
    photo: null,
    department: 'CSE'
  });

  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert('Camera access denied');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, photo: photoData }));
        stopCamera();
        alert('Photo captured successfully!');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter first and last name');
      return;
    }
    if (!formData.photo) {
      alert('Please capture your photo');
      return;
    }
    onSignup(formData);
  };

  if (cameraActive) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Arial'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '4px',
          maxWidth: '700px'
        }}>
          <h3 style={{ marginTop: 0, textAlign: 'center', color: '#333' }}>Capture Photo</h3>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: '640px',
              height: '480px',
              backgroundColor: '#000',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            <button
              onClick={capturePhoto}
              style={{
                padding: '12px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              style={{
                padding: '12px 30px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#003366',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            MR
          </div>
          <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: 'black'
              }}
              placeholder="Enter first name"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: 'black'
              }}
              placeholder="Enter last name"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as 'student' | 'faculty' }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: 'black'
              }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Department
            </label>
            <select
              value={formData.department}
              onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Photo
            </label>
            <button
              type="button"
              onClick={startCamera}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Camera size={16} />
              {formData.photo ? 'Retake Photo' : 'Capture Photo'}
            </button>
            {formData.photo && (
              <div style={{
                marginTop: '10px',
                color: '#28a745',
                fontSize: '13px'
              }}>
                ✓ Photo captured
              </div>
            )}
          </div>

          {signupError && (
            <div style={{
              color: 'red',
              fontSize: '13px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {signupError}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#003366',
              border: '1px solid #003366',
              borderRadius: '3px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Login
          </button>
        </form>
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: '#666',
        fontSize: '13px'
      }}>
        <p>© 2024 Malla Reddy (MR) Deemed to be University</p>
      </div>
    </div>
  );
};
