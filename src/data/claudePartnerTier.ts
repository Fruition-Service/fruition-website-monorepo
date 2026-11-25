// Fruition's tier in Anthropic's Claude Partner Network (Services Track).
//
// Fruition is a Certified Services Partner (Nov 2026) and expects Select soon.
// Every hard-coded Claude badge and tier label on the site reads from here, so
// moving tier is a one-line change: set CLAUDE_PARTNER_TIER below. Both tiers'
// artwork stays in public/, so switching back needs no new files.
//
// Content in Sanity (the partner-claude badge and three labels on Version C
// pages) and the default share image are switched separately; see
// scripts/claude-partner-tier/README.md for the full checklist.

export type ClaudePartnerTier = "certified" | "select"

export const CLAUDE_PARTNER_TIER: ClaudePartnerTier = "certified"

interface BadgeArt {
  src: string
  width: number
  height: number
}

interface TierAssets {
  /** e.g. "Certified Services Partner" */
  label: string
  /** Alt text for the badge, the badge's own wording. */
  alt: string
  /** Hero badge (src/data/partnerBadges.ts), exported at 3x. */
  badge: BadgeArt
  /** Homepage and contact page accreditation rows. */
  home: BadgeArt
}

export const CLAUDE_TIERS: Record<ClaudePartnerTier, TierAssets> = {
  certified: {
    label: "Certified Services Partner",
    alt: "Claude Partner Network Certified Services Partner",
    badge: { src: "/images/partner-badges/claude-certified.webp", width: 416, height: 132 },
    home: { src: "/images/home/partner-claude-certified.png", width: 253, height: 80 },
  },
  select: {
    label: "Select Services Partner",
    alt: "Claude Partner Network Select Services Partner",
    badge: { src: "/images/partner-badges/claude-select.webp", width: 416, height: 132 },
    home: { src: "/images/home/partner-claude-select.png", width: 253, height: 80 },
  },
}

export const CLAUDE_PARTNER = CLAUDE_TIERS[CLAUDE_PARTNER_TIER]
