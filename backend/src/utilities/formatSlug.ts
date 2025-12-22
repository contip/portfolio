import type { FieldHook } from 'payload'

const format = (value: string): string =>
  value
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackValue = data?.[fallbackField] || originalDoc?.[fallbackField]

      if (typeof fallbackValue === 'string') {
        return format(fallbackValue)
      }
    }

    return value
  }

export default formatSlug
