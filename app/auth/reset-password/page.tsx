'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  placeholder,
}: {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPassword: boolean
  onToggle: () => void
  placeholder: string
}) {
  return (
    <div>
      <label htmlFor={id} className="editorial-mono mb-3 block text-neutral-500">
        {label}
      </label>
      <div className="relative border-b border-black/10 focus-within:border-uw-purple transition-colors duration-300">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full bg-transparent py-3 pr-10 text-base outline-none placeholder:text-neutral-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-black"
          onClick={onToggle}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto w-full max-w-xl px-6 sm:px-8">{children}</div>
    </div>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | undefined
    const supabase = createClient()

    const verifyRecoverySession = async () => {
      if (searchParams.get('error') === 'invalid_link') {
        if (mounted) setIsValidToken(false)
        return
      }

      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!mounted) return

        if (error) {
          setIsValidToken(false)
          return
        }

        window.history.replaceState({}, '', '/auth/reset-password')
        setIsValidToken(true)
        return
      }

      const hash = window.location.hash.substring(1)
      if (hash) {
        const hashParams = new URLSearchParams(hash)
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (accessToken && refreshToken && type === 'recovery') {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!mounted) return

          if (!error) {
            window.history.replaceState({}, '', '/auth/reset-password')
            setIsValidToken(true)
            return
          }
        }
      }

      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (mounted && (event === 'PASSWORD_RECOVERY' || session)) {
            setIsValidToken(true)
          }
        }
      )
      subscription = authSubscription

      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) {
        setIsValidToken(!!session)
      }
    }

    verifyRecoverySession()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        setResetSuccess(true)
        toast.success('Password reset successful!')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
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

  if (isValidToken === null) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-uw-purple" />
          <p className="editorial-mono mt-6 text-neutral-500">Verifying reset link...</p>
        </div>
      </PageShell>
    )
  }

  if (isValidToken === false) {
    return (
      <PageShell>
        <div className="mb-10 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">Reset Password</p>
          <h1 className="editorial-heading mb-4">Link expired</h1>
          <p className="editorial-subheading">
            This password reset link is invalid or has expired. Request a new one to continue.
          </p>
        </div>

        <div className="card md:p-10 text-center">
          <Link href="/auth/forgot-password" className="btn-primary inline-block w-full">
            Request new reset link
          </Link>
          <Link
            href="/auth/login"
            className="editorial-mono mt-6 inline-block text-neutral-500 transition-colors hover:text-uw-purple"
          >
            Back to sign in
          </Link>
        </div>
      </PageShell>
    )
  }

  if (resetSuccess) {
    return (
      <PageShell>
        <div className="mb-10 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">Reset Password</p>
          <h1 className="editorial-heading mb-4">Password updated</h1>
          <p className="editorial-subheading">
            Your password has been changed. Redirecting you to sign in...
          </p>
        </div>

        <div className="card md:p-10 text-center">
          <Link href="/auth/login" className="btn-primary inline-block w-full">
            Sign in now
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="mb-10 text-center">
        <p className="editorial-mono mb-4 text-uw-purple">Reset Password</p>
        <h1 className="editorial-heading mb-4">Set a new password</h1>
        <p className="editorial-subheading">
          Choose a strong password for your DubLaunch account.
        </p>
      </div>

      <div className="card md:p-10">
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <PasswordField
              id="password"
              name="password"
              label="New Password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              placeholder="Enter new password"
            />
            <p className="text-xs text-neutral-500">Must be at least 8 characters</p>

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm new password"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.password !== formData.confirmPassword}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="editorial-mono text-neutral-500 transition-colors hover:text-uw-purple"
        >
          Back to sign in
        </Link>
      </p>
    </PageShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-uw-purple" />
            <p className="editorial-mono mt-6 text-neutral-500">Loading...</p>
          </div>
        </PageShell>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
