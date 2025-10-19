import { Suspense } from 'react'
import { getCachedLaunches } from '@/lib/supabase/server-cache'
import Header from '@/components/Header'
import DiscoverClient from './DiscoverClient'

// Revalidate every hour (3600 seconds)
export const revalidate = 3600

export const metadata = {
  title: 'Discover Projects - DubLaunch',
  description: 'Explore the latest launches from the UW community',
}

export default async function DiscoverPage() {
  // Fetch data on the server with caching
  const initialLaunches = await getCachedLaunches()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <DiscoverClient initialLaunches={initialLaunches} />
      </Suspense>
    </div>
  )
}

