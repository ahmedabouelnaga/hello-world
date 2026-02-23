import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 53px)',
      fontFamily: 'system-ui, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#1a202c',
          marginBottom: '12px',
        }}>
          Crackd
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#718096',
          marginBottom: '40px',
          lineHeight: 1.6,
        }}>
          Upload images, generate AI captions, and vote on the funniest ones.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link href="/captions" style={{
            padding: '14px 28px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
          }}>
            Browse Captions
          </Link>
          <Link href="/upload" style={{
            padding: '14px 28px',
            backgroundColor: '#38a169',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
          }}>
            Upload Image
          </Link>
        </div>
      </div>
    </main>
  )
}
