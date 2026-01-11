import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Document, Plugin } from 'payload'

const siteName = process.env.PAYLOAD_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'Site'

export const SEOPlugin: Plugin = seoPlugin({
  collections: ['pages', 'posts', 'services', 'categories', 'lizards'],
  uploadsCollection: 'media',
  generateTitle: ({ doc }: { doc: Document }) => `${siteName} - ${doc.title}`,
  generateDescription: ({ doc }: { doc: Document }) => `${doc.description ?? ''}`,
  tabbedUI: true,
  fields: ({ defaultFields }) => [
    defaultFields[0],
    {
      name: 'title',
      type: 'text',
      admin: {
        components: {
          Field: {
            clientProps: {
              hasGenerateTitleFn: true,
            },
            path: '@payloadcms/plugin-seo/client#MetaTitleComponent',
          },
          afterInput: ['@ai-stack/payloadcms/fields#ComposeField'],
        },
      },
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        components: {
          Field: {
            clientProps: {
              hasGenerateDescriptionFn: true,
            },
            path: '@payloadcms/plugin-seo/client#MetaDescriptionComponent',
          },
          afterInput: ['@ai-stack/payloadcms/fields#ComposeField'],
        },
      },
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      hasMany: false,
      admin: {
        components: {
          Field: {
            clientProps: {
              hasGenerateImageFn: true,
            },
            path: '@payloadcms/plugin-seo/client#MetaImageComponent',
          },
          Description: { path: '@ai-stack/payloadcms/fields#ComposeField' },
        },
        description: 'Maximum upload file size: 12MB. Recommended file size for images is <500KB.',
      },
      label: 'Meta Image',
      localized: true,
      relationTo: 'media',
    },
    defaultFields[4],
  ],
})
