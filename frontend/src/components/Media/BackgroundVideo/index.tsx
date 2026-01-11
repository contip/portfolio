'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { Media } from '@/types/payload-types'

interface BackgroundVideoProps {
  resource: Media
  className?: string
  loop?: boolean
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  resource,
  className,
  loop = true,
}) => {
  const src = resource.url || ''

  // Use thumbnail as poster if available
  const sizes = resource.sizes as Record<string, { url?: string | null }> | undefined
  const poster = sizes?.thumbnail?.url || ''

  if (!src) return null

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop={loop}
      muted
      playsInline
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
    />
  )
}
