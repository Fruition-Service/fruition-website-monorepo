import { revalidatePath } from "next/cache"
import { createClient } from "@sanity/client"
import { isEditablePagePath, safeReturnPath } from "@/lib/inlineEdit"
import { apiVersion, dataset, projectId } from "@/sanity/env"

/** Server-only pieces shared by the inline editor's API routes. */

export function editWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) throw new Error("SANITY_WRITE_TOKEN missing")
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" })
}

/**
 * Drop cached pages after an edit. A field can show on any page (nav, footer,
 * shared FAQs, a logo wall), so every page goes; the next visit to each
 * re-renders from Sanity. The edited URL goes first so it is fresh even if the
 * layout-wide tag were ever missed. Returns the paths that failed.
 */
export function revalidateAfterEdit(pagePathRaw: unknown): string[] {
  const pagePath = safeReturnPath(typeof pagePathRaw === "string" ? pagePathRaw : "/").split("?")[0]
  const failed: string[] = []
  for (const [p, type] of [[pagePath], ["/", "layout"]] as [string, "layout"?][]) {
    if (type !== "layout" && !isEditablePagePath(p)) continue
    try {
      if (type) revalidatePath(p, type)
      else revalidatePath(p)
    } catch (err) {
      console.error(`[inline-edit] revalidate ${p} failed:`, err instanceof Error ? err.message : err)
      failed.push(p)
    }
  }
  return failed
}
