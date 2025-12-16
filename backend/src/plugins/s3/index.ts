import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'

/**
 * Generates the public URL for media files served via CloudFront.
 *
 * All media files MUST be served through CloudFront. The CLOUDFRONT_DOMAIN
 * environment variable is required and must be set (e.g., https://media.example.com).
 *
 * @throws Error if CLOUDFRONT_DOMAIN is not configured
 */
const generateFileUrl = ({ filename, prefix }: { filename: string; prefix?: string }): string => {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN

  if (!cloudfrontDomain) {
    throw new Error(
      'CLOUDFRONT_DOMAIN environment variable is required. ' +
        'Media files must be served through CloudFront CDN.',
    )
  }

  return prefix ? `${cloudfrontDomain}/${prefix}/${filename}` : `${cloudfrontDomain}/${filename}`
}

/**
 * S3 Storage Plugin for Payload CMS
 *
 * Configures S3 storage with CloudFront CDN for the media collection.
 * All files are served through CloudFront with aggressive caching enabled.
 *
 * Required environment variables:
 * - S3_BUCKET: The S3 bucket name
 * - S3_ACCESS_KEY_ID: IAM user access key
 * - S3_SECRET_ACCESS_KEY: IAM user secret key
 * - S3_REGION: AWS region (e.g., us-east-1)
 * - CLOUDFRONT_DOMAIN: Full CloudFront URL (e.g., https://media.example.com)
 */
export const S3StoragePlugin: Plugin = s3Storage({
  collections: {
    media: {
      prefix: 'media',
      disablePayloadAccessControl: true,
      generateFileURL: generateFileUrl,
    },
  },
  bucket: process.env.S3_BUCKET!,
  config: {
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region: process.env.S3_REGION,
  },
})
