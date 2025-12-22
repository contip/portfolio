import type { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
  posts: '/posts',
  services: '/services',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req: _req }: Props) => {
  const baseUrl =
    process.env.FRONTEND_URL ||
    process.env.PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ''
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const previewPath = `/next/preview?${encodedParams.toString()}`
  if (!baseUrl) return previewPath

  return `${baseUrl.replace(/\/$/, '')}${previewPath}`
}
