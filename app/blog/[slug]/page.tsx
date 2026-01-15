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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 text-sm sm:text-base transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 lg:p-12">
          {post.category && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md mb-4 sm:mb-5">
              {post.category}
            </span>
          )}
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-gray-600 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 text-sm sm:text-base">
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
          </div>

          <div
            className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold 
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gray-900
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-900
              prose-h4:text-lg sm:prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base sm:prose-p:text-lg prose-p:first:mt-0
              prose-ul:text-gray-700 prose-ul:my-4 prose-ul:ml-6 prose-ul:list-disc
              prose-ol:text-gray-700 prose-ol:my-4 prose-ol:ml-6 prose-ol:list-decimal
              prose-li:text-gray-700 prose-li:mb-2 prose-li:leading-relaxed prose-li:pl-1
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-em:text-gray-700 prose-em:italic
              prose-a:text-gray-900 prose-a:underline hover:prose-a:text-blue-600 prose-a:font-medium
              prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4
              prose-pre-code:bg-transparent prose-pre-code:p-0
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-gray-600
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 prose-img:w-full prose-img:h-auto
              prose-hr:border-gray-200 prose-hr:my-8
              prose-table:w-full prose-table:my-4 prose-table:border-collapse
              prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 prose-th:font-semibold prose-th:text-gray-900
              prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12">
          <EmailCapture source={`blog-${post.slug}`} />
        </div>
      </article>
    </div>
  )
}
