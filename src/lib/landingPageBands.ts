import type { LeadRegion } from "@/lib/leadNotify"

/**
 * Page-specific copy for the bands every ad landing page shares: the dark
 * mid-page banner, the booking band heading, the purple closing band and the
 * footer's social row. `withLandingPageLayout` injects them at serve time, so
 * the 66 page documents keep their own copy and only this file holds the
 * per-page CTA wording.
 *
 * Copy is keyed by the page topic (the route folder name without its region),
 * and the region fills in the team and the hours. Keep every line page-specific:
 * no generic "Ready to talk?", and no em or en dashes (site writing rule).
 */

export type BandCopy = {
  /** Dark banner: heading (plain + accent), one line, button label. */
  audit: [string, string, string, string]
  /** Booking band: heading (plain + accent) and lead. `{team}` and `{hours}` are filled per region. */
  booking: [string, string, string]
  /** Purple closing band: heading (plain + accent), lead, button label. */
  closing: [string, string, string, string]
}

const REGION_TEAM: Record<LeadRegion, { team: string; hours: string }> = {
  APAC: { team: "our Sydney team", hours: "AEST/AEDT hours" },
  UK: { team: "our London team", hours: "GMT/BST hours" },
  NA: { team: "our New York team", hours: "Eastern to Pacific hours" },
  SEA: { team: "our Singapore team", hours: "SGT hours" },
  IND: { team: "our New Delhi team", hours: "IST hours" },
}

const MONDAY_PARTNER: BandCopy = {
  audit: ["Get monday.com right", "the first time.", "A free 30-minute system audit with a certified Platinum Partner consultant.", "Book a free system audit"],
  booking: ["Book a call with", "{team}.", "A frank read on scope, fit and cost from a certified Platinum Partner, in {hours}."],
  closing: ["Your monday.com rollout,", "scoped this week.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my fixed-fee quote"],
}

