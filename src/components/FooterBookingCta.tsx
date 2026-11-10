"use client"

import { usePathname } from "next/navigation"
import { vercelStegaClean } from "@vercel/stega"
import { bookingHrefForPath } from "@/lib/bookingLink"

/**
 * The footer's booking CTA.
 *
 * Client-side because the destination depends on the page: the six
 * /monday-partner-* location pages render the booking form in the page itself,
 * so there the link is that page's own URL plus #book. Everywhere else it
 * stays the cross-page /contact-us#book. See `lib/bookingLink.ts`.
 *
 * Same tab on purpose: InPageBookingLinks only scrolls for links without a
 * `target`. `data-cta-variant` makes the click a tracked `cta_click`
 * (src/lib/ctaTracking.ts), as it was when this was a CtaButton. Styled by
 * `.vcf .btn` in src/styles/vc/chrome.css.
 */
export default function FooterBookingCta({
  url,
  label,
}: {
  /** Booking URL already resolved by `bookingHref`. */
  url: string
  label: string
}) {
  const pathname = usePathname()

  return (
    <a href={bookingHrefForPath(url, pathname)} data-cta-variant="primary" className="btn inverse sm">
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden>{vercelStegaClean(label)}</span>
      </span>
    </a>
  )
}
