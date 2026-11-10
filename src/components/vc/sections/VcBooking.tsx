"use client"

import { BookingCard } from "@/components/sections/BookingSection"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import { useOfficeStrap } from "@/components/OfficeStrapProvider"
import { Acc, Badge } from "../primitives"
import type { VcBookingData } from "../types"

/**
 * The booking band (#book) in the Version C skin. The card is the site's one
 * booking engine, BookingCard from BookingSection: shared global calendar,
 * region desk detection, lead capture before confirmation, Calendly confirm
 * step and every analytics event, unchanged. Only its colours and type are
 * restyled, through CSS variables scoped to `.vc .cal` (src/styles/vc/extras.css).
 * In-page "book" CTAs still scroll here (InPageBookingLinks looks for #book).
 */
export default function VcBooking({ s, email }: { s: VcBookingData; email?: string }) {
  const offices = useOfficeStrap()
  const mail = email || "contact@fruitionservices.io"
  return (
    <section id="book" className="book-sec" data-sec="book">
      <div className="wrap book">
        <div>
          <Badge>{s.badge}</Badge>
          {s.heading && (
            <h2 className="h2 mt24">
              <Acc text={s.heading} />
            </h2>
          )}
          {s.lead && <p className="lead">{s.lead}</p>}
          <div className="contact">
            <a href={`mailto:${mail}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
              </svg>
              {mail}
            </a>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {offices}
            </div>
          </div>
          {s.tag && (
            <div className="tag">
              <span className="label">{s.tag}</span>
            </div>
          )}
        </div>
        <div className="cal">
          <BookingCard duration={30} askTeamSize calendlyUrl={FALLBACK_BOOKING_URL} title={s.calTitle} />
        </div>
      </div>
    </section>
  )
}
