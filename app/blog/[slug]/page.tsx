import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import BlogImage from '@/components/BlogImage'
import RelatedPosts from '@/components/RelatedPosts'
import { getBlogPost, getBlogPosts } from '@/lib/blog-data'
import { calculateReadingTime, getRelatedPosts } from '@/lib/blog-utils'

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
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-12">
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
          <div className="mb-8 sm:mb-10">
            {post.category && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md mb-4 sm:mb-5">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 sm:mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-600 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 text-sm sm:text-base">
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
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 lg:p-12">
          <div
            className="blog-content prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
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
  )
}
