import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Post } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidatePosts: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>()

  if (doc._status === 'published') {
    paths.add(`/posts/${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    paths.add(`/posts/${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: ['static-sitemap'],
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  await requestRevalidation(req, {
    paths: [`/posts/${doc?.slug}`],
    tags: ['static-sitemap'],
  })

  return doc
}
