import type { GlobalConfig } from 'payload'
import { authenticated } from '@/collections/access/authenticated'

const EmailConfig: GlobalConfig = {
  slug: 'email-config',
  access: {
    read: authenticated,
    update: authenticated,
  },
  admin: {
    description:
      'Global sender identity, internal routing, and editable template catalog for consulting lead automation.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sender & Routing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fromName',
                  label: 'From Name',
                  type: 'text',
                  required: true,
                  defaultValue: process.env.EMAIL_FROM_NAME || 'Peter T Conti Consulting',
                },
                {
                  name: 'fromAddress',
                  label: 'From Address',
                  type: 'email',
                  required: true,
                  defaultValue: process.env.EMAIL_FROM_ADDRESS || 'noreply@email.petertconti.com',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultReplyTo',
                  label: 'Default Reply-To',
                  type: 'email',
                },
                {
                  name: 'fallbackInternalEmail',
                  label: 'Fallback Internal Email',
                  type: 'email',
                  defaultValue: process.env.CONTACT_INBOX_EMAIL || '',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultInternalRecipientKey',
                  label: 'Default Internal Recipient Key',
                  type: 'text',
                  defaultValue: 'sales',
                  admin: {
                    description:
                      'Used when a form does not explicitly choose an internal recipient route.',
                  },
                },
                {
                  name: 'responseSLA',
                  label: 'Response SLA Text',
                  type: 'text',
                  defaultValue: process.env.EMAIL_RESPONSE_SLA || '1 business day',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'consultationURL',
                  label: 'Consultation URL',
                  type: 'text',
                  defaultValue: process.env.CONSULTATION_URL || '',
                },
                {
                  name: 'logoURL',
                  label: 'Brand Logo URL',
                  type: 'text',
                  defaultValue: process.env.EMAIL_BRAND_LOGO_URL || '',
                },
              ],
            },
            {
              name: 'internalRecipients',
              label: 'Internal Recipient Routes',
              type: 'array',
              admin: {
                description:
                  'Define reusable recipient routes by key (e.g. sales, support, partnerships). Forms reference these keys.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'primaryEmail',
                      type: 'email',
                      required: true,
                    },
                    {
                      name: 'secondaryEmails',
                      type: 'array',
                      fields: [
                        {
                          name: 'email',
                          type: 'email',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Template Catalog',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultClientTemplateKey',
                  label: 'Default Client Template Key',
                  type: 'text',
                  defaultValue: 'consulting-client-standard',
                },
                {
                  name: 'defaultInternalTemplateKey',
                  label: 'Default Internal Template Key',
                  type: 'text',
                  defaultValue: 'consulting-internal-standard',
                },
              ],
            },
            {
              name: 'clientTemplates',
              label: 'Client Templates',
              type: 'array',
              minRows: 1,
              defaultValue: [
                {
                  key: 'consulting-client-standard',
                  label: 'Consulting Client Standard',
                  enabled: true,
                  subject: 'Inquiry received: {{serviceNeed}}',
                  heading: 'Inquiry Received',
                  intro:
                    'Thank you for reaching out. Your request has been received and is being reviewed for scope, delivery model, and execution risk.',
                  ctaLabel: 'Book a Strategy Call',
                  closing:
                    'If this request was submitted in error, you can safely ignore this message.',
                },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  name: 'subject',
                  label: 'Subject Template',
                  type: 'text',
                  defaultValue: 'Inquiry received: {{serviceNeed}}',
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Inquiry Received',
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  defaultValue:
                    'Thank you for reaching out. Your project request has been received by our consulting team and is now being reviewed for scope, execution model, and delivery risk.',
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Book a Strategy Call',
                },
                {
                  name: 'closing',
                  type: 'textarea',
                  defaultValue: 'If this request was sent in error, you can safely ignore this message.',
                },
              ],
            },
            {
              name: 'internalTemplates',
              label: 'Internal Templates',
              type: 'array',
              minRows: 1,
              defaultValue: [
                {
                  key: 'consulting-internal-standard',
                  label: 'Consulting Internal Standard',
                  enabled: true,
                  subject: 'New lead: {{companyOrName}}',
                  heading: 'New Enterprise Lead',
                  intro:
                    'A new consulting lead was captured from a Payload form submission. Review details below and follow up.',
                  closing:
                    'Open the Generated Emails collection to inspect the rendered message and delivery status.',
                  includeFieldDump: true,
                },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  name: 'subject',
                  label: 'Subject Template',
                  type: 'text',
                  defaultValue: 'New lead: {{companyOrName}}',
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'New Enterprise Lead',
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  defaultValue:
                    'This message was generated from a Payload form submission and logged in Generated Emails.',
                },
                {
                  name: 'closing',
                  type: 'textarea',
                  defaultValue: 'Open admin and review the full rendered copy under Generated Emails.',
                },
                {
                  name: 'includeFieldDump',
                  label: 'Include Captured Field Dump',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default EmailConfig
