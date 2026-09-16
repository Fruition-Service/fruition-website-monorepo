"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "@/components/sections/types"
import type { RegionSlug } from "@/data/regionPages"
import { filterTeamForRegionPage } from "@/lib/mergeTeamMembers"

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
  /**
   * Region page slugs this person may appear on. Empty or absent means no
   * restriction. See `allowedRegionPages` — the code-level map there wins.
   */
  regionPagesOnly?: string[]
  order?: number
}

/**
 * The region tags a teamMember can carry, from the list in the Sanity schema.
 *
 * Deliberately NOT the booking desks in BookingSection: this vocabulary is
 * per-country (SG, IN, PH, AU) where booking is per-desk (SEA, IND, NA). They
 * overlap on APAC and UK, and differ on four of the six region pages — so a
 * value swapped between them looks plausible and silently filters the grid to
 * nobody. Typing it makes that a compile error instead.
 */
export type TeamRegion = "APAC" | "SG" | "IN" | "PH" | "UK" | "US" | "AU"

/**
 * A regional grid must name the page it is rendering on.
 *
 * `region` narrows the roster by region code; `regionPageSlug` says which of
 * the six region pages this is. They are paired deliberately, so that dropping
 * the slug is a COMPILE error rather than a silent behaviour change — the
 * per-page pins in `REGION_PAGES_ONLY` need the page identity, and region codes
 * can't supply it (Australia, Singapore and the Philippines all read "APAC").
 *
 * This shape is the fix for a bug that shipped twice: the pin lived at the call
 * site in #160, the six region pages were rebuilt in #215, and it was dropped
 * without anything failing. Now the type system objects, and if a non-typed
 * caller still gets through, `filterTeamForRegionPage` fails closed and hides
 * the pinned person rather than putting them back on every page.
 */
type RegionScope =
  | { region: TeamRegion; regionPageSlug: RegionSlug }
  | { region?: never; regionPageSlug?: never }

type Props = RegionScope & {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
  members: TeamMember[]
  /**
   * Narrow the grid to leadership plus implementation consultants, and drop
   * anyone still missing a photo or a bio. See `isDeliveryRoster`.
   */
  deliveryRosterOnly?: boolean
  /** Cap the grid at this many cards, most senior first. Omit to show all. */
  limit?: number
  /** Link rendered under the grid, e.g. through to the full team page. */
  footerLink?: { label: string; href: string }
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

/**
 * Roles that belong on a region page's shortened roster: the people who lead
 * the business or deliver the implementation.
 *
 * Kept — founder/CEO, directors, regional and delivery managers, implementation
 * leads and managers, principal consultants, and implementation consultants at
 * every level.
 *
 * Dropped — support functions that do not scope or deliver an engagement
 * (content, SEO, web/AI engineering, pre-sales engineering) and vague or empty
 * titles. Those people still appear on /fruition-team, which the footer link
 * under the grid points at.
 */
function isDeliveryRoster(member: TeamMember): boolean {
  const role = (member.role ?? "").toLowerCase().trim()
  if (!role) return false

  // Non-delivery specialists are excluded even when their title says "manager"
  // or "lead" — checked first so "Sales Engineer & Project Manager" is dropped.
  if (/\b(content|seo|marketing|design|web developer|ai engineer|sales engineer)\b/.test(role)) {
    return false
  }

  const isLeadership =
    /\b(founder|ceo|chief|director|head of|vp)\b/.test(role) ||
    /\b(lead|manager|principal)\b/.test(role)

  const isImplementationConsultant =
    role.includes("consultant") && !role.startsWith("associate")

  return isLeadership || isImplementationConsultant
}

/** A card with no photo or no bio renders as an empty shell — drop it. */
function hasCardContent(member: TeamMember): boolean {
  const hasPhoto = Boolean(member.photo?.asset?._ref || member.photoUrl)
  return hasPhoto && Boolean(member.bio?.trim())
}

export default function TeamGridSection({
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
  members,
  region,
  regionPageSlug,
  deliveryRosterOnly = false,
  limit,
  footerLink,
}: Props) {
  // A `region` means this is a regional roster, so the per-page pin applies.
  // Enforced here, not at the call site, so EVERY regional grid is gated —
  // including one added later by a page that doesn't use RegionPageTemplate.
  const visible = region ? filterTeamForRegionPage(members, regionPageSlug) : members
  const inRegion = region
    ? visible.filter((m) => Array.isArray(m.regions) && m.regions.includes(region))
    : visible
  const filtered = deliveryRosterOnly
    ? inRegion.filter((m) => isDeliveryRoster(m) && hasCardContent(m))
    : inRegion
  if (filtered.length === 0) return null
  const sorted = [...filtered].sort((a, b) => {
    if (a.name === "Josh Jebathilak") return -1
    if (b.name === "Josh Jebathilak") return 1
    if (a.name === "Edward Zehua Zhang") return 1
    if (b.name === "Edward Zehua Zhang") return -1
    return roleRank(a.role) - roleRank(b.role) || a.name.localeCompare(b.name)
  })
  // Sorted most senior first, so a cap keeps leadership and trims the tail.
  const ordered = limit ? sorted.slice(0, limit) : sorted
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

        <div className="grid grid-cols-2 gap-3 md:gap-7 lg:grid-cols-3">
          {ordered.map((m) => {
            const photo = safeImageUrl(m.photo) || m.photoUrl
            return (
              <article
                key={m._id}
                className="bg-surface-raised rounded-card border border-ui overflow-hidden flex flex-col shadow-whisper dark:shadow-none"
              >
                <div className="flex aspect-square items-center justify-center bg-brand-soft">
                  {photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={photo} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[40px] md:text-[80px]">{m.emoji || "🍎"}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-6">
                  {m.role && (
                    <p className="text-[11px] font-semibold tracking-[0.04em] break-words text-brand uppercase md:text-[13px]">
                      {m.role}
                    </p>
                  )}
                  <h3 className="mt-2 text-[16px] leading-[21px] font-bold break-words text-body md:text-[22px] md:leading-[28px]">
                    {m.name} {m.emoji && <span>{m.emoji}</span>}
                  </h3>
                  {m.bio && (
                    <p className="mt-3 flex-1 text-[13px] leading-[20px] text-muted md:mt-3.5 md:text-[14px] md:leading-[22px]">{m.bio}</p>
                  )}
                  {m.linkedinUrl && (
                    <Link
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-semibold text-brand"
                    >
                      LinkedIn ↗
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {footerLink && (
          <div className="flex justify-center" style={{ marginTop: 40 }}>
            <Link
              href={footerLink.href}
              className="inline-flex items-center font-semibold"
              style={{ color: "#8015e8", fontSize: 15, gap: 8 }}
            >
              {footerLink.label} <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
