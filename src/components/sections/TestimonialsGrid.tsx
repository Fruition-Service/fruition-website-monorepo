import { BOOKING_ANCHOR, bookingHref } from "@/lib/bookingLink"
import TestimonialsRoll, { type HomeTestimonial } from "@/components/home/TestimonialsRoll"
import type { CaseStudy } from "./types"
import { TESTIMONIALS_DEFAULTS } from "@/features/content/industryPageCopy"

interface TestimonialsGridProps {
  /** Small label above the heading. */
  eyebrow?: string
  heading?: string
  /** Line under the heading. */
  intro?: string
  ctaLabel?: string
  ctaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  caseStudies?: CaseStudy[]
}

/**
 * The shared testimonials section. Renders the Client proof treatment — the same
 * rolling-quote section the homepage uses — so every page presents customer
 * proof identically.
 *
 * Kept as its own component, and keeping its original prop names, so the ~14
 * call sites and their Sanity-driven headings carry over untouched. It maps
 * `caseStudies` onto the roll's testimonial shape.
 *
 * The `statCard*` props are still accepted so call sites need no edit, but the
 * Client proof layout has no stat card and none of them are rendered.
 */
export default function TestimonialsGrid({
  eyebrow = TESTIMONIALS_DEFAULTS.eyebrow,
  heading = TESTIMONIALS_DEFAULTS.heading,
  intro = TESTIMONIALS_DEFAULTS.intro,
  ctaLabel = TESTIMONIALS_DEFAULTS.ctaLabel,
  ctaUrl = BOOKING_ANCHOR,
  caseStudies = [],
}: TestimonialsGridProps) {
  // Case studies without a quote (project write-ups) would render as blank
  // cards, so drop them — same rule the grid applied.
  const testimonials: HomeTestimonial[] = caseStudies
    .filter((c) => (c.quote ?? "").trim().length > 0)
    .map((c) => ({
      _key: c._id,
      quote: c.quote,
      authorName: c.clientName,
      authorRole: c.clientRole,
      company: c.clientCompany,
      profilePhoto: c.profilePhoto ?? undefined,
    }))

  return (
    <TestimonialsRoll
      testimonials={testimonials}
      bookingHref={bookingHref(ctaUrl)}
      eyebrow={eyebrow}
      heading={heading}
      intro={intro}
      ctaLabel={ctaLabel}
    />
  )
}
