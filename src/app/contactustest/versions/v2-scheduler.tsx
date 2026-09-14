"use client"

/**
 * ARCHIVED SNAPSHOT — src/components/sections/CalendlySection.tsx as of 6c66013 (29 July 2026, PR #83).
 *
 * The first on-site slot picker — Calendly's embed replaced by our own day/time grid.
 *
 * Frozen on purpose. Nothing here should be refactored, re-themed or kept
 * in step with the live component: the page it feeds exists to show what
 * the card actually looked like on that date, and an edit here is a lie
 * about the past. Two departures from the committed file, both mechanical:
 * imports point at their present-day paths, and every write goes through
 * previewWrite (./previewWrite.ts) so an archived card can never create a
 * lead, an enquiry or a booking.
 */
import { previewWrite } from "./previewWrite"

import { useEffect, useMemo, useState } from "react"

/**
 * Custom scheduling section (replaces the Calendly iframe embed). Availability
 * comes from /api/scheduling/availability (regional event type picked
 * server-side from the visitor's location); bookings go through
 * /api/scheduling/book, which also records the lead on the ILE board. When
 * the booking API is unavailable the visitor is sent to the slot's own
 * Calendly page with their details prefilled, so a booking is never blocked.
 *
 * Props are unchanged from the old embed so existing pages keep working;
 * `calendlyUrl` is now only the last-resort link when availability fails.
 */

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

