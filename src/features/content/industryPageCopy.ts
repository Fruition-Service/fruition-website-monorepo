/*
 * Section copy on the monday-for-* `industryPage` documents that sits outside
 * the long-form sections: the use case catalogue block, the testimonials
 * block and the FAQ contact line.
 *
 * Same rule as the other merge layers: a filled string from the document wins
 * (trimmed), a missing or blank one falls back to the code copy, so a page
 * renders exactly as before until an editor changes a field.
 */
type Maybe<T> = T | null | undefined

/** A filled string, trimmed, or undefined for a missing or blank one. */
export function filledText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

/** Replaced with the industry's use case count in the catalogue button label. */
export const USE_CASE_COUNT_TOKEN = '{count}'

/** FeaturedUseCasesSection's own copy. The heading's default is per industry. */
export const USE_CASE_CATALOGUE_DEFAULTS = {
  eyebrow: 'Use case catalogue',
  lead: "Every use case comes from a real Fruition client engagement, with the client's name withheld.",
  ctaLabel: `See all ${USE_CASE_COUNT_TOKEN} use cases`,
  browseLabel: 'Browse every industry',
} as const

/** The default catalogue heading for an industry. */
export function defaultUseCaseCatalogueHeading(industryName: string): string {
  return `${industryName} use cases`
}

export interface UseCaseCatalogueCopy {
  eyebrow?: string
  heading?: string
  lead?: string
  /** May contain {count}, replaced with the industry's use case count. */
  ctaLabel?: string
  browseLabel?: string
}

export interface UseCaseCatalogueDoc {
  useCaseCatalogueEyebrow?: Maybe<string>
  useCaseCatalogueHeading?: Maybe<string>
  useCaseCatalogueLead?: Maybe<string>
  useCaseCatalogueCtaLabel?: Maybe<string>
  useCaseCatalogueBrowseLabel?: Maybe<string>
}

/** The catalogue block's overrides from an industryPage document. Blank fields are left out. */
export function catalogueCopy(doc: Maybe<UseCaseCatalogueDoc>): UseCaseCatalogueCopy {
  if (!doc) return {}
  return dropUnset({
    eyebrow: filledText(doc.useCaseCatalogueEyebrow),
    heading: filledText(doc.useCaseCatalogueHeading),
    lead: filledText(doc.useCaseCatalogueLead),
    ctaLabel: filledText(doc.useCaseCatalogueCtaLabel),
    browseLabel: filledText(doc.useCaseCatalogueBrowseLabel),
  })
}

/**
 * The words the catalogue block renders: the document's copy, else the code
 * copy. `codeHeading` is the code's own heading override (the solar page has
 * one); the industry name gives the standard heading otherwise.
 */
export function resolveCatalogueCopy(
  copy: Maybe<UseCaseCatalogueCopy>,
  industry: { name: string; count: number },
  codeHeading?: string,
): Required<UseCaseCatalogueCopy> {
  const d = USE_CASE_CATALOGUE_DEFAULTS
  const ctaLabel = filledText(copy?.ctaLabel) ?? d.ctaLabel
  return {
    eyebrow: filledText(copy?.eyebrow) ?? d.eyebrow,
    heading: filledText(copy?.heading) ?? codeHeading ?? defaultUseCaseCatalogueHeading(industry.name),
    lead: filledText(copy?.lead) ?? d.lead,
    ctaLabel: ctaLabel.split(USE_CASE_COUNT_TOKEN).join(String(industry.count)),
    browseLabel: filledText(copy?.browseLabel) ?? d.browseLabel,
  }
}

/**
 * TestimonialsGrid's copy where a page does not pass its own. The eyebrow and
 * intro are the same words TestimonialsRoll defaults to.
 */
export const TESTIMONIALS_DEFAULTS = {
  eyebrow: 'Client proof',
  heading: 'What our customers say about us 🙌',
  intro: 'Operations and IT leaders on what changed after we mapped the process first.',
  ctaLabel: 'Start Your Transformation',
} as const

/** monday-for-construction passes its own testimonials heading (no emoji) and CTA. */
export const CONSTRUCTION_TESTIMONIALS_COPY = {
  heading: 'What our customers say about us',
  ctaLabel: 'Start Your Transformation',
} as const

export interface TestimonialsCopy {
  eyebrow?: string
  heading?: string
  intro?: string
  ctaLabel?: string
}

export interface TestimonialsDoc {
  testimonialsEyebrow?: Maybe<string>
  testimonialsHeading?: Maybe<string>
  testimonialsIntro?: Maybe<string>
  testimonialsCtaLabel?: Maybe<string>
}

/** The testimonials block's overrides from an industryPage document. Blank fields are left out. */
export function testimonialsCopy(doc: Maybe<TestimonialsDoc>): TestimonialsCopy {
  if (!doc) return {}
  return dropUnset({
    eyebrow: filledText(doc.testimonialsEyebrow),
    heading: filledText(doc.testimonialsHeading),
    intro: filledText(doc.testimonialsIntro),
    ctaLabel: filledText(doc.testimonialsCtaLabel),
  })
}

function dropUnset<T extends Record<string, string | undefined>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}
