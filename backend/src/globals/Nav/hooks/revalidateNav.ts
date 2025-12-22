import type { GlobalAfterChangeHook } from 'payload'
import { requestRevalidation } from '@/utilities/requestRevalidation'

export const revalidateNav: GlobalAfterChangeHook = async ({ doc, req }) => {
  const { context } = req

  if (context.disableRevalidate) return doc

  await requestRevalidation(req, {
    tags: ['global_nav'],
  })

  return doc
}
