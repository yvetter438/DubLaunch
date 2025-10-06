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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                  <p className="text-gray-700 mb-2">
                    For general questions, support, or feedback
                  </p>
                  <a 
                    href="mailto:support@dublaunch.com" 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    support@dublaunch.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Community Forums</h3>
                  <p className="text-gray-700 mb-2">
                    Join discussions with other Huskies
                  </p>
                  <a 
                    href="/forums" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Visit Forums →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Github className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">GitHub</h3>
                  <p className="text-gray-700 mb-2">
                    Report bugs or contribute to the project
                  </p>
                  <a 
                    href="https://github.com/dublaunch" 
                    className="text-gray-600 hover:text-gray-700 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/dublaunch
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Twitter</h3>
                  <p className="text-gray-700 mb-2">
                    Follow us for updates and announcements
                  </p>
                  <a 
                    href="https://twitter.com/dublaunch" 
                    className="text-sky-600 hover:text-sky-700 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @dublaunch
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your.email@uw.edu"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Question</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
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
