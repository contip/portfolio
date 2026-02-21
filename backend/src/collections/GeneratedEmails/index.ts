import type { CollectionConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'

export const GeneratedEmails: CollectionConfig = {
  slug: 'generated-emails',
  labels: {
    singular: 'Generated Email',
    plural: 'Generated Emails',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'recipientType',
      'templateKey',
      'contactName',
      'contactEmail',
      'company',
      'status',
      'sentAt',
    ],
    description: 'Captured and/or queued outbound emails for preview, audit, and resend workflows.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'recipientType',
                  type: 'select',
                  required: true,
                  defaultValue: 'internal',
                  options: [
                    {
                      label: 'Client',
                      value: 'client',
                    },
                    {
                      label: 'Internal',
                      value: 'internal',
                    },
                  ],
                  admin: {
                    position: 'sidebar',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'queued',
                  options: [
                    {
                      label: 'Captured (No Send)',
                      value: 'captured',
                    },
                    {
                      label: 'Queued',
                      value: 'queued',
                    },
                    {
                      label: 'Delegated (Direct Send)',
                      value: 'delegated',
                    },
                    {
                      label: 'Sent',
                      value: 'sent',
                    },
                    {
                      label: 'Failed',
                      value: 'failed',
                    },
                  ],
                  admin: {
                    position: 'sidebar',
                  },
                },
                {
                  name: 'deliveryMode',
                  type: 'select',
                  required: true,
                  defaultValue: 'jobs',
                  options: [
                    {
                      label: 'Jobs',
                      value: 'jobs',
                    },
                    {
                      label: 'Direct',
                      value: 'direct',
                    },
                    {
                      label: 'Capture Only',
                      value: 'capture',
                    },
                  ],
                  admin: {
                    position: 'sidebar',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'templateKey',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'internalRecipientKey',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'form',
                  type: 'relationship',
                  relationTo: 'forms',
                  admin: {
                    position: 'sidebar',
                  },
                },
                {
                  name: 'formSubmission',
                  type: 'relationship',
                  relationTo: 'form-submissions',
                  admin: {
                    position: 'sidebar',
                  },
                },
                {
                  name: 'formTitle',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactName',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'contactEmail',
                  type: 'email',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'company',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'serviceNeed',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Envelope',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'from',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'replyTo',
                  type: 'text',
                },
              ],
            },
            {
              name: 'to',
              type: 'array',
              required: true,
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
              ],
            },
            {
              name: 'cc',
              type: 'array',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
              ],
            },
            {
              name: 'bcc',
              type: 'array',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
              ],
            },
            {
              name: 'subject',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'html',
              type: 'textarea',
              required: true,
              admin: {
                rows: 14,
              },
            },
            {
              name: 'submissionSnapshot',
              type: 'json',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          label: 'Preview',
          fields: [
            {
              name: 'previewPane',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/collections/GeneratedEmails/components/PreviewTab',
                },
              },
            },
          ],
        },
        {
          label: 'Delivery',
          fields: [
            {
              name: 'providerMessageId',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'sentAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                readOnly: true,
                position: 'sidebar',
              },
            },
            {
              name: 'error',
              type: 'textarea',
              admin: {
                readOnly: true,
                rows: 4,
              },
            },
          ],
        },
      ],
    },
  ],
}
