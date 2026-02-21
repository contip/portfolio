export type EmailDeliveryMode = 'direct' | 'jobs' | 'capture'

const SUPPORTED_EMAIL_DELIVERY_MODES: EmailDeliveryMode[] = ['direct', 'jobs', 'capture']

export const hasResendConfig = Boolean(
  process.env.RESEND_API_KEY && process.env.EMAIL_FROM_ADDRESS,
)

export const getEmailDeliveryMode = (): EmailDeliveryMode => {
  const rawMode = (process.env.EMAIL_DELIVERY_MODE || '').trim().toLowerCase()

  if (SUPPORTED_EMAIL_DELIVERY_MODES.includes(rawMode as EmailDeliveryMode)) {
    return rawMode as EmailDeliveryMode
  }

  // Default to jobs for production-grade observability and retry behavior.
  return hasResendConfig ? 'jobs' : 'capture'
}
