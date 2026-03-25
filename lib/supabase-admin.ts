import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with the service role key.
 * Used for Storage uploads (bypasses RLS). Never expose this key to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
