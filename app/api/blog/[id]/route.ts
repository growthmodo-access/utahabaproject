import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    
    // First try to find by ID
    const posts = await getBlogPosts()
    let post = posts.find(p => p.id === id)
    
    // If not found by ID, try by slug
    if (!post) {
      const postBySlug = await getBlogPost(id)
      post = postBySlug || undefined
    }
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const body = await request.json()
    
    const updatedPost = await updateBlogPost(id, body)
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const deleted = await deleteBlogPost(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
