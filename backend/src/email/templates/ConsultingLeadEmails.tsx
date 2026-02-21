/* eslint-disable @next/next/no-img-element */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { render } from '@react-email/render'
import * as React from 'react'
import type { LeadSubmissionSummary } from '@/utilities/normalizeLeadSubmission'

type SharedProps = {
  brandName: string
  brandTagline: string
  logoUrl?: string
  submittedAt: string
  formTitle: string
  inquiry: LeadSubmissionSummary
}

export type ClientTemplateCopy = {
  heading?: string
  intro?: string
  ctaLabel?: string
  closing?: string
}

export type InternalTemplateCopy = {
  heading?: string
  intro?: string
  closing?: string
}

type ClientProps = SharedProps & {
  responseSLA: string
  callToActionUrl: string
  copy?: ClientTemplateCopy
}

type InternalProps = SharedProps & {
  copy?: InternalTemplateCopy
  includeFieldDump?: boolean
}

const shell = {
  body: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: '28px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    margin: '0 auto',
    maxWidth: '640px',
    overflow: 'hidden',
  },
  hero: {
    background:
      'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(12,18,42,1) 65%, rgba(30,58,138,1) 100%)',
    color: '#ffffff',
    padding: '28px 32px 22px',
  },
  content: {
    padding: '30px 32px',
  },
  sectionHeading: {
    color: '#0f172a',
    fontSize: '16px',
    fontWeight: 700,
    margin: '0 0 12px',
  },
  helper: {
    color: '#64748b',
    fontSize: '13px',
    lineHeight: 1.4,
    margin: '0 0 8px',
  },
  lead: {
    color: '#334155',
    fontSize: '15px',
    lineHeight: 1.7,
    margin: '0 0 18px',
  },
  keyValueWrap: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '18px',
  },
  keyRow: {
    borderBottom: '1px solid #e2e8f0',
    padding: '10px 14px',
  },
  keyLabel: {
    color: '#475569',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    margin: '0 0 3px',
  },
  keyValue: {
    color: '#0f172a',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
  },
  footer: {
    color: '#64748b',
    fontSize: '12px',
    lineHeight: 1.5,
    margin: '0 0 6px',
  },
}

const Header = ({ brandName, brandTagline, logoUrl }: SharedProps) => (
  <Section style={shell.hero}>
    {logoUrl ? (
      <img
        src={logoUrl}
        width={44}
        height={44}
        alt={`${brandName} logo`}
        style={{ borderRadius: 8, marginBottom: 12 }}
      />
    ) : null}
    <Text style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{brandName}</Text>
    <Text style={{ fontSize: '12px', letterSpacing: '0.08em', margin: '4px 0 0', opacity: 0.85 }}>
      {brandTagline}
    </Text>
  </Section>
)

const KeyDetails = ({ inquiry, submittedAt, formTitle }: SharedProps) => {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Form', value: formTitle || 'General Inquiry' },
    { label: 'Submitted', value: submittedAt },
    { label: 'Contact', value: inquiry.contactName || '-' },
    { label: 'Work Email', value: inquiry.contactEmail || '-' },
    { label: 'Company', value: inquiry.company || '-' },
    { label: 'Service Need', value: inquiry.serviceNeed || '-' },
  ]

  return (
    <Section style={shell.keyValueWrap}>
      {rows.map((row, index) => (
        <Section
          key={`${row.label}-${index}`}
          style={{
            ...shell.keyRow,
            borderBottom: index === rows.length - 1 ? 'none' : shell.keyRow.borderBottom,
          }}
        >
          <Text style={shell.keyLabel}>{row.label}</Text>
          <Text style={shell.keyValue}>{row.value}</Text>
        </Section>
      ))}
    </Section>
  )
}

const FieldDump = ({ inquiry }: { inquiry: LeadSubmissionSummary }) => (
  <Section>
    <Text style={shell.sectionHeading}>Captured Submission Fields</Text>
    <Section style={shell.keyValueWrap}>
      {inquiry.fields.map((field, index) => (
        <Section
          key={`${field.label}-${index}`}
          style={{
            ...shell.keyRow,
            borderBottom: index === inquiry.fields.length - 1 ? 'none' : shell.keyRow.borderBottom,
          }}
        >
          <Text style={shell.keyLabel}>{field.label}</Text>
          <Text style={shell.keyValue}>{field.value}</Text>
        </Section>
      ))}
    </Section>
  </Section>
)

