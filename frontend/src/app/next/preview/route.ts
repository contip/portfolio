import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const previewSecret = searchParams.get('previewSecret')
  const path = searchParams.get('path')

  if (!previewSecret || previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path || !path.startsWith('/')) {
    return new Response('Invalid preview path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  const baseUrl = process.env.FRONTEND_URL || new URL(request.url).origin

  return NextResponse.redirect(new URL(path, baseUrl))
}
