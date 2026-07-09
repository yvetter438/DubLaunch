'use client'

import { useEffect, useState } from 'react'
import { Trophy, Heart } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import FaultLine from '@/components/FaultLine'

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
    if (rank === 1) return 'bg-stone-granite text-vein-gold border border-vein-gold/50 shadow-[inset_0_0_8px_rgba(212,175,55,0.2)]'
    if (rank === 2) return 'bg-stone-granite text-vein-ash border border-vein-ash/30'
    if (rank === 3) return 'bg-stone-granite text-vein-magma border border-vein-magma/50 shadow-[inset_0_0_8px_rgba(255,72,0,0.15)]'
    return 'bg-stone-obsidian text-vein-ash/60 border border-vein-ash/15'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-vein-gold" />
          <h3 className="font-display text-xl font-semibold text-vein-ash text-etched">Top Launches</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-vein-magma border-t-transparent mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-thud-shake">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-5 h-5 text-vein-gold" />
        <h3 className="font-display text-xl font-semibold text-vein-ash text-etched">Top Launches</h3>
      </div>

      {topLaunches.length > 0 ? (
        <>
          <div className="space-y-2">
            {topLaunches.map((launch, index) => {
              const rank = index + 1
              return (
                <div
                  key={launch.id}
                  className="list-plate flex items-center space-x-3 p-3"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                >
                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${getRankBadge(rank)}`}>
                    {rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/launch/${launch.slug}`} className="block">
                      <p className="text-sm font-medium text-vein-ash hover:text-vein-magma transition-all duration-700 ease-tectonic truncate">
                        {launch.name}
                      </p>
                      <p className="text-xs text-vein-ash/45">@{launch.profiles.username}</p>
                    </Link>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-vein-ash/60">
                    <Heart className="w-3 h-3 text-vein-magma" />
                    <span>{launch.votes_count}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-2">
            <FaultLine className="mb-4" />
            <Link href="/leaderboard" className="text-vein-magma hover:text-vein-gold text-sm font-medium transition-all duration-700 ease-tectonic">
              View full leaderboard →
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-vein-ash/20 mx-auto mb-2" />
          <p className="text-sm text-vein-ash/45">No launches yet</p>
        </div>
      )}
    </div>
  )
}
