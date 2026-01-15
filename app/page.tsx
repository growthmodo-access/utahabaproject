import Link from 'next/link'
import { ArrowRight, MapPin, Calculator, HelpCircle, BookOpen, Calendar, User, Star, Award, Sparkles, PhoneCall, Clock } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import BlogRow from '@/components/BlogRow'
import ProviderRow from '@/components/ProviderRow'
import { Provider } from '@/types/provider'
import { getProvidersData } from '@/lib/data'
import { getBlogPosts } from '@/lib/blog-data'
import { calculateReadingTime } from '@/lib/blog-utils'

// Fetch providers directly from data source
async function getFeaturedProviders(): Promise<Provider[]> {
  try {
    const providers = getProvidersData()
    
    if (!providers || providers.length === 0) {
      return []
    }
    
    // Find Golden Touch ABA and put it first
    const goldenTouch = providers.find((p: Provider) => 
      p.name?.toLowerCase().includes('golden touch')
    )
    
    // Get other top providers (excluding Golden Touch)
    const otherProviders = providers
      .filter((p: Provider) => !p.name?.toLowerCase().includes('golden touch'))
      .filter((p: Provider) => p.rank || p.rating || p.name)
      .sort((a: Provider, b: Provider) => {
        if (a.rank && b.rank) return a.rank - b.rank
        if (a.rank) return -1
        if (b.rank) return 1
        if (a.rating && b.rating) return b.rating - a.rating
        return 0
      })
      .slice(0, 4)
    
    // Combine: Golden Touch first, then top 4 others
    const featured = goldenTouch ? [goldenTouch, ...otherProviders] : otherProviders
    
    return featured.slice(0, 5)
  } catch (error) {
    console.error('Error getting featured providers:', error)
    return []
  }
}

export default async function Home() {
  const featuredProviders = await getFeaturedProviders()
  const blogPosts = await getBlogPosts()
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const featuredPost = sortedPosts[0] // Most recent post as featured
  const latestPosts = sortedPosts.slice(1, 6) // Next 5 posts

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden -mt-16 pt-16 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 border-b border-border/50">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 mb-6 sm:mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Trusted by Utah Families</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
              Find the Best ABA Therapy
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-foreground via-yellow-600/20 to-foreground bg-clip-text text-transparent">
                Providers in Utah
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 leading-relaxed font-light">
              Discover top-rated Applied Behavior Analysis providers across all Utah counties. 
              Get expert guidance and tools to make informed decisions about ABA therapy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4 w-full sm:w-auto">
              <Link 
                href="/directory" 
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-foreground text-background px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl font-semibold hover:bg-foreground/90 transition-all duration-200 text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto"
              >
                Browse Providers 
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/cost-estimator" 
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 border-2 border-foreground bg-background text-foreground px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl font-semibold hover:bg-accent transition-all duration-200 text-sm sm:text-base md:text-lg hover:border-foreground/20 hover:scale-105 w-full sm:w-auto"
              >
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                Estimate Costs
              </Link>
            </div>
            <div className="mt-8 sm:mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-base text-muted-foreground px-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>85+ Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-foreground/60" />
                <span>31 Counties</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-foreground/60" />
                <span>Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 5 Featured Providers Section - Row Style */}
      {featuredProviders.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-200/50 bg-gradient-to-b from-white via-gray-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3 leading-tight">
                Top Rated
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 leading-tight">
                Top 5 Featured Providers
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Our handpicked selection of Utah&apos;s best ABA therapy providers
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {featuredProviders.map((provider, index) => {
                const isGoldenTouch = provider.name?.toLowerCase().includes('golden touch')
                return (
                  <ProviderRow
                    key={provider.id}
                    provider={provider}
                    rank={index + 1}
                    featured={isGoldenTouch}
                    tag={isGoldenTouch ? 'Best Rated' : undefined}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section - Enhanced with Featured Post */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-200/50 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-6">
              <span className="inline-block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3 leading-tight">
                Resources
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 leading-tight">
                Latest Articles
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Expert insights and resources about ABA therapy
              </p>
            </div>
            <div className="text-center">
              <Link 
                href="/blog"
                className="group inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium text-sm sm:text-base transition-colors"
              >
                View All 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Featured Post - Sleek Compact Display */}
          {featuredPost && (
            <div className="mb-10 sm:mb-12">
              <Link href={`/blog/${featuredPost.slug}`}>
                <article className="group relative bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row">
                    {/* Featured Image - Compact */}
                    <div className="relative w-full lg:w-[280px] xl:w-[320px] h-48 sm:h-56 lg:h-full lg:min-h-[240px] flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {featuredPost.image && featuredPost.image.trim() !== '' ? (
                        <BlogImage
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          fill={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-xs">No Image</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5">
                        {featuredPost.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-900 shadow-sm border border-gray-200/50">
                            {featuredPost.category}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm">
                          <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    {/* Featured Content - Compact */}
                    <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[240px]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <time dateTime={featuredPost.date}>
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{calculateReadingTime(featuredPost.content)} min read</span>
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                          {featuredPost.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed line-clamp-2">
                          {featuredPost.excerpt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-100">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="font-medium">{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-xs sm:text-sm group-hover:gap-2 transition-all">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Other Latest Posts */}
          <div className="space-y-4 sm:space-y-6">
            {latestPosts.length === 0 && !featuredPost ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              latestPosts.map((post, index) => (
                <BlogRow 
                  key={post.id} 
                  post={{
                    ...post,
                    readingTime: calculateReadingTime(post.content)
                  }} 
                  index={index} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3 leading-tight">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 leading-tight">
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools and resources to help you find the right ABA therapy provider
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="group border border-border rounded-xl bg-card p-6 sm:p-8 hover:shadow-xl hover:border-foreground/20 transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Provider Directory</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Browse top 8 providers from every Utah county with detailed information and rankings.
              </p>
            </div>
            <div className="group border border-border rounded-xl bg-card p-6 sm:p-8 hover:shadow-xl hover:border-foreground/20 transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Cost Estimator</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Get personalized estimates for ABA therapy costs based on your specific needs.
              </p>
            </div>
            <div className="group border border-border rounded-xl bg-card p-6 sm:p-8 hover:shadow-xl hover:border-foreground/20 transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">ABA Benefit Quiz</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Take our quiz to determine if ABA therapy could be beneficial for you or your loved one.
              </p>
            </div>
            <div className="group border border-border rounded-xl bg-card p-6 sm:p-8 hover:shadow-xl hover:border-foreground/20 transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Expert Blog</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Read articles from ABA therapy experts covering treatment, costs, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
