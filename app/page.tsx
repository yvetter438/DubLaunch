import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedLaunches from '@/components/FeaturedLaunches'
import Leaderboard from '@/components/Leaderboard'
import Categories from '@/components/Categories'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-uw-light to-white">
      <Header />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Suspense fallback={<div>Loading launches...</div>}>
                <FeaturedLaunches />
              </Suspense>
            </div>
            <div className="space-y-8">
              <Suspense fallback={<div>Loading leaderboard...</div>}>
                <Leaderboard />
              </Suspense>
              <Categories />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
