import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const BLOG_IMAGES_BUCKET = 'blog-images'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const fileExtension = path.extname(file.name).toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed (JPEG, JPG, PNG, WebP, GIF)' },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const ext = path.extname(originalName)
    const nameWithoutExt = path.basename(originalName, ext)
    const uniqueFilename = `${nameWithoutExt}-${timestamp}${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = getSupabaseAdmin()
    if (supabase) {
      const contentType =
        file.type ||
        ({
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
        }[fileExtension] ?? 'application/octet-stream')

      const { error: uploadError } = await supabase.storage
        .from(BLOG_IMAGES_BUCKET)
        .upload(uniqueFilename, buffer, {
          contentType,
          upsert: false,
        })

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError)
        return NextResponse.json(
          {
            error:
              uploadError.message ||
              'Storage upload failed. Ensure the blog-images bucket exists and is public.',
          },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from(BLOG_IMAGES_BUCKET)
        .getPublicUrl(uniqueFilename)

      const publicUrl = publicUrlData.publicUrl

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
      })
    }

    const isVercel = process.env.VERCEL === '1'
    if (isVercel) {
      return NextResponse.json(
        {
          error:
            'Uploads on production require Supabase Storage. Add SUPABASE_SERVICE_ROLE_KEY to your environment and create a public bucket named blog-images. See ENV_SETUP.md.',
        },
        { status: 503 }
      )
    }

    const blogDir = path.join(process.cwd(), 'public', 'blog')
    if (!existsSync(blogDir)) {
      await mkdir(blogDir, { recursive: true })
    }

    const filePath = path.join(blogDir, uniqueFilename)
    await writeFile(filePath, buffer)

    const publicUrl = `/blog/${uniqueFilename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
