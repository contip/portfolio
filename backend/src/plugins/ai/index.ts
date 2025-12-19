import { Plugin } from 'payload'
import { payloadAiPlugin } from '@ai-stack/payloadcms'

export const PayloadAiPlugin: Plugin = payloadAiPlugin({
  collections: {
    lizards: true,
  },
  // debugging: true,
  generatePromptOnInit: false,
})
