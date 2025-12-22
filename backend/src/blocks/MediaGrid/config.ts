import type { Block } from 'payload'

const MediaGrid: Block = {
  slug: 'mediaGrid',
  interfaceName: 'MediaGridBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

export default MediaGrid
