import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isValidSanitySignature } from "@/lib/sanityWebhook"
import { bumpEdgeContentVersion } from "@/lib/edgeContentVersion"

export const runtime = "nodejs"

/**
 * Sanity publish webhook: makes Studio edits show on the live site without a
 * deploy.
 *
 * Most pages (the home page included) are rendered once at build time and
 * then served from the OpenNext ISR cache in KV. Before this route, only the
 * inline editor's own routes called revalidatePath, so an edit made in the
 * Studio, or through the Sanity API, stayed invisible until the next deploy.
 *
 * Any published document can show on any page (nav, footer, quotes, logo
 * walls, shared FAQs), so this drops every page, exactly like the inline
 * editor does: `revalidatePath("/", "layout")` writes the root layout's tag,
 * which every rendered page carries, and the next visit to each page
 * re-renders from Sanity. It then bumps the edge content version
 * (src/lib/edgeContentVersion.ts): the fruition-edge Worker keys its HTML
 * cache by that value, so every colo drops its old copy instead of serving it
 * until a background refresh happens to replace it. A change shows within
 * about two minutes.
 *
 * Env: SANITY_WEBHOOK_SECRET, the secret set on the webhook in
 * sanity.io/manage. Requests are rejected until it is set.
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  const raw = await req.text()
  if (!secret || !isValidSanitySignature(req.headers.get("sanity-webhook-signature"), raw, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let doc: { _id?: string; _type?: string } = {}
  try {
    doc = raw ? (JSON.parse(raw) as typeof doc) : {}
  } catch {
    // The body is only used for logging; a signed request still revalidates.
  }

  try {
    revalidatePath("/", "layout")
  } catch (err) {
    console.error("[sanity-webhook] revalidate failed:", err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: false, error: "revalidate failed" }, { status: 500 })
  }
  // The ISR revalidation above already succeeded; a failed bump only means the
  // edge falls back to its background refresh, so it is logged, not fatal.
  const edgeVersion = await bumpEdgeContentVersion().catch((err) => {
    console.error("[sanity-webhook] edge version bump failed:", err instanceof Error ? err.message : err)
    return null
  })
  console.log(`[sanity-webhook] revalidated all pages after ${doc._type ?? "?"} ${doc._id ?? "?"}; edge version ${edgeVersion ?? "unchanged"}`)
  return NextResponse.json({ ok: true, revalidated: "/ (layout)", edgeVersion, doc: { _id: doc._id, _type: doc._type } })
}
