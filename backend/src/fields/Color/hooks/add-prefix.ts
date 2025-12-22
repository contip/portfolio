import type { FieldHook } from 'payload'

const addPrefix =
  (prefix = ''): FieldHook =>
  ({ value }) => {
    if (!value || typeof value !== 'string') {
      return value
    }

    return value.startsWith(prefix) ? value : `${prefix}${value}`
  }

export default addPrefix
