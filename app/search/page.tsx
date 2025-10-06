'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, User, Rocket, MessageSquare, Calendar, Eye, Heart } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'launch' | 'user' | 'post'
  title: string
  description: string
  image?: string
  author?: string
  username?: string
  category?: string
  votes_count?: number
  views_count?: number
  created_at: string
  slug?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<'all' | 'launches' | 'users' | 'posts'>('all')
  const [hasSearched, setHasSearched] = useState(false)

  const supabase = createClient()
  const searchParams = useSearchParams()

  // Handle URL search parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    if (urlQuery) {
      setQuery(urlQuery)
      searchAll(urlQuery)
    }
  }, [searchParams])

  const searchAll = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const results: SearchResult[] = []

      // Search launches
      if (selectedType === 'all' || selectedType === 'launches') {
        const { data: launches, error: launchesError } = await supabase
          .from('launches')
          .select(`
            id,
            name,
            tagline,
            description,
            thumbnail_url,
            primary_category,
            votes_count,
            views_count,
            created_at,
            slug,
            profiles!launches_creator_id_fkey (
              username,
              display_name
            )
          `)
          .eq('status', 'published')
          .or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .order('votes_count', { ascending: false })
          .limit(10)

        if (!launchesError && launches) {
          launches.forEach(launch => {
            results.push({
              id: launch.id,
              type: 'launch',
              title: launch.name,
              description: launch.tagline || launch.description?.substring(0, 200) + '...',
              image: launch.thumbnail_url,
              author: launch.profiles?.[0]?.display_name || 'Unknown',
              username: launch.profiles?.[0]?.username,
              category: launch.primary_category,
              votes_count: launch.votes_count || 0,
              views_count: launch.views_count || 0,
              created_at: launch.created_at,
              slug: launch.slug
            })
          })
        }
      }

      // Search users
      if (selectedType === 'all' || selectedType === 'users') {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, username, display_name, bio, avatar_url, created_at')
          .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
          .limit(10)

        if (!usersError && users) {
          users.forEach(user => {
            results.push({
              id: user.id,
              type: 'user',
              title: user.display_name || user.username,
              description: user.bio || 'No bio available',
              image: user.avatar_url,
              username: user.username,
              created_at: user.created_at
            })
          })
        }
      }

      // Search forum posts
      if (selectedType === 'all' || selectedType === 'posts') {
        const { data: posts, error: postsError } = await supabase
          .from('forum_posts')
          .select(`
            id,
            title,
            content,
            created_at,
            views_count,
            likes_count,
            forum_categories!forum_posts_category_id_fkey (
              name,
              color,
              icon
            ),
            profiles!forum_posts_author_id_fkey (
              username,
              display_name
            )
          `)
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!postsError && posts) {
          posts.forEach(post => {
            results.push({
              id: post.id,
              type: 'post',
              title: post.title,
              description: post.content?.substring(0, 200) + '...',
              author: post.profiles?.[0]?.display_name || 'Unknown',
              username: post.profiles?.[0]?.username,
              category: post.forum_categories?.[0]?.name,
              views_count: post.views_count || 0,
              votes_count: post.likes_count || 0,
              created_at: post.created_at
            })
          })
        }
      }

      // Sort results by relevance (recent first for now)
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setResults(results)

    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAll(query)
  }

  const handleTypeChange = (type: 'all' | 'launches' | 'users' | 'posts') => {
    setSelectedType(type)
    if (query.trim()) {
      searchAll(query)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'launch': return <Rocket className="w-5 h-5 text-purple-600" />
      case 'user': return <User className="w-5 h-5 text-blue-600" />
      case 'post': return <MessageSquare className="w-5 h-5 text-green-600" />
      default: return <Search className="w-5 h-5 text-gray-600" />
    }
  }

  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'launch': return `/launch/${result.slug}`
      case 'user': return `/profile/${result.username}`
      case 'post': return `/forums/post/${result.id}`
      default: return '#'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search DubLaunch</h1>
          <p className="text-gray-600">Find projects, users, and discussions</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for projects, users, or discussions..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Filters */}
        <div className="mb-8">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'All', icon: Search },
              { key: 'launches', label: 'Projects', icon: Rocket },
              { key: 'users', label: 'Users', icon: User },
              { key: 'posts', label: 'Discussions', icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTypeChange(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedType === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-gray-600 mb-6">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
                
                <div className="space-y-4">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={getResultUrl(result)}
                      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getResultIcon(result.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {result.title}
                            </h3>
                            {result.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {result.category}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {result.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {result.author && (
                              <span>by {result.author}</span>
                            )}
                            <span>{formatTimeAgo(result.created_at)}</span>
                            {result.votes_count !== undefined && (
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{result.votes_count}</span>
                              </div>
                            )}
                            {result.views_count !== undefined && (
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{result.views_count}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image */}
                        {result.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try searching with different keywords or browse our categories.
                </p>
              </div>
            )}
          </div>
        )}

        {/* No search yet */}
        {!hasSearched && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">
              Search for projects, users, or discussions to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
