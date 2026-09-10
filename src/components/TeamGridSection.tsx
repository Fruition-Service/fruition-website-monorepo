"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "@/components/sections/types"

export interface TeamMember {
  _id: string
  name: string
  role?: string
  emoji?: string
  photo?: SanityImageRef
  /** Direct image URL (e.g. monday.com user photo). Wins over Sanity photo when set. */
  photoUrl?: string
  bio?: string
  linkedinUrl?: string
  regions?: string[]
  order?: number
}

/**
 * The region tags a teamMember can carry, from the list in the Sanity schema.
 *
 * Deliberately NOT the booking regions in BookingSection: this vocabulary is
 * per-country (SG, IN, PH, AU) where booking is per-desk (SEA, IND, NA), and
 * the two overlap on APAC and UK — so a wrong value looks plausible and just
 * filters the grid to nobody. Typing it makes that a compile error instead.
 */
export type TeamRegion = "APAC" | "SG" | "IN" | "PH" | "UK" | "US" | "AU"

interface Props {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
  members: TeamMember[]
  region?: TeamRegion
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(560).height(560).fit("crop").url()
  } catch {
    return null
  }
}

/**
 * Lower rank = appears earlier on the page.
 *   0  Founder / CEO
 *   1  Director / Head of / VP
 *   2  Lead / Manager / Principal / Senior
 *   3  Engineer (specialists)
 *   4  Consultant / Associate / IC default
 */
function roleRank(role?: string): number {
  const r = (role ?? "").toLowerCase()
  if (!r) return 5
  if (r.includes("founder") || r.includes("ceo") || r.includes("chief")) return 0
  if (r.includes("director") || r.includes("head of") || r.includes(" vp ") || r.startsWith("vp")) return 1
  if (r.includes("lead") || r.includes("manager") || r.includes("principal")) return 2
  // Engineering ICs sit below leads/managers even when the title says "Senior".
  if (r.includes("engineer") || r.includes("developer") || r.includes("architect")) return 3
  if (r.includes("senior")) return 3
  return 4
}

export default function TeamGridSection({
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
  members,
  region,
}: Props) {
  const filtered = region
    ? members.filter((m) => Array.isArray(m.regions) && m.regions.includes(region))
    : members
  if (filtered.length === 0) return null
  const ordered = [...filtered].sort((a, b) => {
    if (a.name === "Josh Jebathilak") return -1
    if (b.name === "Josh Jebathilak") return 1
    if (a.name === "Edward Zehua Zhang") return 1
    if (b.name === "Edward Zehua Zhang") return -1
    return roleRank(a.role) - roleRank(b.role) || a.name.localeCompare(b.name)
  })
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        {(heading || subheading || ctaLabel) && (
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 40 }}>
            {heading && (
              <h2 className="font-bold" style={{ color: "var(--text-body)", fontSize: "clamp(28px, 6vw, 36px)", lineHeight: 1.2, marginBottom: 12 }}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p style={{ color: "var(--text-muted-fg)", fontSize: 16, lineHeight: "26px", maxWidth: 760 }}>{subheading}</p>
            )}
            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl}
                className="inline-flex items-center justify-center font-semibold"
                style={{ marginTop: 22, height: 46, padding: "0 22px", borderRadius: 999, border: "1px solid #8015e8", color: "#8015e8", fontSize: 14 }}
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 28 }}>
          {ordered.map((m) => {
            const photo = safeImageUrl(m.photo) || m.photoUrl
            return (
              <article
                key={m._id}
                className="bg-surface-raised rounded-card border border-ui overflow-hidden flex flex-col shadow-whisper dark:shadow-none"
              >
                <div style={{ aspectRatio: "1 / 1", backgroundColor: "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={photo} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ fontSize: 80 }}>{m.emoji || "🍎"}</span>
                  )}
                </div>
                <div className="flex flex-col" style={{ padding: 24, flex: 1 }}>
                  {m.role && (
                    <p className="font-semibold" style={{ fontSize: 13, color: "#8015e8", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {m.role}
                    </p>
                  )}
                  <h3 className="font-bold" style={{ fontSize: 22, lineHeight: "28px", color: "var(--text-body)", marginTop: 8 }}>
                    {m.name} {m.emoji && <span>{m.emoji}</span>}
                  </h3>
                  {m.bio && (
                    <p style={{ fontSize: 14, lineHeight: "22px", color: "var(--text-muted-fg)", marginTop: 14, flex: 1 }}>{m.bio}</p>
                  )}
                  {m.linkedinUrl && (
                    <Link
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold"
                      style={{ marginTop: 16, color: "#8015e8", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      LinkedIn ↗
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
