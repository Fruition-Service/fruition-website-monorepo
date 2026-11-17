import { NextResponse } from "next/server"
import { getPortalApiUser, bylineFor } from "@/lib/portalAuth"
import { getAtPath, isRemovableItemPath, isSafeDocId, parsePath, publishedId } from "@/lib/inlineEdit"
import { editWriteClient, revalidateAfterEdit } from "@/lib/inlineEditServer"

export const runtime = "nodejs"

const MAX_LENGTH = 20_000

function badRequest(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

/** Validate an { id, path } pair and return the published id + parsed path. */
function target(idRaw: unknown, pathRaw: unknown) {
  if (typeof idRaw !== "string" || typeof pathRaw !== "string") return null
  const id = publishedId(idRaw)
  const segments = parsePath(pathRaw)
  if (!isSafeDocId(id) || !segments) return null
  return { id, path: pathRaw, segments }
}

/**
 * The stored value of one field. The overlay compares it with what the page
 * shows: when templates transform the copy (markdown, booking-link rewrites)
 * the editor offers the raw value instead of editing the rendered text.
 */
export async function GET(req: Request) {
  if (!(await getPortalApiUser())) return badRequest("Unauthorized", 401)
  const sp = new URL(req.url).searchParams
  const t = target(sp.get("id"), sp.get("path"))
  if (!t) return badRequest("Bad field reference")

  const doc = await editWriteClient().fetch(`*[_id == $id][0]`, { id: t.id })
  if (!doc) return badRequest("Document not found", 404)
  const value = getAtPath(doc, t.segments)
  if (typeof value !== "string") return badRequest("Field is not plain text", 422)
  return NextResponse.json({ value })
}

/**
 * Save one text field and make the live site pick it up.
 *
 * Writes the published document directly (editors see the result straight
 * away, which is the point of this tool). If someone also has an unpublished
 * Studio draft of the same document, the draft gets the same change so a
 * later Publish from Studio doesn't quietly undo it.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return badRequest("Unauthorized", 401)

  let body: { id?: unknown; path?: unknown; value?: unknown; pagePath?: unknown }
  try {
    body = await req.json()
  } catch {
    return badRequest("Invalid JSON")
  }
  const t = target(body.id, body.path)
  if (!t) return badRequest("Bad field reference")
  if (typeof body.value !== "string") return badRequest("Value must be text")
  if (body.value.length > MAX_LENGTH) return badRequest("Text is too long")
  // Empty text renders nothing, so it carries no edit marker and can never be
  // clicked again here (a FAQ tab cleared this way became a blank bubble that
  // no one could fix, 16 Nov 2026). Tabs have a Remove action instead.
  if (!body.value.trim()) {
    return badRequest("Text can't be saved empty here. To delete a FAQ tab, click its label and use Remove tab; other text can be cleared in Sanity Studio.", 422)
  }

  const client = editWriteClient()
  const docs = await client.fetch<{ _id: string }[]>(
    `*[_id in [$id, $draft]]{ _id }`,
    { id: t.id, draft: `drafts.${t.id}` },
  )
  const published = docs.find((d) => d._id === t.id)
  if (!published) return badRequest("Document not found", 404)

  const tx = client.transaction().patch(t.id, (p) => p.set({ [t.path]: body.value }))
  if (docs.some((d) => d._id === `drafts.${t.id}`)) {
    tx.patch(`drafts.${t.id}`, (p) => p.set({ [t.path]: body.value }))
  }
  await tx.commit({ visibility: "sync" })

  const failed = revalidateAfterEdit(body.pagePath)

  console.log(`[inline-edit] ${await bylineFor(user)} set ${t.id} ${t.path}`)
  return NextResponse.json({ ok: true, revalidateFailed: failed })
}

/**
 * Remove one item from a removable array (a FAQ tab, a FAQ topic) on this
 * page's document. The central questions it pointed at are left alone.
 */
export async function DELETE(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return badRequest("Unauthorized", 401)

  let body: { id?: unknown; path?: unknown; pagePath?: unknown }
  try {
    body = await req.json()
  } catch {
    return badRequest("Invalid JSON")
  }
  const t = target(body.id, body.path)
  if (!t || !isRemovableItemPath(t.path)) return badRequest("This can't be removed here")

  const client = editWriteClient()
  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in [$id, $draft]]`, { id: t.id, draft: `drafts.${t.id}` })
  const published = docs.find((d) => d._id === t.id)
  if (!published) return badRequest("Document not found", 404)
  if (getAtPath(published, t.segments) == null) return badRequest("Already removed", 404)
  const siblings = getAtPath(published, t.segments.slice(0, -1))
  if (Array.isArray(siblings) && siblings.length <= 1) return badRequest("This is the only one left, so it can't be removed", 422)

  const tx = client.transaction().patch(t.id, (p) => p.unset([t.path]))
  const draft = docs.find((d) => d._id === `drafts.${t.id}`)
  if (draft && getAtPath(draft, t.segments) != null) tx.patch(`drafts.${t.id}`, (p) => p.unset([t.path]))
  await tx.commit({ visibility: "sync" })

  const failed = revalidateAfterEdit(body.pagePath)

  console.log(`[inline-edit] ${await bylineFor(user)} removed ${t.id} ${t.path}`)
  return NextResponse.json({ ok: true, revalidateFailed: failed })
}
