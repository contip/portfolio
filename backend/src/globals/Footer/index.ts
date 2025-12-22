import type { GlobalConfig } from 'payload'
import { anyone } from '@/collections/access/anyone'
import { authenticated } from '@/collections/access/authenticated'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'footerItems',
      type: 'array',
      label: 'Footer Items',
      maxRows: 6,
      fields: [link()],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social Media Links',
      maxRows: 5,
      fields: [
        {
          name: 'icon',
          type: 'relationship',
          relationTo: 'icons',
        },
        link({ overrides: { name: 'url', label: 'Social Media URL' }, disableLabel: true }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

export default Footer
