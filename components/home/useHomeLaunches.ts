'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface HomeLaunch {
  id: string
  name: string
  slug: string
  tagline: string | null
  thumbnail_url: string | null
  primary_category: string | null
  votes_count: number
  created_at: string
  profiles: {
    username: string
    display_name: string
  }
}

type HomeLaunchesSort = 'newest' | 'featured'

export function useHomeLaunches(limit = 8, sort: HomeLaunchesSort = 'featured') {
  const [launches, setLaunches] = useState<HomeLaunch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const supabase = createClient()
        let query = supabase
          .from('launches')
          .select(`
            id,
            name,
            slug,
            tagline,
            thumbnail_url,
            primary_category,
            votes_count,
            created_at,
            profiles (
              username,
              display_name
            )
          `)
          .eq('status', 'published')

        if (sort === 'newest') {
          query = query.order('created_at', { ascending: false })
        } else {
          query = query
            .order('votes_count', { ascending: false })
            .order('created_at', { ascending: false })
        }

        const { data, error } = await query.limit(limit)

        if (error) throw error
        setLaunches((data || []) as unknown as HomeLaunch[])
      } catch (error) {
        console.error('Error fetching home launches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [limit, sort])

  return { launches, loading }
}
