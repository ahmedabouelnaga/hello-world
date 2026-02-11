import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// For client components only
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
