import { fields, formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FieldConfig } from '@payloadcms/plugin-form-builder/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block, Field, Plugin } from 'payload'
import verifyTurnstile from './hooks/verify-turnstile'
import spamFilter from './hooks/spam-filter'
import captureGeneratedEmails from './hooks/capture-generated-emails'
import sendConsultingEmails from './hooks/send-consulting-emails'

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
  {
    name: 'emailWorkflow',
    label: 'Email Workflow',
    type: 'group',
    fields: [
      {
        name: 'enableAutomatedResponses',
        label: 'Enable Automated Responses',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        type: 'row',
        fields: [
          {
            name: 'sendClientAcknowledgement',
            label: 'Send Client Acknowledgement',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'sendInternalAlert',
            label: 'Send Internal Alert',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'includeSubmissionFieldDump',
            label: 'Include Submission Field Dump',
            type: 'checkbox',
            defaultValue: true,
          },
        ],
      },
      {
        name: 'internalRecipientKey',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
      {
        name: 'internalRecipientKeyUi',
        type: 'ui',
        label: 'Internal Recipient Route',
        admin: {
          components: {
            Field: '@/plugins/form-builder/components/EmailWorkflowSelect/InternalRecipientKeySelect',
          },
        },
      },
      {
        name: 'clientTemplateKey',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
      {
        name: 'clientTemplateKeyUi',
        type: 'ui',
        label: 'Client Template',
        admin: {
          components: {
            Field: '@/plugins/form-builder/components/EmailWorkflowSelect/ClientTemplateKeySelect',
          },
        },
      },
      {
        name: 'internalTemplateKey',
        type: 'text',
        admin: {
          hidden: true,
        },
      },
      {
        name: 'internalTemplateKeyUi',
        type: 'ui',
        label: 'Internal Template',
        admin: {
          components: {
            Field: '@/plugins/form-builder/components/EmailWorkflowSelect/InternalTemplateKeySelect',
          },
        },
      },
    ],
  },
]

export const FormBuilderPlugin: Plugin = formBuilderPlugin({
  beforeEmail: captureGeneratedEmails,
  fields: {
    payment: false,
    hidden: InputHidden,
  },
  formSubmissionOverrides: {
    hooks: {
      beforeChange: [verifyTurnstile, spamFilter],
      afterChange: [sendConsultingEmails],
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
