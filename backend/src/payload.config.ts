import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Lizards } from './collections/Lizards'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { Icons } from './collections/Icons'
import { GeneratedEmails } from './collections/GeneratedEmails'
import Footer from './globals/Footer'
import Nav from './globals/Nav'
import EmailConfig from './globals/EmailConfig'
import { migrations } from './migrations'
import { plugins } from './plugins'
import verifyTurnstile from './endpoints/verifyTurnstile'
import seedEndpoint from './endpoints/seed'
import SendGeneratedEmail from './jobs/tasks/SendGeneratedEmail'
import { getEmailDeliveryMode, hasResendConfig } from './utilities/emailConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  onInit: (payload) => {
    payload.logger.info(
      `Email delivery mode: ${getEmailDeliveryMode()}${hasResendConfig ? '' : ' (capture only, Resend not configured)'}`,
    )
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Services,
    CaseStudies,
    Categories,
    Icons,
    GeneratedEmails,
    Lizards,
  ],
  globals: [Footer, Nav, EmailConfig],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  email: hasResendConfig
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY || '',
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || '',
        defaultFromName: process.env.EMAIL_FROM_NAME || '',
      })
    : undefined,
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', process.env.PUBLIC_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', process.env.PUBLIC_URL || ''].filter(Boolean),
  jobs: {
    tasks: [SendGeneratedEmail],
    // Serverless functions are ephemeral, so queue processing is explicitly triggered in hooks/tasks.
    shouldAutoRun: async () => false,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  endpoints: [
    {
      path: '/verify-turnstile',
      method: 'post',
      handler: verifyTurnstile,
    },
    {
      path: '/seed',
      method: 'post',
      handler: seedEndpoint,
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [...plugins],
})
