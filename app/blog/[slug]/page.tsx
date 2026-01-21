import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import BlogImage from '@/components/BlogImage'
import RelatedPosts from '@/components/RelatedPosts'
import { getBlogPost, getBlogPosts } from '@/lib/blog-data'
import { calculateReadingTime, getRelatedPosts } from '@/lib/blog-utils'
import { BlogPost } from '@/lib/blog-data'

// Revalidate every 60 seconds to show updates
export const revalidate = 60

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | ABA Therapy Utah',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`) 
    : `${siteUrl}/og-default.jpg`

  return {
    title: `${post.title} | ABA Therapy Utah Blog`,
    description: post.excerpt || `Learn about ${post.title} and ABA therapy in Utah. Expert insights and resources for families.`,
    keywords: post.category 
      ? `ABA therapy, ${post.category}, Utah, autism treatment, ${post.title}` 
      : 'ABA therapy, Utah, autism treatment',
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'ABA Therapy Utah',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'ABA Therapy Utah',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
      tags: post.category ? [post.category, 'ABA Therapy', 'Utah'] : ['ABA Therapy', 'Utah'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getBlogPosts()
  const relatedPosts = getRelatedPosts(post, allPosts, 3)
  const readingTime = calculateReadingTime(post.content)

  return (
    <>
      <ArticleStructuredData post={post} readingTime={readingTime} />
      <BreadcrumbStructuredData post={post} />
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Section with Featured Image */}
      {post.image && post.image.trim() !== '' && (
        <section className="relative w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] -mt-16 mb-8 sm:mb-12 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 w-full h-full">
            <BlogImage
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
              fill={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
          </div>
          <div className="relative h-full flex items-end z-20">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 sm:mb-6 text-sm sm:text-base transition-colors group backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
              {post.category && (
                <span className="inline-block bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md mb-4 sm:mb-5 shadow-lg">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <time dateTime={post.date} className="font-medium">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium">{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-8 sm:pb-10 md:pb-12 lg:pb-16">
        {!post.image && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 text-sm sm:text-base transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        )}

        {!post.image && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            {post.category && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold uppercase tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-md mb-4 sm:mb-5 md:mb-6">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-5 sm:mb-6 md:mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-600 mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 border-b border-gray-200 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500" />
                <time dateTime={post.date} className="font-medium">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500" />
                <span className="font-medium">{readingTime} min read</span>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content - Enhanced HTML Rendering */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          <div
            className="blog-content max-w-none prose prose-lg sm:prose-xl md:prose-2xl"
            dangerouslySetInnerHTML={{ 
              __html: (() => {
                if (typeof post.content !== 'string') return ''
                let content = post.content
                // Fix newlines
                content = content.replace(/\\n/g, '\n')
                // Unescape HTML entities in CORRECT order (amp MUST be first!)
                content = content.replace(/&amp;/g, '&')
                content = content.replace(/&lt;/g, '<')
                content = content.replace(/&gt;/g, '>')
                content = content.replace(/&quot;/g, '"')
                content = content.replace(/&#39;/g, "'")
                content = content.replace(/&#x27;/g, "'")
                return content
              })()
            }}
          />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}

        <div className="mt-8 sm:mt-10 md:mt-12">
          <EmailCapture source={`blog-${post.slug}`} />
        </div>
      </article>
    </div>
    </>
  )
}

// Article Structured Data Component
function ArticleStructuredData({ post, readingTime }: { post: BlogPost, readingTime: number }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`) 
    : `${siteUrl}/og-default.jpg`

  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": imageUrl,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": `${siteUrl}/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "ABA Therapy Utah",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "articleSection": post.category || "ABA Therapy",
    "keywords": post.category 
      ? `${post.category}, ABA Therapy, Utah, Autism Treatment` 
      : "ABA Therapy, Utah, Autism Treatment",
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "inLanguage": "en-US"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Breadcrumb Structured Data Component
function BreadcrumbStructuredData({ post }: { post: BlogPost }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${siteUrl}/blog/${post.slug}`
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  )
}
