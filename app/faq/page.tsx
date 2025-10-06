'use client'

import Header from '@/components/Header'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about DubLaunch
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is DubLaunch?</h3>
                <p className="text-gray-700">
                  DubLaunch is a platform for UW students to discover, share, and vote on amazing projects 
                  created by fellow Huskies. Think of it as ProductHunt, but specifically for the University 
                  of Washington community.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Who can use DubLaunch?</h3>
                <p className="text-gray-700">
                  DubLaunch is open to all University of Washington students, alumni, faculty, and staff. 
                  You'll need a valid UW email address to create an account.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I create an account?</h3>
                <p className="text-gray-700">
                  Click "Join DubLaunch" in the header, fill out the registration form with your UW email, 
                  and verify your account through the email we send you.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submitting Projects</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What kinds of projects can I submit?</h3>
                <p className="text-gray-700">
                  You can submit any project you've created as a UW student, including:
                </p>
                <ul className="text-gray-700 mt-2 space-y-1">
                  <li>• Software applications and websites</li>
                  <li>• Hardware projects and prototypes</li>
                  <li>• Research projects and papers</li>
                  <li>• Art, design, and creative works</li>
                  <li>• Business ideas and startups</li>
                  <li>• Academic coursework and assignments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I submit a project?</h3>
                <p className="text-gray-700">
                  Click "Launch" in the header or "New Launch" on your profile page. Fill out the project 
                  details including name, description, website URL, and upload a logo or image. Make sure 
                  your project is ready to be shared publicly before submitting.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I edit my project after submission?</h3>
                <p className="text-gray-700">
                  Yes! You can edit your project details, description, and media at any time from your 
                  profile page. However, the project URL (slug) cannot be changed after submission.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Voting and Engagement</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does voting work?</h3>
                <p className="text-gray-700">
                  You can vote for projects you think are interesting or well-executed. Each user can vote 
                  for each project once. You can remove your vote at any time. Votes help determine which 
                  projects appear on the leaderboard and get more visibility.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is the leaderboard?</h3>
                <p className="text-gray-700">
                  The leaderboard shows the top-performing projects based on votes and engagement. It's 
                  unlocked once there are at least 5 projects on the platform to ensure meaningful rankings.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I comment on projects?</h3>
                <p className="text-gray-700">
                  Yes! You can leave comments on any project to provide feedback, ask questions, or 
                  start discussions. Comments help creators improve their projects and build community.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Forums</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What are the forums for?</h3>
                <p className="text-gray-700">
                  The forums are for community discussions, asking questions, sharing tips, and connecting 
                  with other students. Categories include General Discussion, Feedback, Showcase, Help & Support, 
                  and Announcements.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I create a forum post?</h3>
                <p className="text-gray-700">
                  Go to the Forums page, select the appropriate category, and click "New Post". Choose a 
                  descriptive title and provide detailed information to help others understand your topic.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account and Privacy</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I update my profile?</h3>
                <p className="text-gray-700">
                  Go to your profile page and click "Edit Profile" to update your display name, bio, 
                  website, and location. Your username and email cannot be changed after account creation.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my information private?</h3>
                <p className="text-gray-700">
                  Your email address is never displayed publicly. Only your display name, username, 
                  bio, and any public profile information you choose to share are visible to other users.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Still have questions?</h2>
            <p className="text-blue-800 mb-4">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
