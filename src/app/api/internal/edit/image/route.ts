import { NextResponse } from "next/server"
import { getPortalApiUser, bylineFor } from "@/lib/portalAuth"
import { findImagePaths, isSafeDocId, publishedId } from "@/lib/inlineEdit"
import { editWriteClient, revalidateAfterEdit } from "@/lib/inlineEditServer"
import { uploadImageAsset } from "@/lib/sanityWriteClient"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml"])
const ASSET_ID = /^image-[a-f0-9]+-\d+x\d+-\w+$/

function badRequest(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

interface Place {
  id: string
  type: string
  title: string
  fields: number
  onPage: boolean
}

/** Published documents that use `assetId`, with how many image fields each. */
async function placesFor(assetId: string, pageDocs: Set<string>): Promise<{ place: Place; doc: unknown }[]> {
  const docs = await editWriteClient().fetch<Record<string, unknown>[]>(
    `*[references($asset) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]`,
    { asset: assetId },
  )
  return docs
    .map((doc) => {
      const id = String(doc._id)
      const title = [doc.title, doc.name, doc.heading, doc.seoTitle].find((v) => typeof v === "string") as string | undefined
      return {
        doc,
        place: {
          id,
          type: String(doc._type),
          title: title ?? id,
          fields: findImagePaths(doc, assetId).length,
          onPage: pageDocs.has(id),
        },
      }
    })
    .filter((p) => p.place.fields > 0)
}

/**
 * Where an image is used. The overlay only knows the asset (from the <img>
 * URL), not the field, so it asks here and lets the editor choose. Documents
 * whose text is also on the current page (`docs`) are flagged so they can be
 * preselected: "replace it on this page" is the usual intent.
 */
export async function GET(req: Request) {
  if (!(await getPortalApiUser())) return badRequest("Unauthorized", 401)
  const sp = new URL(req.url).searchParams
  const asset = sp.get("asset") ?? ""
  if (!ASSET_ID.test(asset)) return badRequest("Not a Sanity image")
  const pageDocs = new Set((sp.get("docs") ?? "").split(",").map(publishedId).filter(isSafeDocId))
  const places = await placesFor(asset, pageDocs)
  return NextResponse.json({ places: places.map((p) => p.place) })
}

/**
 * Upload a replacement and point the chosen documents' image fields at it.
 *
 * Paths are worked out here from the stored documents, never taken from the
 * browser. Crop and hotspot belong to the old picture, so they are cleared.
 * Alt text is kept. Open Studio drafts of the same documents get the same
 * change so a later Publish doesn't put the old image back.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return badRequest("Unauthorized", 401)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return badRequest("Expected a file upload")
  }
  const file = form.get("file")
  const asset = String(form.get("asset") ?? "")
  const targets = new Set(String(form.get("targets") ?? "").split(",").map(publishedId).filter(isSafeDocId))
  if (!(file instanceof File)) return badRequest("No file")
  if (!IMAGE_TYPES.has(file.type)) return badRequest("Use a PNG, JPG, WebP, GIF, AVIF or SVG image")
  if (file.size > MAX_BYTES) return badRequest("Image is over 10 MB")
  if (!ASSET_ID.test(asset)) return badRequest("Not a Sanity image")
  if (targets.size === 0) return badRequest("Choose where to replace it")

  const chosen = (await placesFor(asset, new Set())).filter((p) => targets.has(p.place.id))
  if (chosen.length === 0) return badRequest("That image is no longer used there", 409)

  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(0, 60) || "image"
  const newAsset = await uploadImageAsset(await file.arrayBuffer(), file.type, baseName)

  const client = editWriteClient()
  const drafts = new Set(
    await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: chosen.map((c) => `drafts.${c.place.id}`) }),
  )
  const tx = client.transaction()
  let fields = 0
  for (const { place, doc } of chosen) {
    const paths = findImagePaths(doc, asset)
    fields += paths.length
    const set = Object.fromEntries(paths.map((p) => [`${p}.asset`, { _type: "reference", _ref: newAsset }]))
    const unset = paths.flatMap((p) => [`${p}.crop`, `${p}.hotspot`])
    for (const id of [place.id, `drafts.${place.id}`]) {
      if (id !== place.id && !drafts.has(id)) continue
      tx.patch(id, (p) => p.set(set).unset(unset))
    }
  }
  await tx.commit({ visibility: "sync" })

  const failed = revalidateAfterEdit(form.get("pagePath"))
  console.log(
    `[inline-edit] ${await bylineFor(user)} replaced ${asset} -> ${newAsset} in ${chosen.map((c) => c.place.id).join(", ")}`,
  )
  return NextResponse.json({ ok: true, asset: newAsset, documents: chosen.length, fields, revalidateFailed: failed })
}
