'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
}

export default function BlogImage({ src, alt, className, fill = true }: BlogImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    // Fallback gradient background
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-gray-400 text-xs">Image</div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}
