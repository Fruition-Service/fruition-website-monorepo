/**
 * Knowledge records built from content that lives in the repo rather than in
 * Sanity: the 45-solution monday.com catalog and the practice pages.
 */
import { SOLUTIONS, type Solution } from "@/app/monday-consulting-solutions/catalog/data/solutions"
import { AI_CONSULTING_PAGES } from "@/data/practicePages/aiConsulting"
import { ATLASSIAN_PAGES } from "@/data/practicePages/atlassian"
import { HUBSPOT_PAGES } from "@/data/practicePages/hubspot"
import { INDUSTRIES_PAGES } from "@/data/practicePages/industries"
import { INTEGRATIONS_PAGES } from "@/data/practicePages/integrations"
import { LICENSING_PAGES } from "@/data/practicePages/licensing"
import { PROOF_PAGES } from "@/data/practicePages/proof"
import type { PracticePage } from "@/data/practicePages/types"
import { unique, type KnowledgeRecord } from "./types"

export const CATALOG_URL = "/monday-consulting-solutions/catalog"
const MAX_TEXT = 6000

/**
 * Practice pages that 308 to a partnership page (next.config.ts redirects).
 * The Sanity partnership page is indexed instead, so the agent never cites a
 * URL that bounces.
 */
const REDIRECTED_PATHS = new Set(["/integrations/aircall", "/integrations/make"])

const PRODUCT_TYPE_LABEL: Record<Solution["productType"], string> = {
  wm: "monday Work Management",
  crm: "monday CRM",
  svc: "monday Service",
  ops: "monday Operations",
  new: "monday.com",
}

export function solutionRecord(s: Solution): KnowledgeRecord {
  const lines: string[] = []
  if (s.longDesc) lines.push(s.longDesc)
  for (const [k, v] of s.highlights) lines.push(`${k}: ${v}`)
  if (s.outcomes?.length) lines.push(`Outcomes: ${s.outcomes.join(" ")}`)
  if (s.personas?.length) lines.push(`Who uses it: ${s.personas.map(([p, d]) => `${p} (${d})`).join("; ")}`)
  for (const m of s.modules ?? []) lines.push(`${m.name}: ${m.items.join(", ")}`)
  for (const p of s.phases ?? []) lines.push(`${p.pn} ${p.name}: ${p.focus}`)
  if (s.kpis?.length) lines.push(`KPIs: ${s.kpis.join(", ")}`)
  if (s.cap) lines.push(s.cap)
  if (s.useCases.length) lines.push(`Delivered for: ${s.useCases.map(([c, d]) => `${c}, ${d}`).join(" ")}`)

  const facts: KnowledgeRecord["facts"] = { product: PRODUCT_TYPE_LABEL[s.productType], category: s.tag }
  if (s.integrations?.length) facts.integrations = s.integrations
  if (s.team) facts.team_size = s.team
  if (s.phases?.length) facts.phases = s.phases.map((p) => `${p.name}: ${p.focus}`)
  if (s.useCases.length) facts.reference_clients = s.useCases.map(([c]) => c)

  return {
    id: `solution:${s.key}`,
    kind: "solution",
    title: s.title,
    url: CATALOG_URL,
    summary: s.desc,
    text: lines.join("\n").slice(0, MAX_TEXT),
    tags: unique(["monday.com", PRODUCT_TYPE_LABEL[s.productType], s.tag, ...s.industries, ...(s.integrations ?? [])]),
    facts,
  }
}

function practiceRecord(page: PracticePage, kind: KnowledgeRecord["kind"]): KnowledgeRecord {
  const lines = [
    page.approachHeading,
    ...page.approach.map((a) => `${a.title}: ${a.body}`),
    page.servicesHeading,
    ...page.services.map((s) => `${s.title}: ${s.body}`),
    ...page.faqs.map((f) => `Q: ${f.q} A: ${f.a}`),
  ]
  // The page heading is marketing copy ("Marketing in HubSpot. Delivery in
  // monday."); the breadcrumb trail is the offering's actual name.
  const crumbs = page.breadcrumb.map((b) => b.label)
  const title = crumbs.length > 1 ? `${crumbs[crumbs.length - 2]}: ${crumbs[crumbs.length - 1]}` : crumbs[0] || page.heading
  return {
    id: `page:${page.path.replace(/^\//, "") || "home"}`,
    kind,
    title,
    url: page.path,
    summary: `${page.heading} ${page.lead}`.slice(0, 400),
    text: lines.join("\n").slice(0, MAX_TEXT),
    tags: unique([page.eyebrow, ...page.breadcrumb.map((b) => b.label)]),
    facts: { services: page.services.map((s) => s.title) },
  }
}

export function staticRecords(): KnowledgeRecord[] {
  const records: KnowledgeRecord[] = SOLUTIONS.map(solutionRecord)
  const services: Record<string, PracticePage>[] = [
    AI_CONSULTING_PAGES,
    ATLASSIAN_PAGES,
    HUBSPOT_PAGES,
    INTEGRATIONS_PAGES,
  ]
  for (const group of services) {
    for (const page of Object.values(group)) {
      if (!REDIRECTED_PATHS.has(page.path)) records.push(practiceRecord(page, "service"))
    }
  }
  for (const group of [INDUSTRIES_PAGES, LICENSING_PAGES, PROOF_PAGES]) {
    for (const page of Object.values(group)) records.push(practiceRecord(page, "page"))
  }
  return records
}
