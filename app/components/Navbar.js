'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignIn() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient()
    setUser(null)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/captions', label: 'Captions' },
    { href: '/upload', label: 'Upload' },
  ]

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#1a202c',
          textDecoration: 'none',
        }}>
          Crackd
        </Link>
        <div style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: pathname === link.href ? 600 : 400,
                color: pathname === link.href ? '#0070f3' : '#4a5568',
                backgroundColor: pathname === link.href ? '#ebf4ff' : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!loading && user && (
          <>
            <span style={{ fontSize: '13px', color: '#718096' }}>
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: '6px 14px',
                backgroundColor: 'transparent',
                color: '#e53e3e',
                border: '1px solid #e53e3e',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        )}
        {!loading && !user && (
          <button
            onClick={handleSignIn}
            style={{
              padding: '6px 14px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}
