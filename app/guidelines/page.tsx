'use client'

import Header from '@/components/Header'

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-xl text-gray-600">
            Help us maintain a positive and inclusive environment for all Huskies
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Community Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Be Respectful</h3>
                <p className="text-gray-700 text-sm">Treat everyone with kindness and respect, regardless of background or experience level.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Be Constructive</h3>
                <p className="text-gray-700 text-sm">Provide helpful feedback and constructive criticism to help others improve.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Be Authentic</h3>
                <p className="text-gray-700 text-sm">Share genuine projects and honest feedback. No spam or misleading content.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Be Supportive</h3>
                <p className="text-gray-700 text-sm">Encourage and celebrate the achievements of your fellow Huskies.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Submission Guidelines</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">What to Share</h3>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• Student-created projects and innovations</li>
                <li>• Academic research and coursework</li>
                <li>• Personal projects and side hustles</li>
                <li>• Collaborative work with other students</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900">What Not to Share</h3>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• Commercial products without student involvement</li>
                <li>• Projects that violate UW policies</li>
                <li>• Content that's inappropriate or harmful</li>
                <li>• Spam or promotional content</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Forum Guidelines</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Stay On Topic</h3>
              <p className="text-gray-700">Keep discussions relevant to the category and helpful for the community.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Use Descriptive Titles</h3>
              <p className="text-gray-700">Make it easy for others to understand what your post is about.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Search Before Posting</h3>
              <p className="text-gray-700">Check if your question has already been answered in existing discussions.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Reporting and Enforcement</h2>
          <p className="text-red-800 mb-4">
            If you encounter content that violates these guidelines, please report it to our moderation team. 
            We take all reports seriously and will take appropriate action to maintain our community standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Report Content
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Contact Moderation Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
