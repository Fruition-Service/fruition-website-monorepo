import type { RegionContent } from "@/components/region/types"

/**
 * Overlay a Sanity `locationPage` document onto the shipped region copy.
 *
 * The Sanity schema mirrors `RegionContent` field-for-field, so this is a
 * deep merge with one rule: a Sanity value wins only when it is actually
 * filled in. Blank strings and empty arrays fall through to the code copy in
 * `src/data/regionPages.ts`.
 *
 * That rule is what keeps a half-filled document from punching holes in a
 * live page — clearing a heading in the Studio restores the shipped wording
 * rather than rendering an empty section. The flip side is that an editor
 * cannot empty a list from the Studio: deleting every FAQ brings the shipped
 * eight back. Removing one and keeping the rest works normally.
 *
 * Structural values (`slug`, `teamRegion`, `bookingRegion`) are deliberately
 * not overridable — they pick components and booking desks, not wording.
 */
export function mergeRegionContent(
  defaults: RegionContent,
  page: RegionSanityContent | null | undefined,
): RegionContent {
  if (!page) return defaults
  return {
    ...defaults,
    country: str(page.country, defaults.country),
    flag: str(page.flag, defaults.flag),
    hero: merge(defaults.hero, page.hero),
    services: {
      ...merge(defaults.services, page.services),
      cards: list(page.services?.cards, defaults.services.cards),
      alsoLinks: list(page.services?.alsoLinks, defaults.services.alsoLinks),
    },
    clients: merge(defaults.clients, page.clients),
    answerBlock: merge(defaults.answerBlock, page.answerBlock),
    testimonials: merge(defaults.testimonials, page.testimonials),
    video: merge(defaults.video, page.video),
    process: {
      ...merge(defaults.process, page.process),
      steps: list(page.process?.steps, defaults.process.steps),
    },
    numbers: {
      ...merge(defaults.numbers, page.numbers),
      stats: list(page.numbers?.stats, defaults.numbers.stats),
    },
    team: merge(defaults.team, page.team),
    coverage: {
      ...merge(defaults.coverage, page.coverage),
      locations: list(page.coverage?.locations, defaults.coverage.locations),
      office: merge(defaults.coverage.office, page.coverage?.office),
    },
    faq: {
      ...merge(defaults.faq, page.faq),
      items: list(page.faq?.items, defaults.faq.items),
    },
    closingCta: merge(defaults.closingCta, page.closingCta),
  }
}

/** A filled-in string, or the shipped default. */
function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback
}

/**
 * Shallow-merge one Sanity object over its default, field by field, so a
 * document that fills two of five fields keeps the shipped copy for the rest.
 * Only strings are merged here — arrays are handled by `list`, and nested
 * objects by their own `merge` call.
 */
function merge<T extends Record<string, unknown>>(
  defaults: T,
  incoming: Partial<Record<keyof T, unknown>> | null | undefined,
): T {
  if (!incoming) return defaults
  const out = { ...defaults }
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const value = incoming[key]
    if (typeof value === "string" && value.trim()) out[key] = value as T[keyof T]
  }
  return out
}

/** A non-empty Sanity array, cleaned of Sanity's `_key`/`_type` bookkeeping. */
function list<T>(incoming: unknown, fallback: T[]): T[] {
  if (!Array.isArray(incoming) || incoming.length === 0) return fallback
  return incoming.map((item) => strip(item) as T)
}

function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "_key" && key !== "_type")
        .map(([key, v]) => [key, strip(v)]),
    )
  }
  return value
}

/**
 * The region half of a `locationPage` document — everything the Studio can
 * override. Every field is optional: a document may be seeded, partly filled
 * or empty, and each case falls back independently.
 */
export type RegionSanityContent = {
  [K in Exclude<
    keyof RegionContent,
    "slug" | "teamRegion" | "bookingRegion" | "country" | "flag"
  >]?: DeepPartial<RegionContent[K]>
} & {
  country?: string
  flag?: string
}

/**
 * Sanity's shape for our content: every field optional, and array items carry
 * the `_key`/`_type` bookkeeping the Studio adds (which `strip` removes again
 * on the way back out).
 */
type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U> & SanityMeta>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

type SanityMeta = { _key?: string; _type?: string }

/**
 * The inverse of `mergeRegionContent`: turn shipped region copy into the
 * document shape the Studio edits. Used by `scripts/seed-region-pages.ts` to
 * fill the six documents, and pinned by a test that round-trips every region
 * back through `mergeRegionContent` — seeding must not move a single word.
 *
 * `_key` values are positional and stable, so re-running the seed does not
 * churn every array item in the document history.
 */
export function toSanityRegionContent(content: RegionContent): RegionSanityContent {
  return {
    country: content.country,
    flag: content.flag,
    hero: { ...content.hero },
    services: {
      eyebrow: content.services.eyebrow,
      heading: content.services.heading,
      lead: content.services.lead,
      cards: keyed("card", content.services.cards),
      alsoLabel: content.services.alsoLabel,
      alsoLinks: keyed("link", content.services.alsoLinks),
    },
    clients: { ...content.clients },
    answerBlock: { ...content.answerBlock },
    testimonials: { ...content.testimonials },
    video: { ...content.video },
    process: {
      eyebrow: content.process.eyebrow,
      heading: content.process.heading,
      lead: content.process.lead,
      steps: keyed("step", content.process.steps),
    },
    numbers: {
      eyebrow: content.numbers.eyebrow,
      heading: content.numbers.heading,
      lead: content.numbers.lead,
      stats: keyed("stat", content.numbers.stats),
      footnote: content.numbers.footnote,
    },
    team: { ...content.team },
    coverage: {
      eyebrow: content.coverage.eyebrow,
      heading: content.coverage.heading,
      lead: content.coverage.lead,
      locations: keyed("loc", content.coverage.locations),
      office: { ...content.coverage.office },
    },
    faq: {
      heading: content.faq.heading,
      contactLead: content.faq.contactLead,
      items: keyed("faq", content.faq.items),
    },
    closingCta: { ...content.closingCta },
  }
}

function keyed<T extends object>(prefix: string, items: readonly T[]) {
  return items.map((item, i) => ({ ...item, _key: `${prefix}-${i}` }))
}
