import type { Block } from 'payload'

export const defaultRichTextInlineBlocks: Block[] = [
  {
    slug: 'inlineIcon',
    interfaceName: 'InlineIconBlock',
    labels: {
      singular: 'Icon',
      plural: 'Icons',
    },
    fields: [
      {
        name: 'icon',
        type: 'relationship',
        relationTo: 'icons',
        hasMany: false,
        required: true,
      },
      {
        name: 'textColor',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
      {
        name: 'backgroundColor',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
    ],
    admin: {
      components: {
        Block: '@/components/RichTextInlineIcon',
      },
    },
  },
]
