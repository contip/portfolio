import type { OpenNextConfig } from '@opennextjs/aws/types/open-next'

const config = {
  default: {
    // Install sharp with the correct architecture for Lambda (ARM64)
    install: {
      packages: ['sharp@0.34.2'],
      arch: 'arm64',
      libc: 'glibc',
    },
  },
} satisfies OpenNextConfig

export default config
