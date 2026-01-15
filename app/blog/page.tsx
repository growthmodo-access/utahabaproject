import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import EmailCapture from '@/components/EmailCapture'
import { getBlogPosts } from '@/lib/blog-data'

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Matching Homepage */}
      <section className="relative overflow-hidden -mt-16 pt-12 sm:pt-16 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 mb-4 sm:mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">Expert Resources</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            ABA Therapy
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-foreground via-blue-600/20 to-foreground bg-clip-text text-transparent">
              Blog & Resources
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4 leading-relaxed font-light">
            Expert insights, guides, and resources to help you navigate ABA therapy in Utah
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Expert Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-foreground/60" />
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto">

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

        </div>
      </section>

      {/* Email Capture Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-white">
        <div className="max-w-2xl mx-auto">
          <EmailCapture source="blog" />
        </div>
      </section>
    </div>
  )
}