export const BAND_COPY: Record<string, BandCopy> = {
  "ai-business-consulting-services": {
    audit: ["Separate the AI hype from", "what will pay off.", "A free 30-minute session with a Fruition AI consultant.", "Book an AI session"],
    booking: ["Talk to an", "AI consultant.", "30 minutes with {team} to go through your ideas and leave with the use cases worth funding, in {hours}."],
    closing: ["Turn AI ideas into", "working systems.", "Send the form and an AI consultant replies within one business day with next steps.", "Start my AI plan"],
  },
  "ai-implementation-governance-consultants": {
    audit: ["Is your AI use", "audit-ready?", "A free 30-minute review of your AI policies, data and access.", "Review my AI governance"],
    booking: ["Book an", "AI governance review.", "30 minutes with {team} on how AI is used across your business and where controls should start."],
    closing: ["Put guardrails on AI", "before you scale it.", "Send the form and a consultant replies within one business day with a scoped plan.", "Scope my governance work"],
  },
  "atlassian-consulting": {
    audit: ["Is Jira", "slowing your teams down?", "A free 30-minute health check of your Jira and Confluence setup.", "Book a Jira health check"],
    booking: ["Talk to an", "Atlassian consultant.", "30 minutes with {team} on your Jira, JSM or Confluence setup, migration or rescue, in {hours}."],
    closing: ["Get Jira and Confluence", "working for your teams.", "Send the form and an Atlassian consultant replies within one business day with a fixed-fee quote.", "Get my Atlassian quote"],
  },
  "base44-consulting": {
    audit: ["Have an app idea", "stuck on the whiteboard?", "A free 30-minute session to scope what base44 can build for you.", "Scope my base44 app"],
    booking: ["Scope your", "base44 build.", "30 minutes with {team} to map the app, the data and the workflow it has to run."],
    closing: ["From idea to a working app,", "without the long build.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my base44 quote"],
  },
  "chatgpt-consulting": {
    audit: ["Move past", "ChatGPT experiments.", "A free 30-minute session to find the workflows worth automating first.", "Find my first automation"],
    booking: ["Scope your", "ChatGPT project.", "30 minutes with {team} to pick a use case and plan a secure rollout, in {hours}."],
    closing: ["Put ChatGPT to work on", "real business tasks.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my ChatGPT quote"],
  },
  "claude-consulting": {
    audit: ["Find where Claude", "earns its keep.", "A free 30-minute session to scope your first Claude deployment.", "Scope a Claude project"],
    booking: ["Scope your", "Claude deployment.", "30 minutes with {team} to pick a use case and plan an enterprise rollout, in {hours}."],
    closing: ["Ship something real", "with Claude.", "Send the form and a Claude certified consultant replies within one business day.", "Get my Claude quote"],
  },
  "hubspot-consulting": {
    audit: ["Is HubSpot", "living up to its price?", "A free 30-minute audit of your HubSpot portal and pipelines.", "Audit my HubSpot"],
    booking: ["Talk to a", "HubSpot consultant.", "30 minutes with {team} on your portal, pipelines and automation, with a frank read on what to fix first."],
    closing: ["Make HubSpot", "work harder.", "Send the form and a HubSpot consultant replies within one business day with a fixed-fee quote.", "Get my HubSpot quote"],
  },
  "lovable-consulting": {
    audit: ["Want your web app", "live in days?", "A free 30-minute session to scope what Lovable can ship for you.", "Scope my Lovable app"],
    booking: ["Scope your", "Lovable build.", "30 minutes with {team} to map the app, the integrations and a realistic launch date."],
    closing: ["Ship your web app", "in days, not months.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my Lovable quote"],
  },
  "monday-ai-integration": {
    audit: ["Find the work", "monday.com AI can take on.", "A free 30-minute session to map AI into your boards and automations.", "Map my AI workflows"],
    booking: ["Plan your", "monday.com AI rollout.", "30 minutes with {team} on monday AI, Vibe and the Claude and OpenAI connections that fit your boards."],
    closing: ["Put AI inside", "your monday.com boards.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my AI integration quote"],
  },
  "monday-consulting-services": {
    audit: ["Is monday.com", "working as hard as it could?", "A free 30-minute audit of your monday.com account.", "Audit my monday.com"],
    booking: ["Talk to a", "monday.com consultant.", "30 minutes with {team} for a frank read on scope, fit and cost, in {hours}."],
    closing: ["Build monday.com", "around how you work.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my monday.com quote"],
  },
  "monday-crm-consulting": {
    audit: ["Is your pipeline", "telling you the truth?", "A free 30-minute audit of your sales process and CRM.", "Audit my pipeline"],
    booking: ["Book a", "CRM consultation.", "30 minutes with {team} to map your pipeline live and plan a migration that keeps every record."],
    closing: ["A CRM your team", "will actually use.", "Send the form and a CRM consultant replies within one business day with a fixed-fee migration quote.", "Get my CRM quote"],
  },
  "monday-crm-migration": {
    audit: ["Planning a", "CRM migration?", "A free 30-minute review of your current CRM, fields and history.", "Review my migration"],
    booking: ["Scope your", "CRM migration.", "30 minutes with {team} to map objects, history and a cutover that never stops sales."],
    closing: ["Move CRMs", "without losing a deal.", "Send the form and a consultant replies within one business day with a fixed-fee migration quote.", "Get my migration quote"],
  },
  "monday-for-civil-contractors": {
    audit: ["Get every crew and pour", "in one view.", "A free 30-minute review of your project, crew and plant workflows.", "Review my projects"],
    booking: ["Book a civil contracting", "consultation.", "30 minutes with {team} to map your jobs, crews and site paperwork onto monday.com."],
    closing: ["Run every job", "from one board.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my contractor quote"],
  },
  "monday-for-construction": {
    audit: ["Get every site and", "subcontractor in one view.", "A free 30-minute review of your project workflows.", "Review my projects"],
    booking: ["Book a construction", "consultation.", "30 minutes with {team} to map your projects, sites and subcontractors onto monday.com."],
    closing: ["Run every project", "from one place.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my construction quote"],
  },
  "monday-for-engineering-architecture": {
    audit: ["Keep every project", "on time and on fee.", "A free 30-minute review of your project and resourcing workflows.", "Review my projects"],
    booking: ["Book an engineering and", "architecture consultation.", "30 minutes with {team} to map your projects, fees and resourcing onto monday.com."],
    closing: ["Every project, drawing and fee", "in one system.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my firm's quote"],
  },
  "monday-for-executives": {
    audit: ["See your whole business", "on one dashboard.", "A free 30-minute session to map your OKRs and reporting.", "Map my dashboards"],
    booking: ["Plan your", "executive dashboards.", "30 minutes with {team} on the OKRs, KPIs and roll-ups your leadership team needs."],
    closing: ["Run the business", "from live numbers.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my dashboard quote"],
  },
  "monday-for-finance-teams": {
    audit: ["Close the month", "without the spreadsheets.", "A free 30-minute review of your finance workflows.", "Review my finance workflows"],
    booking: ["Book a finance team", "consultation.", "30 minutes with {team} to map your close, approvals and reporting onto monday.com."],
    closing: ["Finance workflows", "your team can trust.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my finance quote"],
  },
  "monday-for-government": {
    audit: ["Modernise case work", "without the risk.", "A free 30-minute review of your agency's workflows.", "Book a workflow review"],
    booking: ["Book a government", "consultation.", "30 minutes with {team} to map your case, project and service workflows onto monday.com."],
    closing: ["Agency workflows", "on one platform.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my agency quote"],
  },
  "monday-for-labour-hire": {
    audit: ["Fill every shift", "faster.", "A free 30-minute review of your placement and compliance workflows.", "Review my workflows"],
    booking: ["Book a labour hire", "consultation.", "30 minutes with {team} to map candidates, placements and compliance onto monday.com."],
    closing: ["Every candidate and placement", "in one system.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my recruitment quote"],
  },
  "monday-for-legal-teams": {
    audit: ["Never lose track of", "a contract again.", "A free 30-minute review of your matter and contract workflows.", "Review my contracts"],
    booking: ["Book a legal team", "consultation.", "30 minutes with {team} to map matters, contracts and approvals onto monday.com."],
    closing: ["Contracts and matters,", "under control.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my legal quote"],
  },
  "monday-for-manufacturing": {
    audit: ["See your shop floor", "in real time.", "A free 30-minute review of your production workflows.", "Review my production"],
    booking: ["Book a manufacturing", "consultation.", "30 minutes with {team} to map planning, quality and orders onto monday.com."],
    closing: ["Production planning", "on one platform.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my manufacturing quote"],
  },
  "monday-for-marketing": {
    audit: ["Ship campaigns", "without the chasing.", "A free 30-minute review of your marketing and creative workflows.", "Review my campaigns"],
    booking: ["Book a marketing", "consultation.", "30 minutes with {team} to map campaigns, approvals and creative requests onto monday.com."],
    closing: ["Every campaign and asset", "in one place.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my marketing quote"],
  },
  "monday-for-plant-hire": {
    audit: ["Know where every machine", "is right now.", "A free 30-minute review of your fleet, booking and service workflows.", "Review my fleet"],
    booking: ["Book a plant hire", "consultation.", "30 minutes with {team} to map bookings, servicing and dockets onto monday.com."],
    closing: ["Your whole fleet", "on one board.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my plant hire quote"],
  },
  "monday-for-procurement": {
    audit: ["Get every supplier and PO", "in one view.", "A free 30-minute review of your procurement workflows.", "Review my procurement"],
    booking: ["Book a procurement", "consultation.", "30 minutes with {team} to map requests, approvals and suppliers onto monday.com."],
    closing: ["Procurement your auditors", "will thank you for.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my procurement quote"],
  },
  "monday-for-real-estate": {
    audit: ["Stop deals slipping", "through the cracks.", "A free 30-minute review of your listings and deal pipeline.", "Review my pipeline"],
    booking: ["Book a real estate", "consultation.", "30 minutes with {team} to map listings, deals and property management onto monday.com."],
    closing: ["Keep every listing", "and deal moving.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my real estate quote"],
  },
  "monday-for-retail": {
    audit: ["Catch stockouts", "before they cost you.", "A free 30-minute review of your retail operations.", "Review my operations"],
    booking: ["Book a retail", "consultation.", "30 minutes with {team} to map stores, stock and campaigns onto monday.com."],
    closing: ["Connect stores, stock", "and campaigns.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my retail quote"],
  },
  "monday-for-tender-management": {
    audit: ["Never miss", "a tender deadline.", "A free 30-minute review of your bid and tender workflows.", "Review my tenders"],
    booking: ["Book a tender management", "consultation.", "30 minutes with {team} to map your bid pipeline, documents and deadlines onto monday.com."],
    closing: ["Win more bids", "with less scrambling.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my tender quote"],
  },
  "monday-implementation-consultants": MONDAY_PARTNER,
  "monday-partner": MONDAY_PARTNER,
  "monday-partner-singapore-malaysia": {
    audit: ["Get monday.com right", "across ASEAN.", "A free 30-minute system audit with our Singapore team.", "Book a free system audit"],
    booking: ["Book a call with", "{team}.", "A frank read on scope, fit and cost from a certified Platinum Partner, in {hours}."],
    closing: ["Your monday.com rollout across", "Singapore and Malaysia.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my fixed-fee quote"],
  },
  "monday-project-management": {
    audit: ["Are your projects", "on track, really?", "A free 30-minute audit of how your projects are planned and reported.", "Audit my projects"],
    booking: ["Book a project management", "consultation.", "30 minutes with {team} to map how projects run today and the monday.com setup to run them."],
    closing: ["Get every project", "under control.", "Send the form and a consultant replies within one business day with a fixed-fee quote.", "Get my project quote"],
  },
  "monday-training": {
    audit: ["Is your team using", "half of monday.com?", "A free 30-minute session to find the skills gaps worth training.", "Find my training gaps"],
    booking: ["Plan your", "monday.com training.", "30 minutes with {team} to shape sessions around your own boards and workflows."],
    closing: ["Training built on", "your own boards.", "Send the form and a trainer replies within one business day with a fixed-fee quote.", "Get my training quote"],
  },
  "implementation-packages": {
    audit: ["Not sure which package", "fits?", "A free 30-minute system audit to recommend the right one.", "Find my package"],
    booking: ["Find the right", "package.", "30 minutes with {team} to size your rollout and confirm the fixed fee before anything starts."],
    closing: ["A fixed price,", "agreed before we start.", "Send the form and a consultant replies within one business day with your package and quote.", "Get my package quote"],
  },
}

