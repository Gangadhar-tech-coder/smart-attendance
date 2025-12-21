import React from 'react';

interface LoginPageProps {
  username: string;
  password: string;
  loginError: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: (e: React.FormEvent) => void;
  onShowSignup?: () => void;
}

export const LoginPage = ({
  username,
  password,
  loginError,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  onShowSignup
}: LoginPageProps) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '40px',
        width: '400px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
          }}>MR</div>
          <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Portal Login</h2>
        </div>

        <form onSubmit={onLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: 'black'
              }}
              placeholder="Enter username"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: 'black'
              }}
              placeholder="Enter password"
            />
          </div>

          {loginError && (
            <div style={{ 
              color: 'red', 
              fontSize: '13px', 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {loginError}
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
            Login
          </button>

          <button
            type="button"
            onClick={onShowSignup}
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
            Create Account
          </button>
        </form>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
        <p>© 2024 Malla Reddy (MR) Deemed to be University</p>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#f0f0f0',
        padding: '10px 15px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Demo Credentials:</div>
        <div>Student: student / password123</div>
        <div>Faculty: faculty / faculty123</div>
      </div>
    </div>
  );
};
