'use client'

import { useEffect, useState } from 'react'
import { Trophy, Heart } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Launch {
  id: string
  name: string
  slug: string
  votes_count: number
  profiles: {
    username: string
    display_name: string
  }
}

export default function Leaderboard() {
  const [topLaunches, setTopLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopLaunches()
  }, [])

  const fetchTopLaunches = async () => {
    try {
      const supabase = createClient()
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
        .limit(5)

      if (error) throw error

      setTopLaunches((data || []) as unknown as Launch[])
    } catch (error) {
      console.error('Error fetching top launches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800'
    if (rank === 2) return 'bg-gray-100 text-gray-800'
    if (rank === 3) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-uw-gold" />
          <h3 className="text-lg font-semibold text-gray-900">Top Launches</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-uw-gold" />
        <h3 className="text-lg font-semibold text-gray-900">Top Launches</h3>
      </div>
      
      {topLaunches.length > 0 ? (
        <>
          <div className="space-y-3">
            {topLaunches.map((launch, index) => {
              const rank = index + 1
              return (
                <div key={launch.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(rank)}`}>
                    {rank}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/launch/${launch.slug}`} className="block">
                      <p className="text-sm font-medium text-gray-900 hover:text-uw-purple transition-colors truncate">
                        {launch.name}
                      </p>
                      <p className="text-xs text-gray-500">@{launch.profiles.username}</p>
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Heart className="w-3 h-3" />
                    <span>{launch.votes_count}</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/leaderboard" className="text-uw-purple hover:text-uw-purple/80 text-sm font-medium">
              View full leaderboard →
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No launches yet</p>
        </div>
      )}
    </div>
  )
}
