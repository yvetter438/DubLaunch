'use client'

import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About DubLaunch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ProductHunt for UW students - where innovation meets community
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            DubLaunch is dedicated to showcasing the incredible projects and innovations 
            created by University of Washington students. We believe that great ideas 
            deserve to be seen, shared, and celebrated.
          </p>
          <p className="text-gray-700">
            Whether you're building the next big startup, creating art, developing 
            software, or working on research projects, DubLaunch provides the platform 
            to share your work with the UW community and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">For Creators</h3>
            <p className="text-gray-700 mb-4">
              Share your projects, get feedback, and connect with fellow Huskies who 
              share your passion for innovation.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Showcase your work to the UW community</li>
              <li>• Receive votes and feedback</li>
              <li>• Connect with potential collaborators</li>
              <li>• Build your portfolio</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">For Discoverers</h3>
            <p className="text-gray-700 mb-4">
              Discover amazing projects created by your fellow students and support 
              the innovative work happening at UW.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Browse the latest student projects</li>
              <li>• Vote for your favorites</li>
              <li>• Join discussions in our forums</li>
              <li>• Get inspired by fellow Huskies</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Built by Huskies, for Huskies</h2>
          <p className="text-gray-700">
            DubLaunch was created by UW students who understand the challenges and 
            opportunities of being part of the University of Washington community. 
            We're passionate about supporting student innovation and creating a 
            platform where great ideas can thrive.
          </p>
        </div>
      </div>
    </div>
  )
}
