'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { User, Mail, Calendar, MapPin, ExternalLink, Plus, Edit2, Save, X, Heart } from 'lucide-react'
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
  website_url: string
  logo_url: string
  votes_count: number
  created_at: string
}

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    website: '',
    location: ''
  })
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [voting, setVoting] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && launches.length > 0) {
      fetchUserVotes()
    }
  }, [user, launches])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      await fetchProfile(session.user.id)
      await fetchLaunches(session.user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Create a basic profile if none exists
        await createBasicProfile(userId)
        return
      }

      setProfile(data)
      setEditForm({
        display_name: data.display_name || '',
        bio: data.bio || '',
        website: data.website || '',
        location: data.location || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const createBasicProfile = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newProfile = {
        id: userId,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        display_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        bio: '',
        website: '',
        location: '',
        joined_at: new Date().toISOString(),
        avatar_url: ''
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      setProfile(data)
      setEditForm({
        display_name: data.display_name || '',
        bio: data.bio || '',
        website: data.website || '',
        location: data.location || ''
      })
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const fetchLaunches = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('launches')
        .select('*')
        .eq('creator_id', userId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching launches:', error)
        return
      }

      setLaunches(data || [])
    } catch (error) {
      console.error('Error fetching launches:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      setProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
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

    setVoting(prev => new Set([...prev, launchId]))

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

        setUserVotes(prev => new Set([...prev, launchId]))

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/launch')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Launch</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Info</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.display_name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                  {profile.bio && (
                    <div className="pt-2">
                      <p className="text-gray-700">{profile.bio}</p>
                    </div>
                  )}
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
              )}
            </div>
          </div>

          {/* Launches */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Launches</h2>
              
              {launches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No launches yet</h3>
                  <p className="text-gray-600 mb-6">Share your first project with the UW community!</p>
                  <button
                    onClick={() => router.push('/launch')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Your First Launch
                  </button>
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
                            <button
                              onClick={(e) => handleVote(launch.id, e)}
                              disabled={voting.has(launch.id)}
                              className={`flex items-center gap-1 text-sm hover:text-red-500 transition-colors ${
                                userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-500'
                              } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                              {launch.votes_count} votes
                            </button>
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