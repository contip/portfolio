import type { TaskHandler } from 'payload'
import { hasResendConfig } from '@/utilities/emailConfig'

type EmailRow = {
  email?: string | null
}

const selectEmails = (rows?: EmailRow[] | null): string[] =>
  (rows || []).map((row) => (row?.email || '').trim()).filter(Boolean)

const sendGeneratedEmailHandler: TaskHandler<'sendGeneratedEmail'> = async ({ input, req }) => {
  const generatedEmailID = Number(input.generatedEmailID)

  if (!Number.isFinite(generatedEmailID)) {
    return {
      output: {
        success: false,
        message: 'Invalid generatedEmailID input.',
      },
    }
  }

  const emailDoc = await req.payload.findByID({
    collection: 'generated-emails',
    id: generatedEmailID,
    depth: 0,
    req,
    overrideAccess: true,
  })

  const fail = async (message: string) => {
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

    return {
      output: {
        success: false,
        message,
      },
    }
  }

  if (!hasResendConfig) {
    return fail('RESEND_API_KEY or EMAIL_FROM_ADDRESS is not configured in runtime.')
  }

  const to = selectEmails(emailDoc.to as EmailRow[])
  const cc = selectEmails((emailDoc.cc || []) as EmailRow[])
  const bcc = selectEmails((emailDoc.bcc || []) as EmailRow[])

  if (!to.length) {
    return fail('No recipient addresses were found on the generated email document.')
  }

  try {
    const providerResponse = await req.payload.sendEmail({
      to,
      cc: cc.length ? cc : undefined,
      bcc: bcc.length ? bcc : undefined,
      from: emailDoc.from || process.env.EMAIL_FROM_ADDRESS || '',
      replyTo: emailDoc.replyTo || undefined,
      reply_to: emailDoc.replyTo || undefined,
      subject: emailDoc.subject,
      html: emailDoc.html,
    })

    const providerMessageId =
      typeof providerResponse === 'object' &&
      providerResponse !== null &&
      'id' in providerResponse &&
      typeof providerResponse.id === 'string'
        ? providerResponse.id
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

    return {
      output: {
        success: true,
        message: `Generated email ${generatedEmailID} sent.`,
        providerMessageId,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await fail(message)
    throw error
  }
}

export default sendGeneratedEmailHandler
