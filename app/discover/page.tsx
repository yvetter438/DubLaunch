'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, Filter, Grid, List, ArrowUpDown, 
  Heart, MessageCircle, Eye, Calendar, Tag,
  TrendingUp, Clock, Star
} from 'lucide-react'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

interface Launch {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  thumbnail_url: string
  website_url: string
  primary_category: string
  tags: string[]
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

const CATEGORIES = [
  'All',
  'Web App',
  'Mobile App',
  'Desktop App',
  'API',
  'Library',
  'Chrome Extension',
  'Design Tool',
  'Developer Tool',
  'AI/ML',
  'Blockchain',
  'Gaming',
  'E-commerce',
  'Education',
  'Health',
  'Finance',
  'Productivity',
  'Social',
  'Entertainment',
  'Other'
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'oldest', label: 'Oldest First', icon: Calendar },
  { value: 'votes', label: 'Most Votes', icon: TrendingUp },
  { value: 'views', label: 'Most Views', icon: Eye },
  { value: 'trending', label: 'Trending', icon: Star }
]

export default function DiscoverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [voting, setVoting] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    fetchLaunches(true)
    checkUser()
  }, [selectedCategory, sortBy, searchQuery])

  useEffect(() => {
    if (user && launches.length > 0) {
      fetchUserVotes()
    }
  }, [user, launches])

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    window.history.replaceState({}, '', `/discover${newUrl}`)
  }, [searchQuery, selectedCategory, sortBy])

  const fetchLaunches = async (reset = false) => {
    if (reset) {
      setLoading(true)
      setPage(1)
    } else {
      setLoadingMore(true)
    }

    try {
      let query = supabase
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

      // Apply category filter
      if (selectedCategory !== 'All') {
        query = query.eq('primary_category', selectedCategory)
      }

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%, tagline.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'votes':
          query = query.order('votes_count', { ascending: false })
          break
        case 'views':
          query = query.order('views_count', { ascending: false })
          break
        case 'trending':
          // Trending = high votes in last 7 days
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          query = query
            .gte('created_at', weekAgo.toISOString())
            .order('votes_count', { ascending: false })
          break
      }

      // Apply pagination
      const currentPage = reset ? 1 : page
      const from = (currentPage - 1) * 12
      const to = from + 11
      query = query.range(from, to)

      const { data, error } = await query

      if (error) {
        console.error('Error fetching launches:', error)
        return
      }

      if (reset) {
        setLaunches(data || [])
      } else {
        setLaunches(prev => [...prev, ...(data || [])])
      }

      setHasMore((data || []).length === 12)
      if (!reset) setPage(prev => prev + 1)

    } catch (error) {
      console.error('Error fetching launches:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchLaunches(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return formatDate(dateString)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing Projects</h1>
          <p className="text-gray-600">Explore the latest launches from the UW community</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {loading ? 'Loading...' : `${launches.length} launches`}
                </span>
                {searchQuery && (
                  <span className="text-sm text-gray-500">
                    Results for "{searchQuery}"
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Launches Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : launches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No launches found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to launch a project!'
                  }
                </p>
                {!searchQuery && selectedCategory === 'All' && (
                  <button
                    onClick={() => router.push('/launch')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Launch Your Project
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {launches.map((launch) => (
                    <div
                      key={launch.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/launch/${launch.slug}`)}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <div className="p-6">
                          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
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
                          
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{launch.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{launch.tagline}</p>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <button
                              onClick={(e) => handleVote(launch.id, e)}
                              disabled={voting.has(launch.id)}
                              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                                userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-500'
                              } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                              {launch.votes_count}
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {launch.views_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {launch.comments_count}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                {launch.profiles.avatar_url ? (
                                  <img
                                    src={launch.profiles.avatar_url}
                                    alt={launch.profiles.display_name}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-xs font-bold">
                                    {launch.profiles.display_name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">@{launch.profiles.username}</span>
                            </div>
                            <span className="text-xs text-gray-500">{getTimeAgo(launch.created_at)}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              {launch.primary_category}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {launch.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {launch.thumbnail_url ? (
                                <img
                                  src={launch.thumbnail_url}
                                  alt={launch.name}
                                  className="w-16 h-16 object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold text-gray-400">
                                  {launch.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{launch.name}</h3>
                                  <p className="text-gray-600 text-sm">{launch.tagline}</p>
                                </div>
                                <span className="text-xs text-gray-500">{getTimeAgo(launch.created_at)}</span>
                              </div>

                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                                <button
                                  onClick={(e) => handleVote(launch.id, e)}
                                  disabled={voting.has(launch.id)}
                                  className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                                    userVotes.has(launch.id) ? 'text-red-500' : 'text-gray-500'
                                  } ${voting.has(launch.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  <Heart className={`w-4 h-4 ${userVotes.has(launch.id) ? 'fill-current' : ''}`} />
                                  {launch.votes_count} votes
                                </button>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {launch.views_count} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  {launch.comments_count} comments
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    {launch.profiles.avatar_url ? (
                                      <img
                                        src={launch.profiles.avatar_url}
                                        alt={launch.profiles.display_name}
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-white text-xs font-bold">
                                        {launch.profiles.display_name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-600">@{launch.profiles.username}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                    {launch.primary_category}
                                  </span>
                                  {launch.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}