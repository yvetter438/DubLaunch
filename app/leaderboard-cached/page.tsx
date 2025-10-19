import { Suspense } from 'react'
import { getCachedLeaderboard } from '@/lib/supabase/server-cache'
import Header from '@/components/Header'
import LeaderboardClient from './LeaderboardClient'

// Revalidate every hour (3600 seconds)
export const revalidate = 3600

export const metadata = {
  title: 'Leaderboard - DubLaunch',
  description: 'Top projects ranked by community votes',
}

export default async function LeaderboardPage() {
  // Fetch data on the server with caching
  const launches = await getCachedLeaderboard(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      }>
        <LeaderboardClient launches={launches} />
      </Suspense>
    </div>
  )
}

