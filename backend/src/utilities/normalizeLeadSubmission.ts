type SubmissionEntry = {
  field: string
  value: string
}

type SubmissionMap = Record<string, string>

const TECHNICAL_FIELDS = new Set(['cf-turnstile-response', 'website'])

const normalizeKey = (value: string): string => value.replace(/[\s_-]+/g, '').toLowerCase()

const labelFromKey = (key: string): string =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase())

const normalizeValue = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : value == null ? '' : String(value)

const findFirst = (submission: SubmissionMap, aliases: string[]): string => {
  const wanted = aliases.map((alias) => normalizeKey(alias))

  for (const [rawKey, rawValue] of Object.entries(submission)) {
    if (wanted.includes(normalizeKey(rawKey)) && rawValue) {
      return rawValue
    }
  }

  return ''
}

export type LeadSubmissionSummary = {
  contactName: string
  contactEmail: string
  company: string
  serviceNeed: string
  phone: string
  fields: { label: string; value: string }[]
}

export const normalizeLeadSubmission = (entries?: SubmissionEntry[] | null): LeadSubmissionSummary => {
  const submissionMap: SubmissionMap = {}

  for (const entry of entries || []) {
    const key = normalizeValue(entry.field)
    if (!key) continue

    submissionMap[key] = normalizeValue(entry.value)
  }

  const fields = Object.entries(submissionMap)
    .filter(([key]) => !TECHNICAL_FIELDS.has(key))
    .map(([key, value]) => ({
      label: labelFromKey(key),
      value: value || '-',
    }))

  return {
    contactName: findFirst(submissionMap, ['fullName', 'name', 'contactName']),
    contactEmail: findFirst(submissionMap, ['workEmail', 'email', 'contactEmail']),
    company: findFirst(submissionMap, ['company', 'organization', 'org']),
    serviceNeed: findFirst(submissionMap, ['primaryServiceNeed', 'serviceNeed', 'service']),
    phone: findFirst(submissionMap, ['phone', 'phoneNumber', 'workPhone']),
    fields,
  }
}
