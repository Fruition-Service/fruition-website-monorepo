import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isValidSanitySignature } from "@/lib/sanityWebhook"

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
 * re-renders from Sanity. The fruition-edge Worker keeps its HTML copy fresh
 * for 60 s and then refreshes in the background, so a change shows within a
 * minute or two.
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
  console.log(`[sanity-webhook] revalidated all pages after ${doc._type ?? "?"} ${doc._id ?? "?"}`)
  return NextResponse.json({ ok: true, revalidated: "/ (layout)", doc: { _id: doc._id, _type: doc._type } })
}
