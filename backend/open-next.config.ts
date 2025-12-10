import type { OpenNextConfig } from '@opennextjs/aws/types/open-next'

const config = {
  default: {
    // Install sharp with the correct architecture for Lambda
    install: {
      packages: ['sharp@0.34.2'],
      arch: 'x64',
    },
  },
} satisfies OpenNextConfig

export default config
