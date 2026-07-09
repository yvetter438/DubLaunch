'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useHomeLaunches, type HomeLaunch } from './useHomeLaunches'

const CARD_RADIUS = [
  'rounded-tl-[100px] rounded-br-2xl',
  'rounded-tr-[100px] rounded-bl-[40px]',
  'rounded-tl-[40px] rounded-br-[100px]',
  'rounded-tr-[40px] rounded-bl-[100px]',
]

function MarqueeCard({ launch, index }: { launch: HomeLaunch; index: number }) {
  const radius = CARD_RADIUS[index % CARD_RADIUS.length]

  return (
    <Link
      href={`/launch/${launch.slug}`}
      className={`group relative mx-3 w-[220px] shrink-0 overflow-hidden md:w-[280px] ${radius}`}
      data-cursor-hover
    >
      <div className="relative aspect-[5/7] overflow-hidden bg-neutral-100">
        {launch.thumbnail_url ? (
          <Image
            src={launch.thumbnail_url}
            alt={launch.name}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-uw-purple/20 to-uw-purple/5 p-6">
            <span className="text-center text-2xl font-bold tracking-tight text-uw-purple">
              {launch.name}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 px-1">
        <p className="truncate text-sm font-semibold tracking-tight">{launch.name}</p>
        <p className="editorial-mono mt-1 text-neutral-500">{launch.primary_category || 'Launch'}</p>
      </div>
    </Link>
  )
}

export default function HomeMarquee() {
  const { launches, loading } = useHomeLaunches(8)

  const items = launches.length > 0 ? [...launches, ...launches] : []

  return (
    <section className="border-y border-black/10 py-16">
      <div className="mb-8 px-6 md:px-24">
        <p className="editorial-mono text-neutral-500">Featured Launches</p>
      </div>

      {loading ? (
        <div className="flex gap-6 px-6 md:px-24">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[360px] w-[220px] shrink-0 animate-pulse bg-neutral-100 md:w-[280px]" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="marquee-container group overflow-hidden">
          <div className="marquee-track flex w-max">
            {items.map((launch, index) => (
              <MarqueeCard key={`${launch.id}-${index}`} launch={launch} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <p className="px-6 text-neutral-500 md:px-24">No launches yet — be the first to launch.</p>
      )}
    </section>
  )
}
