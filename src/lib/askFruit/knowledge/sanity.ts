/**
 * Knowledge records built from Sanity.
 *
 * Most Fruition documents are shaped around page layout (heroHeading,
 * capabilitiesCards, faqTabs…) rather than around knowledge, so rather than
 * hand-map ~60 field names this walks each document and keeps every string a
 * visitor would read, dropping assets, styling and link plumbing.
 */
import { unique, type KnowledgeRecord } from "./types"

const MAX_TEXT = 6000

/** Keys whose values are never visitor-facing copy. */
const SKIP_KEY = /^_|image|logo|icon|video|color|colour|theme|accent$|^hide|url$|href$|^slug$|^order$|^pages$|^kind$|categoryOrder|^seoTitle$|^columns$/i

/** Flatten a Sanity value into lines of plain text, depth-first, in document order. */
export function flattenSanity(value: unknown, out: string[] = [], key = ""): string[] {
  if (value == null || SKIP_KEY.test(key)) return out
  if (typeof value === "string") {
    const text = value.trim()
    // Hex colours, URLs and bare identifiers are plumbing, not copy.
    if (text && !/^(#[0-9a-f]{3,8}|https?:\/\/\S+|\/[\w/#?=-]*|[\w-]+)$/i.test(text)) out.push(text)
    return out
  }
  if (typeof value === "number" || typeof value === "boolean") return out
  if (Array.isArray(value)) {
    // Portable Text: a block's spans read as one line, not one line per span.
    if (value.every((v) => v && typeof v === "object" && (v as { _type?: string })._type === "block")) {
      for (const block of value as Array<{ children?: Array<{ text?: string }> }>) {
        const line = (block.children ?? []).map((c) => c.text ?? "").join("").trim()
        if (line) out.push(line)
      }
      return out
    }
    for (const item of value) flattenSanity(item, out, "")
    return out
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) flattenSanity(v, out, k)
  }
  return out
}

export interface SanityDoc {
  _id: string
  _type: string
  slug?: { current?: string }
  [key: string]: unknown
}

/** The live URL for each document type. Verified against the sitemap. */
function urlFor(doc: SanityDoc): string | null {
  const slug = doc.slug?.current
  switch (doc._type) {
    case "solutionPage":
      return slug ? `/monday-consulting-solutions/${slug}` : null
    case "partnershipPage":
      return slug ? `/partnerships/${slug}` : null
    case "aiPartnerPage":
      if (!slug) return null
      return slug === "ai-capability-assessment" ? `/${slug}` : `/partnerships/${slug}`
    case "servicePage":
      if (!slug) return null
      return slug.startsWith("integrations-") ? `/integrations/${slug.slice("integrations-".length)}` : `/${slug}`
    case "industryPage":
    case "locationPage":
      return slug ? `/${slug}` : null
    case "implementationPackagesPage":
      return "/implementation-packages"
    case "mondayTrainingPage":
      return "/monday-training"
    case "mondayImplementationConsultantsPage":
      return "/monday-implementation-consultants"
    case "makePartnersPage":
      return "/partnerships/make-partners"
    case "caseStudy":
      return "/customer-testimonials"
    case "faqItem":
      return "/faqs"
    default:
      return null
  }
}

const KIND_BY_TYPE: Record<string, KnowledgeRecord["kind"]> = {
  solutionPage: "solution",
  servicePage: "service",
  mondayTrainingPage: "service",
  mondayImplementationConsultantsPage: "service",
  partnershipPage: "platform",
  aiPartnerPage: "platform",
  makePartnersPage: "platform",
  industryPage: "page",
  locationPage: "region",
  caseStudy: "case_study",
  faqItem: "faq",
}

function firstString(doc: SanityDoc, keys: string[]): string {
  for (const k of keys) {
    const v = doc[k]
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return ""
}

export function sanityRecords(docs: SanityDoc[]): KnowledgeRecord[] {
  const records: KnowledgeRecord[] = []
  const seenQuestions = new Set<string>()

  for (const doc of docs) {
    if (doc._type === "implementationPackagesPage") {
      records.push(...packageRecords(doc))
      continue
    }
    if (doc._type === "proofStats") continue

    const url = urlFor(doc)
    const kind = KIND_BY_TYPE[doc._type]
    if (!url || !kind) continue

    if (doc._type === "faqItem") {
      const question = firstString(doc, ["question"])
      // The same question is filed against several pages; index it once.
      if (!question || seenQuestions.has(question.toLowerCase())) continue
      seenQuestions.add(question.toLowerCase())
      const answer = flattenSanity(doc.answer).join(" ")
      records.push({
        id: `faq:${doc._id}`,
        kind,
        title: question,
        url,
        summary: answer.slice(0, 280),
        text: answer.slice(0, MAX_TEXT),
        tags: unique([typeof doc.category === "string" ? doc.category : undefined]),
        facts: {},
      })
      continue
    }

    if (doc._type === "caseStudy") {
      const title = firstString(doc, ["title", "clientCompany", "clientName"])
      if (!title) continue
      const facts: KnowledgeRecord["facts"] = {}
      for (const k of ["platform", "services", "timeline", "industry"]) {
        const v = doc[k]
        if (typeof v === "string" && v.trim()) facts[k] = v.trim()
      }
      const text = flattenSanity(doc).join("\n")
      records.push({
        id: `case:${doc._id}`,
        kind,
        title,
        url,
        summary: [facts.services, facts.timeline && `Delivered in ${facts.timeline}`].filter(Boolean).join(". "),
        text: text.slice(0, MAX_TEXT),
        tags: unique([facts.platform as string, facts.industry as string]),
        facts,
      })
      continue
    }

    const title = firstString(doc, ["partnerName", "brandName", "industryName", "country", "title", "heroHeading"])
    const summary = firstString(doc, ["seoDescription", "heroSubheading", "heroLead", "capLead", "introStripBody"])
    const lines = flattenSanity(doc)
    records.push({
      id: `page:${url.replace(/^\//, "")}`,
      kind,
      title: title || lines[0] || url,
      url,
      summary: summary || lines.slice(0, 2).join(" ").slice(0, 280),
      text: lines.join("\n").slice(0, MAX_TEXT),
      tags: unique([
        firstString(doc, ["partnerName", "brandName"]),
        firstString(doc, ["industryName"]),
        firstString(doc, ["country", "region"]),
      ]),
      facts: {},
    })
  }
  return records
}

interface PackageTier {
  name?: string
  hours?: string
  basePrice?: number
  pricePrefix?: string
  features?: string[]
  featured?: boolean
}

/** Each implementation package tier becomes its own recommendable offering. */
function packageRecords(doc: SanityDoc): KnowledgeRecord[] {
  const tiers = Array.isArray(doc.packageTiers) ? (doc.packageTiers as PackageTier[]) : []
  const footnote = typeof doc.pricingFootnote === "string" ? doc.pricingFootnote : ""
  return tiers
    .filter((t) => t.name)
    .map((tier) => {
      const price =
        typeof tier.basePrice === "number"
          ? `${tier.pricePrefix ? `${tier.pricePrefix} ` : ""}USD ${tier.basePrice.toLocaleString("en-US")}`
          : "Scoped and quoted by the Fruition team"
      const facts: KnowledgeRecord["facts"] = { price, includes: tier.features ?? [] }
      if (tier.hours) facts.hours = tier.hours
      if (footnote) facts.terms = footnote
      const slug = tier.name!.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      return {
        id: `package:${slug}`,
        kind: "package" as const,
        title: `${tier.name} implementation package`,
        url: "/implementation-packages",
        summary: `${tier.hours ?? ""} monday.com implementation package: ${(tier.features ?? []).join(", ")}.`.trim(),
        text: [price, tier.hours, ...(tier.features ?? []), footnote].filter(Boolean).join("\n"),
        tags: ["monday.com", "implementation package", tier.name!],
        facts,
      }
    })
}

export const KNOWLEDGE_TYPES = [
  "solutionPage",
  "partnershipPage",
  "aiPartnerPage",
  "industryPage",
  "servicePage",
  "locationPage",
  "implementationPackagesPage",
  "mondayTrainingPage",
  "mondayImplementationConsultantsPage",
  "makePartnersPage",
  "caseStudy",
  "faqItem",
] as const

export const KNOWLEDGE_QUERY = `*[_type in $types && !(_id in path("drafts.**"))]`
