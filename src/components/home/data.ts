import type { HomeCopySlot } from "./copy"

/**
 * Structure for the 2026 home page: icons, links, ordering and layout numbers.
 * The wording itself lives in `./copy.ts` (editable with the inline editor);
 * every `*Slot` field below names the copy slot a component reads its text
 * from. Dynamic content (client logos, testimonials, office phone numbers and
 * blog posts) comes from Sanity and is passed into the sections as props.
 */

export interface ServiceCard {
  icon: "layers" | "zap" | "sparkles" | "users" | "file" | "crosshair"
  titleSlot: HomeCopySlot
  bodySlot: HomeCopySlot
  href: string
}

export const SERVICES: ServiceCard[] = [
  { icon: "layers", titleSlot: "services-1-title", bodySlot: "services-1-body", href: "/monday-implementation-consultants" },
  { icon: "zap", titleSlot: "services-2-title", bodySlot: "services-2-body", href: "/integrations" },
  { icon: "sparkles", titleSlot: "services-3-title", bodySlot: "services-3-body", href: "/ai-consulting" },
  { icon: "users", titleSlot: "services-4-title", bodySlot: "services-4-body", href: "/training" },
  { icon: "file", titleSlot: "services-5-title", bodySlot: "services-5-body", href: "/licence-procurement" },
  { icon: "crosshair", titleSlot: "services-6-title", bodySlot: "services-6-body", href: "/implementation-packages" },
]

export interface StatCard {
  icon: "check" | "globe" | "clock" | "trophy"
  valueSlot: HomeCopySlot
  labelSlot: HomeCopySlot
}

export const STATS: StatCard[] = [
  { icon: "check", valueSlot: "stats-1-value", labelSlot: "stats-1-label" },
  { icon: "globe", valueSlot: "stats-2-value", labelSlot: "stats-2-label" },
  { icon: "clock", valueSlot: "stats-3-value", labelSlot: "stats-3-label" },
  { icon: "trophy", valueSlot: "stats-4-value", labelSlot: "stats-4-label" },
]

/**
 * The four delivery phases. `from`/`to` are week numbers on the 12-week
 * timeline and drive both the gantt bars and the step highlight.
 */
export interface MethodStep {
  num: string
  titleSlot: HomeCopySlot
  descSlot: HomeCopySlot
  from: number
  to: number
}

export const METHOD_STEPS: MethodStep[] = [
  { num: "01", titleSlot: "method-1-title", descSlot: "method-1-desc", from: 1, to: 2 },
  { num: "02", titleSlot: "method-2-title", descSlot: "method-2-desc", from: 3, to: 5 },
  { num: "03", titleSlot: "method-3-title", descSlot: "method-3-desc", from: 6, to: 9 },
  { num: "04", titleSlot: "method-4-title", descSlot: "method-4-desc", from: 10, to: 12 },
]

export interface IndustryCard {
  num: string
  titleSlot: HomeCopySlot
  taglineSlot: HomeCopySlot
  chipSlots: HomeCopySlot[]
}

export const INDUSTRIES: IndustryCard[] = [
  {
    num: "01",
    titleSlot: "industries-1-title",
    taglineSlot: "industries-1-tagline",
    chipSlots: ["industries-1-chip-1", "industries-1-chip-2", "industries-1-chip-3", "industries-1-chip-4"],
  },
  {
    num: "02",
    titleSlot: "industries-2-title",
    taglineSlot: "industries-2-tagline",
    chipSlots: ["industries-2-chip-1", "industries-2-chip-2", "industries-2-chip-3", "industries-2-chip-4"],
  },
  {
    num: "03",
    titleSlot: "industries-3-title",
    taglineSlot: "industries-3-tagline",
    chipSlots: ["industries-3-chip-1", "industries-3-chip-2", "industries-3-chip-3", "industries-3-chip-4"],
  },
  {
    num: "04",
    titleSlot: "industries-4-title",
    taglineSlot: "industries-4-tagline",
    chipSlots: ["industries-4-chip-1", "industries-4-chip-2", "industries-4-chip-3"],
  },
]

/** Logos that orbit the hero hub, in ring order. Decorative: the logos carry no text. */
export const ORBIT_LOGOS = [
  { slug: "make" },
  { slug: "zapier" },
  { slug: "slack" },
  { slug: "salesforce" },
  { slug: "jira" },
  { slug: "confluence" },
  { slug: "xero" },
  { slug: "powerbi" },
  { slug: "googlecloud" },
  { slug: "asana" },
  { slug: "trello" },
] as const

