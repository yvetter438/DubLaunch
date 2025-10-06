'use client'

import { Trophy, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

// Mock data for leaderboard
const mockLeaderboard = [
  {
    id: '1',
    title: 'StudyBuddy AI',
    votes: 342,
    author: 'Sarah Chen',
    rank: 1,
    category: 'Education'
  },
  {
    id: '2',
    title: 'HuskyEats',
    votes: 289,
    author: 'Alex Rodriguez',
    rank: 2,
    category: 'Food & Dining'
  },
  {
    id: '3',
    title: 'GreenCampus',
    votes: 156,
    author: 'Emma Johnson',
    rank: 3,
    category: 'Sustainability'
  },
  {
    id: '4',
    title: 'UWConnect',
    votes: 134,
    author: 'Michael Park',
    rank: 4,
    category: 'Social'
  },
  {
    id: '5',
    title: 'CodeCollab',
    votes: 98,
    author: 'Jessica Liu',
    rank: 5,
    category: 'Development'
  }
]

const topMakers = [
  {
    id: '1',
    name: 'Sarah Chen',
    launches: 3,
    totalVotes: 542,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    launches: 2,
    totalVotes: 387,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Emma Johnson',
    launches: 4,
    totalVotes: 298,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  }
]

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      {/* Top Launches */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-uw-gold" />
          <h3 className="text-lg font-semibold text-gray-900">Top Launches</h3>
        </div>
        
        <div className="space-y-3">
          {mockLeaderboard.map((launch) => (
            <div key={launch.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                launch.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                launch.rank === 2 ? 'bg-gray-100 text-gray-800' :
                launch.rank === 3 ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {launch.rank}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link href={`/launch/${launch.id}`} className="block">
                  <p className="text-sm font-medium text-gray-900 hover:text-uw-purple transition-colors truncate">
                    {launch.title}
                  </p>
                  <p className="text-xs text-gray-500">{launch.author}</p>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="w-3 h-3" />
                <span>{launch.votes}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/leaderboard" className="text-uw-purple hover:text-uw-purple/80 text-sm font-medium">
            View full leaderboard →
          </Link>
        </div>
      </div>

      {/* Top Makers */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-uw-purple" />
          <h3 className="text-lg font-semibold text-gray-900">Top Makers</h3>
        </div>
        
        <div className="space-y-3">
          {topMakers.map((maker, index) => (
            <div key={maker.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-uw-purple to-uw-gold text-white">
                {index + 1}
              </div>
              
              <img
                src={maker.avatar}
                alt={maker.name}
                className="w-8 h-8 rounded-full"
              />
              
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${maker.name}`} className="block">
                  <p className="text-sm font-medium text-gray-900 hover:text-uw-purple transition-colors">
                    {maker.name}
                  </p>
                  <p className="text-xs text-gray-500">{maker.launches} launches</p>
                </Link>
              </div>
              
              <div className="text-sm text-gray-600">
                {maker.totalVotes} votes
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/makers" className="text-uw-purple hover:text-uw-purple/80 text-sm font-medium">
            View all makers →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">New launches</span>
            <span className="text-sm font-semibold text-gray-900">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total votes</span>
            <span className="text-sm font-semibold text-gray-900">1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active makers</span>
            <span className="text-sm font-semibold text-gray-900">28</span>
          </div>
        </div>
      </div>
    </div>
  )
}
