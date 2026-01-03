import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Lizard, Page } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateLizard: CollectionAfterChangeHook<Lizard> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>()

  if (doc._status === 'published' && doc.slug) {
    paths.add(`/lizards/${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    paths.add(`/lizards/${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: ['static-sitemap', 'lizards'],
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const path = `/lizards/${doc?.slug}`

  await requestRevalidation(req, {
    paths: [path],
    tags: ['static-sitemap', 'lizards'],
  })

  return doc
}
