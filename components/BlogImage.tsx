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
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    if (src && src.trim() !== '') {
      setImageSrc(src)
      setImageError(false)
      setUseFallback(false)
    } else {
      setImageError(true)
    }
  }, [src])

  // Handle image loading errors
  const handleError = () => {
    console.warn(`Failed to load image: ${imageSrc}`)
    // Try fallback img tag
    if (!useFallback) {
      setUseFallback(true)
    } else {
      setImageError(true)
    }
  }

  // If no image source or error, show fallback
  if (imageError || !imageSrc || imageSrc.trim() === '') {
    return (
      <div className={`${className || ''} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-gray-400 text-xs">Image</div>
      </div>
    )
  }

  const isExternal = imageSrc.startsWith('http') || imageSrc.startsWith('//')

  // If width and height are provided, use them instead of fill
  if (width && height) {
    if (useFallback) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={handleError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )
    }
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        unoptimized={isExternal}
        priority={false}
      />
    )
  }

  // Use fill for responsive images
  if (useFallback) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleError}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }
  
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
