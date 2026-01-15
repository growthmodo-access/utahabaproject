import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, createBlogPost } from '@/lib/blog-data'

export async function GET() {
  try {
    const posts = await getBlogPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, author, date, slug, category, image } = body

    if (!title || !excerpt || !content || !author || !date || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newPost = await createBlogPost({
      title,
      excerpt,
      content,
      author,
      date,
      slug,
      category,
      image
    })

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
