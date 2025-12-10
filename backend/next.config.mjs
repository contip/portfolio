import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for Lambda deployment
  output: 'standalone',

  // Force include sharp and its native binaries in the standalone output
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
