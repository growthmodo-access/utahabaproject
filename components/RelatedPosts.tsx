import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import { BlogPost } from '@/lib/blog-data'
import { calculateReadingTime } from '@/lib/blog-utils'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 sm:mt-16 md:mt-20 pt-12 sm:pt-16 md:pt-20 border-t border-gray-200">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Related Articles
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Continue reading with these related posts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => {
          const readingTime = calculateReadingTime(post.content)
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300/80 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-200/50">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{readingTime} min</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs sm:text-sm group-hover:gap-2 transition-all">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
