import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { Plugin } from 'payload'
import { revalidateRedirects } from './hooks/revalidate-redirects'

export const RedirectsPlugin: Plugin = redirectsPlugin({
  collections: ['pages', 'posts', 'categories', 'services', 'caseStudies', 'lizards'],
  redirectTypes: ['307', '308'],
  overrides: {
    hooks: {
      afterChange: [revalidateRedirects],
    },
  },
})
