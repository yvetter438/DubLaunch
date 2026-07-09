'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useHomeLaunches } from './useHomeLaunches'

export default function HomeProjectGrid() {
  const { launches, loading } = useHomeLaunches(6)

  return (
    <section className="border-t border-black/10 px-6 py-24 md:px-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="editorial-mono text-neutral-500">Top Projects</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] md:text-4xl">Latest Launches</h2>
        </div>
        <Link
          href="/leaderboard"
          className="editorial-mono hidden text-neutral-500 transition-colors hover:text-uw-purple sm:inline-block"
          data-cursor-hover
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-neutral-100" />
              <div className="mt-4 h-6 w-2/3 bg-neutral-100" />
            </div>
          ))}
        </div>
      ) : launches.length > 0 ? (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {launches.map((launch) => {
            const year = new Date(launch.created_at).getFullYear().toString()

            return (
              <Link
                key={launch.id}
                href={`/launch/${launch.slug}`}
                className="group block"
                data-cursor-hover
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                  {launch.thumbnail_url ? (
                    <Image
                      src={launch.thumbnail_url}
                      alt={launch.name}
                      fill
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-uw-purple/15 to-neutral-100">
                      <span className="text-4xl font-bold tracking-tight text-uw-purple">
                        {launch.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                  <ArrowUpRight className="absolute right-4 top-4 h-6 w-6 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>

                <div className="mt-4 border-t border-black/10 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-[-0.03em] transition-colors group-hover:text-uw-purple">
                      {launch.name}
                    </h3>
                    <span className="editorial-mono shrink-0 text-neutral-500">{year}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="editorial-mono text-neutral-500">
                      {launch.primary_category || 'Launch'}
                    </span>
                    <span className="editorial-mono text-neutral-400">
                      {launch.votes_count} votes · @{launch.profiles.username}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-neutral-500">No launches yet.</p>
      )}

      <div className="mt-12 text-center sm:hidden">
        <Link
          href="/leaderboard"
          className="editorial-mono text-neutral-500 transition-colors hover:text-uw-purple"
          data-cursor-hover
        >
          View All →
        </Link>
      </div>
    </section>
  )
}
