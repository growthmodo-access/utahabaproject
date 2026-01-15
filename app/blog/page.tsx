import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import EmailCapture from '@/components/EmailCapture'
import { getBlogPosts } from '@/lib/blog-data'

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden -mt-16 pt-16 sm:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white" />
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-blue-500/4 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-blue-400/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 mb-6 sm:mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Expert Resources</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight px-2">
            ABA Therapy
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-foreground via-blue-600/30 to-foreground bg-clip-text text-transparent">
              Blog & Resources
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed font-light">
            Expert insights, guides, and resources to help you navigate ABA therapy in Utah
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base text-muted-foreground px-4">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-border/50">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="font-medium">Expert Articles</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-border/50">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/60" />
              <span className="font-medium">Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/40 to-white">
        <div className="max-w-7xl mx-auto">

        <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8 md:mb-12">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            blogPosts.map((post) => (
            <article
              key={post.id}
              className="group relative bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-foreground/20 transition-all duration-500 ease-out"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                {/* Featured Image */}
                <div className="relative w-full sm:w-80 md:w-96 lg:w-[28rem] h-64 sm:h-72 md:h-80 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <BlogImage
                    src={post.image || '/blog/placeholder.jpg'}
                    alt={post.title}
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    {post.category && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-foreground shadow-sm border border-border/50">
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between min-w-0 bg-white">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <time dateTime={post.date} className="font-medium">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-foreground/90 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold text-sm sm:text-base group-hover:gap-3 transition-all">
                      <span>Read Article</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-2xl mx-auto">
          <EmailCapture source="blog" />
        </div>
      </section>
    </div>
  )
}
