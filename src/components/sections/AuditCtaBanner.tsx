import Link from "next/link"
import { bookingHref } from "@/lib/bookingLink"

/**
 * Site-wide mid-content conversion banner. Started life as the bottom-of-article
 * CTA on blog posts; the copy is deliberately generic about Fruition so the same
 * banner reads correctly on a practice page, an industry page, a partnership
 * page or an article. Drop it roughly halfway down a page's sections.
 *
 * `contained` (default) wraps the card in a padded section container; pass
 * `containerClassName` to match the host page's own grid.
 * Pass `contained={false}` when the banner already sits inside a content
 * column — e.g. the blog article body.
 *
 * The card runs on the CTA-blue ramp (the same gradient as the booking band
 * and sticky bar): blue means "act here", purple stays with content.
 */

const DEFAULT_HEADING = "Ready to build systems that scale with your team?"
const DEFAULT_BODY =
  "Book a complimentary 30-minute audit with a Fruition consultant — we will map your workflows, spot the automation wins and show you what the build looks like."
const DEFAULT_CTA_LABEL = "Book a 30-Min System Audit"

interface AuditCtaBannerProps {
  /** Booking destination. Calendly URLs are rewritten to our own scheduler. */
  bookingUrl?: string | null
  heading?: string
  body?: string
  ctaLabel?: string
  /** Wrap in a padded full-width section (default) or render the bare card. */
  contained?: boolean
  /**
   * The host page's section container — width AND horizontal padding, so the
   * card's edges line up with the headings above it. Legacy pages run a
   * 1200px/px-4 grid; the home page runs 1348px/px-5 md:px-8.
   */
  containerClassName?: string
  /** Extra classes on the outer element (section, or the card when bare). */
  className?: string
}

export default function AuditCtaBanner({
  bookingUrl,
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  ctaLabel = DEFAULT_CTA_LABEL,
  contained = true,
  containerClassName = "max-w-[1200px] px-4",
  className = "",
}: AuditCtaBannerProps) {
  const card = (
    <aside
      className={`relative w-full overflow-hidden rounded-card p-[28px] md:p-[40px] lg:p-[52px] bg-[linear-gradient(160deg,var(--cta-blue-deep)_0%,var(--cta-blue)_55%,var(--cta-blue-light)_115%)] md:bg-[linear-gradient(110deg,var(--cta-blue-deep)_0%,var(--cta-blue)_50%,var(--cta-blue-light)_105%)]${
        contained ? "" : ` ${className}`
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[140px] -right-[110px] size-[360px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--cta-blue-pale)_35%,transparent)_0%,transparent_70%)]"
      />
      <div className="relative flex flex-col gap-[20px] md:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[560px] lg:max-w-[720px]">
          {/* Sub-section scale: reads as a peer of the surrounding sections
              without competing with their 40-44px H2s. */}
          <h2 className="font-semibold tracking-[-0.01em] text-white text-[22px] leading-[30px] md:text-[28px] md:leading-[36px] lg:text-[32px] lg:leading-[41px] text-balance">
            {heading}
          </h2>
          <p className="mt-[10px] text-[15px] leading-[24px] text-white/[0.78] md:mt-[14px] md:text-[16px] md:leading-[26px]">
            {body}
          </p>
        </div>
        <Link
          href={bookingHref(bookingUrl)}
          className="flex-none cta-btn cta-btn-on-dark-primary"
        >
          {ctaLabel}
        </Link>
      </div>
    </aside>
  )

  if (!contained) return card

  return (
    <section className={`py-14 md:py-20 ${className}`}>
      <div className={`mx-auto w-full ${containerClassName}`}>{card}</div>
    </section>
  )
}
