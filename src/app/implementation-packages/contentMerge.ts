import { DEFAULT_CONTENT, type CompareRow, type PageContent } from "./content"

/**
 * The Sanity singleton `implementationPackagesPage` laid over DEFAULT_CONTENT.
 *
 * Every field is optional in Sanity. A blank string, a missing number or an
 * empty list shows the default from ./content, so a half-filled document can
 * never blank part of the page. Lists that Sanity does fill replace the default
 * list as a whole (an editor can drop or reorder FAQs); packages and service
 * groups are matched to their defaults by `id`, so a blank field in one of them
 * still falls back to that package's own default.
 */

export type Doc = Record<string, unknown>

const isObj = (v: unknown): v is Doc => !!v && typeof v === "object" && !Array.isArray(v)

/** A blank copy of a list item, for items Sanity adds that have no default. */
function blankLike<T>(template: T): T {
  if (Array.isArray(template)) return [] as T
  if (isObj(template)) {
    return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blankLike(v)])) as T
  }
  if (typeof template === "number") return 0 as T
  if (typeof template === "string") return "" as T
  return template
}

function overlay<T>(def: T, src: unknown): T {
  if (Array.isArray(def)) {
    if (!Array.isArray(src) || src.length === 0) return def
    if (def.length === 0 || typeof def[0] === "string") {
      const items = src.filter((s): s is string => typeof s === "string" && s.trim() !== "")
      return (items.length ? items : def) as T
    }
    const byId = new Map(def.filter(isObj).filter((d) => typeof d.id === "string").map((d) => [d.id as string, d]))
    const items = src.filter(isObj).map((item) => {
      const base = (typeof item.id === "string" && byId.get(item.id)) || blankLike(def[0])
      return overlay(base, item)
    })
    return (items.length ? items : def) as T
  }
  if (isObj(def)) {
    const s = isObj(src) ? src : {}
    return Object.fromEntries(Object.entries(def).map(([k, v]) => [k, overlay(v, s[k])])) as T
  }
  if (typeof def === "string") return (typeof src === "string" && src.trim() ? src : def) as T
  if (typeof def === "number") return (typeof src === "number" && Number.isFinite(src) ? src : def) as T
  return def
}

const CELL_FIELDS = ["training", "lockstep", "deployed"] as const

/** Sanity document → PageContent, every gap filled from `defaults`. */
export function mergeContent(doc: Doc | null | undefined, defaults: PageContent = DEFAULT_CONTENT): PageContent {
  if (!doc) return defaults
  const merged = overlay(defaults, {
    ...doc,
    seo: { title: doc.seoTitle, description: doc.seoDescription },
    compareRows: undefined,
  })
  // Comparison rows: an empty cell is deliberate ("Not included"), so no per-cell fallback.
  const rows = Array.isArray(doc.compareRows)
    ? doc.compareRows.filter(isObj).filter((r) => typeof r.label === "string" && r.label.trim())
    : []
  if (rows.length) {
    merged.compareRows = rows.map((r) => ({
      label: r.label as string,
      cells: CELL_FIELDS.map((f) => (typeof r[f] === "string" && r[f].trim() ? r[f] : null)) as CompareRow["cells"],
    }))
  }
  const valid = (c: string) => c === "one-time" || c === "per month"
  merged.packages = merged.packages.map((p) =>
    valid(p.cadence) ? p : { ...p, cadence: defaults.packages.find((d) => d.id === p.id)?.cadence ?? "one-time" },
  )
  return merged
}

/* ------------------------------------------------------------------ */
/*  PageContent → Sanity document fields (the seed script)             */
/* ------------------------------------------------------------------ */

/** Array member `_type`s, matching the schema's defineArrayMember names. */
const MEMBER_TYPES: Record<string, string> = {
  packages: "implementationPackage",
  compareRows: "compareRow",
  servicePrices: "servicePriceGroup",
  "servicePrices.items": "servicePriceItem",
  "howPricingWorks.items": "pricingPrinciple",
  "method.steps": "methodStep",
  "why.items": "whyItem",
  "reviews.items": "review",
  "atAGlance.rows": "glanceRow",
  "regions.links": "regionLink",
  faqs: "faqEntry",
}

/** Adds `_key` and `_type` to every list item. `path` is the field path without list indexes. */
function withKeys(value: unknown, path: string): unknown {
  const fields = (obj: Doc) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, withKeys(v, path ? `${path}.${k}` : k)]))
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      isObj(item)
        ? { _key: typeof item.id === "string" ? item.id : `${path.split(".").pop()}-${i}`, _type: MEMBER_TYPES[path], ...fields(item) }
        : item,
    )
  }
  return isObj(value) ? fields(value) : value
}

export function toSanityFields(c: PageContent = DEFAULT_CONTENT): Doc {
  const { seo, compareRows, ...rest } = c
  const fields = withKeys(rest, "") as Doc
  return {
    seoTitle: seo.title,
    seoDescription: seo.description,
    ...fields,
    compareRows: compareRows.map((r, i) => ({
      _key: `row-${i}`,
      _type: MEMBER_TYPES.compareRows,
      label: r.label,
      ...Object.fromEntries(CELL_FIELDS.map((f, col) => [f, r.cells[col] ?? ""])),
    })),
  }
}

/** Old pre-redesign fields still sitting on the document; the seed unsets them. */
export const RETIRED_FIELDS = [
  "title", "croSections",
  "heroHeadingPart1", "heroHeadingAccent", "heroHeadingPart2", "heroPartnerBadges", "heroMondayPartnersImage",
  "heroCertificationBadge", "heroImage", "heroPrimaryCtaLabel", "heroPrimaryCtaUrl", "heroSecondaryCtaLabel",
  "heroSecondaryCtaUrl", "logoCloudHeadingPart1", "logoCloudHeadingAccent", "videoEmbedUrl", "videoTitle",
  "servicesIntroHeadingPart1", "servicesIntroHeadingAccent", "servicesIntroHeadingPart2", "servicesIntroImage",
  "featureCards", "socialProofBannerHtml", "socialProofCtaLabel", "socialProofCtaUrl", "pricingHeading",
  "pricingSubheading", "pricingFootnote", "packageTiers", "testimonialsHeading", "testimonialsCtaLabel",
  "testimonialsCtaUrl", "statCardValue", "statCardSubtitle", "statCardCtaLabel", "statCardCtaUrl",
  "calendlyHeading", "calendlyUrl",
]
