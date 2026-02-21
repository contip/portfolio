import type { BasePayload, CollectionAfterChangeHook, PayloadRequest } from 'payload'
import type { FormSubmission } from '@/payload-types'
import type {
  ClientTemplateCopy,
  InternalTemplateCopy,
} from '@/email/templates/ConsultingLeadEmails'
import {
  renderClientAcknowledgementEmail,
  renderInternalLeadNotificationEmail,
} from '@/email/templates/ConsultingLeadEmails'
import { getEmailDeliveryMode, hasResendConfig } from '@/utilities/emailConfig'
import { normalizeLeadSubmission } from '@/utilities/normalizeLeadSubmission'

type EmailRouteShape = {
  key?: string | null
  label?: string | null
  enabled?: boolean | null
  primaryEmail?: string | null
  secondaryEmails?: Array<{ email?: string | null }> | null
}

type ClientTemplateShape = {
  key?: string | null
  enabled?: boolean | null
  subject?: string | null
  heading?: string | null
  intro?: string | null
  ctaLabel?: string | null
  closing?: string | null
}

type InternalTemplateShape = {
  key?: string | null
  enabled?: boolean | null
  subject?: string | null
  heading?: string | null
  intro?: string | null
  closing?: string | null
  includeFieldDump?: boolean | null
}

type EmailConfigShape = {
  fromName?: string | null
  fromAddress?: string | null
  defaultReplyTo?: string | null
  fallbackInternalEmail?: string | null
  consultationURL?: string | null
  logoURL?: string | null
  responseSLA?: string | null
  defaultInternalRecipientKey?: string | null
  internalRecipients?: EmailRouteShape[] | null
  defaultClientTemplateKey?: string | null
  defaultInternalTemplateKey?: string | null
  clientTemplates?: ClientTemplateShape[] | null
  internalTemplates?: InternalTemplateShape[] | null
}

type FormWorkflowShape = {
  enableAutomatedResponses?: boolean | null
  sendClientAcknowledgement?: boolean | null
  sendInternalAlert?: boolean | null
  includeSubmissionFieldDump?: boolean | null
  internalRecipientKey?: string | null
  clientTemplateKey?: string | null
  internalTemplateKey?: string | null
}

type ResolvedTemplate<TTemplate extends { key?: string | null }> = {
  key: string
  template: TTemplate
}

type ClientTemplateDefaults = {
  key: string
  subject: string
  heading: string
  intro: string
  ctaLabel: string
  closing: string
}

type InternalTemplateDefaults = {
  key: string
  subject: string
  heading: string
  intro: string
  closing: string
  includeFieldDump: boolean
}

const DEFAULT_CLIENT_TEMPLATE_KEY = 'consulting-client-standard'
const DEFAULT_INTERNAL_TEMPLATE_KEY = 'consulting-internal-standard'

const DEFAULT_CLIENT_TEMPLATE: ClientTemplateDefaults = {
  key: DEFAULT_CLIENT_TEMPLATE_KEY,
  subject: 'Inquiry received: {{serviceNeed}}',
  heading: 'Inquiry Received',
  intro:
    'Thank you for reaching out. Your project request has been received by our consulting team and is now being reviewed for scope, execution model, and delivery risk.',
  ctaLabel: 'Book a Strategy Call',
  closing: 'If this request was sent in error, you can safely ignore this message.',
}

const DEFAULT_INTERNAL_TEMPLATE: InternalTemplateDefaults = {
  key: DEFAULT_INTERNAL_TEMPLATE_KEY,
  subject: 'New lead: {{companyOrName}}',
  heading: 'New Enterprise Lead',
  intro: 'This message was generated from a Payload form submission and logged in Generated Emails.',
  closing: 'Open admin and review the full rendered copy under Generated Emails.',
  includeFieldDump: true,
}

const toRecipientRows = (emails: string[]): { email: string }[] =>
  emails.map((email) => ({ email })).filter((row) => row.email)

const interpolate = (template: string, values: Record<string, string>): string =>
  template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => values[key] || '')

const splitEmails = (value?: string | null): string[] =>
  (value || '')
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)

