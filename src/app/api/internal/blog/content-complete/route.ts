import { NextResponse } from "next/server"
import { authorDisplayName, getPortalAdmin, getPortalApiUser } from "@/lib/portalAuth"

export const runtime = "nodejs"

/* Marketa owns the Slack bot and the blog channel, so the handoff message is
   posted there. Its production URL is public (Slack calls it too). */
function marketaBase(): string {
  return (process.env.MARKETA_URL ?? "https://marketa-edwardzehuazhangs-projects.vercel.app").replace(/\/+$/, "")
}

/**
 * Mark a draft content complete and hand it to the SEO reviewer.
 *
 * Two steps, in this order: record the stage on the draft, then ask Marketa to
 * tag the reviewer in the draft's Slack thread. Marketa reads the stage back
 * from the row before posting, which is why the write comes first. The Slack
 * step failing does not undo the mark; the editor is told, and pressing the
 * button again retries only the Slack half.
 *
 * Returns the draft's metadata as stored afterwards, because the editor saves
 * metadata as a whole object and would otherwise erase these keys on its next
 * "Save draft".
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let id = ""
  try {
    const body = (await req.json()) as { id?: unknown }
    id = typeof body.id === "string" ? body.id : ""
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  const admin = getPortalAdmin()
  const { data, error } = await admin.from("portal_drafts").select("metadata").eq("id", id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  if (!data) return NextResponse.json({ error: "Draft not found." }, { status: 404 })

  const current = (data.metadata ?? {}) as Record<string, unknown>
  if (current.review_stage !== "content_complete") {
    const by = await authorDisplayName(user).catch(() => user.email ?? "")
    const { error: upErr } = await admin
      .from("portal_drafts")
      .update({
        metadata: {
          ...current,
          review_stage: "content_complete",
          content_completed_by: by || user.email || "",
          content_completed_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 502 })
  }

  let slackError: string | null = null
  try {
    const r = await fetch(`${marketaBase()}/api/webhooks/blog-content-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId: id }),
      signal: AbortSignal.timeout(20_000),
    })
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!r.ok || !j.ok) slackError = j.error ?? `Marketa answered ${r.status}`
  } catch (err) {
    slackError = err instanceof Error ? err.message : String(err)
  }

  const { data: after } = await admin.from("portal_drafts").select("metadata").eq("id", id).maybeSingle()
  return NextResponse.json({
    ok: true,
    metadata: (after?.metadata ?? {}) as Record<string, unknown>,
    slackError,
  })
}
