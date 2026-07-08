import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-uw-light to-white">
      <Header />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg mx-auto">
            <Suspense fallback={<div>Loading leaderboard...</div>}>
              <Leaderboard />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
