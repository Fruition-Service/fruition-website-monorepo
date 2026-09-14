/* Shared types for section components */

export type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

export interface CarouselLogo {
  _key?: string
  alt?: string
  image?: SanityImageRef
  /** Matches a name in the catalog's clients.ts — see `clientSlug()` there. */
  clientSlug?: string
}

export interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImageRef
  profilePhoto?: SanityImageRef
  linkedinUrl?: string
}

export interface FaqPair {
  _key?: string
  question?: string
  answer?: string
}

export interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
}

export interface StatItem {
  _key?: string
  value?: string
  label?: string
}

export interface Bullet {
  _key?: string
  emoji?: string
  text?: string
}

export interface ComparisonTabItem {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

export interface ComparisonTab {
  _key?: string
  label?: string
  items?: ComparisonTabItem[]
}

export interface CapabilityCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

export interface FeatureNumberItem {
  _key?: string
  number?: string
  title?: string
  description?: string
}

export type SectionTheme = "light" | "dark"

export interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
}

export interface PartnerBadge {
  _key?: string
  name?: string
  image?: SanityImageRef
  width?: number
  height?: number
}

/* ── CRO kit types ─────────────────────────────────────────────────────── */

export interface TrustBadge {
  _key?: string
  label?: string
  /** Optional sub-label / accreditation detail */
  detail?: string
}

export interface BeforeAfterRow {
  _key?: string
  before?: string
  after?: string
}

export interface MicroCaseStudy {
  _key?: string
  challenge?: string
  solution?: string
  impact?: string
  metric?: string
  metricLabel?: string
}

export interface ChecklistItem {
  _key?: string
  text?: string
}

export interface RoiCalcConfig {
  heading?: string
  subheading?: string
  /** Default slider positions */
  defaultTeamSize?: number
  defaultHoursPerWeek?: number
  /** Fully-loaded hourly cost assumption in dollars */
  hourlyRate?: number
  /** Fraction of manual hours automation reclaims (0–1) */
  reclaimRate?: number
  currencySymbol?: string
}

export interface StatMetric {
  _key?: string
  /** Bold highlighted figure, e.g. "900+" */
  value?: string
  /** Supporting statement */
  text?: string
}

export interface SiteSettingsData {
  calendlyLink?: string
  carouselLogos?: CarouselLogo[]
  navbarPartnerBadges?: PartnerBadge[]
  badgeCertifications?: SanityImageRef
  badgeSecurity?: SanityImageRef
  badgeForrester?: SanityImageRef
  badgeMondayPartners?: SanityImageRef
  [key: string]: unknown
}

/* ------------------------------------------------------------------ */
/*  Long-form industry content sections                                */
/*  Copy lives in src/data/industrySections.ts. Every string may       */
/*  carry the inline-markdown subset (`**bold**`, `[text](/path)`)     */
/*  that <RichText> renders.                                           */
/* ------------------------------------------------------------------ */

/** One point in a capability block or benefit ledger. `label` is the bold
 *  lead-in; rows without one are a plain sentence. */
export interface IndustryPoint {
  label?: string
  text: string
}

/** A numbered block: mono numeral, title, lead paragraph, point list. */
export interface CapabilityBlock {
  /** Mono numeral, e.g. "01". Falls back to the 1-based index. */
  number?: string
  title: string
  lead?: string
  points?: IndustryPoint[]
  /** Closing aside, separated from the points by a hairline. */
  note?: string
}

/** A labelled group of bullets inside a spec panel. */
export interface SpecGroup {
  label: string
  bullets: string[]
}

/** One panel of a template spec — bullets, mono chips, or both. */
export interface SpecPanel {
  title: string
  lead?: string
  bullets?: string[]
  /** Mono label above the chip row, e.g. "Customise the board with". */
  chipsLabel?: string
  chips?: string[]
  groups?: SpecGroup[]
  note?: string
}
