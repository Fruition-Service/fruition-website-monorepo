"use client"

import { usePathname } from "next/navigation"
import { urlFor } from "@/sanity/image"
import { cn } from "@/lib/utils"
import { partnerBadgesForPath, type PartnerBadgeKey } from "@/data/partnerBadges"
import { usePartnerBadges } from "@/components/PartnerBadgesProvider"
import type { PartnerBadge, SanityImageRef } from "./types"

/** Override specific CMS partner badges with local dark variants */
const DARK_LOGO_OVERRIDES: Record<string, string> = {
  n8n: "/images/partner-n8n-dark.avif",
  aircall: "/images/partner-aircall-dark.avif",
}

function cmsBadgeSrc(name: string | undefined, image: SanityImageRef): string | null {
  const n = (name || "").toLowerCase()
  for (const [key, darkSrc] of Object.entries(DARK_LOGO_OVERRIDES)) {
    if (n.includes(key)) return darkSrc
  }
  if (!image?.asset?._ref) return null
  try { return urlFor(image).auto("format").url() } catch { return null }
}

/** Code badge key -> Partners & badges key, where they differ. */
const PARTNER_KEY: Partial<Record<PartnerBadgeKey, string>> = { googleCloud: "google-cloud" }

/** Width and height from a Sanity asset id (image-<hash>-<w>x<h>-<ext>). */
function dims(ref: string | undefined): [number, number] | null {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  return m ? [Number(m[1]), Number(m[2])] : null
}

interface Row {
  key: string
  src: string
  alt: string
  width: number
  height: number
  square: boolean
}

interface PartnerBadgeRowProps {
  /** The page's own badges from Sanity. When set they replace the route's badges. */
  badges?: PartnerBadge[]
  /** Only show badges on routes the map names (see partnerBadgesForPath). */
  explicitOnly?: boolean
  className?: string
}

/**
 * The partner badges at the top of a hero: the page's own Sanity badges if it
 * has any, otherwise the badges for the service the route sells.
 */
export default function PartnerBadgeRow({ badges = [], explicitOnly = false, className }: PartnerBadgeRowProps) {
  const pathname = usePathname()
  const cms = usePartnerBadges()

  const rows: Row[] = badges.length > 0
    ? badges.flatMap((b, i) => {
        const src = cmsBadgeSrc(b.name, b.image)
        if (!src) return []
        return [{ key: b._key || `badge-${i}`, src, alt: b.name || "Partner badge", width: 120, height: 44, square: false }]
      })
    : partnerBadgesForPath(pathname, { explicitOnly }).map((b) => {
        // The partner's badge in Partners & badges wins over the bundled file.
        const live = cms[PARTNER_KEY[b.key] ?? b.key]
        const d = dims(live?.asset?._ref)
        let src = b.src
        if (live && d) {
          try { src = urlFor(live).auto("format").url() } catch { /* keep the bundled file */ }
        }
        return {
          key: b.key,
          src,
          alt: live?.alt || b.alt,
          width: d && src !== b.src ? d[0] : b.width,
          height: d && src !== b.src ? d[1] : b.height,
          square: d && src !== b.src ? Math.abs(d[0] - d[1]) / Math.max(d[0], d[1]) < 0.15 : b.shape === "square",
        }
      })

  if (rows.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-3 md:gap-4", className)}>
      {rows.map((r) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={r.key}
          src={r.src}
          alt={r.alt}
          width={r.width}
          height={r.height}
          className={cn("w-auto", r.square ? "h-16 md:h-[72px]" : "h-9 md:h-[44px] rounded-[5px]")}
        />
      ))}
    </div>
  )
}
