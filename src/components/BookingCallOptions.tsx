"use client"

import { useEffect, useState } from "react"
import { useCallOffices } from "@/components/CallOfficesProvider"
import { useSiteCopy } from "@/components/SiteCopyProvider"
import { callRows, nearestFlag, orderForVisitor } from "@/lib/callOffices"

/**
 * Tap-to-call numbers for the booking band (`#book`), one row per office that
 * has a number in Site Settings. The visitor's own office comes first, as a
 * large button; the rest follow in the usual west-to-east order. The nearest
 * office is resolved after hydration from /api/visitor-region (the resolver the
 * booking card uses), so the page itself stays static, and until it answers
 * the Sydney HQ leads.
 *
 * Styles: src/styles/vc/booking-call.css. `tone="dark"` sits on the Version C
 * midnight band, `tone="light"` on the older white booking section.
 */
export default function BookingCallOptions({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const offices = useCallOffices()
  const t = useSiteCopy()
  const all = callRows(offices)
  const [flag, setFlag] = useState<string | null>(null)

  useEffect(() => {
    if (all.length === 0) return
    let live = true
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    fetch(`/api/visitor-region?tz=${encodeURIComponent(tz)}`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { region?: string; country?: string | null } | null) => {
        if (live && d) setFlag(nearestFlag(d.region, d.country))
      })
      .catch(() => {})
    return () => {
      live = false
    }
    // The set of offices is fixed for the page; resolve the visitor once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all.length === 0])

  if (all.length === 0) return null
  const { rows, nearest } = orderForVisitor(all, flag)
  const [first, ...rest] = rows

  return (
    <div className={`book-call book-call-${tone}`} data-book-call>
      <p className="bc-k">{t("booking-call-label")}</p>
      <a className="bc-main" href={`tel:${first.tel}`} data-call-flag={first.flag}>
        <span aria-hidden className="bc-f">
          {first.flag}
        </span>
        <span className="bc-who">
          <span className="bc-n">{first.country}</span>
          {first.city && first.city !== first.country && <span className="bc-s">{first.city}</span>}
          {nearest && <span className="bc-near">{t("booking-call-nearest")}</span>}
        </span>
        <span className="bc-p">
          <PhoneGlyph />
          {first.phone}
        </span>
      </a>
      {rest.length > 0 && (
        <ul className="bc-list">
          {rest.map((row) => (
            <li key={row.key}>
              <a href={`tel:${row.tel}`} data-call-flag={row.flag}>
                <span aria-hidden className="bc-f">
                  {row.flag}
                </span>
                <span className="bc-c">
                  <span className="bc-n">{row.country}</span>
                  {row.city && row.city !== row.country && <span className="bc-s">{row.city}</span>}
                </span>
                <span className="bc-p">{row.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden>
      <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" />
    </svg>
  )
}