interface Slot {
  start: string
  url: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
}: CalendlySectionProps) {
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")

  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
    } catch {
      return "UTC"
    }
  }, [])

  useEffect(() => {
    let alive = true
    fetch("/api/scheduling/availability")
      .then((r) => r.json())
      .then((d: { slots?: Slot[] }) => {
        if (!alive) return
        if (d.slots && d.slots.length > 0) setSlots(d.slots)
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  // Group slots by the visitor's local calendar day.
  const days = useMemo(() => {
    if (!slots) return []
    const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" })
    const map = new Map<string, Slot[]>()
    for (const s of slots) {
      const key = fmt.format(new Date(s.start))
      const list = map.get(key) ?? []
      list.push(s)
      map.set(key, list)
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, list]) => ({ date, list }))
  }, [slots, timezone])

  useEffect(() => {
    if (!selectedDay && days.length > 0) setSelectedDay(days[0].date)
  }, [days, selectedDay])

  const activeDay = days.find((d) => d.date === selectedDay) ?? days[0]

  function dayLabel(date: string): { weekday: string; day: string } {
    const d = new Date(`${date}T12:00:00`)
    return {
      weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
      day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }
  }

  function timeLabel(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZone: timezone })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedSlot) return
    const fd = new FormData(e.currentTarget)
    const payload = {
      start: selectedSlot.start,
      slotUrl: selectedSlot.url,
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
      timezone,
      website: String(fd.get("website") ?? ""), // honeypot
    }
    if (!payload.name || !EMAIL_RE.test(payload.email)) {
      setStatus("error")
      setError("Please fill in your name and a valid email.")
      return
    }
    setStatus("sending")
    setError("")
    try {
      const r = await previewWrite("/api/scheduling/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; fallbackUrl?: string | null; error?: string }
      if (r.ok && body.ok) {
        setStatus("done")
      } else if (body.fallbackUrl) {
        // API booking unavailable — finish on Calendly with details prefilled.
        window.open(body.fallbackUrl, "_blank", "noopener")
        setStatus("idle")
      } else {
        setStatus("error")
        setError("That slot may have just been taken. Please pick another time.")
      }
    } catch {
      setStatus("error")
      setError("Network error. Please try again.")
    }
  }

  return (
    <section className="bg-surface-subtle" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200, paddingTop: 80, paddingBottom: 88 }}>
        <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-center" style={{ fontSize: 16, lineHeight: "24px", color: "var(--text-body)", marginTop: 16, maxWidth: 900, whiteSpace: "pre-line" }}>
            {subheading}
          </p>
        )}

        <div
          className="w-full bg-surface-raised dark:shadow-none dark:border dark:border-ui"
          style={{ marginTop: 32, maxWidth: 860, borderRadius: 24, border: "1px solid #ece7fb", boxShadow: "0 30px 70px -50px rgba(64,12,140,0.4)", padding: "clamp(24px, 4vw, 40px)" }}
        >
          {status === "done" ? (
            <div
              className="rounded-card"
              style={{ background: "#f5fbf6", border: "1px solid #d6ecd9", padding: 22, color: "#1e7a40", fontSize: 16, lineHeight: "24px" }}
              role="status"
            >
              You&rsquo;re booked{selectedSlot && activeDay ? ` for ${timeLabel(selectedSlot.start)} on ${dayLabel(activeDay.date).day}` : ""}. A
              calendar invite is on its way to your inbox — see you then!
            </div>
          ) : failed ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ color: "var(--text-body)", fontSize: 16, lineHeight: "24px" }}>
                Live availability couldn&rsquo;t load just now.
              </p>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn cta-btn-primary"
                style={{ display: "inline-flex", marginTop: 16 }}
              >
                <span className="cta-btn-label">Open the booking calendar</span>
              </a>
            </div>
          ) : slots === null ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted-fg)", fontSize: 15 }} role="status">
              Loading available times…
            </div>
          ) : (
            <>
              {/* Day strip */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }} role="tablist" aria-label="Pick a day">
                {days.map((d) => {
                  const sel = d.date === activeDay?.date
                  const { weekday, day } = dayLabel(d.date)
                  return (
                    <button
                      key={d.date}
                      type="button"
                      role="tab"
                      aria-selected={sel}
                      onClick={() => {
                        setSelectedDay(d.date)
                        setSelectedSlot(null)
                      }}
                      style={{
                        flex: "0 0 auto",
                        minWidth: 76,
                        padding: "10px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        textAlign: "center",
                        border: `1px solid ${sel ? "var(--purple-primary)" : "var(--border-ui)"}`,
                        background: sel ? "#f4ecff" : "var(--surface-raised)",
                        color: sel ? "var(--purple-dark)" : "var(--text-body)",
                        transition: "border-color 0.18s ease, background 0.18s ease",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.75 }}>{weekday}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{day}</div>
                    </button>
                  )
                })}
              </div>

              {/* Slot grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: 8, marginTop: 16 }}>
                {(activeDay?.list ?? []).map((s) => {
                  const sel = selectedSlot?.start === s.start
                  return (
                    <button
                      key={s.start}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      aria-pressed={sel}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: `1px solid ${sel ? "var(--purple-primary)" : "var(--border-ui)"}`,
                        background: sel ? "var(--purple-primary)" : "var(--surface-raised)",
                        color: sel ? "#fff" : "var(--text-body)",
                        transition: "border-color 0.18s ease, background 0.18s ease, color 0.18s ease",
                      }}
                    >
                      {timeLabel(s.start)}
                    </button>
                  )
                })}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted-fg)", marginTop: 10 }}>
                Times shown in your timezone ({timezone.replace(/_/g, " ")}).
              </p>

              {/* Details form — appears once a slot is picked */}
              {selectedSlot && activeDay && (
                <form onSubmit={onSubmit} noValidate className="flex flex-col" style={{ gap: 14, marginTop: 20, borderTop: "1px solid var(--border-ui)", paddingTop: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-body)" }}>
                    {dayLabel(activeDay.date).weekday} {dayLabel(activeDay.date).day} · {timeLabel(selectedSlot.start)} — 30 minutes
                  </div>
                  <div className="fr-sched-row" style={{ display: "grid", gap: 14 }}>
                    <label className="flex flex-col" style={{ gap: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Full name</span>
                      <input name="name" type="text" required className="form-field" />
                    </label>
                    <label className="flex flex-col" style={{ gap: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Work email</span>
                      <input name="email" type="email" required className="form-field" />
                    </label>
                  </div>
                  <div className="fr-sched-row" style={{ display: "grid", gap: 14 }}>
                    <label className="flex flex-col" style={{ gap: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Company (optional)</span>
                      <input name="company" type="text" className="form-field" />
                    </label>
                    <label className="flex flex-col" style={{ gap: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Phone (optional)</span>
                      <input name="phone" type="tel" className="form-field" />
                    </label>
                  </div>
                  <label className="flex flex-col" style={{ gap: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Anything we should prepare? (optional)</span>
                    <textarea name="notes" rows={3} className="form-field resize-y" />
                  </label>

                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                  {status === "error" && (
                    <p role="alert" style={{ color: "#c0392b", fontSize: 14 }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="cta-btn cta-btn-primary"
                    style={{ alignSelf: "flex-start", marginTop: 2, opacity: status === "sending" ? 0.7 : 1 }}
                  >
                    <span className="cta-btn-label">{status === "sending" ? "Booking…" : "Confirm booking"}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        .fr-sched-row { grid-template-columns: 1fr; }
        @media (min-width: 600px) {
          .fr-sched-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  )
}
