'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import { BlogPost } from '@/lib/blog-data'
import { calculateReadingTime, getAllCategories } from '@/lib/blog-utils'

interface BlogListingProps {
  posts: BlogPost[]
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const categories = useMemo(() => getAllCategories(posts), [posts])
  
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts
    return posts.filter(post => post.category === selectedCategory)
  }, [posts, selectedCategory])
  
  // Sort posts by date (newest first)
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredPosts])

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <p className="mt-4 text-sm text-gray-600">
              Showing {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} in <strong>{selectedCategory}</strong>
            </p>
          )}
        </div>
      )}

      {/* Blog Posts */}
      <div className="space-y-5 sm:space-y-6">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No posts found in this category.</p>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const readingTime = calculateReadingTime(post.content)
            return (
              <article
                key={post.id}
                className="group relative bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_0_rgba(0,0,0,0.08)] hover:border-gray-300/80 transition-all duration-300 ease-out"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                  {/* Featured Image - Improved Aspect Ratio */}
                  <div className="relative w-full sm:w-[300px] md:w-[360px] lg:w-[400px] h-56 sm:h-64 md:h-72 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {post.image && post.image.trim() !== '' ? (
                      <BlogImage
                        src={post.image}
                        alt={post.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        fill={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-xs">No Image</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      {post.category && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-200/50">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6 md:p-7 flex flex-col justify-between min-w-0 bg-white">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{readingTime} min read</span>
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-100">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-xs sm:text-sm group-hover:gap-2.5 transition-all">
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
