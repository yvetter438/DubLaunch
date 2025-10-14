'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { User, Mail, Calendar, MapPin, ExternalLink, Heart, MessageCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface Profile {
  id: string
  username: string
  display_name: string
  email: string
  bio: string
  website: string
  location: string
  joined_at: string
  avatar_url: string
}

interface Launch {
  id: string
  name: string
  description: string
  tagline: string
  website_url: string
  logo_url: string
  thumbnail_url: string
  votes_count: number
  comments_count: number
  created_at: string
  user_id: string
  slug: string
  profiles?: {
    display_name: string
    username: string
  }
}

export default function PublicProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [voting, setVoting] = useState<Set<string>>(new Set())
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const username = params.username as string

  useEffect(() => {
    if (username) {
      fetchProfile()
      checkUser()
    }
  }, [username])

  useEffect(() => {
    if (user && launches.length > 0) {
      fetchUserVotes()
    }
  }, [user, launches])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchProfile = async () => {
    try {
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        setError('Profile not found')
        return
      }

      setProfile(profileData)

      // Fetch user's launches
      const { data: launchesData, error: launchesError } = await supabase
        .from('launches')
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .eq('creator_id', profileData.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (launchesError) {
        console.error('Error fetching launches:', launchesError)
        setLaunches([])
      } else {
        setLaunches(launchesData || [])
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
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

  const handleVote = async (launchId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

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
        // Remove vote
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
        // Add vote
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.display_name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                <p className="text-sm text-gray-500">Joined {new Date(profile.joined_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              
              <div className="space-y-4">
                {profile.bio && (
                  <div>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.display_name}</span>
                </div>
                
                {profile.website && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    Joined {new Date(profile.joined_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Launches</span>
                  <span className="font-semibold text-gray-900">{launches.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-semibold text-gray-900">
                    {launches.reduce((sum, launch) => sum + launch.votes_count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Launches */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Launches ({launches.length})
              </h2>
              
              {launches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No launches yet</h3>
                  <p className="text-gray-600">This user hasn't shared any projects yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {launches.map((launch) => (
                    <div 
                      key={launch.id} 
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/launch/${launch.slug}`)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          {launch.thumbnail_url ? (
                            <img
                              src={launch.thumbnail_url}
                              alt={launch.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {launch.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{launch.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{launch.tagline}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={(e) => handleVote(launch.id, e)}
                                disabled={voting.has(launch.id)}
                                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                                  userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-500'
                                } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                                <span className="text-sm">
                                  {launch.votes_count}
                                </span>
                              </button>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">{launch.comments_count || 0}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(launch.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
