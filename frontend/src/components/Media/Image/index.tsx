'use client'

import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'
import type { Media } from '@/types/payload-types'
import type { Props as MediaProps } from '../types'
import customImageLoader from './customLoader'
import { defaultSizes, IMAGE_SIZES, placeholderBlur } from './imageUtils'

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined | null
  let height: number | undefined | null
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let media: Media | undefined

  if (!src && resource && typeof resource === 'object') {
    media = resource as Media
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = media

    width = widthFromProps ?? fullWidth
    height = heightFromProps ?? fullHeight
    alt = altFromResource || altFromProps

    // Use the URL directly - the loader will handle size selection
    src = url || ''
  }

  // Use provided sizes or default responsive sizes
  const sizes = sizeFromProps || defaultSizes

  // Determine dimensions for non-fill mode
  const chosenWidth = width || widthFromProps || IMAGE_SIZES.full
  const chosenHeight = height || heightFromProps || IMAGE_SIZES.full

  return (
    <NextImage
      loader={({ src, width }) => customImageLoader({ src, width, media, quality: 75 })}
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? chosenHeight : undefined}
      width={!fill ? chosenWidth : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? undefined : 'lazy'}
      decoding="async"
      placeholder="blur"
      blurDataURL={placeholderBlur}
      quality={75}
      sizes={sizes}
      src={src}
    />
  )
}
