import { BookOpen, Calendar, Sparkles } from 'lucide-react'
import EmailCapture from '@/components/EmailCapture'
import BlogListing from '@/components/BlogListing'
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

      {/* Blog Posts Section with Category Filtering */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <BlogListing posts={blogPosts} />
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
