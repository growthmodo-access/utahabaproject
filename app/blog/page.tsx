import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import EmailCapture from '@/components/EmailCapture'
import { getBlogPosts } from '@/lib/blog-data'

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
            ABA Therapy Blog
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Expert insights, guides, and resources to help you navigate ABA therapy in Utah
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 md:mb-12">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            blogPosts.map((post) => (
            <article
              key={post.id}
              className="group border border-border rounded-lg bg-card hover:shadow-lg transition-all overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                {/* Featured Image */}
                <div className="relative w-full sm:w-48 md:w-64 lg:w-80 h-40 sm:h-48 md:h-64 lg:h-72 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <BlogImage
                    src={post.image || '/blog/placeholder.jpg'}
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      {post.category && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent text-accent-foreground">
                          {post.category}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium text-xs sm:text-sm md:text-base group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
            ))
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <EmailCapture source="blog" />
        </div>
      </div>
    </div>
  )
}
