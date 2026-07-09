'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, User, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setIsLoggedIn(!!user)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    }
  }

  return (
    <header className="bg-stone-obsidian border-b border-vein-ash/10 relative z-50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vein-magma/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.svg"
                alt="DubLaunch Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display font-semibold text-2xl text-vein-ash text-etched tracking-wide group-hover:text-vein-gold transition-all duration-700 ease-tectonic">
              DubLaunch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/discover" className="text-vein-ash/70 hover:text-vein-magma transition-all duration-700 ease-tectonic text-sm tracking-wide uppercase">
              Discover
            </Link>
            <Link href="/launch" className="text-vein-ash/70 hover:text-vein-magma transition-all duration-700 ease-tectonic text-sm tracking-wide uppercase">
              Launch
            </Link>
            <Link href="/leaderboard" className="text-vein-ash/70 hover:text-vein-magma transition-all duration-700 ease-tectonic text-sm tracking-wide uppercase">
              Leaderboard
            </Link>
            <Link href="/forums" className="text-vein-ash/70 hover:text-vein-magma transition-all duration-700 ease-tectonic text-sm tracking-wide uppercase">
              Community
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vein-ash/40 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search projects, users..."
                className="pl-10 pr-4 py-2 w-64 bg-stone-basalt border border-vein-ash/15 text-vein-ash placeholder:text-vein-ash/35 rounded-none focus:outline-none focus:border-vein-magma transition-all duration-700 ease-tectonic"
              />
            </form>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/launch" className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Launch</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-2 text-vein-ash/70 hover:text-vein-gold transition-all duration-700 ease-tectonic">
                  <div className="w-8 h-8 bg-stone-granite border border-vein-magma/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-vein-ash" />
                  </div>
                  <span>Profile</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-vein-ash/70 hover:text-vein-gold transition-all duration-700 ease-tectonic">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Join DubLaunch
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-vein-ash hover:bg-stone-basalt transition-all duration-700 ease-tectonic border border-transparent hover:border-vein-ash/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-vein-ash/10 bg-stone-basalt">
            <nav className="flex flex-col space-y-4">
              <Link href="/discover" className="text-vein-ash/80 hover:text-vein-magma transition-all duration-700 ease-tectonic uppercase tracking-wide text-sm">
                Discover
              </Link>
              <Link href="/launch" className="text-vein-ash/80 hover:text-vein-magma transition-all duration-700 ease-tectonic uppercase tracking-wide text-sm">
                Launch
              </Link>
              <Link href="/leaderboard" className="text-vein-ash/80 hover:text-vein-magma transition-all duration-700 ease-tectonic uppercase tracking-wide text-sm">
                Leaderboard
              </Link>
              <Link href="/forums" className="text-vein-ash/80 hover:text-vein-magma transition-all duration-700 ease-tectonic uppercase tracking-wide text-sm">
                Community
              </Link>
              <div className="pt-4 border-t border-vein-ash/10">
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/launch" className="btn-primary text-center">
                      Launch Project
                    </Link>
                    <Link href="/profile" className="text-vein-ash/80 hover:text-vein-gold transition-all duration-700 ease-tectonic">
                      My Profile
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" className="text-vein-ash/80 hover:text-vein-gold transition-all duration-700 ease-tectonic">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="btn-primary text-center">
                      Join DubLaunch
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
