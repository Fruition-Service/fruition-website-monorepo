"use client"

import { createContext, useContext } from "react"
import type { PartnerImage } from "@/sanity/partners"

const PartnerBadgesContext = createContext<Record<string, PartnerImage>>({})

/**
 * The current badge of every partner in Partners & badges, keyed by partner
 * key. Mounted once in the root layout so the coded hero badge rows
 * (PartnerBadgeRow) show the same badge as the rest of the site.
 */
export function PartnerBadgesProvider({ badges, children }: { badges: Record<string, PartnerImage>; children: React.ReactNode }) {
  return <PartnerBadgesContext.Provider value={badges}>{children}</PartnerBadgesContext.Provider>
}

export function usePartnerBadges(): Record<string, PartnerImage> {
  return useContext(PartnerBadgesContext)
}
