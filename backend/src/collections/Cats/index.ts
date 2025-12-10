import type { CollectionConfig } from 'payload'

export const Cats: CollectionConfig = {
  slug: 'cats',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'breed',
      type: 'select',
      options: [
        { label: 'Siamese', value: 'siamese' },
        { label: 'Maine Coon', value: 'maine_coon' },
        { label: 'Persian', value: 'persian' },
        { label: 'Ragdoll', value: 'ragdoll' },
        { label: 'British Shorthair', value: 'british_shorthair' },
        { label: 'Tomcat', value: 'tomcat' },
      ],
    },
    {
      name: 'weight',
      type: 'number',
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
