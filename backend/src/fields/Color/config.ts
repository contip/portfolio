import type { Field } from 'payload'
import deepMerge from '@/utilities/deepMerge'

type ColorFieldOptions = Partial<Field> & {
  prefix?: string
}

/**
 * Creates a color field that stores Tailwind class names.
 *
 * @param options - Field overrides and optional prefix
 * @param options.prefix - Tailwind prefix like 'bg-', 'text-', 'border-' (default: 'bg-')
 *
 * @example
 * // Background color field
 * colorField({ name: 'backgroundColor', prefix: 'bg-' })
 *
 * @example
 * // Text color field
 * colorField({ name: 'textColor', prefix: 'text-' })
 *
 * @example
 * // Border color field
 * colorField({ name: 'borderColor', prefix: 'border-' })
 */
const colorField = (options: ColorFieldOptions = {}): Field => {
  const { prefix = 'bg-', ...overrides } = options

  const baseField: Field = {
    admin: {
      components: {
        Field: {
          path: '@/components/ColorPicker',
          clientProps: {
            prefix,
          },
        },
      },
    },
    name: 'color',
    type: 'text',
  }

  return deepMerge(baseField, overrides)
}

export default colorField
