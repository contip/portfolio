import type { Field } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import formatSlug from '@/utilities/formatSlug'

type SlugField = (fieldToUse?: string, overrides?: Partial<Field>) => Field

export const slugField: SlugField = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
