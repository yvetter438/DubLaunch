'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication error')
          router.push('/auth/login')
          return
        }

        if (data.session) {
          toast.success('Email verified successfully!')
          router.push('/profile')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        toast.error('Something went wrong')
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-uw-purple to-uw-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">D</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  )
}
