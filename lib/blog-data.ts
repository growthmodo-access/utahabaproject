import { promises as fs } from 'fs'
import path from 'path'
import { isSupabaseConfigured } from './supabase'
import {
  getBlogPostsFromSupabase,
  getBlogPostFromSupabase,
  createBlogPostInSupabase,
  updateBlogPostInSupabase,
  deleteBlogPostFromSupabase,
} from './blog-data-supabase'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  slug: string
  category?: string
  image?: string
}

const dataFilePath = path.join(process.cwd(), 'data', 'blog-posts.json')

// In-memory storage for serverless environments
let inMemoryBlogPosts: BlogPost[] | null = null
let isReadOnly = false

// Check if file system is writable
async function checkFileSystemWritable(): Promise<boolean> {
  if (isReadOnly !== false) return !isReadOnly
  
  try {
    // Try to write a test file
    const testPath = path.join(process.cwd(), 'data', '.test-write')
    await fs.writeFile(testPath, 'test', 'utf8')
    await fs.unlink(testPath)
    isReadOnly = false
    return true
  } catch (error) {
    console.warn('File system is read-only, using in-memory storage:', error)
    isReadOnly = true
    return false
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Use Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      return await getBlogPostsFromSupabase()
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to file storage:', error)
      // Fall through to file storage
    }
  }

  // If using in-memory storage, return that
  if (isReadOnly && inMemoryBlogPosts !== null) {
    return inMemoryBlogPosts
  }
  
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    const posts = JSON.parse(fileContents)
    // Cache in memory for read-only environments
    if (isReadOnly) {
      inMemoryBlogPosts = posts
    }
    return posts
  } catch (error) {
    console.error('Error reading blog posts:', error)
    // Return in-memory data if available
    if (inMemoryBlogPosts !== null) {
      return inMemoryBlogPosts
    }
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Use Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      return await getBlogPostFromSupabase(slug)
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to file storage:', error)
      // Fall through to file storage
    }
  }

  const posts = await getBlogPosts()
  return posts.find(post => post.slug === slug) || null
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  // Check if file system is writable
  const writable = await checkFileSystemWritable()
  
  if (!writable) {
    // Use in-memory storage
    inMemoryBlogPosts = posts
    console.warn('File system is read-only. Changes are stored in memory only and will be lost on server restart.')
    console.warn('For persistent storage, please set up a database (e.g., Supabase, PostgreSQL).')
    return
  }
  
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), 'utf8')
    // Update in-memory cache
    inMemoryBlogPosts = posts
  } catch (error: any) {
    console.error('Error saving blog posts:', error)
    // Fallback to in-memory storage
    inMemoryBlogPosts = posts
    
    // Check if it's a read-only file system error
    if (error?.code === 'EROFS' || error?.message?.includes('read-only')) {
      console.warn('Using in-memory storage due to read-only file system')
      return // Don't throw, just use in-memory storage
    }
    
    throw new Error(`Failed to save blog posts: ${error?.message || 'Unknown error'}. Consider using a database for persistent storage.`)
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  // Use Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      return await createBlogPostInSupabase(post)
    } catch (error) {
      console.error('Error creating in Supabase, falling back to file storage:', error)
      throw error // Re-throw Supabase errors
    }
  }

  const posts = await getBlogPosts()
  const newId = String(Math.max(...posts.map(p => parseInt(p.id) || 0), 0) + 1)
  const newPost: BlogPost = { ...post, id: newId }
  posts.push(newPost)
  await saveBlogPosts(posts)
  return newPost
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  // Use Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      return await updateBlogPostInSupabase(id, updates)
    } catch (error) {
      console.error('Error updating in Supabase, falling back to file storage:', error)
      throw error // Re-throw Supabase errors
    }
  }

  try {
    const posts = await getBlogPosts()
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) {
      console.error(`Blog post with id ${id} not found`)
      return null
    }
    
    // Merge updates with existing post, preserving the id
    const updatedPost: BlogPost = { 
      ...posts[index], 
      ...updates,
      id: posts[index].id // Ensure ID is never changed
    }
    
    posts[index] = updatedPost
    await saveBlogPosts(posts)
    return posts[index]
  } catch (error) {
    console.error('Error updating blog post:', error)
    throw error
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  // Use Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      return await deleteBlogPostFromSupabase(id)
    } catch (error) {
      console.error('Error deleting in Supabase, falling back to file storage:', error)
      throw error // Re-throw Supabase errors
    }
  }

  const posts = await getBlogPosts()
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) return false
  
  await saveBlogPosts(filtered)
  return true
}
