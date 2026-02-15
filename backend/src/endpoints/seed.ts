import { addDataAndFileToRequest, type JsonObject, type PayloadHandler } from 'payload'
import { runSeed } from '@/utilities/seed'

const seedEndpoint: PayloadHandler = async (req) => {
  await addDataAndFileToRequest(req)

  const data = (req.data || {}) as JsonObject
  const reset = data.reset === true || data.reset === 'true'
  const providedSecret =
    (typeof data.secret === 'string' ? data.secret : null) || req.headers.get('x-seed-secret')
  const requiredSecret = process.env.SEED_SECRET

  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (requiredSecret && providedSecret !== requiredSecret) {
    return Response.json({ error: 'Invalid seed secret' }, { status: 403 })
  }

  const result = await runSeed({ payload: req.payload, reset })
  return Response.json(result, { status: 200 })
}

export default seedEndpoint
