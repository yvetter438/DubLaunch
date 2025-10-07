'use client'

import Header from '@/components/Header'
import { Mail, MessageSquare, Github, Twitter } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with the DubLaunch team
          </p>
        </div>

        {/* Contact Information - Full Width */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Email Support */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    General inquiries, feedback, support, or partnership opportunities
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="mailto:support@dublaunch.io" 
                      className="block text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      support@dublaunch.io
                    </a>
                    <a 
                      href="mailto:info@dublaunch.io" 
                      className="block text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      info@dublaunch.io
                    </a>
                  </div>
                </div>
              </div>

              {/* Community Forums */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Forums</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Join discussions with other UW students and get community support
                  </p>
                  <a 
                    href="/forums" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Visit Forums
                    <span className="ml-1">→</span>
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Github className="w-7 h-7 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bug Reports & Features</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Report bugs, request features, or contribute to the codebase
                  </p>
                  <a 
                    href="https://github.com/yvetter438/DubLaunch" 
                    className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/yvetter438/DubLaunch
                    <span className="ml-1">↗</span>
                  </a>
                </div>
              </div>

              {/* Twitter/X */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-7 h-7 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow Us</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Stay updated with announcements, new features, and community highlights
                  </p>
                  <a 
                    href="https://x.com/dub_launch" 
                    className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @dub_launch
                    <span className="ml-1">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* What to Reach Out For */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What Can We Help You With?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-purple-900">General Questions</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-blue-900">Technical Support</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-green-900">Feature Requests</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-red-900">Bug Reports</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-yellow-900">Partnerships</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-indigo-900">Feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-12">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Response Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">General Questions:</span> 1-2 business days
            </div>
            <div>
              <span className="font-medium">Bug Reports:</span> 24-48 hours
            </div>
            <div>
              <span className="font-medium">Technical Support:</span> 2-3 business days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
