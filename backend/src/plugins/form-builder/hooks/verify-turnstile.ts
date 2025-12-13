import { FormSubmission } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'

const verifyTurnstile: CollectionBeforeChangeHook<FormSubmission> = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create') {
    // Check if a Turnstile token was provided
    const tokenField = data.submissionData?.find((f) => f.field === 'cf-turnstile-response')

    if (!tokenField || !tokenField.value) {
      req.payload.logger.warn(
        `Submission blocked - No Turnstile token. IP: ${
          data.submissionData?.find((f) => f.field === 'ipAddress')?.value || 'unknown'
        }`,
      )
      throw new Error('Security verification required. Please complete the CAPTCHA.')
    }

    try {
      const token = String(tokenField.value)

      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-turnstile`,
        {
          method: 'POST',
          body: JSON.stringify({ token }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!verifyResponse.ok) {
        throw new Error('Turnstile verification failed')
      }

      const result = await verifyResponse.json()

      if (!result.success) {
        req.payload.logger.warn(
          `Turnstile verification failed: ${JSON.stringify(result['error-codes'] || [])}`,
        )
        throw new Error('Security verification failed. Please try again.')
      }

      req.payload.logger.info('Turnstile verification successful')

      return data
    } catch (error) {
      req.payload.logger.error(`Error verifying turnstile: ${error}`)
      throw new Error('Security verification failed. Please refresh and try again.')
    }
  }
  return data
}

export default verifyTurnstile
