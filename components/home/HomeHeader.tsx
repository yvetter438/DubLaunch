'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { href: '/discover', label: 'Discover' },
    { href: '/launch', label: 'Launch' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/forums', label: 'Community' },
  ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference px-6 py-6 md:px-24">
        <div className="flex items-center justify-between text-white">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter"
            data-cursor-hover
          >
            dl
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center transition-transform duration-300 hover:rotate-90"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            data-cursor-hover
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Plus className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white text-black">
          <div className="flex h-full flex-col px-6 py-6 md:px-24">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tighter text-uw-purple"
                onClick={() => setIsMenuOpen(false)}
                data-cursor-hover
              >
                dublaunch
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Close menu"
                data-cursor-hover
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mt-16 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-bold tracking-tight transition-colors hover:text-uw-purple md:text-6xl"
                  data-cursor-hover
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="mt-12">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, users..."
                  className="w-full border-b border-black/10 bg-transparent py-3 pl-8 text-base outline-none placeholder:text-neutral-400 focus:border-uw-purple"
                />
              </div>
            </form>

            <div className="mt-auto flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/launch"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center gap-2 bg-uw-purple px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    data-cursor-hover
                  >
                    <Plus className="h-4 w-4" />
                    Launch Project
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-sm uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
                    data-cursor-hover
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex bg-uw-purple px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    data-cursor-hover
                  >
                    Join DubLaunch
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-sm uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
                    data-cursor-hover
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
