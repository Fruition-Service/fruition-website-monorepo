"use client"

import Link from "next/link"
import { useId, useState } from "react"
import { CalendarDays } from "lucide-react"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
const BOOKING_URL = "/contact-us#book"

/** Calendly's own inline-embed parameters, with the host read at runtime. */
function embedUrl(host: string) {
  const params = new URLSearchParams({ embed_type: "Inline", embed_domain: host, hide_gdpr_banner: "1" })
  return `${FALLBACK_BOOKING_URL}?${params}`
}

/**
 * The booking card shown once, after the first finished answer of a
 * conversation. The Calendly iframe is only mounted when the visitor opens it.
 */
export function BookingCta() {
  const id = useId()
  const titleId = `${id}-title`
  const panelId = `${id}-panel`
  const [src, setSrc] = useState<string | null>(null)
  const open = src !== null

  return (
    <aside aria-labelledby={titleId} className="mt-2 w-full max-w-[520px] rounded-card border border-ui bg-surface-subtle p-4 md:p-5">
      <p className={`${EYEBROW} text-brand`}>{"// Book a time"}</p>
      <h2 id={titleId} className="text-card-title mt-2 text-ink">
        Talk it through with a consultant.
      </h2>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
        A 30 minute call confirms scope, price and timeline. No slides, no obligation.
      </p>
      <div className="mt-4 flex flex-col items-start gap-1">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setSrc(open ? null : embedUrl(window.location.host))}
          className="cta-btn cta-btn-primary w-full px-5 focus-visible:ring-2 focus-visible:ring-cta-blue focus-visible:ring-offset-2 focus-visible:outline-none md:w-auto md:px-7"
        >
          <span className="cta-btn-icon">
            <CalendarDays size={18} aria-hidden />
          </span>
          <span className="cta-btn-label">Book a 30 minute consultation</span>
        </button>
        <Link
          href={BOOKING_URL}
          className="inline-flex min-h-11 items-center rounded-badge text-[13.5px] font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          Open the full booking page
        </Link>
      </div>
      <div id={panelId} hidden={!open} className="mt-4 overflow-hidden rounded-chip border border-ui bg-surface">
        {src ? (
          <iframe
            src={src}
            title="Book a 30 minute consultation with Fruition on Calendly"
            loading="lazy"
            className="block h-[620px] w-full md:h-[660px]"
          />
        ) : null}
      </div>
    </aside>
  )
}
