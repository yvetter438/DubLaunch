import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for cached data fetching
// This bypasses RLS and uses service role for faster queries
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Cached data fetching functions with 1 hour revalidation

export async function getCachedLaunches() {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('launches')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching cached launches:', error)
    return []
  }
  
  return data || []
}

export async function getCachedLeaderboard(limit: number = 50) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('launches')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching cached leaderboard:', error)
    return []
  }
  
  return data || []
}

export async function getCachedTopLaunches(limit: number = 5) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('launches')
    .select(`
      id,
      name,
      slug,
      votes_count,
      profiles (
        username,
        display_name
      )
    `)
    .eq('status', 'published')
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching cached top launches:', error)
    return []
  }
  
  return data || []
}

export async function getCachedFeaturedLaunches(limit: number = 6) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('launches')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching cached featured launches:', error)
    return []
  }
  
  return data || []
}

export async function getCachedLaunchBySlug(slug: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('launches')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error) {
    console.error('Error fetching cached launch:', error)
    return null
  }
  
  return data
}