const ClientAcknowledgementEmail = ({
  brandName,
  brandTagline,
  logoUrl,
  responseSLA,
  callToActionUrl,
  copy,
  submittedAt,
  formTitle,
  inquiry,
}: ClientProps) => {
  const heading = copy?.heading || 'Inquiry Received'
  const intro =
    copy?.intro ||
    'Thank you for reaching out. Your project request has been received by our consulting team and is now being reviewed for scope, execution model, and delivery risk.'
  const ctaLabel = copy?.ctaLabel || 'Book a Strategy Call'
  const closing =
    copy?.closing || 'If this request was sent in error, you can safely ignore this message.'

  return (
    <Html>
      <Head />
      <Preview>We received your request and are preparing the next technical steps.</Preview>
      <Body style={shell.body}>
        <Container style={shell.container}>
          <Header
            brandName={brandName}
            brandTagline={brandTagline}
            logoUrl={logoUrl}
            submittedAt={submittedAt}
            formTitle={formTitle}
            inquiry={inquiry}
          />
          <Section style={shell.content}>
            <Heading as="h1" style={{ fontSize: '26px', margin: '0 0 14px', color: '#0f172a' }}>
              {heading}
            </Heading>
            <Text style={shell.lead}>{intro}</Text>
            <Text style={shell.lead}>
              You can expect a tailored response within <strong>{responseSLA}</strong>.
            </Text>
            <KeyDetails
              brandName={brandName}
              brandTagline={brandTagline}
              logoUrl={logoUrl}
              submittedAt={submittedAt}
              formTitle={formTitle}
              inquiry={inquiry}
            />
            <Section style={{ margin: '22px 0' }}>
              <Button
                href={callToActionUrl}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#ffffff',
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 18px',
                  textDecoration: 'none',
                }}
              >
                {ctaLabel}
              </Button>
            </Section>
            <Hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />
            <Text style={shell.footer}>{closing}</Text>
            <Text style={shell.footer}>{brandName}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const InternalLeadNotificationEmail = ({
  brandName,
  brandTagline,
  logoUrl,
  submittedAt,
  formTitle,
  inquiry,
  copy,
  includeFieldDump = true,
}: InternalProps) => {
  const heading = copy?.heading || 'New Enterprise Lead'
  const intro =
    copy?.intro ||
    'This message was generated from a Payload form submission and logged in Generated Emails.'
  const closing =
    copy?.closing ||
    'Open admin and review the full rendered copy under Generated Emails.'

  return (
    <Html>
      <Head />
      <Preview>New enterprise consulting lead submitted via {formTitle || 'form'}.</Preview>
      <Body style={shell.body}>
        <Container style={shell.container}>
          <Header
            brandName={brandName}
            brandTagline={brandTagline}
            logoUrl={logoUrl}
            submittedAt={submittedAt}
            formTitle={formTitle}
            inquiry={inquiry}
          />
          <Section style={shell.content}>
            <Heading as="h1" style={{ fontSize: '24px', margin: '0 0 12px', color: '#0f172a' }}>
              {heading}
            </Heading>
            <Text style={shell.helper}>{intro}</Text>
            <KeyDetails
              brandName={brandName}
              brandTagline={brandTagline}
              logoUrl={logoUrl}
              submittedAt={submittedAt}
              formTitle={formTitle}
              inquiry={inquiry}
            />
            {includeFieldDump ? <FieldDump inquiry={inquiry} /> : null}
            <Hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />
            <Text style={shell.footer}>{closing}</Text>
            <Text style={shell.footer}>
              <Link href={`${process.env.PAYLOAD_PUBLIC_SERVER_URL || ''}/admin/collections/generated-emails`}>
                Open Generated Emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const renderClientAcknowledgementEmail = async (props: ClientProps): Promise<string> => {
  return render(<ClientAcknowledgementEmail {...props} />)
}

export const renderInternalLeadNotificationEmail = async (props: InternalProps): Promise<string> => {
  return render(<InternalLeadNotificationEmail {...props} />)
}
