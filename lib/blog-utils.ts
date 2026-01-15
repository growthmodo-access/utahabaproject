import { BlogPost } from './blog-data'

// Calculate reading time in minutes based on content
export function calculateReadingTime(content: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 words per minute as average
  const wordsPerMinute = 225
  
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(word => word.length > 0).length
  
  // Calculate reading time (minimum 1 minute)
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readingTime)
}

// Get related posts based on category
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
  if (!currentPost.category) {
    // If no category, return latest posts excluding current
    return allPosts
      .filter(p => p.id !== currentPost.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
  
  // Get posts with same category, excluding current post
  const related = allPosts
    .filter(p => p.id !== currentPost.id && p.category === currentPost.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
  
  // If not enough related posts, fill with latest posts
  if (related.length < limit) {
    const additional = allPosts
      .filter(p => p.id !== currentPost.id && !related.find(r => r.id === p.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit - related.length)
    return [...related, ...additional]
  }
  
  return related
}

// Get all unique categories from blog posts
export function getAllCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>()
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category)
    }
  })
  return Array.from(categories).sort()
}
