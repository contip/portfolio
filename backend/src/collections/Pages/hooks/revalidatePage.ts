import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Page } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({ doc, previousDoc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>()

  if (doc._status === 'published') {
    paths.add(doc.slug === 'home' ? '/' : `/${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    paths.add(previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: ['static-sitemap'],
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`

  await requestRevalidation(req, {
    paths: [path],
    tags: ['static-sitemap'],
  })

  return doc
}
