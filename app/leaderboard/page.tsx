'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'

const LEADERBOARD_UNLOCK_THRESHOLD = 5

export default function LeaderboardPage() {
  const [launchCount, setLaunchCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkLaunchCount()
  }, [])

  const checkLaunchCount = async () => {
    try {
      console.log('Starting launch count check...')
      const supabase = createClient()
      
      const { count, error } = await supabase
        .from('launches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      console.log('Launch count result:', { count, error })

      if (error) {
        console.error('Error:', error)
        setError(error.message)
      } else {
        setLaunchCount(count || 0)
      }
    } catch (err) {
      console.error('Catch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const launchesNeeded = LEADERBOARD_UNLOCK_THRESHOLD - (launchCount || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Lock Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-purple-600 text-4xl">🔒</span>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Leaderboard Coming Soon!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We need <strong>{launchesNeeded} more amazing projects</strong> from the UW community before we can unlock the leaderboard.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{launchCount || 0} / {LEADERBOARD_UNLOCK_THRESHOLD} launches</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(((launchCount || 0) / LEADERBOARD_UNLOCK_THRESHOLD) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{launchCount || 0}</div>
              <div className="text-sm text-gray-600">Launches</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">Creators</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-gray-600">
              Help unlock the leaderboard by sharing your amazing project!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/launch"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🚀 Launch Your Project
              </a>
              <a
                href="/discover"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                👀 Browse Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}