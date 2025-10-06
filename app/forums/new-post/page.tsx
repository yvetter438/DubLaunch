'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ForumCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    is_pinned: false
  })

  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchCategories()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
        return
      }

      setCategories(data || [])
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to create a post')
      return
    }

    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title: formData.title.trim(),
          content: formData.content.trim(),
          category_id: formData.category_id,
          author_id: user.id,
          is_pinned: formData.is_pinned,
          status: 'published'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        toast.error(error.message || 'Failed to create post')
        return
      }

      toast.success('Post created successfully!')
      router.push(`/forums/post/${data.id}`)
      
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Authentication Required</div>
            <p className="text-gray-600 mb-6">Please log in to create a forum post.</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts and start a discussion</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Pin Post Option (for future moderation features) */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pinned"
                name="is_pinned"
                checked={formData.is_pinned}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="is_pinned" className="ml-2 block text-sm text-gray-700">
                Pin this post to the top (moderators only)
              </label>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-2">Community Guidelines</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Be respectful and constructive in your discussions</li>
                    <li>• Stay on topic and relevant to the category</li>
                    <li>• Use clear, descriptive titles for your posts</li>
                    <li>• Search existing posts before creating duplicates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link
                href="/forums"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || !formData.title.trim() || !formData.content.trim() || !formData.category_id}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
