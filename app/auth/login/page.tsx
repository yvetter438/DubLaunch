'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Welcome back!')
        router.push('/')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto w-full max-w-xl px-6 sm:px-8">
        <div className="mb-10 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">Sign In</p>
          <h1 className="editorial-heading mb-4">Welcome back</h1>
          <p className="editorial-subheading">
            Sign in to discover and launch amazing projects from the UW community.
          </p>
        </div>

        <div className="card md:p-10">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <label htmlFor="email" className="editorial-mono mb-3 block text-neutral-500">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="yournetid@uw.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="editorial-mono mb-3 block text-neutral-500">
                  Password
                </label>
                <div className="relative border-b border-black/10 focus-within:border-uw-purple transition-colors duration-300">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent py-3 pr-10 text-base outline-none placeholder:text-neutral-400"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-black"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label htmlFor="remember-me" className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-black/10 text-uw-purple focus:ring-uw-purple"
                />
                Remember me
              </label>

              <Link
                href="/auth/forgot-password"
                className="editorial-mono text-neutral-500 transition-colors hover:text-uw-purple"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-uw-purple transition-colors hover:text-uw-purple/80"
          >
            Join DubLaunch
          </Link>
        </p>
      </div>
    </div>
  )
}