/** Topic key for a page: its route folder name (the source minus `adwords-lp-<region>-`). */
export function bandTopic(source: string): string {
  return source.replace(/^adwords-lp-[a-z]+-/, "")
}

export function bandCopy(source: string, region: LeadRegion): BandCopy | undefined {
  const copy = BAND_COPY[bandTopic(source)]
  if (!copy) return undefined
  const r = REGION_TEAM[region]
  const fill = (s: string) => s.replace("{team}", r.team).replace("{hours}", r.hours)
  return {
    audit: copy.audit,
    booking: [fill(copy.booking[0]), fill(copy.booking[1]), fill(copy.booking[2])],
    closing: copy.closing,
  }
}

const ARROW = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

export function renderAuditBand(copy: BandCopy, target = "#lead"): string {
  const [plain, em, sub, btn] = copy.audit
  return `<section class="lp-audit-sec"><div class="wrap"><div class="lp-audit"><div><h2>${plain} <em>${em}</em></h2><p>${sub}</p></div><a class="lp-btn" href="${target}">${btn}${ARROW}</a></div></div></section>`
}

export function renderClosingBand(
  copy: BandCopy,
  phone?: { href: string; label: string },
  target = "#lead",
): string {
  const [plain, em, lead, btn] = copy.closing
  const call = phone ? `<a class="lp-btn ghost" href="${phone.href}">Call ${phone.label}</a>` : ""
  return `<section class="lp-closing"><div class="wrap"><span class="lp-k">Next step</span><h2>${plain} <em>${em}</em></h2><p>${lead}</p><div class="lp-ctas"><a class="lp-btn" href="${target}">${btn}${ARROW}</a>${call}</div></div></section>`
}

const ICON = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`

const SOCIAL: Array<[string, string, string]> = [
  ["LinkedIn", "https://www.linkedin.com/company/fruition-services", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"],
  ["YouTube", "https://youtube.com/@fruitionservices", "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"],
  ["X", "https://x.com/Fruitionservic", "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"],
  ["Email", "mailto:contact@fruitionservices.io", "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"],
]

export function renderSocialRow(): string {
  return `<div class="lp-soc">${SOCIAL.map(
    ([name, href, d]) =>
      `<a href="${href}" target="_blank" rel="noopener" aria-label="Fruition on ${name}" title="${name}">${ICON(d)}</a>`,
  ).join("")}</div>`
}
