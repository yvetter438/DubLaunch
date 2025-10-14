'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, Heart, MessageCircle, ExternalLink, 
  Calendar, Eye, Share2, Play, Tag, Users,
  DollarSign, Gift, Clock, CheckCircle
} from 'lucide-react'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

interface Launch {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  apple_store_url: string
  android_store_url: string
  twitter_url: string
  other_links: Array<{name: string, url: string}>
  thumbnail_url: string
  demo_video_url: string
  gallery_images: string[]
  tags: string[]
  primary_category: string
  creator_id: string
  collaborators: string[]
  pricing_type: string
  pricing_details: string
  promo_code: string
  special_offer: string
  offer_expiry_date: string
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

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_id: string | null
  profiles: {
    username: string
    display_name: string
    avatar_url: string
  }
}

export default function LaunchDetailPage() {
  const [launch, setLaunch] = useState<Launch | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const launchSlug = params.id as string

  useEffect(() => {
    if (launchSlug) {
      fetchLaunch()
      checkUser()
    }
  }, [launchSlug])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchLaunch = async () => {
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
        .eq('slug', launchSlug)
        .eq('status', 'published')
        .single()

      if (error) {
        console.error('Error fetching launch:', error)
        router.push('/404')
        return
      }

      // Increment view count first
      const { error: updateError } = await supabase
        .from('launches')
        .update({ views_count: data.views_count + 1 })
        .eq('slug', launchSlug)

      if (!updateError) {
        // Update local state with incremented count
        data.views_count = data.views_count + 1
      }

      setLaunch(data)

      // Check if user has voted
      if (user) {
        await checkUserVote(data.id)
      }

      // Fetch comments
      await fetchComments(data.id)
      
    } catch (error) {
      console.error('Error fetching launch:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  const checkUserVote = async (launchId: string) => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('votes')
        .select('id')
        .eq('launch_id', launchId)
        .eq('user_id', user.id)
        .single()

      setHasVoted(!!data)
    } catch (error) {
      setHasVoted(false)
    }
  }

  const fetchComments = async (launchId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('launch_id', launchId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleVote = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    setVoting(true)

    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('launch_id', launch?.id)
          .eq('user_id', user.id)

        if (error) throw error

        setHasVoted(false)
        if (launch) {
          setLaunch({ ...launch, votes_count: launch.votes_count - 1 })
        }
        toast.success('Vote removed')
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert([{
            launch_id: launch?.id,
            user_id: user.id
          }])

        if (error) throw error

        setHasVoted(true)
        if (launch) {
          setLaunch({ ...launch, votes_count: launch.votes_count + 1 })
        }
        toast.success('Vote added!')
      }
    } catch (error: any) {
      console.error('Error voting:', error)
      toast.error(error.message || 'Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!newComment.trim()) return

    setSubmittingComment(true)

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment.trim(),
          user_id: user.id,
          launch_id: launch?.id
        }])

      if (error) throw error

      setNewComment('')
      toast.success('Comment added!')
      
      // Refresh comments
      await fetchComments(launch?.id || '')
      
      // Update comment count
      if (launch) {
        setLaunch({ ...launch, comments_count: launch.comments_count + 1 })
      }
      
    } catch (error: any) {
      console.error('Error adding comment:', error)
      toast.error(error.message || 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isOfferExpired = (expiryDate: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading launch...</p>
        </div>
      </div>
    )
  }

  if (!launch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Launch Not Found</h1>
          <p className="text-gray-600 mb-6">The launch you're looking for doesn't exist or has been removed.</p>
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Launch Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {launch.thumbnail_url ? (
                    <img
                      src={launch.thumbnail_url}
                      alt={launch.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {launch.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{launch.name}</h1>
                    <p className="text-gray-600">{launch.tagline}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {launch.views_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(launch.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleVote}
                  disabled={voting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasVoted
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                  {launch.votes_count}
                </button>
              </div>

              <p className="text-gray-700 mb-4">{launch.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                  {launch.primary_category}
                </span>
                {launch.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={launch.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
                
                {launch.demo_video_url && (
                  <a
                    href={launch.demo_video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </a>
                )}

                {launch.apple_store_url && (
                  <a
                    href={launch.apple_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    App Store
                  </a>
                )}

                {launch.android_store_url && (
                  <a
                    href={launch.android_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Play Store
                  </a>
                )}

                {launch.twitter_url && (
                  <a
                    href={launch.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Twitter
                  </a>
                )}

                {launch.other_links?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Pricing & Offers */}
            {(launch.pricing_type !== 'free' || launch.special_offer || launch.promo_code) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Offers</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="capitalize">{launch.pricing_type}</span>
                  </div>

                  {launch.pricing_details && (
                    <p className="text-gray-700">{launch.pricing_details}</p>
                  )}

                  {launch.promo_code && (
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-500" />
                      <span className="text-green-700 font-medium">Promo Code: {launch.promo_code}</span>
                    </div>
                  )}

                  {launch.special_offer && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">{launch.special_offer}</p>
                      {launch.offer_expiry_date && (
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span className={isOfferExpired(launch.offer_expiry_date) ? 'text-red-600' : 'text-green-600'}>
                            {isOfferExpired(launch.offer_expiry_date) ? 'Expired' : `Expires ${formatDate(launch.offer_expiry_date)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              {user && (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this launch..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        {comment.profiles.avatar_url ? (
                          <img
                            src={comment.profiles.avatar_url}
                            alt={comment.profiles.display_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {comment.profiles.display_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.profiles.display_name}</span>
                          <span className="text-gray-500 text-sm">@{comment.profiles.username}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Created by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  {launch.profiles.avatar_url ? (
                    <img
                      src={launch.profiles.avatar_url}
                      alt={launch.profiles.display_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {launch.profiles.display_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{launch.profiles.display_name}</h4>
                  <p className="text-gray-600 text-sm">@{launch.profiles.username}</p>
                  <button
                    onClick={() => router.push(`/profile/${launch.profiles.username}`)}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Launch Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-semibold text-gray-900">{launch.votes_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{launch.views_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-semibold text-gray-900">{launch.comments_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
