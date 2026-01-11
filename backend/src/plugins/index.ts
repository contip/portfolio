import { Plugin } from 'payload'
import { FormBuilderPlugin } from './form-builder'
import { S3StoragePlugin } from './s3'
import { PayloadAiPlugin } from './ai'
import { SEOPlugin } from './seo'
import { NestedDocsPlugin } from './nested-docs'
import { RedirectsPlugin } from './redirects'

/**
 * Payload CMS Plugins
 *
 * S3StoragePlugin is conditionally included only when S3 is configured.
 * This allows local development without S3 credentials while enabling
 * cloud storage in deployed environments.
 */

const hasS3Config = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_REGION &&
  process.env.CLOUDFRONT_DOMAIN,
)

export const plugins: Plugin[] = [
  FormBuilderPlugin,
  SEOPlugin,
  NestedDocsPlugin,
  ...(hasS3Config ? [S3StoragePlugin] : []),
  PayloadAiPlugin,
  RedirectsPlugin,
]
