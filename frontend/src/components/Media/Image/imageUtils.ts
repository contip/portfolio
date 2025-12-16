/**
 * Image size breakpoints - must match backend Media collection imageSizes
 */
export const IMAGE_SIZES = {
  thumbnail: 400,
  card: 768,
  tablet: 1024,
  full: 2048,
} as const

export type ImageSizeName = keyof typeof IMAGE_SIZES

/**
 * Simple blur placeholder for loading state
 */
export const placeholderBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/**
 * Returns the appropriate size name for a requested width
 * Uses conservative thresholds to avoid serving undersized images
 */
export function getAppropriateSize(requestedWidth: number): ImageSizeName {
  if (requestedWidth <= IMAGE_SIZES.thumbnail) return 'thumbnail'
  if (requestedWidth <= IMAGE_SIZES.card) return 'card'
  if (requestedWidth <= IMAGE_SIZES.tablet) return 'tablet'
  return 'full'
}

/**
 * Default sizes attribute for responsive images
 * Tells browsers which image size to use at different viewport widths
 */
export const defaultSizes = `
  (max-width: ${IMAGE_SIZES.thumbnail}px) 100vw,
  (max-width: ${IMAGE_SIZES.card}px) ${IMAGE_SIZES.card}px,
  (max-width: ${IMAGE_SIZES.tablet}px) ${IMAGE_SIZES.tablet}px,
  ${IMAGE_SIZES.full}px
`
  .replace(/\s+/g, ' ')
  .trim()
