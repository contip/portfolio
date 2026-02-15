import { Plugin } from 'payload'
import { payloadAiPlugin } from '@ai-stack/payloadcms'

export const PayloadAiPlugin: Plugin = payloadAiPlugin({
  collections: {
    pages: true,
    posts: true,
    categories: true,
    services: true,
    caseStudies: true,
    lizards: true,
  },
  // debugging: true,
  generatePromptOnInit: process.env.NODE_ENV !== 'production',
})
