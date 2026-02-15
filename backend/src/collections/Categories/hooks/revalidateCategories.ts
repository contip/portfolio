import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Category } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateCategories: CollectionAfterChangeHook<Category> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/blog', '/blog/category'])
  const tags = new Set<string>(['static-sitemap', 'categories'])

  if (doc?.slug) {
    paths.add(`/blog/category/${doc.slug}`)
    tags.add(`categories-${doc.slug}`)
    tags.add(`category:${doc.slug}`)
  }

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    paths.add(`/blog/category/${previousDoc.slug}`)
    tags.add(`categories-${previousDoc.slug}`)
    tags.add(`category:${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Category> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/blog', '/blog/category'])
  const tags = new Set<string>(['static-sitemap', 'categories'])

  if (doc?.slug) {
    paths.add(`/blog/category/${doc.slug}`)
    tags.add(`categories-${doc.slug}`)
    tags.add(`category:${doc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}
