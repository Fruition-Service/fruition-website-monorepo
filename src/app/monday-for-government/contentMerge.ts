import type { IndustrySections } from "@/data/industrySections"
import { DEFAULT_SECTIONS } from "./content"

/**
 * The page's Sanity `sections` object laid over DEFAULT_SECTIONS.
 *
 * Every Sanity field is optional. A blank string or a missing number shows the
 * default wording, so a half-filled document can never blank part of the page.
 * Lists are matched by position: item 0 in Sanity overlays item 0 in the
 * defaults, and the seeded document carries a full copy of every item, so an
 * ordinary edit only replaces the field that was typed in. A list Sanity leaves
 * empty keeps the default list.
 */

type Doc = Record<string, unknown>

const isObj = (v: unknown): v is Doc => !!v && typeof v === "object" && !Array.isArray(v)

/** Thrown away: Sanity's own list bookkeeping is not part of the copy. */
const META_KEYS = new Set(["_key", "_type", "_rev", "_id"])

/** A blank copy of a list item, for items Sanity adds that have no default. */
function blankLike<T>(template: T): T {
  if (Array.isArray(template)) return [] as T
  if (isObj(template)) {
    return Object.fromEntries(
      Object.entries(template)
        .filter(([k]) => !META_KEYS.has(k))
        .map(([k, v]) => [k, blankLike(v)]),
    ) as T
  }
  if (typeof template === "number") return 0 as T
  if (typeof template === "string") return "" as T
  return template
}

function overlay<T>(def: T, src: unknown): T {
  if (Array.isArray(def)) {
    if (!Array.isArray(src) || src.length === 0) return def
    const items = src.filter(isObj)
    if (items.length === 0) return def
    const template = def.length ? def[0] : undefined
    return items.map((item, i) =>
      template === undefined ? strip(item) : overlay(def[i] ?? blankLike(template), item),
    ) as T
  }
  if (isObj(def)) {
    const s = isObj(src) ? src : {}
    return Object.fromEntries(
      Object.entries(def)
        .filter(([k]) => !META_KEYS.has(k))
        .map(([k, v]) => [k, overlay(v, s[k])]),
    ) as T
  }
  if (typeof def === "string") return (typeof src === "string" && src.trim() ? src : def) as T
  if (typeof def === "number") return (typeof src === "number" && Number.isFinite(src) ? src : def) as T
  return def
}

/** A Sanity object with its bookkeeping keys removed, for items that have no default. */
function strip(item: Doc): Doc {
  return Object.fromEntries(Object.entries(item).filter(([k]) => !META_KEYS.has(k)))
}

/** Sanity `sections` object (or the whole document) to IndustrySections. */
export function mergeSections(
  doc: Doc | null | undefined,
  defaults: IndustrySections = DEFAULT_SECTIONS,
): IndustrySections {
  if (!doc) return defaults
  const src = isObj(doc.sections) ? doc.sections : doc
  return overlay(defaults, src)
}

/* ------------------------------------------------------------------ */
/*  IndustrySections to Sanity `sections` (the seed script)            */
/* ------------------------------------------------------------------ */

/** Array member `_type`s, matching the schema's defineArrayMember names. */
const MEMBER_TYPES: Record<string, string> = {
  "capabilityBlocks.blocks": "capabilityBlock",
  "capabilityBlocks.blocks.points": "industryPoint",
  "benefitLedger.items": "benefitLedgerItem",
}

function withKeys(value: unknown, path: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      isObj(item)
        ? {
            _key: `${path.split(".").pop()}-${i}`,
            _type: MEMBER_TYPES[path],
            ...(withKeys(item, path) as Doc),
          }
        : item,
    )
  }
  if (isObj(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withKeys(v, path ? `${path}.${k}` : k)]))
  }
  return value
}

/** The `sections` object to write into the page's document. */
export function toSanitySections(sections: IndustrySections = DEFAULT_SECTIONS): Doc {
  return withKeys(JSON.parse(JSON.stringify(sections)), "") as Doc
}
