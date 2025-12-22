import type { Block } from 'payload'
import { link } from '@/fields/link'
import colorField from '@/fields/Color/config'
import richText from '@/fields/richText'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    richText({ name: 'richText' }),
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
