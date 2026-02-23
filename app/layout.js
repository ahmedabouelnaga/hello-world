import Navbar from './components/Navbar'

export const metadata = {
  title: 'Crackd - Caption & Vote',
  description: 'Upload images, generate captions, and vote on the funniest ones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#f7fafc' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
