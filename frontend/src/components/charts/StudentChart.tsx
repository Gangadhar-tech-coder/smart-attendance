interface StudentChartProps {
  data: Array<{ rollNo: string; name: string; attended: number; total: number }>;
}

export const StudentChart = ({ data }: StudentChartProps) => {
  const h = 250;
  return (
    <div style={{ padding: '10px 0' }}>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>No student data available</div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: h,
          borderBottom: '3px solid #333',
          borderLeft: '3px solid #333',
          paddingLeft: '10px',
          paddingBottom: '10px',
          backgroundColor: '#fafafa',
          overflowX: 'auto',
          gap: '4px'
        }}>
          {data.map((s, i) => {
            const pct = Math.round((s.attended / s.total) * 100);
            const bh = (pct / 100) * (h - 40);
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '0 0 auto',
                minWidth: '70px'
              }}>
                <div style={{
                  fontSize: '11px',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#003366'
                }}>
                  {pct}%
                </div>
                <div style={{
                  width: '100%',
                  height: `${Math.max(bh, 5)}px`,
                  backgroundColor: pct >= 75 ? '#28a745' : '#dc3545',
                  borderRadius: '3px 3px 0 0',
                  border: `1px solid ${pct >= 75 ? '#1e7e34' : '#bd2130'}`,
                  minHeight: '5px'
                }} />
                <div style={{
                  fontSize: '10px',
                  marginTop: '8px',
                  color: '#666',
                  fontWeight: '500',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {s.rollNo}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
