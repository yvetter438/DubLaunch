'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateUniqueSlug } from '@/lib/utils/slug'
import { 
  ChevronLeft, ChevronRight, Save, Eye, 
  Link as LinkIcon, Image as ImageIcon, 
  Video, Tag, Users, DollarSign, 
  Gift, Calendar, Check
} from 'lucide-react'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

interface LaunchFormData {
  // Basic Info
  name: string
  tagline: string
  description: string
  website_url: string
  
  // Additional Links
  apple_store_url: string
  android_store_url: string
  twitter_url: string
  other_links: Array<{name: string, url: string}>
  
  // Media
  thumbnail_url: string
  demo_video_url: string
  gallery_images: string[]
  
  // Categorization
  tags: string[]
  primary_category: string
  
  // Team
  collaborators: string[]
  
  // Pricing & Offers
  pricing_type: 'free' | 'paid' | 'freemium' | 'free_trial'
  pricing_details: string
  promo_code: string
  special_offer: string
  offer_expiry_date: string
  
  // First Comment
  first_comment: string
}

const CATEGORIES = [
  'Web App', 'Mobile App', 'Desktop App', 'API', 'Library',
  'Chrome Extension', 'Design Tool', 'Developer Tool', 'AI/ML',
  'Blockchain', 'Gaming', 'E-commerce', 'Education', 'Health',
  'Finance', 'Productivity', 'Social', 'Entertainment', 'Other'
]

const PRICING_TYPES = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'free_trial', label: 'Free Trial' }
]

export default function LaunchPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState<LaunchFormData>({
    name: '',
    tagline: '',
    description: '',
    website_url: '',
    apple_store_url: '',
    android_store_url: '',
    twitter_url: '',
    other_links: [],
    thumbnail_url: '',
    demo_video_url: '',
    gallery_images: [],
    tags: [],
    primary_category: '',
    collaborators: [],
    pricing_type: 'free',
    pricing_details: '',
    promo_code: '',
    special_offer: '',
    offer_expiry_date: '',
    first_comment: ''
  })

  const totalSteps = 6

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    setUser(session.user)
  }

  const handleInputChange = (field: keyof LaunchFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addOtherLink = () => {
    setFormData(prev => ({
      ...prev,
      other_links: [...prev.other_links, { name: '', url: '' }]
    }))
  }

  const updateOtherLink = (index: number, field: 'name' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      other_links: prev.other_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeOtherLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      other_links: prev.other_links.filter((_, i) => i !== index)
    }))
  }

  const addTag = (tag: string) => {
    if (formData.tags.length < 3 && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      // Generate unique slug
      const slug = await generateUniqueSlug(formData.name)
      
      // Create the launch
      const { data: launch, error: launchError } = await supabase
        .from('launches')
        .insert([{
          name: formData.name,
          slug: slug,
          tagline: formData.tagline,
          description: formData.description,
          website_url: formData.website_url,
          apple_store_url: formData.apple_store_url || null,
          android_store_url: formData.android_store_url || null,
          twitter_url: formData.twitter_url || null,
          other_links: formData.other_links.filter(link => link.name && link.url),
          thumbnail_url: formData.thumbnail_url || null,
          demo_video_url: formData.demo_video_url || null,
          gallery_images: formData.gallery_images,
          tags: formData.tags,
          primary_category: formData.primary_category,
          creator_id: user.id,
          collaborators: formData.collaborators,
          pricing_type: formData.pricing_type,
          pricing_details: formData.pricing_details || null,
          promo_code: formData.promo_code || null,
          special_offer: formData.special_offer || null,
          offer_expiry_date: formData.offer_expiry_date || null,
          status: 'published'
        }])
        .select()
        .single()

      if (launchError) {
        throw launchError
      }

      // Add the first comment if provided
      if (formData.first_comment.trim()) {
        const { error: commentError } = await supabase
          .from('comments')
          .insert([{
            content: formData.first_comment,
            user_id: user.id,
            launch_id: launch.id
          }])

        if (commentError) {
          console.error('Error adding first comment:', commentError)
        }
      }

      toast.success('Launch published successfully!')
      router.push(`/launch/${launch.slug}`)
      
    } catch (error: any) {
      console.error('Error creating launch:', error)
      toast.error(error.message || 'Failed to create launch')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={40}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your project name (max 40 characters)"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.name.length}/40 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="A catchy one-liner about your project (max 60 characters)"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.tagline.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://yourproject.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                maxLength={300}
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your project in detail (max 300 characters)"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.description.length}/300 characters</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Additional Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apple App Store
                </label>
                <input
                  type="url"
                  value={formData.apple_store_url}
                  onChange={(e) => handleInputChange('apple_store_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://apps.apple.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Play Store
                </label>
                <input
                  type="url"
                  value={formData.android_store_url}
                  onChange={(e) => handleInputChange('android_store_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://play.google.com/..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter/X Account
                </label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourproject"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Links
              </label>
              {formData.other_links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Link name (e.g., GitHub, Discord)"
                    value={link.name}
                    onChange={(e) => updateOtherLink(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateOtherLink(index, 'url', e.target.value)}
                    className="flex-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherLink(index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOtherLink}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200"
              >
                <LinkIcon className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Media & Demo</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.png"
              />
              {formData.thumbnail_url && (
                <div className="mt-2">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Thumbnail preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo Video (Loom/YouTube)
              </label>
              <input
                type="url"
                value={formData.demo_video_url}
                onChange={(e) => handleInputChange('demo_video_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://loom.com/share/... or https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Categories & Tags</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.primary_category}
                onChange={(e) => handleInputChange('primary_category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (up to 3)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(cat => !formData.tags.includes(cat)).map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => addTag(category)}
                    disabled={formData.tags.length >= 3}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Pricing & Offers</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRICING_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('pricing_type', type.value)}
                    className={`p-3 rounded-lg border text-center ${
                      formData.pricing_type === type.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.pricing_type !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Details
                </label>
                <textarea
                  rows={3}
                  value={formData.pricing_details}
                  onChange={(e) => handleInputChange('pricing_details', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your pricing model..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={formData.promo_code}
                  onChange={(e) => handleInputChange('promo_code', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="DUBLAUNCH2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.offer_expiry_date}
                  onChange={(e) => handleInputChange('offer_expiry_date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Offer
              </label>
              <textarea
                rows={3}
                value={formData.special_offer}
                onChange={(e) => handleInputChange('special_offer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any special offers for DubLaunch users?"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Final Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Comment (Why & How)
              </label>
              <textarea
                rows={5}
                value={formData.first_comment}
                onChange={(e) => handleInputChange('first_comment', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Explain the story behind your project - why you built it, how it works, what makes it special..."
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Preview</h4>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{formData.name || 'Project Name'}</h3>
                  <p className="text-gray-600">{formData.tagline || 'Project tagline'}</p>
                </div>
                <p className="text-sm text-gray-700">{formData.description || 'Project description'}</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Launch Your Project</h1>
                <p className="text-gray-600">Share your amazing project with the UW community</p>
              </div>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${
                      i + 1 <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentStep === totalSteps ? (
                  <>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !formData.name || !formData.tagline || !formData.description || !formData.website_url || !formData.primary_category}
                      className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Publishing...' : 'Publish Launch'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}