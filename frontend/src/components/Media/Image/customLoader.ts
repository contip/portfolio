import type { Media } from '@/types/payload-types'
import { getAppropriateSize } from './imageUtils'

interface ImageLoaderProps {
  src: string
  width: number
  media?: Media
  quality?: number
}

/**
 * Custom image loader that selects the appropriate size variant
 * based on the requested width. This ensures we serve optimally-sized
 * images from CloudFront/S3 rather than the full-size original.
 */
const customImageLoader = ({ src, width, media, quality = 75 }: ImageLoaderProps): string => {
  // If no media object provided, just return the source URL
  if (!media || !media.url) {
    if (src.startsWith('http')) {
      return src
    }
    return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${src}`
  }

  // Get the appropriate size name based on requested width
  const sizeName = getAppropriateSize(width)

  // Get URL for selected size or fall back to original
  const sizes = media.sizes as Record<string, { url?: string | null }> | undefined
  const imageUrl = sizes?.[sizeName]?.url || media.url || src

  // Ensure the URL is properly encoded
  return imageUrl.replace(/ /g, '%20')
}

export default customImageLoader
