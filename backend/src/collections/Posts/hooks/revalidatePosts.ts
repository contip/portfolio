import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import type { Post } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

const resolveCategorySlugs = async (value: unknown, req: PayloadRequest): Promise<string[]> => {
  if (!value) return []

  const slugs: string[] = []
  const ids: Array<number | string> = []

  if (typeof value === 'object' && value !== null) {
    if ('slug' in value) {
      const slug = (value as { slug?: string }).slug
      if (typeof slug === 'string') slugs.push(slug)
    } else if ('id' in value) {
      const id = (value as { id?: number | string }).id
      if (typeof id === 'number' || typeof id === 'string') ids.push(id)
    }
  } else if (typeof value === 'number' || typeof value === 'string') {
    ids.push(value)
  }

  if (!ids.length) return slugs

  try {
    const { docs } = await req.payload.find({
      collection: 'categories',
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 0,
      overrideAccess: true,
      req,
    })

    docs.forEach((doc) => {
      if (typeof doc?.slug === 'string') slugs.push(doc.slug)
    })
  } catch {
    return slugs
  }

  return slugs
}

export const revalidatePosts: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/blog', '/blog/category'])
  const tags = new Set<string>(['static-sitemap', 'posts'])

  if (doc._status === 'published' && doc.slug) {
    paths.add(`/blog/${doc.slug}`)
    tags.add(`posts-${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
    paths.add(`/blog/${previousDoc.slug}`)
    tags.add(`posts-${previousDoc.slug}`)
  }

  const currentCategorySlugs = await resolveCategorySlugs(doc.category, req)
  currentCategorySlugs.forEach((slug) => {
    paths.add(`/blog/category/${slug}`)
    tags.add(`category:${slug}`)
  })

  const previousCategorySlugs = await resolveCategorySlugs(previousDoc?.category, req)
  previousCategorySlugs.forEach((slug) => {
    paths.add(`/blog/category/${slug}`)
    tags.add(`category:${slug}`)
  })

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/blog', '/blog/category'])
  const tags = new Set<string>(['static-sitemap', 'posts'])

  if (doc?.slug) {
    paths.add(`/blog/${doc.slug}`)
    tags.add(`posts-${doc.slug}`)
  }

  const categorySlugs = await resolveCategorySlugs(doc?.category, req)
  categorySlugs.forEach((slug) => {
    paths.add(`/blog/category/${slug}`)
    tags.add(`category:${slug}`)
  })

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}
