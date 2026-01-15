'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react'
import { BlogPost } from '@/lib/blog-data'
import Image from 'next/image'

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  useEffect(() => {
    fetchPosts()
    // Check if Supabase is configured (client-side check)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setSupabaseConfigured(!!(supabaseUrl && supabaseKey))
  }, [])

  useEffect(() => {
    if (editingPost?.image) {
      setImagePreview(editingPost.image)
    } else if (!isCreating && !editingPost) {
      setImagePreview('')
    }
  }, [editingPost, isCreating])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setMessage('Error loading posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage('Post deleted successfully')
        fetchPosts()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error deleting post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setMessage('Error deleting post')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const categoryValue = formData.get('category') as string
    const imageValue = formData.get('image') as string
    
    const postData = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      date: formData.get('date') as string,
      slug: formData.get('slug') as string,
      category: categoryValue && categoryValue.trim() ? categoryValue.trim() : undefined,
      image: imageValue && imageValue.trim() ? imageValue.trim() : undefined,
    }

    // Validate required fields
    if (!postData.title || !postData.excerpt || !postData.content || !postData.author || !postData.date || !postData.slug) {
      setMessage('Please fill in all required fields')
      return
    }

    try {
      let res
      if (editingPost) {
        res = await fetch(`/api/blog/${editingPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      }

      const responseData = await res.json()

      if (res.ok) {
        setMessage(editingPost ? 'Post updated successfully! Refreshing...' : 'Post created successfully!')
        setEditingPost(null)
        setIsCreating(false)
        setImagePreview('')
        fetchPosts()
        // Refresh the router to clear Next.js cache
        router.refresh()
        setTimeout(() => {
          setMessage('')
          // Force a hard refresh of blog pages
          if (editingPost) {
            window.location.href = `/blog/${editingPost.slug}`
          }
        }, 1000)
      } else {
        const errorMsg = responseData.error || `Error: ${res.status} ${res.statusText}`
        setMessage(errorMsg)
        console.error('Error response:', responseData)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setMessage(`Error saving post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create, edit, and manage blog posts</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingPost(null)
              setImagePreview('')
            }}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
            type="button"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Storage status message */}
        <div className={`mb-4 p-4 rounded-lg border ${
          supabaseConfigured
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm ${
            supabaseConfigured
              ? 'text-green-800'
              : 'text-yellow-800'
          }`}>
            {supabaseConfigured ? (
              <>
                <strong>✓ Supabase Connected:</strong> Blog posts are stored persistently in Supabase database.
              </>
            ) : (
              <>
                <strong>Note:</strong> Supabase is not configured. Blog posts are stored in memory/file system 
                and may be lost on server restart. See <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code> for setup instructions.
              </>
            )}
          </p>
        </div>

        {(isCreating || editingPost) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
                    setImagePreview('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingPost?.title}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingPost?.slug}
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-gray-500 mt-1">Lowercase, hyphens only (e.g., my-blog-post)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                <textarea
                  name="excerpt"
                  defaultValue={editingPost?.excerpt}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
                <textarea
                  name="content"
                  defaultValue={editingPost?.content}
                  required
                  rows={15}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">Use HTML tags (h2, h3, p, ul, li, etc.)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingPost?.author}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingPost?.date}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingPost?.category}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Education, Guide, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Featured Image URL
                  </span>
                  <span className="text-xs font-normal text-gray-500 ml-6">(Recommended for homepage display)</span>
                </label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingPost?.image}
                  onChange={(e) => setImagePreview(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/blog/your-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1 mb-3">
                  Upload your image to <code className="bg-gray-100 px-1 rounded">public/blog/</code> folder, then enter the path (e.g., <code className="bg-gray-100 px-1 rounded">/blog/image.jpg</code>). 
                  Recommended size: 1200x630px for best display on homepage and blog listing.
                </p>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative w-full max-w-md h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Featured image preview"
                        fill
                        className="object-cover"
                        onError={() => setImagePreview('')}
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This is how the featured image will appear on the homepage and blog listing.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPost(null)
                    setImagePreview('')
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No blog posts yet. Create your first post!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.category || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                          onClick={() => {
                            setEditingPost(post)
                            setIsCreating(false)
                            setImagePreview(post.image || '')
                          }}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
