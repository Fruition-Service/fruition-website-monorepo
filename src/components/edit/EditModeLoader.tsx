"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { isEditablePagePath } from "@/lib/inlineEdit"
import { EDIT_FLAG_COOKIE } from "@/sanity/editMode"

const EditOverlay = dynamic(() => import("./EditOverlay"), { ssr: false })

const subscribe = () => () => {}
const readFlag = () => document.cookie.split("; ").includes(`${EDIT_FLAG_COOKIE}=1`)

/**
 * Loads the inline editor only for browsers that switched edit mode on.
 *
 * It reads a flag cookie on the client instead of calling draftMode() in the
 * root layout, which would opt every page out of static rendering. Ordinary
 * visitors download nothing beyond this check.
 */
export default function EditModeLoader() {
  const pathname = usePathname()
  const on = useSyncExternalStore(subscribe, readFlag, () => false)
  return on && isEditablePagePath(pathname) ? <EditOverlay /> : null
}
