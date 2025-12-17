import { slugField, type CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Lizards: CollectionConfig = {
  slug: 'lizards',
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
  ],
}
