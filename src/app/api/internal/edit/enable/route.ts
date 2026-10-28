import { cookies, draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { getPortalApiUser, LOGIN_PATH } from "@/lib/portalAuth"
import { isEditablePagePath, safeReturnPath } from "@/lib/inlineEdit"
import { EDIT_FLAG_COOKIE } from "@/sanity/editMode"

export const runtime = "nodejs"

/**
 * Turns the inline editor on for this browser, then sends it to `path`.
 * Signed-out visitors go through the portal's Google login first and land
 * back here. Edit mode is Next draft mode (pages render fresh and carry the
 * stega source map) plus a readable flag cookie that loads the overlay.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const raw = safeReturnPath(url.searchParams.get("path"))
  const path = isEditablePagePath(raw) ? raw : "/"

  const user = await getPortalApiUser()
  if (!user) {
    const back = `/api/internal/edit/enable?path=${encodeURIComponent(path)}`
    redirect(`${LOGIN_PATH}?next=${encodeURIComponent(back)}`)
  }

  ;(await draftMode()).enable()
  ;(await cookies()).set(EDIT_FLAG_COOKIE, "1", {
    path: "/",
    sameSite: "lax",
    secure: url.protocol === "https:",
    maxAge: 60 * 60 * 8,
  })
  redirect(path)
}
