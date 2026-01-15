import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import { getBlogPost } from '@/lib/blog-data'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
          {post.category && (
            <span className="inline-block bg-accent text-accent-foreground text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
              {post.category}
            </span>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-muted-foreground mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          <div
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-6 sm:mt-8 md:mt-12">
          <EmailCapture source={`blog-${post.slug}`} />
        </div>
      </article>
    </div>
  )
}