const normalizeKey = (value?: string | null): string => (value || '').trim().toLowerCase()

const resolveTemplate = <
  TTemplate extends {
    key?: string | null
    enabled?: boolean | null
  },
>(
  templates: TTemplate[] | null | undefined,
  selectedKey: string | null | undefined,
  defaultKey: string | null | undefined,
  fallback: TTemplate,
): ResolvedTemplate<TTemplate> => {
  const enabledTemplates = (templates || []).filter(
    (template) => template && template.enabled !== false && normalizeKey(template.key),
  )

  const findByKey = (key: string | null | undefined): TTemplate | undefined => {
    const target = normalizeKey(key)
    if (!target) return undefined
    return enabledTemplates.find((template) => normalizeKey(template.key) === target)
  }

  const selectedTemplate =
    findByKey(selectedKey) ||
    findByKey(defaultKey) ||
    findByKey(fallback.key) ||
    enabledTemplates[0] ||
    fallback

  return {
    key: (selectedTemplate.key || fallback.key || '').trim() || (fallback.key as string),
    template: selectedTemplate,
  }
}

const collectRouteEmails = (route: EmailRouteShape | null): string[] => {
  if (!route || route.enabled === false) return []

  const secondary = (route.secondaryEmails || [])
    .map((item) => (item?.email || '').trim())
    .filter(Boolean)

  return Array.from(
    new Set([route.primaryEmail || '', ...secondary].map((email) => email.trim()).filter(Boolean)),
  )
}

const resolveInternalRoute = (
  routes: EmailRouteShape[] | null | undefined,
  selectedKey: string | null | undefined,
  defaultKey: string | null | undefined,
): EmailRouteShape | null => {
  const enabledRoutes = (routes || []).filter((route) => route && route.enabled !== false)

  const findByKey = (key: string | null | undefined): EmailRouteShape | undefined => {
    const target = normalizeKey(key)
    if (!target) return undefined
    return enabledRoutes.find((route) => normalizeKey(route.key) === target)
  }

  return findByKey(selectedKey) || findByKey(defaultKey) || enabledRoutes[0] || null
}

const loadEmailConfig = async (payload: BasePayload, req: PayloadRequest): Promise<EmailConfigShape> => {
  try {
    const config = await payload.findGlobal({
      slug: 'email-config',
      depth: 1,
      req,
      overrideAccess: true,
    })

    return config as EmailConfigShape
  } catch {
    return {}
  }
}

const sendWithPayload = async ({
  payload,
  from,
  to,
  replyTo,
  subject,
  html,
}: {
  payload: BasePayload
  from: string
  to: string[]
  replyTo?: string
  subject: string
  html: string
}) => {
  return payload.sendEmail({
    from,
    to,
    replyTo,
    reply_to: replyTo,
    subject,
    html,
  })
}

