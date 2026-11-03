import { NextResponse } from "next/server"
import { getPortalApiUser, bylineFor } from "@/lib/portalAuth"
import { SEO_DOC_TYPES, isSafeDocId, pickMetaDoc, publishedId } from "@/lib/inlineEdit"
import { editWriteClient, revalidateAfterEdit } from "@/lib/inlineEditServer"

export const runtime = "nodejs"

const MAX_LENGTH = 1_000
const MAX_IDS = 200

function badRequest(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

interface MetaDoc {
  id: string
  type: string
  slug: string | null
  name: string | null
  seoTitle: string | null
  seoDescription: string | null
}

function ids(raw: string | null): string[] {
  return (raw ?? "").split(",").map(publishedId).filter(isSafeDocId).slice(0, MAX_IDS)
}

/**
 * The document behind this page's meta title and description, with their
 * stored values. The overlay sends the documents it saw in <head> and in the
 * body; pickMetaDoc decides which one is the page.
 */
export async function GET(req: Request) {
  if (!(await getPortalApiUser())) return badRequest("Unauthorized", 401)
  const sp = new URL(req.url).searchParams
  const head = ids(sp.get("head"))
  const body = ids(sp.get("body"))
  const all = Array.from(new Set([...head, ...body]))
  if (all.length === 0) return NextResponse.json({ doc: null })

  const docs = await editWriteClient().fetch<MetaDoc[]>(
    `*[_id in $ids]{ "id": _id, "type": _type, "slug": slug.current, "name": coalesce(title, name, heading),
      seoTitle, seoDescription }`,
    { ids: all },
  )
  const byId = new Map(docs.map((d) => [d.id, d]))
  const pick = (list: string[]) => list.map((id) => byId.get(id)).filter((d): d is MetaDoc => !!d)
  const doc = pickMetaDoc(pick(head), pick(body), sp.get("path") ?? "/")
  return NextResponse.json({ doc })
}

/**
 * Save the meta title and description. An empty value unsets the field, so
 * the page goes back to its built-in fallback. Same write rules as text
 * fields: the published document, plus any open Studio draft of it.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return badRequest("Unauthorized", 401)

  let body: { id?: unknown; seoTitle?: unknown; seoDescription?: unknown; pagePath?: unknown }
  try {
    body = await req.json()
  } catch {
    return badRequest("Invalid JSON")
  }
  const id = typeof body.id === "string" ? publishedId(body.id) : ""
  if (!isSafeDocId(id)) return badRequest("Bad document id")
  const values: Record<string, string> = {}
  for (const key of ["seoTitle", "seoDescription"] as const) {
    const v = body[key]
    if (v === undefined) continue
    if (typeof v !== "string") return badRequest("Values must be text")
    if (v.length > MAX_LENGTH) return badRequest("Text is too long")
    values[key] = v.trim()
  }
  const keys = Object.keys(values)
  if (keys.length === 0) return badRequest("Nothing to save")

  const client = editWriteClient()
  const docs = await client.fetch<{ _id: string; _type: string }[]>(
    `*[_id in [$id, $draft]]{ _id, _type }`,
    { id, draft: `drafts.${id}` },
  )
  const published = docs.find((d) => d._id === id)
  if (!published) return badRequest("Document not found", 404)
  if (!SEO_DOC_TYPES.has(published._type)) return badRequest("This document has no page meta fields", 422)

  const set = Object.fromEntries(keys.filter((k) => values[k]).map((k) => [k, values[k]]))
  const unset = keys.filter((k) => !values[k])
  const tx = client.transaction()
  for (const docId of docs.map((d) => d._id)) tx.patch(docId, (p) => p.set(set).unset(unset))
  await tx.commit({ visibility: "sync" })

  const failed = revalidateAfterEdit(body.pagePath)

  console.log(`[inline-edit] ${await bylineFor(user)} set ${id} ${keys.join(", ")}`)
  return NextResponse.json({ ok: true, revalidateFailed: failed })
}
