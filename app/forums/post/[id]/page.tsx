'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { 
  ArrowLeft, Heart, MessageSquare, Eye, Pin, Lock,
  User, Clock, ChevronDown, ChevronUp, Reply, MoreHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ForumPost {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  views_count: number
  likes_count: number
  comments_count: number
  is_pinned: boolean
  is_locked: boolean
  category: {
    id: string
    name: string
    color: string
    icon: string
  }
  author: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
}

interface ForumComment {
  id: string
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  parent_comment_id: string | null
  author: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
  }
  replies?: ForumComment[]
  is_liked?: boolean
}

export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    console.log('🔄 ForumPostPage useEffect triggered with postId:', postId)
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Run all operations in parallel
        await Promise.all([
          checkUser(),
          fetchPost(),
          fetchComments()
        ])
        
        console.log('🔄 All data fetching completed')
      } catch (err) {
        console.error('🔄 Error in fetchAllData:', err)
        setError('Failed to load data')
      } finally {
        console.log('🔄 Setting loading to false')
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [postId])

  const checkUser = async () => {
    console.log('👤 Checking user authentication...')
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('👤 User check result:', { user: user?.id, error })
      setUser(user)
    } catch (err) {
      console.error('👤 User check error:', err)
    }
  }

  const fetchPost = async () => {
    try {
      console.log('📝 Starting to fetch post with ID:', postId)
      
      // Fetch post data (simple query first)
      console.log('📝 Step 1: Fetching basic post data...')
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .eq('status', 'published')
        .single()

      console.log('📝 Post query result:', { data: postData, error: postError })

      if (postError) {
        console.error('📝 Post fetch error:', postError)
        setError('Post not found or no longer available')
        return
      }

      if (!postData) {
        console.error('📝 No post data returned')
        setError('Post not found')
        return
      }

      console.log('📝 Post data received:', postData)

      // Fetch category data separately
      console.log('📝 Step 2: Fetching category data for category_id:', postData.category_id)
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('id, name, color, icon')
        .eq('id', postData.category_id)
        .single()

      console.log('📝 Category query result:', { data: categoryData, error: categoryError })

      // Fetch author data separately
      console.log('📝 Step 3: Fetching author data for author_id:', postData.author_id)
      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .eq('id', postData.author_id)
        .single()

      console.log('📝 Author query result:', { data: authorData, error: authorError })

      // Combine the data
      const enrichedPost = {
        ...postData,
        category: categoryData || { name: 'General', color: '#6366f1', icon: '💬' },
        author: authorData || { username: 'unknown', display_name: 'Unknown User', avatar_url: null }
      }

      console.log('📝 Final enriched post:', enrichedPost)
      setPost(enrichedPost)
      console.log('📝 Post state updated successfully')

      // Increment view count
      console.log('📝 Step 4: Incrementing view count...')
      const { error: viewError } = await supabase
        .from('forum_posts')
        .update({ views_count: postData.views_count + 1 })
        .eq('id', postId)
      
      console.log('📝 View count update result:', { error: viewError })

    } catch (error) {
      console.error('📝 Fatal error in fetchPost:', error)
      setError('Failed to load post')
      throw error // Re-throw to be caught by the main try-catch
    }
  }

  const fetchComments = async () => {
    try {
      console.log('💬 Starting to fetch comments for post:', postId)
      
      // Fetch comments (simple query first)
      console.log('💬 Step 1: Fetching basic comments data...')
      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'published')
        .order('created_at', { ascending: true })

      console.log('💬 Comments query result:', { data: commentsData, error: commentsError })

      if (commentsError) {
        console.error('💬 Comments fetch error:', commentsError)
        return
      }

      if (!commentsData || commentsData.length === 0) {
        console.log('💬 No comments found, setting empty array')
        setComments([])
        return
      }

      console.log('💬 Found', commentsData.length, 'comments')

      // Fetch author data for each comment separately
      console.log('💬 Step 2: Fetching author data for each comment...')
      const enrichedComments = await Promise.all(
        commentsData.map(async (comment, index) => {
          console.log(`💬 Fetching author for comment ${index + 1}/${commentsData.length}:`, comment.author_id)
          
          // Fetch author data
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .eq('id', comment.author_id)
            .single()

          console.log(`💬 Author data for comment ${index + 1}:`, { data: authorData, error: authorError })

          return {
            ...comment,
            author: authorData || { username: 'unknown', display_name: 'Unknown User', avatar_url: null },
            is_liked: false, // Simplified for now
            replies: []
          }
        })
      )

      console.log('💬 All enriched comments:', enrichedComments)

      // Process comments to build nested structure
      console.log('💬 Step 3: Building nested comment structure...')
      const commentsMap = new Map<string, ForumComment>()
      const rootComments: ForumComment[] = []

      enrichedComments.forEach(comment => {
        commentsMap.set(comment.id, comment)

        if (comment.parent_comment_id) {
          const parent = commentsMap.get(comment.parent_comment_id)
          if (parent) {
            parent.replies = parent.replies || []
            parent.replies.push(comment)
          }
        } else {
          rootComments.push(comment)
        }
      })

      console.log('💬 Final root comments structure:', rootComments)
      setComments(rootComments)
      console.log('💬 Comments state updated successfully')

    } catch (error) {
      console.error('💬 Error fetching comments:', error)
      throw error // Re-throw to be caught by the main try-catch
    }
  }

  const handleLikePost = async () => {
    if (!user) {
      toast.error('Please log in to like posts')
      return
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
      } else {
        // Like
        await supabase
          .from('forum_post_likes')
          .insert([{
            post_id: postId,
            user_id: user.id
          }])
      }

      // Refresh post data
      fetchPost()
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like')
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to comment')
      return
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setSubmittingComment(true)

    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert([{
          content: newComment.trim(),
          post_id: postId,
          author_id: user.id,
          status: 'published'
        }])

      if (error) {
        console.error('Error creating comment:', error)
        toast.error('Failed to create comment')
        return
      }

      setNewComment('')
      toast.success('Comment added successfully!')
      fetchComments()
      fetchPost() // Update comment count
      
    } catch (error) {
      console.error('Error creating comment:', error)
      toast.error('Failed to create comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!user) {
      toast.error('Please log in to reply')
      return
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    setSubmittingReply(true)

    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert([{
          content: replyContent.trim(),
          post_id: postId,
          author_id: user.id,
          parent_comment_id: parentCommentId,
          status: 'published'
        }])

      if (error) {
        console.error('Error creating reply:', error)
        toast.error('Failed to create reply')
        return
      }

      setReplyContent('')
      setReplyingTo(null)
      toast.success('Reply added successfully!')
      fetchComments()
      
    } catch (error) {
      console.error('Error creating reply:', error)
      toast.error('Failed to create reply')
    } finally {
      setSubmittingReply(false)
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

  const renderComment = (comment: ForumComment, depth: number = 0) => {
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {comment.author?.avatar_url ? (
                <img
                  src={comment.author.avatar_url}
                  alt={comment.author?.display_name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <button
                  onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
                  className="font-medium text-gray-900 hover:text-purple-600 transition-colors text-left"
                >
                  {comment.author?.display_name || 'Unknown User'}
                </button>
                <span className="text-xs text-gray-500">@{comment.author?.username || 'unknown'}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">{comment.content}</div>
              <div className="flex items-center space-x-4 mt-3">
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent('')
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={submittingReply || !replyContent.trim()}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingReply ? 'Posting...' : 'Reply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  console.log('🎨 Render state:', { loading, error, post: !!post, comments: comments?.length || 0 })

  if (loading) {
    console.log('🎨 Rendering loading state')
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    console.log('🎨 Rendering error state:', { error, post: !!post })
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-6">{error || 'Post not found'}</p>
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

  console.log('🎨 Rendering main post content with post:', post)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/forums"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forums
        </Link>

        {/* Post Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            {post.is_pinned && (
              <Pin className="w-4 h-4 text-orange-500" />
            )}
            <div 
              className="inline-flex items-center space-x-1 px-2 py-1 rounded text-white text-sm"
              style={{ backgroundColor: post.category?.color || '#6366f1' }}
            >
              <span>{post.category?.icon || '💬'}</span>
              <span>{post.category?.name || 'General'}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                {post.author?.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author?.display_name || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.author?.display_name || 'Unknown User'}</div>
                  <div className="text-sm text-gray-500">@{post.author?.username || 'unknown'}</div>
                </div>
              </button>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(post.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments_count || 0}</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLikePost}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>{post.likes_count}</span>
            </button>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Last updated: {formatTimeAgo(post.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Comments ({post.comments_count})
          </h2>

          {/* New Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start space-x-3">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Please log in to comment</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div>
            {comments.length > 0 ? (
              comments.map(comment => renderComment(comment))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
