import type { Media } from '@/payload-types'
import type { GetAdminThumbnail } from 'payload'

/**
 * Returns the appropriate thumbnail URL for the Payload admin panel.
 *
 * For images, returns the thumbnail size URL or falls back to the main URL.
 * For videos, returns the mobile poster image if available.
 */
const getAdminThumbnail: GetAdminThumbnail = ({ doc }) => {
  const record = doc as unknown as Media

  if (record.mimeType?.includes('image')) {
    return record.sizes?.thumbnail?.url || record.url || ''
  }

  if (record.mimeType?.includes('video')) {
    // Video poster support - can be extended when video posters are added
    return ''
  }

  return ''
}

export default getAdminThumbnail
