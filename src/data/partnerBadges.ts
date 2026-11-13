// Partner badges shown at the top of page heroes, chosen by route so each
// page carries the badge for the service it sells (a HubSpot page shows the
// HubSpot badge, not monday + Make). Artwork is the Figma set in
// "Fruition Landing - workspace" (nodes 748:3 to 748:12), exported at 3x with
// the dark canvas corners made transparent, in public/images/partner-badges/.
//
// A page's own `heroPartnerBadges` in Sanity still wins over this map.

export type PartnerBadgeKey =
  | "monday"
  | "make"
  | "hubspot"
  | "atlassian"
  | "clickup"
  | "aws"
  | "googleCloud"
  | "openai"
  | "elevenlabs"
  | "claude"

export interface ServicePartnerBadge {
  key: PartnerBadgeKey
  src: string
  alt: string
  width: number
  height: number
  /** Square badges (HubSpot, AWS, ClickUp) render taller to match the wide ones' weight. */
  shape: "wide" | "square"
}

export const PARTNER_BADGES: Record<PartnerBadgeKey, ServicePartnerBadge> = {
  monday: { key: "monday", src: "/images/partner-badges/monday.webp", alt: "monday.com Platinum Partner", width: 387, height: 132, shape: "wide" },
  make: { key: "make", src: "/images/partner-badges/make.webp", alt: "Make Partner", width: 514, height: 132, shape: "wide" },
  hubspot: { key: "hubspot", src: "/images/partner-badges/hubspot.webp", alt: "HubSpot Solutions Partner", width: 217, height: 216, shape: "square" },
  atlassian: { key: "atlassian", src: "/images/partner-badges/atlassian.webp", alt: "Atlassian Platinum Solution Partner", width: 419, height: 132, shape: "wide" },
  clickup: { key: "clickup", src: "/images/partner-badges/clickup.webp", alt: "ClickUp Registered Partner 2026", width: 217, height: 216, shape: "square" },
  aws: { key: "aws", src: "/images/partner-badges/aws.webp", alt: "AWS Partner", width: 215, height: 216, shape: "square" },
  googleCloud: { key: "googleCloud", src: "/images/partner-badges/google-cloud.webp", alt: "Google Cloud Partner", width: 433, height: 132, shape: "wide" },
  openai: { key: "openai", src: "/images/partner-badges/openai.webp", alt: "OpenAI Select Partner", width: 283, height: 132, shape: "wide" },
  elevenlabs: { key: "elevenlabs", src: "/images/partner-badges/elevenlabs.svg", alt: "ElevenLabs Eleven Agents Certified Partner", width: 216, height: 214, shape: "square" },
  claude: { key: "claude", src: "/images/partner-badges/claude.webp", alt: "Claude Partner Network Select Services Partner", width: 416, height: 132, shape: "wide" },
}

const AI_BADGES: PartnerBadgeKey[] = ["claude", "openai", "elevenlabs", "googleCloud"]

/**
 * Route prefix to badges, most specific first. A prefix matches the path
 * itself and anything under it. Routes not listed get DEFAULT_BADGES.
 */
const ROUTE_BADGES: Array<[prefix: string, badges: PartnerBadgeKey[]]> = [
  // The hub absorbed the integration and migration pages (monday 2900266080);
  // the design keeps its hero to the HubSpot badge alone.
  ["/hubspot-consulting", ["hubspot"]],
  ["/partnerships/certified-hubspot-partner", ["hubspot"]],
  // The hub absorbed the Jira to monday.com migration page (monday 2899845035),
  // so it carries that page's dual-platform pairing.
  ["/atlassian-consulting", ["atlassian", "monday"]],
  ["/partnerships/certified-atlassian-partner", ["atlassian"]],
  ["/partnerships/certified-clickup-partner", ["clickup"]],
  ["/partnerships/make-partners", ["make"]],
  ["/partnerships/aws-partner", ["aws"]],
  ["/partnerships/google-cloud-partner", ["googleCloud"]],
  ["/partnerships/google-gemini-vertex-ai-partner", ["googleCloud"]],
  ["/partnerships/openai-chatgpt-partner", ["openai"]],
  ["/partnerships/anthropic-claude-partner", ["claude"]],
  ["/partnerships/elevenlabs-partner", ["elevenlabs"]],
  ["/partnerships/monday-consulting-partner", ["monday"]],
  // Other partner pages (Aircall, Hootsuite, guidde, n8n, ...) have no badge
  // in the set yet, so they show none rather than an unrelated monday badge.
  ["/partnerships", []],
  ["/ai-strategy-and-execution", AI_BADGES],
  ["/ai-consulting", AI_BADGES],
]

/** monday.com work (industry, solution, training, team pages) is the default. */
const DEFAULT_BADGES: PartnerBadgeKey[] = ["monday"]

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/**
 * The partner badges for a route. With `explicitOnly`, routes that fall
 * through to the default get none: for templates that never showed badges
 * before and should only gain them on a service's own pages.
 */
export function partnerBadgesForPath(
  pathname: string | null | undefined,
  { explicitOnly = false }: { explicitOnly?: boolean } = {},
): ServicePartnerBadge[] {
  const path = (pathname || "/").replace(/\/+$/, "") || "/"
  const hit = ROUTE_BADGES.find(([prefix]) => matches(path, prefix))
  const keys = hit ? hit[1] : explicitOnly ? [] : DEFAULT_BADGES
  return keys.map((k) => PARTNER_BADGES[k])
}