/**
 * Platform pills in the hero network, positioned on the 560×480 SVG canvas.
 * `x`/`y` are the pill centres; `path` is the connector endpoint on the hub.
 */
export const HERO_NODES = [
  { slug: "monday", labelSlot: "hero-node-monday", x: 280, y: 56, path: "M280 74 L280 214" },
  { slug: "atlassian", labelSlot: "hero-node-atlassian", x: 114, y: 130, path: "M128 138 L242 210" },
  { slug: "hubspot", labelSlot: "hero-node-hubspot", x: 446, y: 130, path: "M432 138 L318 210" },
  { slug: "claude", labelSlot: "hero-node-claude", x: 92, y: 306, path: "M104 306 L230 256" },
  { slug: "openai", labelSlot: "hero-node-openai", x: 468, y: 306, path: "M456 306 L330 256" },
  { slug: "microsoftcopilot", labelSlot: "hero-node-copilot", x: 176, y: 418, path: "M192 418 L258 280" },
  { slug: "n8n", labelSlot: "hero-node-n8n", x: 380, y: 418, path: "M368 418 L302 280" },
] as const satisfies readonly {
  slug: string
  labelSlot: HomeCopySlot
  x: number
  y: number
  path: string
}[]

/** Tiles on the isometric AI-capability board. */
export interface AiTile {
  labelSlot: HomeCopySlot
  /** The AI-layer core tile has no caption. */
  subSlot?: HomeCopySlot
  /** `core` = the AI layer itself, `live` = AI-enabled today, `next` = roadmap. */
  tone: "core" | "live" | "next" | "liveAlt"
  col: number
  row: number
}

export const AI_TILES: AiTile[] = [
  { labelSlot: "ai-tile-1-label", subSlot: "ai-tile-1-sub", tone: "next", col: 0, row: 0 },
  { labelSlot: "ai-tile-2-label", subSlot: "ai-tile-2-sub", tone: "next", col: 1, row: 0 },
  { labelSlot: "ai-tile-3-label", subSlot: "ai-tile-3-sub", tone: "live", col: 2, row: 0 },
  { labelSlot: "ai-tile-4-label", subSlot: "ai-tile-4-sub", tone: "next", col: 3, row: 0 },
  { labelSlot: "ai-tile-5-label", subSlot: "ai-tile-5-sub", tone: "next", col: 0, row: 1 },
  { labelSlot: "ai-tile-6-label", tone: "core", col: 1, row: 1 },
  { labelSlot: "ai-tile-7-label", subSlot: "ai-tile-7-sub", tone: "live", col: 2, row: 1 },
  { labelSlot: "ai-tile-8-label", subSlot: "ai-tile-8-sub", tone: "next", col: 3, row: 1 },
  { labelSlot: "ai-tile-9-label", subSlot: "ai-tile-9-sub", tone: "next", col: 0, row: 2 },
  { labelSlot: "ai-tile-10-label", subSlot: "ai-tile-10-sub", tone: "liveAlt", col: 1, row: 2 },
  { labelSlot: "ai-tile-11-label", subSlot: "ai-tile-11-sub", tone: "next", col: 2, row: 2 },
  { labelSlot: "ai-tile-12-label", subSlot: "ai-tile-12-sub", tone: "next", col: 3, row: 2 },
]

export interface FaqEntry {
  questionSlot: HomeCopySlot
  answerSlot: HomeCopySlot
}

/** Answers stay under ~50 words and self-contained, mirrored into FAQPage JSON-LD. */
export const FAQS: FaqEntry[] = [
  { questionSlot: "faq-1-question", answerSlot: "faq-1-answer" },
  { questionSlot: "faq-2-question", answerSlot: "faq-2-answer" },
  { questionSlot: "faq-3-question", answerSlot: "faq-3-answer" },
  { questionSlot: "faq-4-question", answerSlot: "faq-4-answer" },
  { questionSlot: "faq-5-question", answerSlot: "faq-5-answer" },
  { questionSlot: "faq-6-question", answerSlot: "faq-6-answer" },
  { questionSlot: "faq-7-question", answerSlot: "faq-7-answer" },
]
