import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  const baseUrl = process.env.FRONTEND_URL || new URL(request.url).origin;
  return NextResponse.redirect(new URL("/", baseUrl));
}
