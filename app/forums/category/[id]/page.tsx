'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { 
  ArrowLeft, Heart, MessageSquare, Eye, Pin, Plus,
  User, Clock, ChevronRight, Filter, TrendingUp
} from 'lucide-react'

interface ForumCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

interface ForumPost {
  id: string
  title: string
  content: string
  created_at: string
  views_count: number
  likes_count: number
  comments_count: number
  is_pinned: boolean
  author: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<ForumCategory | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')

  const supabase = createClient()

  useEffect(() => {
    fetchCategoryData()
  }, [categoryId, sortBy])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch category info
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('id', categoryId)
        .eq('is_active', true)
        .single()

      if (categoryError) {
        console.error('Error fetching category:', categoryError)
        setError('Category not found')
        return
      }

      setCategory(categoryData)

      // Fetch posts in this category
      let postsQuery = supabase
        .from('forum_posts')
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('category_id', categoryId)
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
          postsQuery = postsQuery.order('comments_count', { ascending: false }).order('created_at', { ascending: false })
          break
      }

      const { data: postsData, error: postsError } = await postsQuery

      if (postsError) {
        console.error('Error fetching posts:', postsError)
        throw postsError
      }

      setPosts(postsData || [])

    } catch (err) {
      console.error('Error fetching category data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load category')
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
            <p className="mt-4 text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-6">{error || 'Category not found'}</p>
            <Link
              href="/forums"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Forums
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/forums"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forums
        </Link>

        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>
            </div>
            <Link
              href="/forums/new-post"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        {/* Sort and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {posts.length} posts in this category
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'trending')}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/forums/post/${post.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.is_pinned && (
                      <Pin className="w-4 h-4 text-orange-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {truncateContent(post.content)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
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
                              className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors text-left"
                            >
                              {post.author?.display_name || 'Unknown User'}
                            </button>
                            <span className="text-xs text-gray-500">@{post.author?.username || 'unknown'}</span>
                          </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(post.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
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
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl mx-auto mb-4"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to start a discussion in {category.name}!
            </p>
            <Link
              href="/forums/new-post"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
