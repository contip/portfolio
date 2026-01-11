import type { Field } from 'payload'

import { link } from '@/fields/link'
import richText from '@/fields/richText'
import colorField from '@/fields/Color/config'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    richText({ name: 'richText' }),
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      maxRows: 2,
      fields: [
        link({
          appearances: ['default', 'outline', 'secondary', 'ghost', 'link'],
        }),
      ],
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      hasMany: false,
      required: false,
    },
    colorField({ name: 'bgColor', label: 'Background Color' }),
  ],
  label: false,
}
