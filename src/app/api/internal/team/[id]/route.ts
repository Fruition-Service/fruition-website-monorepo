import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { patchDocument, uploadImageAsset } from "@/lib/sanityWriteClient"
import { ALLOWED_REGIONS, ALLOWED_CERTIFICATIONS } from "@/lib/teamMemberOptions"
import { revalidateTeamPaths } from "@/lib/revalidateSite"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_PHOTO_BYTES = 8 * 1024 * 1024

type Ctx = { params: Promise<{ id: string }> }

/**
 * Update a team member's Sanity doc from the portal edit form. Patches only
 * the submitted fields, so anything the form doesn't manage survives. The
 * public team/partner pages read this doc directly.
 *
 * Note: this edits Sanity only — the monday.com People board row created at
 * onboarding is not synced here.
 */
export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { id } = await ctx.params

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const name = String(form.get("name") ?? "").trim()
  const role = String(form.get("role") ?? "").trim()
  const bio = String(form.get("bio") ?? "").trim()
  const emoji = String(form.get("emoji") ?? "").trim()
  const linkedinUrl = String(form.get("linkedinUrl") ?? "").trim()
  const websiteUrl = String(form.get("websiteUrl") ?? "").trim()
  const orderRaw = String(form.get("order") ?? "").trim()
  const regions = form.getAll("regions").map(String).filter(Boolean)
  const certifications = form.getAll("certifications").map(String).filter(Boolean)
  const photo = form.get("photo")

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 })
  if (!role) return NextResponse.json({ error: "Role is required." }, { status: 400 })
  if (regions.some((r) => !ALLOWED_REGIONS.has(r))) {
    return NextResponse.json({ error: "Invalid region." }, { status: 400 })
  }
  if (certifications.some((c) => !ALLOWED_CERTIFICATIONS.has(c))) {
    return NextResponse.json({ error: "Invalid certification." }, { status: 400 })
  }
  if (linkedinUrl && !/^https?:\/\//i.test(linkedinUrl)) {
    return NextResponse.json({ error: "LinkedIn URL must start with http(s)://" }, { status: 400 })
  }
  if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
    return NextResponse.json({ error: "Website URL must start with http(s)://" }, { status: 400 })
  }
  const order = orderRaw ? Number(orderRaw) : undefined
  if (orderRaw && !Number.isFinite(order)) {
    return NextResponse.json({ error: "Order must be a number." }, { status: 400 })
  }

  const set: Record<string, unknown> = { name, role, regions, certifications }
  const unset: string[] = []
  // Empty optional fields clear the value rather than leaving stale content.
  for (const [field, value] of [
    ["bio", bio],
    ["emoji", emoji],
    ["linkedinUrl", linkedinUrl],
    ["websiteUrl", websiteUrl],
  ] as const) {
    if (value) set[field] = value
    else unset.push(field)
  }
  if (order !== undefined) set.order = order

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Photo must be an image." }, { status: 400 })
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Photo exceeds 8 MB limit." }, { status: 413 })
    }
    try {
      const assetId = await uploadImageAsset(
        Buffer.from(await photo.arrayBuffer()),
        photo.type,
        `team-${id}-${Date.now()}`,
      )
      set.photo = { _type: "image", asset: { _type: "reference", _ref: assetId } }
    } catch (err) {
      return NextResponse.json(
        { error: `Photo upload failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 502 },
      )
    }
  }

  try {
    await patchDocument(id, set, unset)
    // Without this the public team cards keep serving the cached copy.
    const { failed } = revalidateTeamPaths(name)
    return NextResponse.json({ ok: true, ...(failed.length > 0 && { revalidateFailed: failed }) })
  } catch (err) {
    return NextResponse.json(
      { error: `Update failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
