import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  date: string
  slug: string
  category?: string
}

// In production, this would fetch from a CMS or database
const getBlogPost = (slug: string): BlogPost | null => {
  const posts: Record<string, BlogPost> = {
    'understanding-aba-therapy': {
      id: '1',
      title: 'Understanding ABA Therapy: A Comprehensive Guide for Utah Families',
      content: `
        <h2>What is ABA Therapy?</h2>
        <p>Applied Behavior Analysis (ABA) is a scientific approach to understanding behavior and how it is affected by the environment. ABA therapy applies this understanding to help individuals with autism spectrum disorder (ASD) and other developmental conditions learn new skills and reduce problematic behaviors.</p>
        
        <h2>How Does ABA Therapy Work?</h2>
        <p>ABA therapy breaks down complex skills into smaller, manageable steps. Through positive reinforcement and systematic teaching methods, individuals learn to:</p>
        <ul>
          <li>Improve communication and social skills</li>
          <li>Develop daily living skills</li>
          <li>Reduce challenging behaviors</li>
          <li>Increase academic performance</li>
          <li>Enhance independence</li>
        </ul>
        
        <h2>Benefits of ABA Therapy</h2>
        <p>Research has consistently shown that ABA therapy is one of the most effective treatments for autism. Benefits include:</p>
        <ul>
          <li>Evidence-based approach with decades of research support</li>
          <li>Individualized treatment plans tailored to each person's needs</li>
          <li>Measurable progress tracking</li>
          <li>Family involvement and training</li>
          <li>Improved quality of life for individuals and families</li>
        </ul>
        
        <h2>Finding ABA Providers in Utah</h2>
        <p>Utah has many qualified ABA therapy providers across all counties. When choosing a provider, consider factors such as:</p>
        <ul>
          <li>Board-certified behavior analysts (BCBAs) on staff</li>
          <li>Experience with your child's age group</li>
          <li>Insurance acceptance</li>
          <li>Location and convenience</li>
          <li>Parent involvement and communication</li>
        </ul>
        
        <p>Use our directory to find top-rated ABA providers in your Utah county.</p>
      `,
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      slug: 'understanding-aba-therapy',
      category: 'Education'
    },
    'choosing-aba-provider': {
      id: '2',
      title: 'How to Choose the Right ABA Provider in Utah',
      content: `
        <h2>Key Factors to Consider</h2>
        <p>Choosing the right ABA provider is crucial for your child's success. Here are essential factors to evaluate:</p>
        
        <h3>1. Credentials and Certification</h3>
        <p>Look for providers with Board Certified Behavior Analysts (BCBAs) on staff. BCBAs have advanced training and certification in ABA therapy.</p>
        
        <h3>2. Experience and Specialization</h3>
        <p>Consider providers with experience working with children of similar age and needs. Some providers specialize in early intervention, while others focus on school-age children or teens.</p>
        
        <h3>3. Treatment Approach</h3>
        <p>Ask about their treatment philosophy and methods. Do they use naturalistic teaching? How do they handle challenging behaviors? Ensure their approach aligns with your values.</p>
        
        <h3>4. Insurance and Costs</h3>
        <p>Verify that the provider accepts your insurance. Understand your out-of-pocket costs and any financial assistance programs available.</p>
        
        <h3>5. Location and Schedule</h3>
        <p>Consider the provider's location and whether they offer in-home, clinic-based, or school-based services. Ensure their schedule can accommodate your family's needs.</p>
        
        <h2>Questions to Ask During Consultation</h2>
        <ul>
          <li>What is your staff-to-client ratio?</li>
          <li>How do you involve parents in treatment?</li>
          <li>What is your data collection and progress tracking process?</li>
          <li>How do you handle challenging behaviors?</li>
          <li>What is your communication policy with families?</li>
        </ul>
      `,
      author: 'Michael Chen',
      date: '2024-01-10',
      slug: 'choosing-aba-provider',
      category: 'Guide'
    }
  }
  
  return posts[slug] || null
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {post.category && (
            <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
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
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-12">
          <EmailCapture source={`blog-${post.slug}`} />
        </div>
      </article>
    </div>
  )
}
