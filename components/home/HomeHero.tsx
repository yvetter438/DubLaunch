'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import StaggeredText from './StaggeredText'

const STATS = [
  { value: '13+', label: 'Projects Launched' },
  { value: '25+', label: 'DubLaunchers' },
  { value: '500K+', label: 'Raised by DubLaunchers' },
]

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center md:px-24">
      <p className="editorial-mono mb-8 text-uw-purple">University of Washington</p>

      <h1 className="max-w-[14ch] text-[12vw] font-bold leading-[0.9] tracking-[-0.05em] md:max-w-none">
        <StaggeredText text="Product Hunt" className="block" />
        <span className="mt-2 block text-uw-purple">
          <StaggeredText text="for UW" delay={0.4} />
        </span>
        <span className="mt-2 block">
          <StaggeredText text="Students" delay={0.7} />
        </span>
      </h1>

      <p className="mt-8 max-w-2xl text-2xl leading-snug tracking-[-0.02em] text-neutral-600">
        Discover, launch, and support the most innovative projects from the
        University of Washington community.
      </p>

      <div className="mt-10 inline-flex items-center gap-3 border border-black/10 px-5 py-3">
        <Image src="/yclogo.png" alt="Y Combinator" width={28} height={28} />
        <p className="text-left text-sm text-neutral-600">
          <span className="font-semibold text-black">DubLaunchers</span> got into{' '}
          <span className="font-semibold text-uw-purple">Y Combinator</span>
          <span className="text-neutral-400"> · Summer 2026</span>
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/launch"
          className="inline-flex items-center justify-center gap-2 bg-uw-purple px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-uw-purple/90"
          data-cursor-hover
        >
          Launch Your Project
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center justify-center gap-2 border border-black/10 px-8 py-4 text-sm font-medium transition-colors duration-300 hover:border-uw-purple hover:text-uw-purple"
          data-cursor-hover
        >
          Discover Projects
        </Link>
      </div>

      <div className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-8 border-t border-black/10 pt-10">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold tracking-tight text-uw-purple md:text-4xl">{stat.value}</p>
            <p className="editorial-mono mt-2 text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
