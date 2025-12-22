import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      hasMany: false,
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      label: 'Clicking picture should direct to specified URL? (optional)',
      required: false,
    },
  ],
}
