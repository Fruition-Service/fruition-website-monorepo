import { NextResponse } from "next/server"
import { getVisitor, jsonError, sameOrigin, withVisitorCookie } from "@/lib/askFruit/server"
import { EvaluationStore } from "@/lib/askFruit/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// One route for list, detail and updates (`?id=`), rather than a separate
// [id] route: each route handler adds a few KiB to a Worker near its size limit.

function idFrom(req: Request): string | null {
  return new URL(req.url).searchParams.get("id")
}

/**
 * GET without `?id=`: the visitor's conversations, most recent first. A new
 * visitor gets an empty list and a cookie. GET with `?id=`: one conversation.
 */
export async function GET(req: Request) {
  const id = idFrom(req)
  const visitor = await getVisitor()
  if (!id) {
    if (visitor.isNew) {
      return withVisitorCookie(NextResponse.json({ evaluations: [] }, { headers: { "Cache-Control": "no-store" } }), visitor)
    }
    try {
      const evaluations = await new EvaluationStore().list(visitor.id)
      return NextResponse.json({ evaluations }, { headers: { "Cache-Control": "no-store" } })
    } catch (err) {
      console.error("[ask-fruit] list failed", err)
      return jsonError(503, "UNAVAILABLE", "Could not load your conversations.", true)
    }
  }
  if (visitor.isNew) return jsonError(404, "NOT_FOUND", "That conversation was not found.")
  try {
    const evaluation = await new EvaluationStore().get(visitor.id, id)
    if (!evaluation) return jsonError(404, "NOT_FOUND", "That conversation was not found.")
    return NextResponse.json({ evaluation }, { headers: { "Cache-Control": "no-store" } })
  } catch (err) {
    console.error("[ask-fruit] get failed", err)
    return jsonError(503, "UNAVAILABLE", "Could not load that conversation.", true)
  }
}

/**
 * `?id=`: rename, archive, delete, or set the shortlist from the decision board.
 * Body: { title?, status?: "archived" | "deleted", shortlist?: string[] }.
 */
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return jsonError(403, "FORBIDDEN", "Cross-site requests are not allowed.")
  const id = idFrom(req)
  if (!id) return jsonError(400, "BAD_REQUEST", "Which conversation? Pass ?id=.")
  const visitor = await getVisitor()
  if (visitor.isNew) return jsonError(404, "NOT_FOUND", "That conversation was not found.")

  let body: { title?: unknown; status?: unknown; shortlist?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, "BAD_REQUEST", "Expected a JSON body.")
  }

  const store = new EvaluationStore()
  const patch: { title?: string; status?: string; shortlist?: string[] } = {}
  if (typeof body.title === "string") {
    const title = body.title.replace(/\s+/g, " ").trim().slice(0, 120)
    if (!title) return jsonError(400, "BAD_REQUEST", "A title cannot be empty.")
    patch.title = title
  }
  if (body.status === "archived" || body.status === "deleted") patch.status = body.status
  if (Array.isArray(body.shortlist)) {
    const current = await store.get(visitor.id, id).catch(() => null)
    if (!current) return jsonError(404, "NOT_FOUND", "That conversation was not found.")
    // Only offerings already on the board can be kept.
    const onBoard = new Set(current.matches.map((m) => m.offering_id))
    patch.shortlist = [...new Set(body.shortlist.filter((v): v is string => typeof v === "string" && onBoard.has(v)))]
  }
  if (!Object.keys(patch).length) return jsonError(400, "BAD_REQUEST", "Nothing to update.")

  try {
    const evaluation = await store.update(visitor.id, id, patch)
    if (!evaluation) return jsonError(404, "NOT_FOUND", "That conversation was not found.")
    return NextResponse.json({ evaluation }, { headers: { "Cache-Control": "no-store" } })
  } catch (err) {
    console.error("[ask-fruit] update failed", err)
    return jsonError(503, "UNAVAILABLE", "Could not save that change.", true)
  }
}
