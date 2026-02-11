'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={signOut}
      style={{
        padding: '8px 16px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      Sign Out
    </button>
  )
}
