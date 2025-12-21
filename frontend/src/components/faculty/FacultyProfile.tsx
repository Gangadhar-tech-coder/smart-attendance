import { MOCK_FACULTY } from '../../data/mockData';

interface FacultyProfileProps {
  onViewChange?: (view: string) => void;
}

export const FacultyProfile = ({ onViewChange }: FacultyProfileProps) => {
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
        Faculty Profile
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {[
            ['Faculty Name', MOCK_FACULTY.name],
            ['Employee ID', MOCK_FACULTY.employeeId],
            ['Department', MOCK_FACULTY.department],
            ['Email', MOCK_FACULTY.email],
            ['Phone', MOCK_FACULTY.phone]
          ].map(([label, value], i) => (
            <tr key={i}>
              <td style={{ padding: '12px', backgroundColor: '#f8f9fa', fontWeight: 'bold', width: '40%', border: '1px solid #ddd', color: 'black' }}>{label}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
