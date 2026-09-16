/**
 * Static copy for the 2026 home page, transcribed from the Claude Design
 * source (`Fruition Home.dc.html`). Dynamic content — client logos,
 * testimonials, office phone numbers and blog posts — comes from Sanity and is
 * passed into the sections as props instead of living here.
 */

export interface ServiceCard {
  icon: "layers" | "zap" | "sparkles" | "users" | "file" | "crosshair"
  title: string
  body: string
  href: string
}

export const SERVICES: ServiceCard[] = [
  {
    icon: "layers",
    title: "Platform implementation",
    body: "monday.com, Atlassian and HubSpot: discovery, solution design, build, data migration and go-live.",
    href: "/monday-implementation-consultants",
  },
  {
    icon: "zap",
    title: "Integrations & automation",
    body: "Native integrations, API and middleware on n8n, and migrations off any current tools or spreadsheets.",
    href: "/integrations",
  },
  {
    icon: "sparkles",
    title: "AI advisory & implementation",
    body: "Readiness, adoption frameworks and agent builds on Claude, OpenAI and Copilot, with platform-native AI.",
    href: "/ai-consulting",
  },
  {
    icon: "users",
    title: "Change management & adoption",
    body: "Stakeholder engagement, training, comms and measurement: the reason implementations stick.",
    href: "/monday-training",
  },
  {
    icon: "file",
    title: "Partner & licensing advisory",
    body: "Licensing, plan and procurement guidance, plus managed services as the long-term partner of record.",
    href: "/pricing",
  },
  {
    icon: "crosshair",
    title: "FDE & managed services",
    body: "Full deployment experience, ongoing optimisation, and managed support that keeps your platforms running long after go-live.",
    href: "/implementation-packages",
  },
]

export interface StatCard {
  icon: "check" | "globe" | "clock" | "trophy"
  value: string
  label: string
}

export const STATS: StatCard[] = [
  { icon: "check", value: "900+", label: "implementations delivered" },
  { icon: "globe", value: "6", label: "markets · 3 entities" },
  { icon: "clock", value: "<24m", label: "Authorised → Platinum" },
  { icon: "trophy", value: "2026", label: "Rising Star winner" },
]

/**
 * The four delivery phases. `from`/`to` are week numbers on the 12-week
 * timeline and drive both the gantt bars and the step highlight.
 */
export interface MethodStep {
  num: string
  title: string
  desc: string
  from: number
  to: number
}

export const METHOD_STEPS: MethodStep[] = [
  { num: "01", title: "Discover", desc: "Map how work should run", from: 1, to: 2 },
  { num: "02", title: "Design", desc: "Blueprint process, data, integrations", from: 3, to: 5 },
  { num: "03", title: "Deliver", desc: "Build and migrate in sprints", from: 6, to: 9 },
  { num: "04", title: "Adopt", desc: "Change management and training", from: 10, to: 12 },
]

export interface IndustryCard {
  num: string
  title: string
  tagline: string
  chips: string[]
}

export const INDUSTRIES: IndustryCard[] = [
  {
    num: "01",
    title: "Industrial",
    tagline: "Heavy process, heavy coordination.",
    chips: ["Manufacturing", "Construction", "Engineering", "Infrastructure"],
  },
  {
    num: "02",
    title: "Public sector",
    tagline: "Accountable, auditable delivery.",
    chips: ["Local government", "State government", "Federal agencies", "NGOs"],
  },
  {
    num: "03",
    title: "FSI",
    tagline: "Regulated work, zero slippage.",
    chips: ["Banks", "Insurance", "Accounting", "Investments & capital"],
  },
  {
    num: "04",
    title: "Retail",
    tagline: "High volume, fast cycles.",
    chips: ["FMCG", "Franchises", "Ecommerce"],
  },
]

/** Logos that orbit the hero hub, in ring order. */
export const ORBIT_LOGOS = [
  { slug: "make", label: "Make" },
  { slug: "zapier", label: "Zapier" },
  { slug: "slack", label: "Slack" },
  { slug: "salesforce", label: "Salesforce" },
  { slug: "jira", label: "Jira" },
  { slug: "confluence", label: "Confluence" },
  { slug: "xero", label: "Xero" },
  { slug: "powerbi", label: "Power BI" },
  { slug: "googlecloud", label: "Google Cloud" },
  { slug: "asana", label: "Asana" },
  { slug: "trello", label: "Trello" },
] as const

