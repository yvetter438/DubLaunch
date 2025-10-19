'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

interface VoteButtonProps {
  launchId: string
  initialVoteCount: number
  className?: string
  showCount?: boolean
}

export default function VoteButton({ 
  launchId, 
  initialVoteCount, 
  className = '',
  showCount = true 
}: VoteButtonProps) {
  const router = useRouter()
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    checkUserAndVote()
  }, [launchId])

  const checkUserAndVote = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)

    if (session?.user) {
      // Check if user has voted
      const { data } = await supabase
        .from('votes')
        .select('id')
        .eq('launch_id', launchId)
        .eq('user_id', session.user.id)
        .single()

      setHasVoted(!!data)
    }
  }

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (voting) return
    setVoting(true)

    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('launch_id', launchId)
          .eq('user_id', user.id)

        if (error) throw error

        setHasVoted(false)
        setVoteCount(prev => prev - 1)
        toast.success('Vote removed')
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert([{
            launch_id: launchId,
            user_id: user.id
          }])

        if (error) throw error

        setHasVoted(true)
        setVoteCount(prev => prev + 1)
        toast.success('Vote added!')
      }

      // Refresh the page data in the background
      router.refresh()
    } catch (error: any) {
      console.error('Error voting:', error)
      toast.error(error.message || 'Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={voting}
      className={`flex items-center gap-1 transition-colors ${
        hasVoted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
      } ${voting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
      {showCount && <span>{voteCount}</span>}
    </button>
  )
}

