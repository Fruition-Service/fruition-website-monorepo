import type { LeadRegion } from "@/lib/leadNotify"

/**
 * Team photos for the Google Ads landing pages.
 *
 * From the 28 Oct 2025 website call (monday 2893036733): the ad landing pages
 * had gone live without the consultants section that the rest of the site shows,
 * so paid traffic never saw a real face before booking. 36 of the 48 ad pages
 * carried a hand-written `.team` section; the 11 AU industry pages built from
 * the later template, plus /au/ai-implementation-governance-consultants, did not.
 *
 * This module is the single source for that section. `withLandingPageLayout`
 * appends it to any ad page that has no team block of its own, so a new region
 * or a new page inherits it instead of repeating the markup. Pages that already
 * carry a curated team section keep it untouched: their copy differs per region
 * and is not ours to rewrite.
 *
 * Only real Fruition people, and only photos already published on this site's
 * Sanity CDN (the same asset URLs the partner pages use). No stock imagery.
 */

export interface LandingTeamMember {
  name: string
  role: string
  bio: string
  /** Sanity CDN URL, 560x560 crop, as used by the existing team sections. */
  photo: string
}

const PHOTOS = {
  josh: "https://cdn.sanity.io/images/bt6nb58h/production/811213d278aabf0686ff32841b559dec63cce794-1584x1246.jpg?rect=169,0,1246,1246&w=560&h=560&fit=crop",
  nikki:
    "https://cdn.sanity.io/images/bt6nb58h/production/800645656b19c9368a1fcc57c73d2f7956e9e826-593x593.jpg?w=560&h=560&fit=crop",
  suzzane:
    "https://cdn.sanity.io/images/bt6nb58h/production/56b7495c43a5904dc35ac1955f21b6b6461ee780-1000x1000.jpg?w=560&h=560&fit=crop",
  kevin:
    "https://cdn.sanity.io/images/bt6nb58h/production/0b7cac4a6d1e09efde35a473e3e6bee65f5d91d2-800x800.jpg?w=560&h=560&fit=crop",
  alex: "https://cdn.sanity.io/images/bt6nb58h/production/634ee0c5c7d9e2c0d18d21d8a387822961233fed-512x512.png?w=560&h=560&fit=crop",
  nevena:
    "https://cdn.sanity.io/images/bt6nb58h/production/ff248988d44e2d927a796f035b39f8bc5fe7b3f7-512x512.jpg?w=560&h=560&fit=crop",
  zach: "https://cdn.sanity.io/images/bt6nb58h/production/cf374b7d32b3925ddec53b799e10e0d0cc759207-800x800.jpg?w=560&h=560&fit=crop",
  nikhil:
    "https://cdn.sanity.io/images/bt6nb58h/production/194c9ab129a70bab635384976fc43ecc0661b587-500x500.jpg?w=560&h=560&fit=crop",
  valeria:
    "https://cdn.sanity.io/images/bt6nb58h/production/4179badfb046d5720f83fc8ed82e088cde8578bc-400x400.jpg?w=560&h=560&fit=crop",
} as const

const JOSH: LandingTeamMember = {
  name: "Josh Jebathilak",
  role: "Founder &amp; Managing Director",
  bio: "Ex-monday.com, personally oversaw system builds for hundreds of organisations before founding Fruition.",
  photo: PHOTOS.josh,
}

const NIKHIL: LandingTeamMember = {
  name: "Nikhil Tiwari",
  role: "Sales &amp; Implementation Lead",
  bio: "Certified monday.com and Make consultant with a machine learning and GenAI background.",
  photo: PHOTOS.nikhil,
}

const AU: LandingTeamMember[] = [
  JOSH,
  {
    name: "Nikki Glucksman",
    role: "Principal Consultant",
    bio: "UX-driven product strategist translating business requirements into streamlined workflows.",
    photo: PHOTOS.nikki,
  },
  {
    name: "Suzzane Castro",
    role: "Regional Delivery Manager",
    bio: "Business automation specialist connecting monday.com with Xero, PandaDoc and Slack.",
    photo: PHOTOS.suzzane,
  },
]

const UK: LandingTeamMember[] = [
  {
    name: "Kevin Zhao",
    role: "Director, EMEA",
    bio: "Ex-monday.com, leading UK delivery and best practice across hundreds of builds.",
    photo: PHOTOS.kevin,
  },
  {
    name: "Alex Bordei",
    role: "Implementation Manager",
    bio: "Workflow design, process automation and change management.",
    photo: PHOTOS.alex,
  },
  {
    name: "Nevena Gravin",
    role: "Implementation Lead",
    bio: "CRM, work management and ticketing system architecture.",
    photo: PHOTOS.nevena,
  },
]

const US: LandingTeamMember[] = [
  {
    name: "Zach Weller",
    role: "Director, North America",
    bio: "Leads US delivery from New York, hands-on through scoping, build and training.",
    photo: PHOTOS.zach,
  },
  NIKHIL,
  {
    name: "Valeria Marin",
    role: "Implementation Consultant",
    bio: "Optimises business processes and ensures seamless project transitions for US clients.",
    photo: PHOTOS.valeria,
  },
]

const SEA: LandingTeamMember[] = [
  NIKHIL,
  {
    name: "Suzzane Castro",
    role: "Delivery Consultant",
    bio: "Business automation specialist connecting monday.com with finance, document and messaging tools.",
    photo: PHOTOS.suzzane,
  },
  {
    name: "Josh Jebathilak",
    role: "Founder &amp; Managing Director",
    bio: "Former monday.com sales leader who founded Fruition. Oversees every regional rollout.",
    photo: PHOTOS.josh,
  },
]

const TEAM_BY_REGION: Record<LeadRegion, LandingTeamMember[]> = {
  APAC: AU,
  UK,
  NA: US,
  SEA,
  // No India ad page yet. The Asia bench is the right bench if one is added.
  IND: SEA,
}

/** The roster shown on an ad page for `region`. */
export function landingTeam(region?: LeadRegion): LandingTeamMember[] {
  return (region && TEAM_BY_REGION[region]) || AU
}

/**
 * True when the page already carries a team section: the conversion template's
 * `.team`/`.member` cards, the consulting template's `.tm` cards, or a block we
 * injected on an earlier pass (which keeps the layout idempotent).
 */
export function hasTeamSection(html: string): boolean {
  return /\bclass="(?:team|tm|lp-team)\b/.test(html)
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

function card(member: LandingTeamMember): string {
  const alt = `${member.name}, ${member.role.replace(/&amp;/g, "and")} at Fruition`
  return `<article class="lp-team-card"><img src="${member.photo}" alt="${escapeAttr(alt)}" width="88" height="88" loading="lazy" decoding="async"><h3>${member.name}</h3><div class="lp-team-role">${member.role}</div><p>${member.bio}</p></article>`
}

/**
 * The consultants band: three real headshots, same card language as the rest of
 * the landing page theme, on the tinted surface so the white cards read.
 */
export function renderTeamSection(region?: LeadRegion): string {
  const members = landingTeam(region)
  return `<section class="lp-team" id="team">
<div class="wrap">
<p class="lp-team-k">Your consultants</p>
<h2>Work directly with a certified monday.com partner consultant</h2>
<p class="lp-team-lede">Engagements are scoped and delivered personally by the consultant who does the build, not handed to an offshore bench.</p>
<div class="lp-team-grid">
${members.map(card).join("\n")}
</div>
</div>
</section>`
}
