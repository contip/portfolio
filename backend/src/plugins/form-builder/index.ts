import { fields, formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FieldConfig } from '@payloadcms/plugin-form-builder/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block, Field, Plugin } from 'payload'
import verifyTurnstile from './hooks/verify-turnstile'
import spamFilter from './hooks/spam-filter'

const textFields = (fields.text as Block).fields

const InputHidden: FieldConfig = {
  /* @ts-expect-error: hidden field slug */
  slug: 'hidden',
  labels: {
    singular: 'Hidden',
    plural: 'Hidden',
  },
  fields: [...textFields],
}

const newFormFields: Field[] = [
  {
    name: 'captcha',
    label: 'Protect Form with Cloudflare Turnstile',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'honeypot',
    label: 'Enable Honeypot Field',
    type: 'checkbox',
    defaultValue: true,
  },
]

export const FormBuilderPlugin: Plugin = formBuilderPlugin({
  fields: {
    payment: false,
    hidden: InputHidden,
  },
  formSubmissionOverrides: {
    hooks: {
      beforeChange: [verifyTurnstile, spamFilter],
    },
  },
  formOverrides: {
    fields: ({ defaultFields }) => {
      return [
        ...newFormFields,
        ...defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        }),
      ]
    },
  },
})
