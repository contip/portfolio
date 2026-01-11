import { Redirect } from '@/payload-types'
import { requestRevalidation } from '@/utilities/requestRevalidation'
import { CollectionAfterChangeHook } from 'payload'

export const revalidateRedirects: CollectionAfterChangeHook<Redirect> = async ({ doc, req }) => {
  req.payload.logger.info(`Revalidating redirects!`)
  await requestRevalidation(req, {
    tags: ['redirects'],
  })
  return doc
}
