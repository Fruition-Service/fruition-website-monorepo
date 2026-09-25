import type { MetadataRoute } from "next"
import {
  getBlogPosts,
  getBlogAuthors,
  getAllSolutionPages,
  getAllPartnershipPages,
} from "@/sanity/queries"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"

// Indexable static routes. Add new marketing pages here.
// Deliberately excludes: /internal/*, /studio/*, the dynamic [slug] routes
// (added from Sanity below), and /consulting-blog/categories/* (noindexed via
// page metadata, so kept out of the sitemap to avoid conflicting signals).
const STATIC_PATHS: string[] = [
  "/",
  "/about-us",
  "/ai-capability-assessment",
  "/ai-consulting",
  "/ai-consulting/agent-development",
  "/ai-consulting/customer-service",
  "/ai-consulting/governance-and-compliance",
  "/ai-consulting/marketing-automation",
  "/ai-consulting/operations-back-office",
  "/ai-consulting/rag-knowledge-systems",
  "/ai-consulting/sales-outbound",
  "/ai-readiness-blueprint",
  "/ai-strategy-and-execution",
  "/atlassian-consulting",
  "/atlassian-consulting/confluence",
  "/atlassian-consulting/jira",
  "/atlassian-consulting/jira-service-management",
  "/atlassian-consulting/jira-to-monday-migration",
  "/careers",
  "/certifications-and-awards",
  "/hubspot-consulting",
  "/hubspot-consulting/breeze-ai",
  "/hubspot-consulting/hubspot-to-monday-migration",
  "/hubspot-consulting/implementation",
  "/hubspot-consulting/monday-hubspot-integration",
  "/integrations",
  "/integrations/line",
  "/integrations/twilio",
  "/integrations/viber",
  "/integrations/whatsapp",
  "/integrations/zapier",
  "/industries",
  "/industries/financial-services",
  "/industries/healthcare",
  "/industries/solar-renewables",
  "/consulting-blog",
  "/contact-us",
  "/customer-testimonials",
  "/data-privacy",
  "/faqs",
  "/fruition-team",
  "/implementation-packages",
  "/monday-consulting-solutions",
  "/monday-consulting-solutions/catalog",
  "/monday-consulting-solutions/monday-for-cabinetry-renovation",
  "/monday-consulting-solutions/monday-for-finance",
  "/monday-consulting-solutions/monday-for-hr",
  "/monday-consulting-solutions/monday-product-management",
  "/monday-consulting-solutions/monday-project-management",
  "/monday-consulting-solutions/monday-service",
  "/monday-consulting-solutions/solar-crm-solution",
  "/monday-crm-consulting",
  "/monday-for-construction",
  "/monday-for-government",
  "/monday-for-manufacturing",
  "/monday-for-marketing",
  "/monday-for-professional-services",
  "/monday-for-real-estate",
  "/monday-for-retail",
  "/monday-implementation-consultants",
  "/monday-partner-australia",
  "/monday-partner-india",
  "/monday-partner-philippines",
  "/monday-partner-singapore",
  "/monday-partner-uk",
  "/monday-partner-us",
  "/monday-training",
  "/partnerships/aircall-partner",
  "/partnerships/anthropic-claude-partner",
  "/partnerships/aws-partner",
  "/partnerships/certified-atlassian-partner",
  "/partnerships/certified-clickup-partner",
  "/partnerships/clay-partner",
  "/partnerships/elevenlabs-partner",
  "/partnerships/google-cloud-partner",
  "/partnerships/google-gemini-vertex-ai-partner",
  "/partnerships/hootsuite-delivery-partner",
  "/partnerships/langgraph-partner",
  "/partnerships/make-partners",
  "/partnerships/microsoft-azure-partner",
  "/partnerships/microsoft-copilot-partner",
  "/partnerships/monday-consulting-partner",
  "/partnerships/n8n-integration-partner",
  "/partnerships/openai-chatgpt-partner",
  "/partnerships/openclaw-partner",
  "/partnerships/supabase-partner",
  "/partnerships/vapi-partner",
  "/pricing",
  "/terms-and-conditions",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Fetch dynamic slugs from Sanity. Use allSettled so a single failing query
  // never breaks the whole sitemap (it just omits that section).
  const [postsR, authorsR, solutionsR, partnershipsR] = await Promise.allSettled([
    getBlogPosts(500, 0),
    getBlogAuthors(),
    getAllSolutionPages(),
    getAllPartnershipPages(),
  ])

  const posts = (postsR.status === "fulfilled" ? postsR.value : []) as Array<{
    slug?: string
    publishedAt?: string
  }>
  const authors = (authorsR.status === "fulfilled" ? authorsR.value : []) as Array<{
    slug?: string
    latestPublishedAt?: string
  }>
  const solutions = (solutionsR.status === "fulfilled" ? solutionsR.value : []) as Array<{
    slug?: string
  }>
  const partnerships = (partnershipsR.status === "fulfilled"
    ? partnershipsR.value
    : []) as Array<{ slug?: string }>

  const seen = new Set<string>()
  const entries: MetadataRoute.Sitemap = []
  const add = (path: string, lastModified?: string | Date) => {
    if (!path || seen.has(path)) return
    seen.add(path)
    entries.push({
      url: `${BASE}${path}`,
      lastModified: lastModified ? new Date(lastModified) : now,
    })
  }

  for (const p of STATIC_PATHS) add(p)
  for (const p of posts) if (p?.slug) add(`/post/${p.slug}`, p.publishedAt)
  for (const a of authors) if (a?.slug) add(`/author/${a.slug}`, a.latestPublishedAt)
  for (const s of solutions) if (s?.slug) add(`/monday-consulting-solutions/${s.slug}`)
  for (const p of partnerships) if (p?.slug) add(`/partnerships/${p.slug}`)

  return entries
}
