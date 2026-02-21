import type { TaskConfig } from 'payload'
import sendGeneratedEmailHandler from './handler'

const SendGeneratedEmail: TaskConfig = {
  slug: 'sendGeneratedEmail',
  label: 'Send Generated Email',
  retries: 3,
  handler: sendGeneratedEmailHandler,
  inputSchema: [
    {
      name: 'generatedEmailID',
      type: 'number',
      required: true,
    },
  ],
  outputSchema: [
    {
      name: 'success',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'message',
      type: 'text',
    },
    {
      name: 'providerMessageId',
      type: 'text',
    },
  ],
}

export default SendGeneratedEmail
