import DiscordBanner from '@/components/DiscordBanner'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto max-w-2xl px-6 md:px-24">
        <div className="mb-8 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">Community</p>
          <h1 className="editorial-heading mb-2">Community</h1>
          <p className="editorial-subheading">Connect with fellow Huskies on Discord</p>
        </div>

        <DiscordBanner />
      </div>
    </div>
  )
}
