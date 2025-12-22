import type { Field } from 'payload'
import deepMerge from '@/utilities/deepMerge'
import addPrefix from './hooks/add-prefix'

const defaultColorField = (prefix: string): Field => ({
  admin: {
    components: {
      Field: '@/components/ColorPicker',
    },
  },
  name: 'color',
  type: 'text',
  hooks: {
    beforeValidate: [addPrefix(prefix)],
  },
})

const colorField = (overrides?: Partial<Field>, prefix = ''): Field => {
  const baseField = defaultColorField(prefix)
  return deepMerge(baseField, overrides ?? {})
}

export default colorField
