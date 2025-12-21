interface CameraModalProps {
  isActive: boolean;
  selectedCourse: any;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCapture: () => void;
  onCancel: () => void;
}

export const CameraModal = ({ 
  isActive, 
  selectedCourse, 
  videoRef, 
  onCapture, 
  onCancel 
}: CameraModalProps) => {
  if (!isActive) return null;

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
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '700px'
      }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>
          Capture Attendance - {selectedCourse?.code}
        </h3>
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
            onClick={onCapture}
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
            Capture
          </button>
          <button
            onClick={onCancel}
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
};
