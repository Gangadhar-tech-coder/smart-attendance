interface MonthlyChartProps {
  data: Array<{ month: string; percentage: number }>;
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const h = 180;
  return (
    <div style={{ padding: '10px 0' }}>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>No data available</div>
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
          backgroundColor: '#fafafa'
        }}>
          {data.map((d, i) => {
            const bh = (d.percentage / 100) * (h - 20);
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                margin: '0 3px'
              }}>
                <div style={{
                  fontSize: '11px',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#003366'
                }}>
                  {d.percentage}%
                </div>
                <div style={{
                  width: '100%',
                  height: `${Math.max(bh, 5)}px`,
                  backgroundColor: '#007bff',
                  borderRadius: '3px 3px 0 0',
                  border: '1px solid #0056b3',
                  minHeight: '5px'
                }} />
                <div style={{
                  fontSize: '11px',
                  marginTop: '8px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {d.month}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
