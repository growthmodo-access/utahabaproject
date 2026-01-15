import Link from 'next/link'
import { ArrowRight, MapPin, Calculator, HelpCircle, BookOpen, Calendar, User, Star, Award, Sparkles } from 'lucide-react'
import BlogImage from '@/components/BlogImage'
import { Provider } from '@/types/provider'
import { getProvidersData } from '@/lib/data'

// Fetch providers directly from data source
async function getFeaturedProviders(): Promise<Provider[]> {
  try {
    const providers = getProvidersData()
    
    if (!providers || providers.length === 0) {
      return []
    }
    
    // Get top 5 providers by rank or rating
    const sorted = providers
      .filter((p: Provider) => p.rank || p.rating)
      .sort((a: Provider, b: Provider) => {
        if (a.rank && b.rank) return a.rank - b.rank
        if (a.rank) return -1
        if (b.rank) return 1
        if (a.rating && b.rating) return b.rating - a.rating
        return 0
      })
      .slice(0, 5)
    
    return sorted
  } catch (error) {
    console.error('Error getting featured providers:', error)
    return []
  }
}

// Sample blog posts with featured images
const blogPosts = [
  {
    id: '1',
    title: 'Understanding ABA Therapy: A Comprehensive Guide for Utah Families',
    excerpt: 'Applied Behavior Analysis (ABA) is an evidence-based therapy that helps individuals with autism develop essential life skills.',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    slug: 'understanding-aba-therapy',
    category: 'Education',
    image: '/blog/aba-therapy-guide.jpg'
  },
  {
    id: '2',
    title: 'How to Choose the Right ABA Provider in Utah',
    excerpt: 'Selecting an ABA provider is one of the most important decisions you\'ll make. This guide covers key factors to consider.',
    author: 'Michael Chen',
    date: '2024-01-10',
    slug: 'choosing-aba-provider',
    category: 'Guide',
    image: '/blog/choosing-provider.jpg'
  },
  {
    id: '3',
    title: 'Insurance Coverage for ABA Therapy in Utah: What You Need to Know',
    excerpt: 'Navigating insurance coverage for ABA therapy can be confusing. Learn about Utah-specific insurance requirements.',
    author: 'Jennifer Martinez',
    date: '2024-01-05',
    slug: 'insurance-coverage-utah',
    category: 'Insurance',
    image: '/blog/insurance-coverage.jpg'
  },
  {
    id: '4',
    title: 'Early Intervention: Why Starting ABA Therapy Early Matters',
    excerpt: 'Research shows that early intervention with ABA therapy can lead to significantly better outcomes.',
    author: 'Dr. Sarah Johnson',
    date: '2023-12-28',
    slug: 'early-intervention-aba',
    category: 'Research',
    image: '/blog/early-intervention.jpg'
  },
  {
    id: '5',
    title: 'The Cost of ABA Therapy: Breaking Down Expenses',
    excerpt: 'Understanding the true cost of ABA therapy and how to maximize your insurance benefits.',
    author: 'Michael Chen',
    date: '2023-12-20',
    slug: 'aba-therapy-costs',
    category: 'Finance',
    image: '/blog/aba-costs.jpg'
  },
  {
    id: '6',
    title: 'Success Stories: How ABA Therapy Transformed Lives in Utah',
    excerpt: 'Real stories from Utah families who have seen remarkable progress through ABA therapy.',
    author: 'Jennifer Martinez',
    date: '2023-12-15',
    slug: 'aba-success-stories',
    category: 'Stories',
    image: '/blog/success-stories.jpg'
  }
]

export default async function Home() {
  const featuredProviders = await getFeaturedProviders()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-foreground/60" />
              <span className="text-sm font-medium text-foreground/80">Trusted by Utah Families</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
              Find the Best ABA Therapy
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Providers in Utah
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover top-rated Applied Behavior Analysis providers across all Utah counties. 
              Get expert guidance and tools to make informed decisions about ABA therapy.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center px-4">
              <Link 
                href="/directory" 
                className="group inline-flex items-center gap-2 bg-foreground text-background px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium hover:bg-foreground/90 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Browse Providers 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/cost-estimator" 
                className="group inline-flex items-center gap-2 border-2 border-border bg-background text-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium hover:bg-accent transition-all duration-200 text-sm sm:text-base hover:border-foreground/20"
              >
                Estimate Costs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers Listicle Section - Enhanced */}
      {featuredProviders.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-foreground rounded-full" />
                <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Top Rated</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                Top 5 Featured Providers
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Our handpicked selection of Utah&apos;s best ABA therapy providers
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {featuredProviders.map((provider, index) => (
                <Link
                  key={provider.id}
                  href={`/directory/${provider.id}`}
                  className="group block border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-4 sm:gap-6">
                      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-foreground to-foreground/80 text-background rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <div className="flex-1 sm:flex-none min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors mb-1">
                          {provider.name}
                        </h3>
                        {provider.county && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{provider.city || ''} {provider.city && provider.county ? ', ' : ''}{provider.county} County</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {provider.description && (
                        <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-1">
                          {provider.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        {provider.rating && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {provider.certifications && provider.certifications.length > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-lg">
                            <Award className="w-4 h-4 text-foreground/60 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{provider.certifications[0]}</span>
                          </div>
                        )}
                        {provider.services && provider.services.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {provider.services.slice(0, 2).map((service, idx) => (
                              <span 
                                key={idx}
                                className="bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-medium"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section - Enhanced Row Layout */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-gray-50/30 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-foreground rounded-full" />
                <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Resources</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                Latest Articles
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Expert insights and resources about ABA therapy
              </p>
            </div>
            <Link 
              href="/blog"
              className="group inline-flex items-center gap-2 text-foreground hover:text-foreground/80 font-medium text-sm sm:text-base w-fit transition-colors"
            >
              View All 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {blogPosts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className="group border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                  {/* Featured Image */}
                  <div className="relative w-full sm:w-48 md:w-64 lg:w-80 h-48 sm:h-full sm:min-h-[200px] flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <BlogImage
                      src={post.image || '/blog/placeholder.jpg'}
                      alt={post.title}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        {post.category && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent text-accent-foreground border border-border">
                            {post.category}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2 sm:line-clamp-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-foreground rounded-full" />
              <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
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
