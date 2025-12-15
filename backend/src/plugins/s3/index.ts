import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'

/**
 * Generates the public URL for media files served via CloudFront.
 *
 * In production/dev environments, files are served through CloudFront for
 * optimal caching and performance. In local development with S3 (e.g., MinIO),
 * files are served directly from the S3 endpoint.
 */
const generateFileUrl = ({ filename, prefix }: { filename: string; prefix?: string }): string => {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN

  if (!cloudfrontDomain) {
    // Fallback for local development without CloudFront
    const s3Url = process.env.S3_URL || `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`
    return prefix ? `${s3Url}/${prefix}/${filename}` : `${s3Url}/${filename}`
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
