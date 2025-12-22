import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Service } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateService: CollectionAfterChangeHook<Service> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>()

  if (doc._status === 'published') {
    paths.add(`/services/${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    paths.add(`/services/${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: ['static-sitemap'],
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Service> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  await requestRevalidation(req, {
    paths: [`/services/${doc?.slug}`],
    tags: ['static-sitemap'],
  })

  return doc
}