const sendConsultingEmails: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const mode = hasResendConfig ? getEmailDeliveryMode() : 'capture'
  const inquiry = normalizeLeadSubmission(doc.submissionData)

  const formID =
    typeof doc.form === 'number'
      ? doc.form
      : typeof doc.form === 'object' && doc.form && 'id' in doc.form && typeof doc.form.id === 'number'
        ? doc.form.id
        : undefined

  let formTitle = 'Project Inquiry'
  let formWorkflow: FormWorkflowShape = {}

  if (formID) {
    try {
      const formDoc = await req.payload.findByID({
        collection: 'forms',
        id: formID,
        depth: 1,
        req,
      })

      formTitle = formDoc?.title || formTitle
      formWorkflow = (formDoc as unknown as { emailWorkflow?: FormWorkflowShape })?.emailWorkflow || {}
    } catch (error) {
      req.payload.logger.warn(`Unable to resolve form settings for submission ${doc.id}: ${String(error)}`)
    }
  }

  if (formWorkflow.enableAutomatedResponses === false) {
    req.payload.logger.info(`Automated responses disabled on form ${formID || 'unknown'}`)
    return doc
  }

  const emailConfig = await loadEmailConfig(req.payload, req)
  const submittedAtISO = new Date().toISOString()
  const submittedAtDisplay = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  })

  const fromName = emailConfig.fromName || process.env.EMAIL_FROM_NAME || 'Peter T Conti Consulting'
  const fallbackDomain = process.env.EMAIL_DOMAIN || 'email.petertconti.com'
  const fromAddress =
    emailConfig.fromAddress || process.env.EMAIL_FROM_ADDRESS || `noreply@${fallbackDomain}`
  const from = fromName ? `${fromName} <${fromAddress}>` : fromAddress

  const defaultReplyTo = emailConfig.defaultReplyTo || undefined
  const consultationURL =
    emailConfig.consultationURL || process.env.CONSULTATION_URL || `${process.env.PUBLIC_URL || ''}/contact`
  const logoURL = emailConfig.logoURL || process.env.EMAIL_BRAND_LOGO_URL || ''
  const responseSLA = emailConfig.responseSLA || process.env.EMAIL_RESPONSE_SLA || '1 business day'

  const selectedRouteKey = formWorkflow.internalRecipientKey || undefined
  const defaultRouteKey = emailConfig.defaultInternalRecipientKey || undefined
  const selectedInternalRoute = resolveInternalRoute(
    emailConfig.internalRecipients,
    selectedRouteKey,
    defaultRouteKey,
  )

  const routeEmails = collectRouteEmails(selectedInternalRoute)
  const fallbackInternalEmails = splitEmails(
    emailConfig.fallbackInternalEmail || process.env.CONTACT_INBOX_EMAIL || fromAddress,
  )

  const internalRecipients = routeEmails.length
    ? routeEmails
    : fallbackInternalEmails.length
      ? fallbackInternalEmails
      : [fromAddress]

  const selectedClientTemplate = resolveTemplate(
    emailConfig.clientTemplates,
    formWorkflow.clientTemplateKey,
    emailConfig.defaultClientTemplateKey,
    DEFAULT_CLIENT_TEMPLATE,
  )

  const selectedInternalTemplate = resolveTemplate(
    emailConfig.internalTemplates,
    formWorkflow.internalTemplateKey,
    emailConfig.defaultInternalTemplateKey,
    DEFAULT_INTERNAL_TEMPLATE,
  )

  const templateValues = {
    serviceNeed: inquiry.serviceNeed || 'Cloud & Software Consulting',
    company: inquiry.company || '',
    contactName: inquiry.contactName || '',
    contactEmail: inquiry.contactEmail || '',
    formTitle,
    companyOrName: inquiry.company || inquiry.contactName || inquiry.contactEmail || 'Unknown contact',
  }

  const clientTemplate = {
    ...DEFAULT_CLIENT_TEMPLATE,
    ...selectedClientTemplate.template,
  }

  const internalTemplate = {
    ...DEFAULT_INTERNAL_TEMPLATE,
    ...selectedInternalTemplate.template,
  }

  const clientSubject = clientTemplate.subject || DEFAULT_CLIENT_TEMPLATE.subject
  const internalSubject = internalTemplate.subject || DEFAULT_INTERNAL_TEMPLATE.subject

  const clientCopy: ClientTemplateCopy = {
    heading: clientTemplate.heading || undefined,
    intro: clientTemplate.intro || undefined,
    ctaLabel: clientTemplate.ctaLabel || undefined,
    closing: clientTemplate.closing || undefined,
  }

  const internalCopy: InternalTemplateCopy = {
    heading: internalTemplate.heading || undefined,
    intro: internalTemplate.intro || undefined,
    closing: internalTemplate.closing || undefined,
  }

  const sendClientAcknowledgement = formWorkflow.sendClientAcknowledgement !== false
  const sendInternalAlert = formWorkflow.sendInternalAlert !== false

  const includeFieldDump =
    typeof formWorkflow.includeSubmissionFieldDump === 'boolean'
      ? formWorkflow.includeSubmissionFieldDump
      : internalTemplate.includeFieldDump !== false

  const outboundEmails: Array<{
    recipientType: 'client' | 'internal'
    templateKey: string
    internalRecipientKey?: string
    to: string[]
    replyTo?: string
    subject: string
    html: string
  }> = []

  if (sendClientAcknowledgement && inquiry.contactEmail) {
    outboundEmails.push({
      recipientType: 'client',
      templateKey: selectedClientTemplate.key,
      to: [inquiry.contactEmail],
      subject: interpolate(clientSubject, templateValues),
      html: await renderClientAcknowledgementEmail({
        brandName: fromName,
        brandTagline: 'SOFTWARE ENGINEERING | CLOUD SOLUTIONS',
        logoUrl: logoURL,
        responseSLA,
        callToActionUrl: consultationURL,
        copy: clientCopy,
        submittedAt: submittedAtDisplay,
        formTitle,
        inquiry,
      }),
    })
  }

  if (sendInternalAlert && internalRecipients.length > 0) {
    outboundEmails.push({
      recipientType: 'internal',
      templateKey: selectedInternalTemplate.key,
      internalRecipientKey: selectedInternalRoute?.key?.trim() || defaultRouteKey || undefined,
      to: internalRecipients,
      replyTo: inquiry.contactEmail || defaultReplyTo,
      subject: interpolate(internalSubject, templateValues),
      html: await renderInternalLeadNotificationEmail({
        brandName: fromName,
        brandTagline: 'SOFTWARE ENGINEERING | CLOUD SOLUTIONS',
        logoUrl: logoURL,
        copy: internalCopy,
        includeFieldDump,
        submittedAt: submittedAtDisplay,
        formTitle,
        inquiry,
      }),
    })
  }

  if (!outboundEmails.length) {
    req.payload.logger.warn(`No outbound consulting emails produced for form submission ${doc.id}`)
    return doc
  }

  const generatedEmailIDs: number[] = []

  for (const [index, outbound] of outboundEmails.entries()) {
    const created = await req.payload.create({
      collection: 'generated-emails',
      data: {
        name: `submission-${doc.id}-${outbound.recipientType}-${index + 1}`,
        status: mode === 'capture' ? 'captured' : mode === 'jobs' ? 'queued' : 'delegated',
        deliveryMode: mode,
        recipientType: outbound.recipientType,
        templateKey: outbound.templateKey,
        internalRecipientKey: outbound.internalRecipientKey,
        form: formID,
        formSubmission: doc.id,
        formTitle,
        contactName: inquiry.contactName,
        contactEmail: inquiry.contactEmail,
        company: inquiry.company,
        serviceNeed: inquiry.serviceNeed,
        from,
        replyTo: outbound.replyTo,
        to: toRecipientRows(outbound.to),
        subject: outbound.subject,
        html: outbound.html,
        submissionSnapshot: {
          submittedAt: submittedAtISO,
          formTitle,
          submissionData: doc.submissionData || [],
        },
      },
      req,
      overrideAccess: true,
    })

    generatedEmailIDs.push(created.id as number)
  }

  if (mode === 'capture') {
    return doc
  }

  if (mode === 'jobs') {
    for (const generatedEmailID of generatedEmailIDs) {
      await req.payload.jobs.queue({
        task: 'sendGeneratedEmail',
        queue: 'email',
        input: { generatedEmailID },
      })
    }

    await req.payload.jobs.run({
      queue: 'email',
      limit: generatedEmailIDs.length,
    })

    return doc
  }

  for (const [index, generatedEmailID] of generatedEmailIDs.entries()) {
    const outbound = outboundEmails[index]
    try {
      const response = await sendWithPayload({
        payload: req.payload,
        from,
        to: outbound.to,
        replyTo: outbound.replyTo,
        subject: outbound.subject,
        html: outbound.html,
      })

      const providerMessageId =
        typeof response === 'object' &&
        response !== null &&
        'id' in response &&
        typeof response.id === 'string'
          ? response.id
          : ''

      await req.payload.update({
        collection: 'generated-emails',
        id: generatedEmailID,
        data: {
          status: 'sent',
          sentAt: new Date().toISOString(),
          error: '',
          providerMessageId,
        },
        req,
        overrideAccess: true,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      await req.payload.update({
        collection: 'generated-emails',
        id: generatedEmailID,
        data: {
          status: 'failed',
          error: message,
        },
        req,
        overrideAccess: true,
      })
    }
  }

  return doc
}

export default sendConsultingEmails
