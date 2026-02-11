'use client'

export default function CaptionsTable({ captions }) {
  const columns = Object.keys(captions[0])

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #ddd',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {columns.map((key) => (
              <th key={key} style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
              }}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {captions.map((caption, index) => (
            <tr key={index} style={{
              backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
            }}>
              {columns.map((key) => (
                <td key={key} style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                }}>
                  {caption[key] !== null && caption[key] !== undefined
                    ? String(caption[key])
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
