'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import FaultLine from '@/components/FaultLine'

const STATS = [
  { value: '11+', label: 'Projects Launched' },
  { value: '24+', label: 'UW Students' },
  { value: '20+', label: 'Total Votes' },
]

export default function Hero() {
  return (
    <section className="relative bg-stone-obsidian text-vein-ash overflow-hidden basalt-columns">
      <div className="absolute inset-0 topo-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-vein-magma/[0.06] via-transparent to-stone-basalt pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center animate-thud-shake">
          <p className="font-display text-vein-gold text-sm md:text-base tracking-[0.35em] uppercase mb-6 text-etched">
            University of Washington
          </p>

          <h1 className="font-display text-5xl md:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight">
            <span className="text-engraved block">Product Hunt for UW Students</span>
            <span className="block mt-2 text-vein-magma text-etched">by UW Students</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-vein-ash/75 max-w-3xl mx-auto font-sans leading-relaxed">
            DubLaunch is your gateway to discovering, launching, and supporting the most innovative
            projects from the University of Washington community.
          </p>

          <div
            className="inline-flex items-center gap-3 bg-stone-basalt border border-vein-gold/30 px-5 py-3 mb-10 shadow-monolith"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
          >
            <Image
              src="/yclogo.png"
              alt="Y Combinator"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <p className="text-sm md:text-base text-vein-ash text-left">
              <span className="font-semibold text-vein-gold">DubLaunchers</span> got into{' '}
              <span className="font-semibold text-vein-ash">Y Combinator</span>
              <span className="text-vein-ash/50"> · Summer 2026 batch</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/launch"
              className="btn-magma px-8 py-4 text-lg gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Launch Your Project</span>
            </Link>
            <Link
              href="/discover"
              className="border-2 border-vein-ash/30 text-vein-ash hover:border-vein-gold hover:text-vein-gold px-8 py-4 font-semibold text-lg transition-all duration-700 ease-tectonic flex items-center justify-center gap-2 bg-stone-basalt shadow-monolith"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
            >
              <span>Discover Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats — overlapping monolith plates */}
          <div className="plate-row max-w-4xl mx-auto gap-4 md:gap-0">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="monolith-plate px-6 py-8 text-center flex-1 animate-thud-shake"
                style={{ animationDelay: `${0.2 + index * 0.12}s` }}
              >
                <div className="font-display text-4xl font-semibold text-engraved mb-2">{stat.value}</div>
                <div className="text-vein-ash/55 text-sm tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FaultLine />
    </section>
  )
}
