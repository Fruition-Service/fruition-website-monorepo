"use client"

import { createContext, useContext } from "react"
import { siteText, type SiteCopy, type SiteCopySlot } from "@/lib/siteCopy"

const SiteCopyContext = createContext<SiteCopy>({})

/**
 * Hands the shared copy slots (siteSettings.copy) to client components such as
 * the booking card. Mounted once in the root layout. Outside it, every slot
 * reads its built-in default.
 */
export function SiteCopyProvider({ copy, children }: { copy: SiteCopy; children: React.ReactNode }) {
  return <SiteCopyContext.Provider value={copy}>{children}</SiteCopyContext.Provider>
}

export function useSiteText(id: SiteCopySlot): string {
  return siteText(useContext(SiteCopyContext), id)
}

/** The whole map, for components that read several slots. */
export function useSiteCopy(): (id: SiteCopySlot) => string {
  const copy = useContext(SiteCopyContext)
  return (id) => siteText(copy, id)
}
