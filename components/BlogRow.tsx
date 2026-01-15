'use client'

import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react'
import BlogImage from '@/components/BlogImage'

interface BlogRowProps {
  post: {
    id: string
    title: string
    excerpt: string
    author: string
    date: string
    slug: string
    category?: string
    image?: string
    readingTime?: number
  }
  index?: number
}

export default function BlogRow({ post, index }: BlogRowProps) {
  return (
    <div className="group border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6">
        {/* Image Section */}
        <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          {post.image && post.image.trim() !== '' ? (
            <BlogImage
              src={post.image}
              alt={post.title}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              fill={true}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-xs">No Image</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              {post.category && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-accent text-accent-foreground border border-border">
                  {post.category}
                </span>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{post.author}</span>
            </div>

            <div className="flex items-center gap-2 text-foreground font-medium text-xs sm:text-sm md:text-base group-hover:gap-3 transition-all">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
