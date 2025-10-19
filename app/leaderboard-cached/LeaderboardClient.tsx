'use client'

import { useRouter } from 'next/navigation'
import { Trophy, Eye, MessageCircle, Award, Medal, TrendingUp } from 'lucide-react'
import VoteButton from '@/components/VoteButton'

interface Launch {
  id: string
  name: string
  slug: string
  tagline: string
  thumbnail_url: string
  primary_category: string
  votes_count: number
  views_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string
    display_name: string
    avatar_url: string
  }
}

interface LeaderboardClientProps {
  launches: Launch[]
}

export default function LeaderboardClient({ launches }: LeaderboardClientProps) {
  const router = useRouter()

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />
    return null
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    return 'bg-gray-100 text-gray-700'
  }

  const topThree = launches.slice(0, 3)
  const rest = launches.slice(3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">Top projects ranked by community votes</p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topThree.map((launch, index) => {
              const rank = index + 1
              return (
                <div
                  key={launch.id}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all ${
                    rank === 1 ? 'md:order-2 md:scale-105 border-2 border-yellow-400' :
                    rank === 2 ? 'md:order-1' :
                    'md:order-3'
                  }`}
                  onClick={() => router.push(`/launch/${launch.slug}`)}
                >
                  {/* Rank Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadge(rank)}`}>
                      #{rank}
                    </div>
                    {getRankIcon(rank)}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {launch.thumbnail_url ? (
                      <img
                        src={launch.thumbnail_url}
                        alt={launch.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {launch.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{launch.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{launch.tagline}</p>

                  {/* Creator */}
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {launch.profiles.display_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="truncate">@{launch.profiles.username}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <VoteButton 
                      launchId={launch.id} 
                      initialVoteCount={launch.votes_count}
                      className="text-sm font-medium"
                    />
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {launch.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {launch.comments_count}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rest of Rankings */}
      {rest.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Full Rankings
          </h2>
          <div className="space-y-3">
            {rest.map((launch, index) => {
              const rank = index + 4
              return (
                <div
                  key={launch.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/launch/${launch.slug}`)}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                    #{rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {launch.thumbnail_url ? (
                      <img
                        src={launch.thumbnail_url}
                        alt={launch.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {launch.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{launch.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{launch.tagline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">by @{launch.profiles.username}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                        {launch.primary_category}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <VoteButton 
                      launchId={launch.id} 
                      initialVoteCount={launch.votes_count}
                      className="font-medium"
                    />
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      {launch.views_count}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      {launch.comments_count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {launches.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Be the first to launch a project!</p>
          <button
            onClick={() => router.push('/launch')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Launch Your Project
          </button>
        </div>
      )}
    </div>
  )
}

