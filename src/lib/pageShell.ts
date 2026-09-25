/**
 * Page shells — the centred content containers marketing pages lay their
 * sections out in.
 *
 * The breadcrumb bar is rendered once by `SiteFrame`, above `<main>`, so it sits
 * *outside* the page it belongs to and cannot inherit that page's container.
 * Hardcoding one width made the trail hang 26–66px away from the page copy on
 * every page whose shell is not the 1148px practice-page container.
 *
 * So the mapping lives here: `pageShell(pathname)` returns the Tailwind classes
 * for the container that page opens with, and `Breadcrumbs` renders the trail in
 * exactly that container. Padding is part of the shell — matching the max-width
 * alone still misaligns wherever the gutter differs (the banner hero runs
 * `px-4 md:px-16 lg:px-24`).
 *
 * Adding a page: if its hero container is not the 1148px default, add it below.
 * Changing a shared template's container: update the shell here too —
 * `pageShell.test.ts` asserts the two stay in step for the shared templates.
 */

/**
 * Every container width in use. Values are copied verbatim from the page's own
 * hero container so the content boxes line up at every breakpoint. A container
 * that carries no padding of its own (it sits inside an already-padded section)
 * is written here as `max-w-[width + 2 × gutter] px-4`, which reproduces the
 * same content box while keeping a gutter on mobile.
 */
export const PAGE_SHELLS = {
  /** PracticePageTemplate — AI, Atlassian, HubSpot, integrations, pricing. */
  standard: "max-w-[1148px] px-4",
  /** RegionHero and the pages rebuilt on it. */
  wide: "max-w-[1200px] px-4",
  /** Same width, roomier gutter (people-and-proof pages). */
  wideRoomy: "max-w-[1200px] px-6",
  /** sections/HeroBanner — industry, solution and platform-partner pages. */
  banner: "max-w-[1588px] px-4 md:px-16 lg:px-24",
  /** AiPartnerTemplate's `.ap-wrap` (20px gutter under md, 32px above). */
  aiPartner: "max-w-[1240px] px-5 md:px-8",
  /** About us — 1240px shell with the standard responsive gutter. */
  about: "max-w-[1240px] px-4 md:px-6 lg:px-8",
  /** AI readiness blueprint. */
  blueprint: "max-w-[1280px] px-4 md:px-8 lg:px-10",
  /** Blog index, category and author listings. */
  blog: "max-w-[1280px] px-4",
  /** UniversalPageTemplate — Sanity-driven partnership pages. */
  universal: "max-w-[1042px] px-4",
  /** Solutions catalog. */
  catalog: "max-w-6xl px-5 md:px-7",
  /** Solutions index — legacy centred HeroSection, so the trail follows the
      solution grid below it (the page's only full-width container). */
  solutionsIndex: "max-w-6xl px-4",
  /** Meet-the-team. */
  team: "max-w-[1100px] px-6",
  /** Contact — 1100px shell inside a px-4 section. */
  contact: "max-w-[1132px] px-4",
  /** FAQs. */
  faq: "max-w-4xl px-4",
  /** Policy prose (privacy, terms). */
  prose: "max-w-3xl px-4",
  /** Thank-you confirmation. */
  narrow: "max-w-[720px] px-4",
} as const

export type PageShell = keyof typeof PAGE_SHELLS

/** Pages whose shell is not the default. Longest match wins over PREFIXES. */
const EXACT: Record<string, PageShell> = {
  "/about-us": "about",
  "/ai-capability-assessment": "aiPartner",
  "/ai-readiness-blueprint": "blueprint",
  "/ai-strategy-and-execution": "banner",
  "/careers": "wide",
  "/consulting-blog": "blog",
  "/contact-us": "contact",
  "/customer-testimonials": "wideRoomy",
  "/data-privacy": "prose",
  "/faqs": "faq",
  "/fruition-team": "team",
  "/industries": "standard",
  // The three messaging-channel pages open with sections/HeroBanner; the rest of
  // /integrations/ is PracticePageTemplate and keeps the default shell.
  "/integrations/line": "banner",
  "/integrations/viber": "banner",
  "/integrations/whatsapp": "banner",
  "/monday-consulting-solutions": "solutionsIndex",
  "/monday-consulting-solutions/catalog": "catalog",
  "/monday-consulting-solutions/monday-for-cabinetry-renovation": "banner",
  "/monday-consulting-solutions/monday-for-finance": "standard",
  "/monday-consulting-solutions/monday-for-hr": "banner",
  "/monday-consulting-solutions/monday-product-management": "wide",
  "/monday-consulting-solutions/monday-project-management": "banner",
  "/monday-consulting-solutions/monday-service": "wide",
  "/monday-consulting-solutions/solar-crm-solution": "banner",
  "/monday-crm-consulting": "banner",
  // Centred heroes with outsized gutters (`lg:px-[120px]`, `lg:px-[273px]`):
  // the trail follows the body sections rather than the hero's own inset.
  "/monday-implementation-consultants": "wide",
  "/monday-training": "wide",
  // AiPartnerTemplate routes. Everything else under /partnerships — the
  // hand-built HeroBanner pages and every Sanity-driven `[slug]` page, which
  // opens with the same banner hero — falls to the `banner` family below.
  "/partnerships/anthropic-claude-partner": "aiPartner",
  "/partnerships/aws-partner": "aiPartner",
  "/partnerships/clay-partner": "aiPartner",
  "/partnerships/elevenlabs-partner": "aiPartner",
  "/partnerships/google-cloud-partner": "aiPartner",
  "/partnerships/google-gemini-vertex-ai-partner": "aiPartner",
  "/partnerships/langgraph-partner": "aiPartner",
  "/partnerships/make-partners": "wide",
  "/partnerships/microsoft-azure-partner": "aiPartner",
  "/partnerships/microsoft-copilot-partner": "aiPartner",
  "/partnerships/openai-chatgpt-partner": "aiPartner",
  "/partnerships/openclaw-partner": "aiPartner",
  "/partnerships/supabase-partner": "aiPartner",
  "/partnerships/vapi-partner": "aiPartner",
  "/terms-and-conditions": "prose",
  "/thank-you": "narrow",
}

/** Route families. Checked longest-prefix-first, after EXACT. */
const PREFIXES: Array<[string, PageShell]> = [
  ["/author/", "blog"],
  ["/consulting-blog/", "blog"],
  ["/industries/", "banner"],
  ["/monday-for-", "banner"],
  ["/monday-partner-", "wide"],
  // UniversalPageTemplate (the Sanity-driven `[slug]` route) opens with the
  // same HeroBanner as the hand-built partnership pages, so `banner` is the
  // safe default here — a new Sanity partnership page lands on it unlisted.
  ["/partnerships/", "banner"],
]

/** Shell key for a pathname — `standard` when the route is not registered. */
export function pageShellKey(pathname: string): PageShell {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  const exact = EXACT[path]
  if (exact) return exact

  let best: PageShell | null = null
  let bestLength = -1
  for (const [prefix, shell] of PREFIXES) {
    if (path.startsWith(prefix) && prefix.length > bestLength) {
      best = shell
      bestLength = prefix.length
    }
  }
  return best ?? "standard"
}

/** Tailwind container classes for a pathname (no `mx-auto` — callers add it). */
export function pageShell(pathname: string): string {
  return PAGE_SHELLS[pageShellKey(pathname)]
}
