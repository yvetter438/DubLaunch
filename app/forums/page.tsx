'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { 
  MessageSquare, Users, Clock, Eye, Heart, 
  Plus, TrendingUp, Pin, Lock, Filter,
  ChevronRight, Calendar, User
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ForumCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  sort_order: number
  is_active: boolean
  posts_count?: number
  latest_post?: {
    id: string
    title: string
    created_at: string
    author: {
      username: string
      display_name: string
    }
  }
}

interface RecentPost {
  id: string
  title: string
  content: string
  created_at: string
  views_count: number
  likes_count: number
  comments_count: number
  is_pinned: boolean
  category: {
    name: string
    color: string
    icon: string
  }
  author: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export default function ForumsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')

  const supabase = createClient()

  useEffect(() => {
    fetchForumsData()
  }, [sortBy])

  const fetchForumsData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting forums data fetch...')

      // Fetch categories first with timeout
      console.log('Fetching categories...')
      const categoriesPromise = supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      const categoriesResult = await Promise.race([
        categoriesPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Categories query timeout')), 10000)
        )
      ]) as any

      console.log('Categories result:', categoriesResult.data)
      console.log('Categories error:', categoriesResult.error)

      if (categoriesResult.error) {
        console.error('Error fetching categories:', categoriesResult.error)
        throw categoriesResult.error
      }

      // Process categories data (post counts will be calculated separately)
      const processedCategories = categoriesResult.data?.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        sort_order: category.sort_order,
        is_active: category.is_active,
        posts_count: 0, // Will be calculated below
        latest_post: undefined
      })) || []

      setCategories(processedCategories)

      // Fetch recent posts (simple query first)
      console.log('Fetching posts...')
      let postsQuery = supabase
        .from('forum_posts')
        .select('*')
        .eq('status', 'published')
        .order('is_pinned', { ascending: false })

      switch (sortBy) {
        case 'recent':
          postsQuery = postsQuery.order('created_at', { ascending: false })
          break
        case 'popular':
          postsQuery = postsQuery.order('likes_count', { ascending: false })
          break
        case 'trending':
          // Simple trending: recent posts with high engagement
          postsQuery = postsQuery.order('comments_count', { ascending: false }).order('created_at', { ascending: false })
          break
      }

      const { data: postsData, error: postsError } = await postsQuery.limit(10)

      console.log('Posts result:', postsData)
      console.log('Posts error:', postsError)

      if (postsError) {
        console.error('Error fetching recent posts:', postsError)
        throw postsError
      }

      // Fetch related data separately for each post
      console.log('Fetching related data for posts...')
      const enrichedPosts = await Promise.all(
        postsData.map(async (post) => {
          // Fetch category data
          const { data: categoryData } = await supabase
            .from('forum_categories')
            .select('id, name, color, icon')
            .eq('id', post.category_id)
            .single()

          // Fetch author data
          const { data: authorData } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .eq('id', post.author_id)
            .single()

          return {
            ...post,
            category: categoryData || { name: 'General', color: '#6366f1', icon: '💬' },
            author: authorData || { username: 'unknown', display_name: 'Unknown User', avatar_url: null }
          }
        })
      )

      console.log('Enriched posts:', enrichedPosts)
      setRecentPosts(enrichedPosts)

      // Calculate post counts for each category
      const categoryCounts: { [key: string]: number } = {}
      enrichedPosts.forEach(post => {
        if (post.category_id) {
          categoryCounts[post.category_id] = (categoryCounts[post.category_id] || 0) + 1
        }
      })

      // Update categories with post counts
      const updatedCategories = processedCategories.map(category => ({
        ...category,
        posts_count: categoryCounts[category.id] || 0
      }))
      setCategories(updatedCategories)

    } catch (err) {
      console.error('Error fetching forums data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load forums')
    } finally {
      setLoading(false)
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading forums...</p>
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
            <button
              onClick={fetchForumsData}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Forums</h1>
            <p className="text-gray-600">Join the conversation with the UW community</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/forums/new-post"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Link href="/forums/new-post" className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Start Discussion</span>
                </Link>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/forums/category/${category.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.posts_count || 0} posts</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Total Posts</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {categories.reduce((sum, cat) => sum + (cat.posts_count || 0), 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Categories</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">This Week</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {recentPosts.reduce((sum, post) => sum + post.comments_count, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Discussions</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'trending')}
                  className="text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forums/post/${post.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ backgroundColor: post.category?.color || '#6366f1' }}
                    >
                      {post.category?.icon || '💬'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            {post.is_pinned && (
                              <Pin className="w-4 h-4 text-orange-500" />
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 line-clamp-2 mb-3">{truncateContent(post.content, 200)}</p>
                        </div>
                        
                        <span 
                          className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ml-4 flex-shrink-0"
                          style={{ backgroundColor: post.category?.color || '#6366f1' }}
                        >
                          <span>{post.category?.icon || '💬'}</span>
                          <span>{post.category?.name || 'General'}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {post.author?.avatar_url ? (
                              <img
                                src={post.author.avatar_url}
                                alt={post.author?.display_name || 'User'}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                            <button
                              onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                              className="hover:text-purple-600 transition-colors text-left"
                            >
                              {post.author?.display_name || 'Unknown User'}
                            </button>
                            <span>@{post.author?.username || 'unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {recentPosts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
                <p className="text-gray-600 mb-6">Be the first to start a conversation in the community!</p>
                <Link href="/forums/new-post" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Start Discussion
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}