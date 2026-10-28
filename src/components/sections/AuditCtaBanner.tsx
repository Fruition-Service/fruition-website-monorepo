"use client"

import Link from "next/link"
import { bookingHref } from "@/lib/bookingLink"
import { useSiteCopy } from "@/components/SiteCopyProvider"

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

// Default wording is the `audit-*` shared copy slots (src/lib/siteCopy.ts),
// editable in place; a page that passes its own heading/body/ctaLabel wins.

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
   * card's edges line up with the headings above it. Every page now runs on
   * `.site-container`, so the default is almost always right.
   */
  containerClassName?: string
  /** Extra classes on the outer element (section, or the card when bare). */
  className?: string
}

export default function AuditCtaBanner({
  bookingUrl,
  heading,
  body,
  ctaLabel,
  contained = true,
  containerClassName = "site-container",
  className = "",
}: AuditCtaBannerProps) {
  const t = useSiteCopy()
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
            {heading ?? t("audit-heading")}
          </h2>
          <p className="mt-[10px] text-[15px] leading-[24px] text-white/[0.78] md:mt-[14px] md:text-[16px] md:leading-[26px]">
            {body ?? t("audit-body")}
          </p>
        </div>
        <Link
          href={bookingHref(bookingUrl)}
          className="flex-none cta-btn cta-btn-on-dark-primary"
        >
          {ctaLabel ?? t("audit-cta")}
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
