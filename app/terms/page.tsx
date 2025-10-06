'use client'

import Header from '@/components/Header'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using DubLaunch, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily use DubLaunch for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Standards</h2>
            <p className="text-gray-700 mb-4">
              You agree not to post content that:
            </p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>• Is unlawful, harmful, or violates any applicable laws</li>
              <li>• Infringes on the rights of others</li>
              <li>• Contains spam or promotional material</li>
              <li>• Is offensive, defamatory, or inappropriate</li>
              <li>• Violates University of Washington policies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              You retain ownership of the content you submit to DubLaunch. By submitting content, 
              you grant us a license to display, distribute, and modify it as necessary to provide our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service:
            </p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>• To violate any international, federal, provincial, or state regulations</li>
              <li>• To infringe upon or violate our intellectual property rights</li>
              <li>• To harass, abuse, insult, harm, or discriminate against others</li>
              <li>• To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              The information on this website is provided on an "as is" basis. To the fullest extent 
              permitted by law, DubLaunch excludes all representations, warranties, and conditions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitations</h2>
            <p className="text-gray-700 mb-6">
              In no event shall DubLaunch or its suppliers be liable for any damages arising out of 
              the use or inability to use the materials on DubLaunch's website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms and conditions are governed by and construed in accordance with the laws 
              of Washington State.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. We will notify users of any 
              changes by posting the new terms on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@dublaunch.com" className="text-purple-600 hover:text-purple-700">
                legal@dublaunch.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
