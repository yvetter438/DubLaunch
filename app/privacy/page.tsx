'use client'

import Header from '@/components/Header'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              submit a project, or contact us for support.
            </p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>• Account information (email, username, display name)</li>
              <li>• Profile information (bio, website, location)</li>
              <li>• Project submissions and content</li>
              <li>• Forum posts and comments</li>
              <li>• Communication with our support team</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>• Provide, maintain, and improve our services</li>
              <li>• Process transactions and send related information</li>
              <li>• Send technical notices and support messages</li>
              <li>• Respond to your comments and questions</li>
              <li>• Monitor and analyze usage patterns</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>• Access and update your personal information</li>
              <li>• Delete your account and associated data</li>
              <li>• Opt out of promotional communications</li>
              <li>• Request a copy of your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@dublaunch.com" className="text-purple-600 hover:text-purple-700">
                privacy@dublaunch.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
