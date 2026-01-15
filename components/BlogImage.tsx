'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export default function BlogImage({ src, alt, className, fill = true, width, height }: BlogImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    // Fallback gradient background
    return (
      <div className={`${className || ''} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-gray-400 text-xs">Image</div>
      </div>
    )
  }

  // If width and height are provided, use them instead of fill
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setImageError(true)}
        unoptimized={src.startsWith('http')}
      />
    )
  }

  // Use fill for responsive images
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setImageError(true)}
        unoptimized={src.startsWith('http')}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
