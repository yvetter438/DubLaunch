'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Users, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-uw-purple to-uw-gold text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Product Hunt for UW Students
            <br />
            <span className="text-uw-gold">by UW Students</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            DubLaunch is your gateway to discovering, launching, and supporting the most innovative 
            projects from the University of Washington community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/launch" className="bg-white text-uw-purple hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Launch Your Project</span>
            </Link>
            <Link href="/discover" className="border-2 border-white text-white hover:bg-white hover:text-uw-purple px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
              <span>Discover Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3+</div>
              <div className="text-white/80">Projects Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">7+</div>
              <div className="text-white/80">UW Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3+</div>
              <div className="text-white/80">Total Votes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
