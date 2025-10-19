'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { Trophy, Heart, Eye, MessageCircle, TrendingUp, Award, Medal } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function LeaderboardPage() {
  const router = useRouter()
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [voting, setVoting] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    fetchLeaderboard()
    checkUser()
  }, [])

  useEffect(() => {
    if (user && launches.length > 0) {
      fetchUserVotes()
    }
  }, [user, launches])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchUserVotes = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('votes')
        .select('launch_id')
        .eq('user_id', user.id)

      if (data) {
        setUserVotes(new Set(data.map(vote => vote.launch_id)))
      }
    } catch (error) {
      console.error('Error fetching user votes:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
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
        .limit(50)

      if (error) throw error

      setLaunches((data || []) as any)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (launchId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setVoting(prev => {
      const newSet = new Set(prev)
      newSet.add(launchId)
      return newSet
    })

    try {
      const hasVoted = userVotes.has(launchId)

      if (hasVoted) {
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('launch_id', launchId)
          .eq('user_id', user.id)

        if (error) throw error

        setUserVotes(prev => {
          const newSet = new Set(prev)
          newSet.delete(launchId)
          return newSet
        })

        setLaunches(prev => prev.map(launch => 
          launch.id === launchId 
            ? { ...launch, votes_count: launch.votes_count - 1 }
            : launch
        ))

        toast.success('Vote removed')
      } else {
        const { error } = await supabase
          .from('votes')
          .insert([{
            launch_id: launchId,
            user_id: user.id
          }])

        if (error) throw error

        setUserVotes(prev => {
          const newSet = new Set(prev)
          newSet.add(launchId)
          return newSet
        })

        setLaunches(prev => prev.map(launch => 
          launch.id === launchId 
            ? { ...launch, votes_count: launch.votes_count + 1 }
            : launch
        ))

        toast.success('Vote added!')
      }
    } catch (error: any) {
      console.error('Error voting:', error)
      toast.error(error.message || 'Failed to vote')
    } finally {
      setVoting(prev => {
        const newSet = new Set(prev)
        newSet.delete(launchId)
        return newSet
      })
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const topThree = launches.slice(0, 3)
  const rest = launches.slice(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                      <button
                        onClick={(e) => handleVote(launch.id, e)}
                        disabled={voting.has(launch.id)}
                        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                          userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                        {launch.votes_count}
                      </button>
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
                      <button
                        onClick={(e) => handleVote(launch.id, e)}
                        disabled={voting.has(launch.id)}
                        className={`flex items-center gap-1 font-medium transition-colors ${
                          userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                        {launch.votes_count}
                      </button>
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
    </div>
  )
}