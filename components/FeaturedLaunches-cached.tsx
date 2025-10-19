import Link from 'next/link'
import { Heart, Eye, MessageCircle, ExternalLink, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getCachedFeaturedLaunches } from '@/lib/supabase/server-cache'
import VoteButton from './VoteButton'

interface Launch {
  id: string
  name: string
  slug: string
  tagline: string
  thumbnail_url: string
  website_url: string
  primary_category: string
  votes_count: number
  views_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string
    display_name: string
    avatar_url: string
  }
}

export default async function FeaturedLaunches() {
  const launches = await getCachedFeaturedLaunches(6) as unknown as Launch[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Today's Top Launches</h2>
        <Link href="/discover-cached" className="text-uw-purple hover:text-uw-purple/80 font-medium">
          View all →
        </Link>
      </div>

      {launches.length > 0 ? (
        <div className="space-y-4">
          {launches.slice(0, 3).map((launch, index) => (
            <div key={launch.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Ranking */}
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-uw-purple to-uw-gold rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Logo */}
                <div className="flex-shrink-0">
                  {launch.thumbnail_url ? (
                    <img
                      src={launch.thumbnail_url}
                      alt={launch.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {launch.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        <Link href={`/launch/${launch.slug}`} className="hover:text-uw-purple transition-colors">
                          {launch.name}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{launch.tagline}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(launch.created_at))} ago</span>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {launch.primary_category}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {launch.website_url && (
                        <a
                          href={launch.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-uw-purple transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <VoteButton 
                        launchId={launch.id} 
                        initialVoteCount={launch.votes_count}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-uw-purple hover:text-white transition-colors"
                      />
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{launch.views_count}</span>
                      </div>
                      
                      <Link 
                        href={`/launch/${launch.slug}#comments`} 
                        className="flex items-center space-x-1 text-gray-500 hover:text-uw-purple transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{launch.comments_count}</span>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                      {launch.profiles.avatar_url ? (
                        <img
                          src={launch.profiles.avatar_url}
                          alt={launch.profiles.display_name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {launch.profiles.display_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <Link 
                          href={`/profile/${launch.profiles.username}`} 
                          className="text-gray-900 hover:text-uw-purple transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {launch.profiles.display_name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No launches yet</h3>
          <p className="text-gray-600 mb-6">Be the first to launch a project!</p>
          <Link
            href="/launch"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Launch Your Project
          </Link>
        </div>
      )}
    </div>
  )
}

