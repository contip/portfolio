import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Lizard } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateLizard: CollectionAfterChangeHook<Lizard> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>()
  const tags = new Set<string>()

  // Always invalidate the collection listing and sitemap
  tags.add('lizards')
  tags.add('static-sitemap')

  // Always invalidate the listing page
  paths.add('/lizards')

  if (doc._status === 'published' && doc.slug) {
    // Invalidate the individual document page and cache tag
    paths.add(`/lizards/${doc.slug}`)
    tags.add(`lizards-${doc.slug}`)
  }

  // If slug changed or document was unpublished, invalidate old slug too
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    paths.add(`/lizards/${previousDoc.slug}`)
    tags.add(`lizards-${previousDoc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
    paths.add(`/lizards/${previousDoc.slug}`)
    tags.add(`lizards-${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Lizard> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = ['/lizards']
  const tags = ['lizards', 'static-sitemap']

  if (doc?.slug) {
    paths.push(`/lizards/${doc.slug}`)
    tags.push(`lizards-${doc.slug}`)
  }

  await requestRevalidation(req, {
    paths,
    tags,
  })

  return doc
}
