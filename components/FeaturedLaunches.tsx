'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Eye, MessageCircle, ExternalLink, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Mock data - this will be replaced with actual API calls
const mockLaunches = [
  {
    id: '1',
    title: 'StudyBuddy AI',
    description: 'An AI-powered study companion that helps UW students optimize their learning schedules and track progress.',
    logo: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop&crop=center',
    votes: 342,
    views: 1250,
    comments: 28,
    category: 'Education',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      major: 'Computer Science'
    },
    createdAt: new Date('2024-01-15'),
    website: 'https://studybuddy-ai.com'
  },
  {
    id: '2',
    title: 'HuskyEats',
    description: 'A food delivery app specifically designed for UW students, featuring campus dining options and local restaurants.',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center',
    votes: 289,
    views: 980,
    comments: 19,
    category: 'Food & Dining',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      major: 'Business'
    },
    createdAt: new Date('2024-01-12'),
    website: 'https://huskyeats.com'
  },
  {
    id: '3',
    title: 'GreenCampus',
    description: 'A sustainability tracking app that helps UW students monitor their environmental impact and find eco-friendly alternatives.',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop&crop=center',
    votes: 156,
    views: 654,
    comments: 12,
    category: 'Sustainability',
    author: {
      name: 'Emma Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      major: 'Environmental Science'
    },
    createdAt: new Date('2024-01-10'),
    website: 'https://greencampus.uw.edu'
  }
]

export default function FeaturedLaunches() {
  const [launches, setLaunches] = useState(mockLaunches)
  const [votedLaunches, setVotedLaunches] = useState<Set<string>>(new Set())

  const handleVote = (launchId: string) => {
    setLaunches(prev => prev.map(launch => {
      if (launch.id === launchId) {
        const isVoted = votedLaunches.has(launchId)
        return {
          ...launch,
          votes: isVoted ? launch.votes - 1 : launch.votes + 1
        }
      }
      return launch
    }))
    
    setVotedLaunches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(launchId)) {
        newSet.delete(launchId)
      } else {
        newSet.add(launchId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Today's Top Launches</h2>
        <Link href="/launches" className="text-uw-purple hover:text-uw-purple/80 font-medium">
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {launches.map((launch, index) => (
          <div key={launch.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Ranking */}
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-uw-purple to-uw-gold rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={launch.logo}
                  alt={launch.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/launch/${launch.id}`} className="hover:text-uw-purple transition-colors">
                        {launch.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{launch.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(launch.createdAt)} ago</span>
                      </div>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {launch.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    {launch.website && (
                      <a
                        href={launch.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-uw-purple transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleVote(launch.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        votedLaunches.has(launch.id)
                          ? 'bg-uw-purple text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-uw-purple hover:text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{launch.votes}</span>
                    </button>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{launch.views}</span>
                    </div>
                    
                    <Link href={`/launch/${launch.id}#comments`} className="flex items-center space-x-1 text-gray-500 hover:text-uw-purple transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{launch.comments}</span>
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2">
                    <img
                      src={launch.author.avatar}
                      alt={launch.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="text-sm">
                      <Link href={`/profile/${launch.author.name}`} className="text-gray-900 hover:text-uw-purple transition-colors">
                        {launch.author.name}
                      </Link>
                      <div className="text-gray-500 text-xs">{launch.author.major}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
