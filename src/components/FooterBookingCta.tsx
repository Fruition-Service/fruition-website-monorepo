"use client"

import { usePathname } from "next/navigation"
import CtaButton from "@/components/CtaButton"
import { bookingHrefForPath } from "@/lib/bookingLink"

/**
 * The footer's booking CTA.
 *
 * Client-side because the destination depends on the page: the six
 * /monday-partner-* location pages render the booking form in the page itself,
 * so there the link is that page's own URL plus #book. Everywhere else it
 * stays the cross-page /contact-us#book. See `lib/bookingLink.ts` and
 * monday 2887483583.
 */
export default function FooterBookingCta({
  url,
  label,
  className,
}: {
  /** Booking URL already resolved by `bookingHref`. */
  url: string
  label: string
  className?: string
}) {
  const pathname = usePathname()

  return (
    <CtaButton
      href={bookingHrefForPath(url, pathname)}
      label={label}
      variant="primary"
      className={className}
    />
  )
}
