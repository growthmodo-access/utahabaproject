import { promises as fs } from 'fs'
import path from 'path'

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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find(post => post.slug === slug) || null
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving blog posts:', error)
    throw error
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const posts = await getBlogPosts()
  const newId = String(Math.max(...posts.map(p => parseInt(p.id) || 0), 0) + 1)
  const newPost: BlogPost = { ...post, id: newId }
  posts.push(newPost)
  await saveBlogPosts(posts)
  return newPost
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
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
  const posts = await getBlogPosts()
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) return false
  
  await saveBlogPosts(filtered)
  return true
}
