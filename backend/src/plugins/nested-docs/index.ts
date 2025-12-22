import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import type { Plugin } from 'payload'

export const NestedDocsPlugin: Plugin = nestedDocsPlugin({
  collections: ['categories'],
  generateURL: (docs) => docs.reduce((_, doc) => `/posts/category/${doc.slug}`, ''),
  generateLabel: (_, doc) => doc.title as string,
  parentFieldSlug: 'parentId',
})
