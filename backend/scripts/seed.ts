import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { runSeed } from '@/utilities/seed'

const args = new Set(process.argv.slice(2))
const reset = args.has('--reset') || process.env.SEED_RESET === 'true'
const yes = args.has('--yes') || process.env.SEED_YES === 'true'

const isProduction =
  process.env.NODE_ENV === 'production' || process.env.APP_STAGE === 'production'

const main = async () => {
  if (isProduction && !yes) {
    throw new Error(
      'Refusing to run seed in production without explicit confirmation. Re-run with --yes.',
    )
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await runSeed({ payload, reset })

    payload.logger.info(result.message)
    payload.logger.info(
      `Created: ${result.created}, Updated: ${result.updated}, Deleted: ${result.deleted}`,
    )
    payload.logger.info(
      `Services: ${result.services}, Case Studies: ${result.caseStudies}, Categories: ${result.categories}, Posts: ${result.posts}, Pages: ${result.pages}`,
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
