import { getPayload } from 'payload'
import config from '@payload-config'

type EmailConfigShape = {
  internalRecipients?: Array<{
    key?: string | null
    label?: string | null
    enabled?: boolean | null
    primaryEmail?: string | null
  }> | null
  clientTemplates?: Array<{
    key?: string | null
    label?: string | null
    enabled?: boolean | null
  }> | null
  internalTemplates?: Array<{
    key?: string | null
    label?: string | null
    enabled?: boolean | null
  }> | null
}

type SelectOption = {
  label: string
  value: string
}

const normalizeKey = (value?: string | null): string => (value || '').trim()

const uniqueByValue = (options: SelectOption[]): SelectOption[] => {
  return Array.from(new Map(options.map((option) => [option.value.toLowerCase(), option])).values())
}

const mapRecipientOptions = (configDoc: EmailConfigShape): SelectOption[] => {
  const options = (configDoc.internalRecipients || [])
    .filter((row) => row?.enabled !== false)
    .map((row) => {
      const key = normalizeKey(row?.key)
      const label = (row?.label || key).trim()
      const primaryEmail = (row?.primaryEmail || '').trim()

      if (!key) return null

      return {
        value: key,
        label: primaryEmail ? `${label} (${key}) - ${primaryEmail}` : `${label} (${key})`,
      }
    })
    .filter((row): row is SelectOption => Boolean(row))

  return uniqueByValue(options)
}

const mapTemplateOptions = (
  templates: Array<{ key?: string | null; label?: string | null; enabled?: boolean | null }> | null | undefined,
): SelectOption[] => {
  const options = (templates || [])
    .filter((row) => row?.enabled !== false)
    .map((row) => {
      const key = normalizeKey(row?.key)
      const label = (row?.label || key).trim()

      if (!key) return null

      return {
        value: key,
        label: `${label} (${key})`,
      }
    })
    .filter((row): row is SelectOption => Boolean(row))

  return uniqueByValue(options)
}

export const getEmailConfigSelectOptions = async (): Promise<{
  recipients: SelectOption[]
  clientTemplates: SelectOption[]
  internalTemplates: SelectOption[]
}> => {
  try {
    const payload = await getPayload({ config })
    const configDoc = (await payload.findGlobal({
      slug: 'email-config',
      depth: 0,
      overrideAccess: true,
    })) as EmailConfigShape

    return {
      recipients: mapRecipientOptions(configDoc),
      clientTemplates: mapTemplateOptions(configDoc.clientTemplates),
      internalTemplates: mapTemplateOptions(configDoc.internalTemplates),
    }
  } catch {
    return {
      recipients: [],
      clientTemplates: [],
      internalTemplates: [],
    }
  }
}
