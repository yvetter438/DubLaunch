'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, User, LogOut, Plus } from 'lucide-react'
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
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.svg"
                alt="DubLaunch Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl text-gray-900">DubLaunch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/discover" className="text-gray-700 hover:text-uw-purple transition-colors">
              Discover
            </Link>
            <Link href="/launch" className="text-gray-700 hover:text-uw-purple transition-colors">
              Launch
            </Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-uw-purple transition-colors">
              Leaderboard
            </Link>
            <Link href="/forums" className="text-gray-700 hover:text-uw-purple transition-colors">
              Forums
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search projects, users, discussions..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uw-purple/20 focus:border-uw-purple"
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
                <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-uw-purple transition-colors">
                  <div className="w-8 h-8 bg-uw-purple rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>Profile</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-uw-purple transition-colors">
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
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/discover" className="text-gray-700 hover:text-uw-purple transition-colors">
                Discover
              </Link>
              <Link href="/launch" className="text-gray-700 hover:text-uw-purple transition-colors">
                Launch
              </Link>
              <Link href="/leaderboard" className="text-gray-700 hover:text-uw-purple transition-colors">
                Leaderboard
              </Link>
              <Link href="/forums" className="text-gray-700 hover:text-uw-purple transition-colors">
                Forums
              </Link>
              <div className="pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/launch" className="btn-primary text-center">
                      Launch Project
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-uw-purple transition-colors">
                      My Profile
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" className="text-gray-700 hover:text-uw-purple transition-colors">
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
