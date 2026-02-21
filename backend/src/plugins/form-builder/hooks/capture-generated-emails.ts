import type { BeforeEmail } from '@payloadcms/plugin-form-builder/types'
/**
 * We intentionally disable plugin-native emails so enterprise templates are
 * generated from our dedicated afterChange workflow.
 */
const captureGeneratedEmails: BeforeEmail = async () => {
  return []
}

export default captureGeneratedEmails
