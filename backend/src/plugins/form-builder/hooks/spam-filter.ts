import { FormSubmission } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'

const spamFilter: CollectionBeforeChangeHook<FormSubmission> = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  // Helper to get field values
  const getFieldValue = (fieldName: string): string =>
    data.submissionData?.find((f) => f.field === fieldName)?.value?.toString() || ''

  // Extract fields
  const fields = {
    website: getFieldValue('website'),
    message: getFieldValue('message'),
    email: getFieldValue('email'),
    query: getFieldValue('query'),
  }

  req.payload.logger.info(
    `Spam filter check for submission: ${fields.email}, IP: ${fields.message}`,
  )
  req.payload.logger.info(`Honeypot field value: ${fields.website}`)

  // 1. HONEYPOT CHECK - Instant block
  if (fields.website) {
    req.payload.logger.warn(`Honeypot triggered!!!`)
    throw new Error('Invalid submission detected')
  }

  req.payload.logger.info(`Form submission passed: ${fields.email}, IP: ${fields.message}`)

  return data
}

export default spamFilter
