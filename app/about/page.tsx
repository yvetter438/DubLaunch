'use client'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-6 md:px-24">
        <div className="mb-12 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">About</p>
          <h1 className="editorial-heading mb-4">About DubLaunch</h1>
          <p className="editorial-subheading mx-auto max-w-2xl">
            The Product Hunt for UW students — where innovation meets community
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Our Mission</h2>
          <p className="mb-6 text-neutral-600">
            DubLaunch is dedicated to showcasing the incredible projects and innovations
            created by University of Washington students. We believe that great ideas
            deserve to be seen, shared, and celebrated.
          </p>
          <p className="text-neutral-600">
            Whether you&apos;re building the next big startup, creating art, developing
            software, or working on research projects, DubLaunch provides the platform
            to share your work with the UW community and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="card">
            <h3 className="mb-4 text-xl font-bold tracking-tight">For Creators</h3>
            <p className="mb-4 text-neutral-600">
              Share your projects, get feedback, and connect with fellow Huskies who
              share your passion for innovation.
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• Showcase your work to the UW community</li>
              <li>• Receive votes and feedback</li>
              <li>• Connect with potential collaborators</li>
              <li>• Build your portfolio</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="mb-4 text-xl font-bold tracking-tight">For Discoverers</h3>
            <p className="mb-4 text-neutral-600">
              Discover amazing projects created by your fellow students and support
              the innovative work happening at UW.
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li>• Browse the latest student projects</li>
              <li>• Vote for your favorites</li>
              <li>• Connect with the community on Discord</li>
              <li>• Get inspired by fellow Huskies</li>
            </ul>
          </div>
        </div>

        <div className="card mt-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Built by Huskies, for Huskies</h2>
          <p className="text-neutral-600">
            DubLaunch was created by UW students who understand the challenges and
            opportunities of being part of the University of Washington community.
            We&apos;re passionate about supporting student innovation and creating a
            platform where great ideas can thrive.
          </p>
        </div>
      </div>
    </div>
  )
}
