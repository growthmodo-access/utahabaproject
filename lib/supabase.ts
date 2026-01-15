import { createClient } from '@supabase/supabase-js'
import { BlogPost } from './blog-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Blog posts will use in-memory storage.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return supabase !== null
}
