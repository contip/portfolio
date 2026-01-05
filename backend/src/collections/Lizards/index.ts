import { slugField, type CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { revalidateLizard, revalidateDelete } from './hooks/revalidateLizard'

export const Lizards: CollectionConfig = {
  slug: 'lizards',
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateLizard],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'species',
      type: 'select',
      options: [
        {
          label: 'Cuban Brown Anole',
          value: 'sagrei',
        },
        {
          label: 'Baracoa Anole',
          value: 'baracoa',
        },
        {
          label: 'Cuban False Chameleon',
          value: 'barbatus',
        },
      ],
    },
    {
      name: 'age',
      type: 'number',
    },
    slugField({
      useAsSlug: 'name',
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'additionalImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  versions: {
    drafts: true,
  },
}
