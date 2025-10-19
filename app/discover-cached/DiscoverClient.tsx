'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, Grid, List, Eye, MessageCircle, Calendar
} from 'lucide-react'
import VoteButton from '@/components/VoteButton'

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
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'votes', label: 'Most Votes' },
  { value: 'views', label: 'Most Views' },
  { value: 'trending', label: 'Trending' }
]

interface DiscoverClientProps {
  initialLaunches: Launch[]
}

export default function DiscoverClient({ initialLaunches }: DiscoverClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [launches, setLaunches] = useState<Launch[]>(initialLaunches)
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>(initialLaunches)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  useEffect(() => {
    // Apply client-side filtering and sorting
    let filtered = [...launches]

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(l => l.primary_category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.tagline.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
      )
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'votes':
        filtered.sort((a, b) => b.votes_count - a.votes_count)
        break
      case 'views':
        filtered.sort((a, b) => b.views_count - a.views_count)
        break
      case 'trending':
        // Trending = created in last 7 days, sorted by votes
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        filtered = filtered.filter(l => new Date(l.created_at) >= weekAgo)
        filtered.sort((a, b) => b.votes_count - a.votes_count)
        break
    }

    setFilteredLaunches(filtered)

    // Update URL
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    window.history.replaceState({}, '', `/discover-cached${newUrl}`)
  }, [launches, searchQuery, selectedCategory, sortBy])

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

  return (
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                onChange={(e) => setSortBy(e.target.value)}
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
              <span className="text-gray-600">{filteredLaunches.length} launches</span>
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
          {filteredLaunches.length === 0 ? (
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
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredLaunches.map((launch) => (
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
                        <VoteButton 
                          launchId={launch.id} 
                          initialVoteCount={launch.votes_count}
                          className="text-sm"
                        />
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
                            <VoteButton 
                              launchId={launch.id} 
                              initialVoteCount={launch.votes_count}
                              className="text-sm font-medium"
                            />
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
          )}
        </div>
      </div>
    </div>
  )
}

