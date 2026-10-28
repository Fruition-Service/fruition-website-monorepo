import { cookies, draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { safeReturnPath } from "@/lib/inlineEdit"
import { EDIT_FLAG_COOKIE } from "@/sanity/editMode"

export const runtime = "nodejs"

/** Leaves edit mode and returns to the same page as a normal visitor. */
export async function GET(req: Request) {
  const path = safeReturnPath(new URL(req.url).searchParams.get("path"))
  ;(await draftMode()).disable()
  ;(await cookies()).delete(EDIT_FLAG_COOKIE)
  redirect(path)
}
