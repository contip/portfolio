import httpStatus from 'http-status'
import { JsonObject, PayloadHandler, addDataAndFileToRequest } from 'payload'

const verifyTurnstile: PayloadHandler = async (req) => {
  try {
    // const { token } = (req.data as JsonObject) || {}
    // req.payload.logger.info(`ATTEMPTING TO VERIFY CLOUDFLARE TURNSTILE TOKEN`)
    // req.payload.logger.info(`the token i received is: ${JSON.stringify(token)}`)
    await addDataAndFileToRequest(req)
    const { token } = req.data as JsonObject

    if (!token) {
      return Response.json(
        {
          success: false,
          error: 'Cloudflare response token not provided',
          user: null,
        },
        { status: 400 },
      )
    }

    const tokenStr = String(token)

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!secret) {
      req.payload.logger.error('Missing Turnstile secret key in environment variables')
      return Response.json(
        {
          success: false,
          error: 'Server misconfiguration: missing Turnstile secret!',
        },
        { status: 400 },
      )
    }

    const formData = new FormData()
    formData.append('secret', secret)
    formData.append('response', tokenStr)

    const ip = req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For')
    if (ip) {
      formData.append('remoteip', ip)
    }

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text()
      return Response.json(
        {
          success: false,
          error: `Error verifying Turnstile token! Status: ${verifyResponse.status}`,
          details: errorText,
        },
        { status: 400 },
      )
    }

    const verifyData = await verifyResponse.json()

    if (!verifyData.success) {
      return Response.json(
        {
          error: `Turnstile validation failed: ${(verifyData['error-codes'] || []).join(', ')}`,
          success: false,
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        message: 'Cloudflare turnstile verification successful!',
        success: true,
      },
      {
        status: httpStatus.OK,
      },
    )
  } catch (e) {
    const error = e as Error
    req.payload.logger.error(`Unexpected error in verifyTurnstile: ${error.message}`)
    return Response.json(
      {
        error: `Server error during verification: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

export default verifyTurnstile
