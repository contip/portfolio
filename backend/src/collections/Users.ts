import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
    },
  ],
  timestamps: true,
}
