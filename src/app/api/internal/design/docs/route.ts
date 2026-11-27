import { NextResponse } from "next/server"
import { getPortalApiUser, getPortalAdmin } from "@/lib/portalAuth"
import { DEFAULT_TEMPLATE_ID, isTemplateId } from "@/lib/design/templates"

export const runtime = "nodejs"

/** Save a generated design document (called by the client after the stream completes). */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: { title?: string; html?: string; source_filename?: string; template?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  if (!body.html?.trim()) {
    return NextResponse.json({ error: "Missing html." }, { status: 400 })
  }

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from("design_docs")
    .insert({
      author_id: user.id,
      title: body.title?.trim() || "Untitled document",
      source_filename: body.source_filename ?? null,
      // An unrecognised template would silently mis-style the document at render
      // time, so fall back to the default rather than storing it.
      template: isTemplateId(body.template) ? body.template : DEFAULT_TEMPLATE_ID,
      html: body.html,
    })
    .select("id")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ ok: true, id: data.id })
}
