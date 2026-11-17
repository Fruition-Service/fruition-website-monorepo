"use client"

import { useEffect, useRef, useState } from "react"
import { callRows, type CallOffice } from "@/lib/callOffices"

export type { CallOffice }

interface Props {
  offices: CallOffice[]
  /** Last-resort number when no office has one, the existing site phone. */
  fallbackPhone?: string
}

/**
 * The nav phone icon opens this instead of dialling one hardcoded number:
 * a visitor in London should not be calling the Sydney office by default.
 * Offices without a number are omitted rather than shown as dead rows.
 */
export default function RegionalCallPopover({ offices, fallbackPhone }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const rows = callRows(offices)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.querySelector("a")?.focus()
  }, [open])

  // Nothing to offer a popover for, fall back to the old single-number link.
  if (rows.length === 0) {
    if (!fallbackPhone) return null
    return (
      <a href={`tel:${fallbackPhone.replace(/\s/g, "")}`} className="nav-tel" aria-label="Call us">
        <PhoneGlyph />
      </a>
    )
  }

  return (
    <div ref={wrapRef} className={`nav-call${open ? " open" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nav-tel"
        aria-label="Call one of our offices"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <PhoneGlyph />
      </button>

      {open && (
        <div ref={panelRef} role="menu" className="nc-pop">
          <p className="nc-k">Call an office</p>

          <ul className="nc-list">
            {rows.map((row) => (
              <li key={row.key}>
                <a href={`tel:${row.tel}`} role="menuitem">
                  <span className="nc-c">
                    <span aria-hidden className="nc-f">
                      {row.flag}
                    </span>
                    <span>
                      <span className="nc-n">{row.country}</span>
                      {row.city && row.city !== row.country && <span className="nc-s">{row.city}</span>}
                    </span>
                  </span>
                  <span className="nc-p">{row.phone}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
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

/**
 * The same regional numbers for the mobile sheet, where the desktop phone icon
 * does not exist and tapping to call is the likelier action.
 */
export function MobileCallList({
  offices,
  fallbackPhone,
  onNavigate,
}: Props & { onNavigate?: () => void }) {
  const rows = callRows(offices)

  if (rows.length === 0) {
    if (!fallbackPhone) return null
    return (
      <a href={`tel:${fallbackPhone.replace(/\s/g, "")}`} onClick={onNavigate} className="nd-dfoot">
        {fallbackPhone}
      </a>
    )
  }

  return (
    <>
      <p className="nc-k nd-dk">Call an office</p>
      <ul className="nc-list nd-dcalls">
        {rows.map((row) => (
          <li key={row.key}>
            <a href={`tel:${row.tel}`} onClick={onNavigate}>
              <span className="nc-c">
                <span aria-hidden className="nc-f">
                  {row.flag}
                </span>
                <span>
                  <span className="nc-n">{row.country}</span>
                  {row.city && row.city !== row.country && <span className="nc-s">{row.city}</span>}
                </span>
              </span>
              <span className="nc-p">{row.phone}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
