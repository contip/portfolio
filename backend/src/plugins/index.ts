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

export const plugins: Plugin[] = [FormBuilderPlugin, S3StoragePlugin]
