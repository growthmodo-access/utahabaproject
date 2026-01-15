import Link from 'next/link'
import { ArrowRight, MapPin, Calculator, HelpCircle, BookOpen, Calendar, User, Star, Award, Sparkles, PhoneCall, Clock } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
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
    
    // Find Golden Touch ABA and put it first (get the first occurrence)
    const goldenTouch = providers.find((p: Provider) => 
      p.name?.toLowerCase().includes('golden touch')
    )
    
    // Get unique providers by name (to avoid duplicates from multiple counties)
    const uniqueProvidersMap = new Map<string, Provider>()
    
    providers.forEach((p: Provider) => {
      if (!p.name) return
      const nameKey = p.name.toLowerCase().trim()
      
      // Skip Golden Touch (we'll add it separately)
      if (nameKey.includes('golden touch')) return
      
      // If we haven't seen this provider name before, add it
      // Or if this one has better data (rank/rating), replace it
      if (!uniqueProvidersMap.has(nameKey)) {
        uniqueProvidersMap.set(nameKey, p)
      } else {
        const existing = uniqueProvidersMap.get(nameKey)!
        // Prefer provider with rank, then rating, then keep first
        if (p.rank && !existing.rank) {
          uniqueProvidersMap.set(nameKey, p)
        } else if (p.rating && !existing.rating) {
          uniqueProvidersMap.set(nameKey, p)
        } else if (p.rank && existing.rank && p.rank < existing.rank) {
          uniqueProvidersMap.set(nameKey, p)
        } else if (p.rating && existing.rating && p.rating > existing.rating) {
          uniqueProvidersMap.set(nameKey, p)
        }
      }
    })
    
    // Convert map to array and randomize (Fisher-Yates shuffle)
    const otherProviders = Array.from(uniqueProvidersMap.values())
      .filter((p: Provider) => p.rank || p.rating || p.name)
    
    // Shuffle array randomly (Fisher-Yates algorithm)
    for (let i = otherProviders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherProviders[i], otherProviders[j]] = [otherProviders[j], otherProviders[i]]
    }
    
    // Take first 4 after randomization
    const shuffledProviders = otherProviders.slice(0, 4)
    
    // Combine: Golden Touch first, then 4 random unique others
    const featured = goldenTouch ? [goldenTouch, ...shuffledProviders] : shuffledProviders
    
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

          {/* Blog Posts Grid - Consistent Card Sizes */}
          {latestPosts.length === 0 && !featuredPost ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Featured Post - Same size as others but with featured badge */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="md:col-span-2 lg:col-span-1">
                  <article className="group h-full flex flex-col bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300/80 transition-all duration-300">
                    {/* Featured Image - Consistent Aspect Ratio */}
                    <div className="relative w-full h-56 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-4 left-4">
                        {featuredPost.category && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-900 shadow-md border border-gray-200/50">
                            {featuredPost.category}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/95 backdrop-blur-sm text-gray-700 shadow-md">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    {/* Featured Content */}
                    <div className="flex-1 flex flex-col p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={featuredPost.date}>
                            {new Date(featuredPost.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{calculateReadingTime(featuredPost.content)} min read</span>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-medium text-sm group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Other Latest Posts - Consistent Card Sizes */}
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group h-full flex flex-col bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300/80 transition-all duration-300">
                    {/* Image - Consistent Aspect Ratio */}
                    <div className="relative w-full h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {post.image && post.image.trim() !== '' ? (
                        <BlogImage
                          src={post.image}
                          alt={post.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          fill={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-xs">No Image</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-900 shadow-md border border-gray-200/50">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
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
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readingTime} min read</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-medium text-xs sm:text-sm group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
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
