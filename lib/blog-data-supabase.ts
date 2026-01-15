import { supabase, isSupabaseConfigured } from './supabase'
import { BlogPost } from './blog-data'

export async function getBlogPostsFromSupabase(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase!
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts from Supabase:', error)
    throw error
  }

  return (data || []).map((post: any) => ({
    id: String(post.id),
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    slug: post.slug,
    category: post.category || undefined,
    image: post.image || undefined,
  }))
}

export async function getBlogPostFromSupabase(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase!
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching blog post from Supabase:', error)
    throw error
  }

  if (!data) return null

  return {
    id: String(data.id),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    date: data.date,
    slug: data.slug,
    category: data.category || undefined,
    image: data.image || undefined,
  }
}

export async function createBlogPostInSupabase(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase!
    .from('blog_posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      slug: post.slug,
      category: post.category || null,
      image: post.image || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating blog post in Supabase:', error)
    throw error
  }

  return {
    id: String(data.id),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    date: data.date,
    slug: data.slug,
    category: data.category || undefined,
    image: data.image || undefined,
  }
}

export async function updateBlogPostInSupabase(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const updateData: any = {}
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt
  if (updates.content !== undefined) updateData.content = updates.content
  if (updates.author !== undefined) updateData.author = updates.author
  if (updates.date !== undefined) updateData.date = updates.date
  if (updates.slug !== undefined) updateData.slug = updates.slug
  if (updates.category !== undefined) updateData.category = updates.category || null
  if (updates.image !== undefined) updateData.image = updates.image || null

  const { data, error } = await supabase!
    .from('blog_posts')
    .update(updateData)
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error updating blog post in Supabase:', error)
    throw error
  }

  if (!data) return null

  return {
    id: String(data.id),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    date: data.date,
    slug: data.slug,
    category: data.category || undefined,
    image: data.image || undefined,
  }
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase!
    .from('blog_posts')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    console.error('Error deleting blog post from Supabase:', error)
    throw error
  }

  return true
}
