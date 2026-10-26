/**
 * Testimonial cards for /customer-testimonials, with industry and platform
 * tags for the filter chips.
 *
 * The quotes are caseStudy docs, and the same quote is often stored several
 * times (once per page it was migrated from), with tags that disagree: one
 * copy of the Givergy quote says "Solar & Renewables" because it was copied
 * for the solar page. So a tag is only used when it is a real industry or
 * platform name and every copy of the quote agrees on it. Where the docs carry
 * no usable tag, it is derived from evidence elsewhere in Sanity:
 *  - platform: the product on the client's case study card;
 *  - industry: the industry page a copy of the quote was placed on.
 * Nothing is guessed: a quote with no evidence carries no tag and shows under "All".
 */

export interface TestimonialDoc {
  _id: string
  clientName?: string | null
  clientRole?: string | null
  clientCompany?: string | null
  quote?: string | null
  industry?: string | null
  platform?: string | null
  pages?: string[] | null
}

export interface CaseStudyCardTag {
  title?: string | null
  product?: string | null
}

export interface TestimonialCard {
  id: string
  quote: string
  name: string
  /** "Role, Company" as one line, without repeating the company. */
  byline: string
  industry?: string
  platform?: string
}

export const INDUSTRY_NAMES = [
  'Construction',
  'Manufacturing',
  'Government',
  'Professional services',
  'Real estate',
  'Financial services',
  'Retail',
  'Healthcare',
  'Solar & renewables',
  'Education',
  'Nonprofits',
] as const

/** Industry page key (a caseStudy `pages` entry) → industry name. */
const INDUSTRY_BY_PAGE: Record<string, string> = {
  'monday-for-construction': 'Construction',
  'monday-for-manufacturing': 'Manufacturing',
  'monday-for-government': 'Government',
  'monday-for-professional-services': 'Professional services',
  'monday-for-real-estate': 'Real estate',
  'monday-for-retail': 'Retail',
  'industries/financial-services': 'Financial services',
  'industries/healthcare': 'Healthcare',
  'industries/solar-renewables': 'Solar & renewables',
  'industries/education': 'Education',
  'industries/nonprofits': 'Nonprofits',
}

const norm = (s?: string | null) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Canonical industry name for a free-text tag, or undefined if it isn't one. */
export function toIndustry(tag?: string | null): string | undefined {
  const n = norm(tag)
  return INDUSTRY_NAMES.find((name) => norm(name) === n)
}

/**
 * Canonical platform for a free-text tag or card product: the first monday.com
 * product named ("monday CRM & Project Management" → "monday CRM"), or a known
 * non-monday platform. Undefined if it names none.
 */
export function toPlatform(tag?: string | null): string | undefined {
  const n = norm(tag)
  if (!n) return undefined
  if (/\bmonday( com)? crm\b/.test(n)) return 'monday CRM'
  if (/\bmonday( com)? dev\b/.test(n)) return 'monday Dev'
  if (/\bmonday( com)? service\b/.test(n)) return 'monday Service'
  if (/\bmonday( com)? work management\b/.test(n)) return 'monday Work Management'
  if (/\b(jira|confluence|atlassian)\b/.test(n)) return 'Atlassian'
  if (/\bhubspot\b/.test(n)) return 'HubSpot'
  if (/\b(openai|chatgpt|claude|anthropic|ai)\b/.test(n)) return 'AI'
  return undefined
}

/** The one value every copy agrees on, or undefined when they disagree or none has one. */
function agreed(values: (string | undefined)[]): string | undefined {
  const set = new Set(values)
  if (set.size !== 1) return undefined
  return [...set][0]
}

function companyOf(doc: TestimonialDoc): string | undefined {
  if (doc.clientCompany) return doc.clientCompany
  // Migrated copies put the company after the role: "Managing Director, Popology".
  const parts = (doc.clientRole ?? '').split(',')
  return parts.length > 1 ? parts[parts.length - 1].trim() : undefined
}

export function buildTestimonialCards(docs: TestimonialDoc[], cards: CaseStudyCardTag[] = []): TestimonialCard[] {
  const groups = new Map<string, TestimonialDoc[]>()
  for (const doc of docs) {
    if (!doc.quote?.trim() || !doc.clientName?.trim()) continue
    const key = norm(doc.quote).slice(0, 80)
    groups.set(key, [...(groups.get(key) ?? []), doc])
  }

  const productByCompany = new Map<string, string>()
  for (const card of cards) {
    const platform = toPlatform(card.product)
    // Card titles read "<Client> Case Study"; "Tourism NT" is Tourism Northern Territory.
    const company = norm((card.title ?? '').replace(/case study/i, '')).replace(/\bnt\b/, 'northern territory')
    if (platform && company) productByCompany.set(company, platform)
  }

  return [...groups.values()].map((copies) => {
    // Show the copy with the fullest attribution: a separate company field first.
    const primary = [...copies].sort((a, b) => Number(!!b.clientCompany) - Number(!!a.clientCompany))[0]
    const company = copies.map(companyOf).find(Boolean)
    const role = primary.clientRole?.trim()
    // Some roles already end with the company ("…Manager, Tourism Northern Territory").
    const byline =
      role && company && norm(role).endsWith(norm(company))
        ? role
        : [role, company].filter(Boolean).join(', ')

    const companyKey = norm(company)
    const cardPlatform = [...productByCompany].find(([c]) => c && companyKey && (companyKey.startsWith(c) || c.startsWith(companyKey)))?.[1]
    const platform = agreed(copies.map((d) => toPlatform(d.platform))) ?? cardPlatform
    const industry =
      agreed(copies.map((d) => toIndustry(d.industry))) ??
      agreed(copies.flatMap((d) => (d.pages ?? []).map((p) => INDUSTRY_BY_PAGE[p]).filter(Boolean)))

    return {
      id: primary._id,
      quote: primary.quote!.trim(),
      name: primary.clientName!.trim(),
      byline,
      ...(industry ? { industry } : {}),
      ...(platform ? { platform } : {}),
    }
  })
}

/** Filter chips: only tags at least one card carries, industries first. */
export function testimonialFilterTags(cards: TestimonialCard[]): string[] {
  const industries = INDUSTRY_NAMES.filter((i) => cards.some((c) => c.industry === i))
  const platforms = [...new Set(cards.map((c) => c.platform).filter((p): p is string => !!p))].sort()
  return [...industries, ...platforms]
}
