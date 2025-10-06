'use client'

import Link from 'next/link'
import { Code, BookOpen, Utensils, Heart, Gamepad2, Palette, Music, Camera } from 'lucide-react'

const categories = [
  {
    name: 'Technology',
    icon: Code,
    count: 45,
    color: 'bg-blue-100 text-blue-700',
    description: 'Apps, tools, and tech innovations'
  },
  {
    name: 'Education',
    icon: BookOpen,
    count: 32,
    color: 'bg-green-100 text-green-700',
    description: 'Learning platforms and study tools'
  },
  {
    name: 'Food & Dining',
    icon: Utensils,
    count: 18,
    color: 'bg-orange-100 text-orange-700',
    description: 'Restaurants, recipes, and food tech'
  },
  {
    name: 'Health & Fitness',
    icon: Heart,
    count: 15,
    color: 'bg-red-100 text-red-700',
    description: 'Wellness and fitness solutions'
  },
  {
    name: 'Gaming',
    icon: Gamepad2,
    count: 12,
    color: 'bg-purple-100 text-purple-700',
    description: 'Games and gaming platforms'
  },
  {
    name: 'Design',
    icon: Palette,
    count: 25,
    color: 'bg-pink-100 text-pink-700',
    description: 'Design tools and creative platforms'
  },
  {
    name: 'Music',
    icon: Music,
    count: 8,
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Music creation and streaming'
  },
  {
    name: 'Photography',
    icon: Camera,
    count: 14,
    color: 'bg-gray-100 text-gray-700',
    description: 'Photo editing and sharing tools'
  }
]

export default function Categories() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
      
      <div className="space-y-2">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-uw-purple transition-colors">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {category.count}
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link href="/categories" className="text-uw-purple hover:text-uw-purple/80 text-sm font-medium">
          View all categories →
        </Link>
      </div>
    </div>
  )
}
