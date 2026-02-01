import { createSupabaseClient } from '@/lib/supabase'

export default async function CaptionsPage() {
  const supabase = createSupabaseClient()

  const { data: captions, error } = await supabase
    .from('captions')
    .select('*')

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Captions</h1>
        <p style={{ color: 'red' }}>Error loading captions: {error.message}</p>
      </div>
    )
  }

  if (!captions || captions.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Captions</h1>
        <p>No captions found.</p>
      </div>
    )
  }

  const allKeys = Object.keys(captions[0])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Captions</h1>
      <p>Total records: {captions.length}</p>

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              {allKeys.map((key) => (
                <th key={key} style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {captions.map((caption, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
              }}>
                {allKeys.map((key) => (
                  <td key={key} style={{
                    border: '1px solid #ddd',
                    padding: '12px'
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
    </div>
  )
}
