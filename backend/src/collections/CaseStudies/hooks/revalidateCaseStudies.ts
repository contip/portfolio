import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { CaseStudy } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateCaseStudies: CollectionAfterChangeHook<CaseStudy> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/case-studies'])
  const tags = new Set<string>(['static-sitemap', 'caseStudies'])

  if (doc._status === 'published' && doc.slug) {
    paths.add(`/case-studies/${doc.slug}`)
    tags.add(`caseStudies-${doc.slug}`)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
    paths.add(`/case-studies/${previousDoc.slug}`)
    tags.add(`caseStudies-${previousDoc.slug}`)
  }

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    paths.add(`/case-studies/${previousDoc.slug}`)
    tags.add(`caseStudies-${previousDoc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<CaseStudy> = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  const paths = new Set<string>(['/case-studies'])
  const tags = new Set<string>(['static-sitemap', 'caseStudies'])

  if (doc?.slug) {
    paths.add(`/case-studies/${doc.slug}`)
    tags.add(`caseStudies-${doc.slug}`)
  }

  await requestRevalidation(req, {
    paths: Array.from(paths),
    tags: Array.from(tags),
  })

  return doc
}
