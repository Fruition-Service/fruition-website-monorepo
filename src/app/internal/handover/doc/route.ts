import { NextResponse } from "next/server"
import { getPortalUser, LOGIN_PATH } from "@/lib/portalAuth"
import { HANDOVER_HTML } from "./content"

export const dynamic = "force-dynamic"

/**
 * The developer handover guide as a standalone HTML document. /internal/handover frames it
 * inside the portal shell; opening this URL directly gives the full-width page. Same login
 * gate as every portal page: signed-out visitors go to the portal login.
 */
export async function GET(req: Request) {
  const user = await getPortalUser()
  if (!user) {
    const login = new URL(LOGIN_PATH, req.url)
    login.searchParams.set("next", "/internal/handover")
    return NextResponse.redirect(login)
  }
  return new NextResponse(HANDOVER_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  })
}
