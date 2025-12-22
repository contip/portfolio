import type { CollectionConfig, ImageUploadFormatOptions } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import getAdminThumbnail from './getAdminThumbnail'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const formatOptions: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 75,
    effort: 2,
    compressionLevel: 6,
  },
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      required: false,
    },
  ],
  upload: {
    formatOptions: formatOptions,
    imageSizes: [
      {
        formatOptions: formatOptions,
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        formatOptions: formatOptions,
        name: 'card',
        width: 768,
        height: undefined,
        position: 'centre',
        withoutEnlargement: false,
      },
      {
        formatOptions: formatOptions,
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
        withoutEnlargement: false,
      },
      {
        formatOptions: formatOptions,
        name: 'full',
        width: 2048,
        height: undefined,
        position: 'centre',
        withoutEnlargement: false,
      },
    ],
    // Disable local storage - files are stored in S3 via the S3StoragePlugin
    disableLocalStorage: true,
    // Allowed file types
    mimeTypes: ['image/*', 'video/*'],
    // Admin panel thumbnail
    adminThumbnail: getAdminThumbnail,
  },
}
