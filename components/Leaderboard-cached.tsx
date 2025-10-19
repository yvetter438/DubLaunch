import { Trophy, Heart } from 'lucide-react'
import Link from 'next/link'
import { getCachedTopLaunches } from '@/lib/supabase/server-cache'

export default async function Leaderboard() {
  const topLaunches = await getCachedTopLaunches(5)

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800'
    if (rank === 2) return 'bg-gray-100 text-gray-800'
    if (rank === 3) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-600'
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
            <Link href="/leaderboard-cached" className="text-uw-purple hover:text-uw-purple/80 text-sm font-medium">
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

