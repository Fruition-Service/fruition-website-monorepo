"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { EDIT_FLAG_COOKIE } from "@/sanity/editMode"
import { STAFF_PATH, startCurrency } from "@/lib/currency/client"

/**
 * Starts the site-wide display currency once per tab (see src/lib/currency).
 * Mounted in the root layout body, outside SiteFrame, so the chromeless
 * Implementation Calculator workspace is covered too. It renders nothing and
 * reads no request data, so every page stays statically rendered.
 *
 * Off in the inline editor: rewriting prices there would put converted figures
 * into the text the editor saves back to Sanity.
 */
export default function CurrencyRuntime() {
  const pathname = usePathname()
  useEffect(() => {
    if (STAFF_PATH.test(pathname ?? "")) return
    if (document.cookie.split("; ").includes(`${EDIT_FLAG_COOKIE}=1`)) return
    startCurrency()
  }, [pathname])
  return null
}
