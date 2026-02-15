import { postgresAdapter } from '@payloadcms/db-postgres'
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
import Footer from './globals/Footer'
import Nav from './globals/Nav'
import { migrations } from './migrations'
import { plugins } from './plugins'
import verifyTurnstile from './endpoints/verifyTurnstile'
import seedEndpoint from './endpoints/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Posts, Services, CaseStudies, Categories, Icons, Lizards],
  globals: [Footer, Nav],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', process.env.PUBLIC_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', process.env.PUBLIC_URL || ''].filter(Boolean),
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
