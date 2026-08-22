import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { resolveLinkedInMention } from "@/lib/social/zernio"
import { normaliseLinkedInTarget } from "@/lib/social/mentions"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Resolve a LinkedIn account into text a caption can carry.
 *
 * Body: { target, displayName? } — a company page URL, a profile URL, or the
 * bare vanity name from either.
 *
 * LinkedIn is the only channel that needs a server for this. On X "@handle"
 * in the body IS the mention, so the composer builds that itself; here plain
 * text does nothing and the post must carry the account's URN, which only
 * LinkedIn can answer. Resolving through Zernio keeps the API key server-side.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: { target?: string; displayName?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const target = typeof body.target === "string" ? body.target.trim() : ""
  if (!target) return NextResponse.json({ error: "Nothing to tag." }, { status: 400 })

  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }

  try {
    const mention = await resolveLinkedInMention(
      normaliseLinkedInTarget(target),
      body.displayName?.trim() || undefined,
    )
    return NextResponse.json({
      text: mention.mentionFormat,
      displayName: mention.displayName,
      urn: mention.urn,
      type: mention.type,
      ...(mention.notice ? { notice: mention.notice } : {}),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    // Zernio answers 404 for "no such page" and 403 when the connected account
    // can't resolve a person — both are the writer's problem to fix, not ours.
    const missing = /\b(404|403)\b/.test(message)
    return NextResponse.json(
      {
        error: missing
          ? "LinkedIn couldn't find that account. Paste the company page URL, or its name from the URL (e.g. mondaydotcom)."
          : `Couldn't resolve that tag: ${message}`,
      },
      { status: missing ? 404 : 502 },
    )
  }
}
