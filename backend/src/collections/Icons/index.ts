import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'
import { anyone } from '@/collections/access/anyone'

export const Icons: CollectionConfig = {
  slug: 'icons',
  labels: {
    singular: 'Icon',
    plural: 'Icons',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'svg',
      label: 'Icon SVG',
      type: 'textarea',
      required: true,
    },
  ],
}
