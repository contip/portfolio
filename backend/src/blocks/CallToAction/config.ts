import type { Block } from 'payload'
import { link } from '@/fields/link'
import colorField from '@/fields/Color/config'
import richTextBase from '@/fields/richTextBase'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    richTextBase({ name: 'richText' }),
    link(),
    colorField({ name: 'backgroundColor' }),
    {
      name: 'bgImage',
      label: 'Background Image',
      type: 'upload',
      hasMany: false,
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => !siblingData?.backgroundColor,
      },
    },
  ],
}
