import type { PayloadRequest } from 'payload'

type RevalidationPayload = {
  paths?: string[]
  tags?: string[]
}

const normalizeBaseUrl = (value: string): string => value.replace(/\/$/, '')

const resolveRevalidateUrl = (): string | null => {
  const baseUrl =
    process.env.FRONTEND_URL ||
    process.env.PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ''

  if (!baseUrl) return null

  return `${normalizeBaseUrl(baseUrl)}/api/revalidate`
}

export const requestRevalidation = async (
  req: PayloadRequest,
  { paths = [], tags = [] }: RevalidationPayload,
): Promise<void> => {
  const url = resolveRevalidateUrl()
  const secret = process.env.REVALIDATE_SECRET

  if (!url) {
    req.payload.logger.warn('Revalidation skipped: FRONTEND_URL/PUBLIC_URL is not configured.')
    return
  }

  if (!secret) {
    req.payload.logger.warn('Revalidation skipped: REVALIDATE_SECRET is not configured.')
    return
  }

  if (!paths.length && !tags.length) {
    return
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ paths, tags }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`Revalidation failed: ${response.status} ${response.statusText} ${text}`)
    }

    req.payload.logger.info(`Revalidation request sent to ${url}`)
  } catch (error) {
    req.payload.logger.error(`Error sending revalidation request: ${error}`)
  }
}
