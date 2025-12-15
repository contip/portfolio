import { Plugin } from 'payload'
import { FormBuilderPlugin } from './form-builder'
import { S3StoragePlugin } from './s3'

/**
 * Payload CMS Plugins
 *
 * S3StoragePlugin is conditionally included only when S3 is configured.
 * This allows local development without S3 credentials while enabling
 * cloud storage in deployed environments.
 */
const isS3Configured = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
)

export const plugins: Plugin[] = [
  FormBuilderPlugin,
  ...(isS3Configured ? [S3StoragePlugin] : []),
]