/**
 * Platform pills in the hero network, positioned on the 560×480 SVG canvas.
 * `x`/`y` are the pill centres; `px`/`py` the connector endpoint on the hub.
 */
export const HERO_NODES = [
  { slug: "monday", label: "monday.com", x: 280, y: 56, path: "M280 74 L280 214" },
  { slug: "atlassian", label: "Atlassian", x: 114, y: 130, path: "M128 138 L242 210" },
  { slug: "hubspot", label: "HubSpot", x: 446, y: 130, path: "M432 138 L318 210" },
  { slug: "claude", label: "Claude", x: 92, y: 306, path: "M104 306 L230 256" },
  { slug: "openai", label: "OpenAI", x: 468, y: 306, path: "M456 306 L330 256" },
  { slug: "microsoftcopilot", label: "Copilot", x: 176, y: 418, path: "M192 418 L258 280" },
  { slug: "n8n", label: "n8n", x: 380, y: 418, path: "M368 418 L302 280" },
] as const

/** Tiles on the isometric AI-capability board. */
export interface AiTile {
  label: string
  sub: string
  /** `core` = the AI layer itself, `live` = AI-enabled today, `next` = roadmap. */
  tone: "core" | "live" | "next" | "liveAlt"
  col: number
  row: number
}

export const AI_TILES: AiTile[] = [
  { label: "Strategy", sub: "roadmap", tone: "next", col: 0, row: 0 },
  { label: "Marketing", sub: "campaigns", tone: "next", col: 1, row: 0 },
  { label: "Revenue", sub: "monday CRM", tone: "live", col: 2, row: 0 },
  { label: "Projects", sub: "delivery", tone: "next", col: 3, row: 0 },
  { label: "Finance", sub: "approvals", tone: "next", col: 0, row: 1 },
  { label: "AI layer", sub: "", tone: "core", col: 1, row: 1 },
  { label: "Operations", sub: "workflows", tone: "live", col: 2, row: 1 },
  { label: "Service desk", sub: "Jira & JSM", tone: "next", col: 3, row: 1 },
  { label: "Data", sub: "one model", tone: "next", col: 0, row: 2 },
  { label: "Automations", sub: "n8n", tone: "liveAlt", col: 1, row: 2 },
  { label: "Integration", sub: "HubSpot", tone: "next", col: 2, row: 2 },
  { label: "Adoption", sub: "training", tone: "next", col: 3, row: 2 },
]

export interface FaqEntry {
  question: string
  answer: string
}

/** Answers stay under ~50 words and self-contained, mirrored into FAQPage JSON-LD. */
export const FAQS: FaqEntry[] = [
  {
    question: "What does Fruition Services do?",
    answer:
      "Fruition Services is a technology consultancy that implements and integrates monday.com, Atlassian and HubSpot, and delivers AI advisory and change management. Headquartered in Sydney, Fruition works with mid-market and enterprise teams across Australia, the UK, the US, Singapore, India and the Philippines.",
  },
  {
    question: "Is Fruition an official monday.com partner?",
    answer:
      "Yes. Fruition is a monday.com Platinum Partner and won the Rising Star Award at the 2026 monday.com Partner Summit. Our founder spent six years at monday.com before starting Fruition, so we know the platform from the inside.",
  },
  {
    question: "Which platforms and AI tools do you work with?",
    answer:
      "monday.com, Atlassian (Jira, Jira Service Management, Confluence) and HubSpot, plus AI implementation across Anthropic Claude, OpenAI and Microsoft Copilot, with automation on n8n and native platform integrations.",
  },
  {
    question: "Where does Fruition operate?",
    answer:
      "Fruition is headquartered at 64 York Street, Sydney, with entities in Australia, the US and the UK, and consultants delivering across Australia, the UK, the US, Singapore, India and the Philippines: coverage in your time zone.",
  },
  {
    question: "How much does a monday.com implementation cost?",
    answer:
      "It depends on scope. Focused implementations start from a fixed price; larger programs are phased with a fixed scope per phase. Book a discovery call and you'll have a tailored estimate within 48 hours.",
  },
  {
    question: "Can you migrate us from another tool?",
    answer:
      "Yes. We regularly migrate teams from Smartsheet, Asana, Trello, Wrike, SimPro and spreadsheets (including data, automations and integrations) with training and change management so the new platform actually gets adopted.",
  },
  {
    question: "How is Fruition different from other partners?",
    answer:
      "Process before platform: we design how your business should run first, then configure the tool to match. Combined with insider platform experience and in-house AI capability, implementations land faster and stick.",
  },
]
