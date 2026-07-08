import Header from '@/components/Header'
import DiscordBanner from '@/components/DiscordBanner'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow Huskies on Discord</p>
        </div>

        <DiscordBanner />
      </div>
    </div>
  )
}
