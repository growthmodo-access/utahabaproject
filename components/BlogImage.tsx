'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

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
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
    setImageError(false)
  }, [src])

  // Handle image loading errors
  const handleError = () => {
    console.warn(`Failed to load image: ${imageSrc}`)
    setImageError(true)
  }

  if (imageError || !imageSrc || imageSrc === '') {
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
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        unoptimized={imageSrc.startsWith('http') || imageSrc.startsWith('//')}
        priority={false}
      />
    )
  }

  // Use fill for responsive images
  const isExternal = imageSrc.startsWith('http') || imageSrc.startsWith('//')
  
  return (
    <div className="relative w-full h-full min-h-[200px]">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={isExternal}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        priority={false}
      />
    </div>
  )
}
