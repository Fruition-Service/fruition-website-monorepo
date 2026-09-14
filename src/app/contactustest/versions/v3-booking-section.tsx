"use client"

/**
 * ARCHIVED SNAPSHOT — src/components/sections/BookingSection.tsx as of a589fcd (29 July 2026, PR #86).
 *
 * Picker and form folded into one surface: choose a time, then give your details.
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
import type { ChangeEvent, CSSProperties, ReactNode } from "react"

/**
 * Unified contact + booking section — dark brand band, big left copy, month
 * grid + time column card, three-step flow (pick time → details → confirmed).
 *
 * Availability comes from /api/scheduling/availability (regional event type
 * picked server-side from the visitor's location, slots in UTC); bookings go
 * through /api/scheduling/book, which also records the lead on the ILE board.
 * The visitor's timezone is auto-detected and can be switched manually — all
 * day grouping and time labels are derived client-side with Intl. When the
 * booking API is unavailable the visitor finishes on the slot's own Calendly
 * page, so a booking is never blocked.
 */

interface Slot {
  start: string
  url: string
}

export interface BookingSectionProps {
  eyebrow?: string
  heading?: string
  sub?: string
  email?: string
  offices?: string
  proof?: string
  duration?: number
  askTeamSize?: boolean
  calendlyUrl?: string
}

const TZS: [string, string][] = [
  ["Australia/Sydney", "Sydney (AEST)"],
  ["Asia/Singapore", "Singapore (SGT)"],
  ["Asia/Kolkata", "India (IST)"],
  ["Europe/London", "London (BST)"],
  ["America/New_York", "New York (EDT)"],
  ["America/Los_Angeles", "Los Angeles (PDT)"],
]
const TOPICS = [
  "monday.com implementation", "Workflow automation", "Integrations & Make",
  "Training & enablement", "CRM & sales ops", "Something else",
]
const SIZES = ["1–10", "11–50", "51–200", "200+"]
const OFFICES = ["Australia", "United States", "United Kingdom", "Singapore", "India", "Somewhere else"]
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ---------- helpers ---------- */
function officeFor(tz: string): string {
  if (/Australia/.test(tz)) return "Australia"
  if (/America/.test(tz)) return "United States"
  if (/London|Dublin/.test(tz)) return "United Kingdom"
  if (/Singapore|Kuala/.test(tz)) return "Singapore"
  if (/Kolkata|Calcutta/.test(tz)) return "India"
  return "Somewhere else"
}
function tzLabel(tz: string): string {
  const hit = TZS.find((x) => x[0] === tz)
  return hit ? hit[1] : (tz.split("/").pop() ?? tz).replace(/_/g, " ")
}
/** "YYYY-MM-DD" of a UTC instant in the given timezone. */
function dayFmt(tz: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
}
/** Slot label in the given timezone — 12h for the Americas, 24h elsewhere. */
function fmtTime(iso: string, tz: string): string {
  const h12 = /America/.test(tz)
  return new Date(iso).toLocaleTimeString(h12 ? "en-US" : "en-GB", {
    hour: "numeric", minute: "2-digit", timeZone: tz, hour12: h12,
  })
}
function partsOf(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split("-").map(Number)
  return { y, m, d }
}
const dayShort = (key: string): string => {
  const { y, m, d } = partsOf(key)
  const dt = new Date(y, m - 1, d)
  return `${DOW[(dt.getDay() + 6) % 7]} ${d} ${MON[m - 1]}`
}

/* ---------- atoms ---------- */
const pill = (sel: boolean, wide?: boolean): CSSProperties => ({
  display: "flex", alignItems: "center", justifyContent: "center", height: 38, padding: "0 16px",
  width: wide ? "100%" : undefined, borderRadius: 9999, fontFamily: "var(--font-sans)", fontSize: 14,
  fontWeight: 600, cursor: "pointer", border: `1px solid ${sel ? "transparent" : "var(--color-border)"}`,
  background: sel ? "var(--purple-primary)" : "#fff", color: sel ? "#fff" : "var(--text-dark)",
  boxShadow: sel ? "0 6px 18px -8px rgba(128,21,232,.55)" : "none", transition: "all .16s ease",
})
const chip = (sel: boolean): CSSProperties => ({
  height: 36, padding: "0 15px", borderRadius: 9999, fontFamily: "var(--font-sans)", fontSize: 13.5,
  fontWeight: 500, cursor: "pointer", border: `1px solid ${sel ? "var(--purple-primary)" : "var(--color-border)"}`,
  background: sel ? "var(--color-brand-soft)" : "#fff", color: sel ? "var(--purple-primary)" : "var(--text-dark)",
  transition: "all .16s ease",
})
const cell = (sel: boolean, dis: boolean): CSSProperties => ({
  height: 40, borderRadius: 10, border: "1px solid transparent", fontFamily: "var(--font-sans)",
  fontSize: 13.5, fontWeight: 600, cursor: dis ? "default" : "pointer",
  background: sel ? "var(--purple-primary)" : dis ? "transparent" : "var(--color-brand-soft)",
  color: sel ? "#fff" : dis ? "#c8c8d4" : "var(--text-dark)",
  boxShadow: sel ? "0 6px 18px -8px rgba(128,21,232,.55)" : "none", transition: "all .16s ease",
})
const navBtn = (dis: boolean): CSSProperties => ({
  width: 30, height: 30, borderRadius: 9999, border: "1px solid var(--color-border)", background: "#fff",
  color: dis ? "#c8c8d4" : "var(--text-dark)", fontSize: 16, lineHeight: 1,
  cursor: dis ? "default" : "pointer", fontFamily: "var(--font-sans)",
})
const label: CSSProperties = { fontSize: 14, fontWeight: 500, color: "var(--text-dark)" }
const field: CSSProperties = {
  height: 48, padding: "0 16px", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-dark)",
  background: "#fff", border: "1px solid var(--color-border)", borderRadius: 10,
  outline: "none", transition: "border-color .16s ease, box-shadow .16s ease",
}

/* Pill CTA — gradient at rest, solid brand-dark on hover (.cta-btn-primary:hover) */
const ctaStyle = (hover: boolean, disabled?: boolean): CSSProperties => ({
  display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 53,
  padding: "0 28px", borderRadius: 9999, border: "1px solid transparent", fontFamily: "var(--font-sans)",
  fontSize: 16, fontWeight: 700, letterSpacing: ".32px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  backgroundImage: hover && !disabled ? "none" : "linear-gradient(to right, var(--purple-primary), var(--purple-light))",
  backgroundColor: hover && !disabled ? "var(--purple-dark)" : undefined,
  transition: "background-color .18s ease, background-image .18s ease",
})

function Cta({ children, disabled, onClick, type = "button" }: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={ctaStyle(hover, disabled)}
    >
      {children}
    </button>
  )
}
function CtaLink({ children, href }: { children: ReactNode; href: string }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...ctaStyle(hover), width: undefined, display: "inline-flex", textDecoration: "none" }}
    >
      {children}
    </a>
  )
}
function Field({ label: l, name, type = "text", placeholder, value, onChange }: {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={name} style={label}>{l}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          ...field,
          borderColor: focus ? "var(--purple-primary)" : "var(--color-border)",
          boxShadow: focus ? "0 0 0 3px rgba(186,131,240,.25)" : "none",
        }}
      />
    </div>
  )
}

/* ---------- the booking card ---------- */
interface BlankCell { blank: true; id: string }
interface DayCell { blank?: false; id: string; label: string; key: string; disabled: boolean }
type CalCell = BlankCell | DayCell

function BookingCard({ duration, askTeamSize, calendlyUrl }: {
  duration: number
  askTeamSize: boolean
  calendlyUrl: string
}) {
  const [tz, setTz] = useState("Australia/Sydney")
  const [rawSlots, setRawSlots] = useState<Slot[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [f, setF] = useState<Record<string, string>>({})
  const [topic, setTopic] = useState("")
  const [size, setSize] = useState("")
  const [office, setOffice] = useState("Australia")
  const [showOptional, setShowOptional] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [fallbackNote, setFallbackNote] = useState(false)

  /* auto-detect timezone once */
  useEffect(() => {
    let detected = "Australia/Sydney"
    try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || detected } catch { /* keep default */ }
    setTz(detected)
    setOffice(officeFor(detected))
  }, [])

  /* fetch ~14 days of availability once — UTC slots, regrouped per timezone */
  useEffect(() => {
    let live = true
    fetch("/api/scheduling/availability")
      .then((r) => r.json())
      .then((d: { slots?: Slot[] }) => {
        if (!live) return
        if (d.slots && d.slots.length > 0) setRawSlots(d.slots)
        else setFailed(true)
      })
      .catch(() => { if (live) setFailed(true) })
    return () => { live = false }
  }, [])

  /* group slots by calendar day in the selected timezone */
  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>()
    if (!rawSlots) return map
    const fmt = dayFmt(tz)
    for (const s of [...rawSlots].sort((a, b) => a.start.localeCompare(b.start))) {
      const key = fmt.format(new Date(s.start))
      const list = map.get(key)
      if (list) list.push(s)
      else map.set(key, [s])
    }
    return map
  }, [rawSlots, tz])
  const dayKeys = useMemo(() => [...slotsByDay.keys()].sort(), [slotsByDay])

  /* keep the selection sensible when slots load or the timezone changes */
  useEffect(() => {
    if (dayKeys.length === 0) return
    if (slot) {
      const k = dayFmt(tz).format(new Date(slot.start))
      if (k !== dayKey) setDayKey(k)
      return
    }
    if (!dayKey || !slotsByDay.has(dayKey)) setDayKey(dayKeys[0])
  }, [slotsByDay, dayKeys, dayKey, slot, tz])

  const onField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const ready = Boolean(f.first && f.last && f.email && EMAIL_RE.test(f.email) && f.company && topic)

  /* month grid cells — a day is enabled only if it has ≥1 slot in this tz */
  const todayKey = useMemo(() => dayFmt(tz).format(new Date()), [tz])
  const cells = useMemo<CalCell[]>(() => {
    const t = partsOf(todayKey)
    const base = new Date(t.y, t.m - 1 + monthOffset, 1)
    const y = base.getFullYear(), m = base.getMonth()
    const lead = (new Date(y, m, 1).getDay() + 6) % 7
    const last = new Date(y, m + 1, 0).getDate()
    const out: CalCell[] = Array.from({ length: lead }, (_, i) => ({ blank: true as const, id: `b${i}` }))
    for (let d = 1; d <= last; d++) {
      const k = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      out.push({ id: k, label: String(d), key: k, disabled: !slotsByDay.has(k) })
    }
    return out
  }, [monthOffset, todayKey, slotsByDay])

  const monthBase = useMemo(() => {
    const t = partsOf(todayKey)
    return new Date(t.y, t.m - 1 + monthOffset, 1)
  }, [todayKey, monthOffset])

  async function onBook() {
    if (!ready || !slot || sending) return
    setSending(true)
    setSubmitError("")
    setFallbackNote(false)
    try {
      const r = await previewWrite("/api/scheduling/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.start,
          slotUrl: slot.url,
          firstName: f.first ?? "",
          lastName: f.last ?? "",
          email: f.email ?? "",
          company: f.company ?? "",
          phone: f.phone ?? "",
          service: topic,
          notes: f.message ?? "",
          teamSize: size,
          office,
          timezone: tz,
          website: f.website ?? "",
        }),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; fallbackUrl?: string | null }
      if (r.ok && body.ok) {
        setStep(3)
      } else if (body.fallbackUrl) {
        // API booking unavailable — finish on Calendly with details prefilled.
        window.open(body.fallbackUrl, "_blank", "noopener")
        setFallbackNote(true)
      } else {
        setSubmitError("That slot may have just been taken — pick another time.")
      }
    } catch {
      setSubmitError("That slot may have just been taken — pick another time.")
    } finally {
      setSending(false)
    }
  }

  /* ---- availability failed or empty: last-resort Calendly link ---- */
  if (failed) {
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18, minHeight: 414, padding: "22px 8px" }}>
        <span style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-text-secondary)", maxWidth: 380 }}>
          Live availability couldn&rsquo;t load just now — pick your time on our calendar instead.
        </span>
        <CtaLink href={calendlyUrl}>Open the booking calendar</CtaLink>
      </div>
    )
  }

  /* ---- loading ---- */
  if (rawSlots === null) {
    return (
      <div role="status" style={{ fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 414, fontSize: 15, color: "var(--color-text-secondary)" }}>
        Loading available times…
      </div>
    )
  }

  /* ---- step 3: confirmed ---- */
  if (step === 3 && slot && dayKey) {
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "22px 8px 10px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,202,114,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#0a8c52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.015em" }}>You&rsquo;re booked in</span>
          <span style={{ fontSize: 15, color: "var(--color-text-secondary)", maxWidth: 400 }}>
            {dayShort(dayKey)} at {fmtTime(slot.start, tz)} · {duration} minutes. The invite is on its way to {f.email || "your inbox"}.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, textAlign: "left", marginTop: 8, padding: "13px 15px", borderRadius: 14, background: "var(--color-brand-soft)", border: "1px solid var(--border-ui)" }}>
          <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
            Your notes are already on the consultant&rsquo;s board — they&rsquo;ll read them before the call, so you won&rsquo;t repeat yourself.
          </span>
        </div>
        <button type="button" onClick={() => { setStep(1); setSlot(null) }} style={{ background: "none", border: "none", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600, color: "var(--purple-primary)", cursor: "pointer", padding: 4 }}>
          Need a different time?
        </button>
      </div>
    )
  }

  /* ---- step 2: details, slot pinned on top ---- */
  if (step === 2 && slot && dayKey) {
    const dd = partsOf(dayKey)
    return (
      <form
        onSubmit={(e) => { e.preventDefault(); onBook() }}
        noValidate
        style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: 18 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderRadius: 14, background: "var(--color-brand-soft)", border: "1px solid var(--border-ui)" }}>
          <div style={{ width: 40, height: 42, borderRadius: 10, background: "#fff", border: "1px solid var(--border-ui)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".07em", color: "var(--purple-primary)" }}>{MON[dd.m - 1].toUpperCase()}</span>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.1 }}>{dd.d}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>
              {dayShort(dayKey)} · {fmtTime(slot.start, tz)}
            </span>
            <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{duration} min · Google Meet · {tzLabel(tz)}</span>
          </div>
          <button type="button" onClick={() => setStep(1)} style={{ flex: "none", height: 32, padding: "0 14px", borderRadius: 9999, border: "1px solid var(--color-border)", background: "#fff", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600, color: "var(--purple-primary)", cursor: "pointer" }}>
            Change
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First name" name="first" placeholder="Alex" value={f.first || ""} onChange={onField} />
            <Field label="Last name" name="last" placeholder="Morgan" value={f.last || ""} onChange={onField} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Work email" name="email" type="email" placeholder="you@company.com" value={f.email || ""} onChange={onField} />
            <Field label="Company" name="company" placeholder="Acme Pty Ltd" value={f.company || ""} onChange={onField} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={label}>What should we prepare for?</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOPICS.map((t) => (
                <button key={t} type="button" onClick={() => setTopic(t)} style={chip(t === topic)}>{t}</button>
              ))}
            </div>
          </div>

          {showOptional && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 2 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Phone (optional)" name="phone" placeholder="+61 400 000 000" value={f.phone || ""} onChange={onField} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="office" style={label}>Which office should take this?</label>
                  <select id="office" value={office} onChange={(e) => setOffice(e.target.value)} style={{ ...field, cursor: "pointer" }}>
                    {OFFICES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {askTeamSize && (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={label}>How many people would use monday? (optional)</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SIZES.map((s) => (
                      <button key={s} type="button" onClick={() => setSize(s)} style={chip(s === size)}>{s} people</button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="message" style={label}>Anything we should read first? (optional)</label>
                <textarea
                  id="message" name="message" rows={3} value={f.message || ""} onChange={onField}
                  placeholder="We run sales in spreadsheets and quotes in email…"
                  style={{ ...field, height: "auto", padding: "12px 16px", resize: "vertical", lineHeight: 1.55 }}
                />
              </div>
            </div>
          )}

          <button type="button" onClick={() => setShowOptional((v) => !v)} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: "2px 0", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--purple-primary)", cursor: "pointer" }}>
            {showOptional ? "− Hide extra details" : "+ Add phone, team size or a note (optional)"}
          </button>
        </div>

        {/* Honeypot — must stay empty */}
        <input
          type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={f.website || ""} onChange={onField}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {submitError && (
            <span role="alert" style={{ fontSize: 13, color: "#e2445c", textAlign: "center" }}>
              {submitError}{" "}
              <button
                type="button"
                onClick={() => { setStep(1); setSlot(null); setSubmitError("") }}
                style={{ background: "none", border: "none", padding: 0, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--purple-primary)", cursor: "pointer", textDecoration: "underline" }}
              >
                Pick another time
              </button>
            </span>
          )}
          {fallbackNote && (
            <span role="status" style={{ fontSize: 12.5, color: "var(--color-text-secondary)", textAlign: "center" }}>
              Almost there — your booking continues on the Calendly page we just opened.
            </span>
          )}
          <Cta type="submit" disabled={!ready || sending}>
            {sending ? "Booking…" : ready ? "Confirm booking" : "Fill in your details to confirm"}
          </Cta>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>
            By booking you agree to our privacy policy. We never share your details.
          </span>
        </div>
      </form>
    )
  }

  /* ---- step 1: pick a time ---- */
  const daySlots = dayKey ? slotsByDay.get(dayKey) ?? [] : []
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--color-brand-soft)", color: "var(--purple-primary)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700 }}>
            F
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>Discovery call · {duration} min</span>
            <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>with a certified monday consultant</span>
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, flex: "none", height: 34, padding: "0 8px 0 12px", border: "1px solid var(--color-border)", borderRadius: 9999, background: "#fff" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5l3 2" /></svg>
          <select value={tz} onChange={(e) => { setTz(e.target.value); setOffice(officeFor(e.target.value)) }} style={{ border: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--color-text-secondary)", outline: "none", cursor: "pointer", height: 32 }}>
            {(TZS.some((x) => x[0] === tz) ? TZS : ([[tz, `${tzLabel(tz)} · detected`] as [string, string], ...TZS])).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="fr-booking-card-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 20, alignItems: "start" }}>
        {/* month grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>
              {MONTH_FULL[monthBase.getMonth()]} {monthBase.getFullYear()}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" disabled={monthOffset <= 0} onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} style={navBtn(monthOffset <= 0)} aria-label="Previous month">‹</button>
              <button type="button" onClick={() => setMonthOffset((m) => m + 1)} style={navBtn(false)} aria-label="Next month">›</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
              <span key={i} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", color: "var(--color-text-secondary)", textAlign: "center" }}>{w}</span>
            ))}
            {cells.map((c) =>
              c.blank
                ? <span key={c.id} style={{ height: 40 }} />
                : <button key={c.id} type="button" disabled={c.disabled} onClick={() => { setDayKey(c.key); setSlot(null) }} style={cell(c.key === dayKey, c.disabled)}>{c.label}</button>
            )}
          </div>
        </div>

        {/* time column — scrolls vertically, never wraps sideways */}
        <div className="fr-booking-times" style={{ display: "flex", flexDirection: "column", gap: 9, paddingLeft: 20, borderLeft: "1px solid var(--border-ui)", minHeight: 230, maxHeight: 318 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-text-secondary)", flex: "none" }}>
            {dayKey ? (() => { const dd = partsOf(dayKey); const dt = new Date(dd.y, dd.m - 1, dd.d); return `${DOW[(dt.getDay() + 6) % 7]} ${dd.d} ${MONTH_FULL[dd.m - 1]}` })() : "Pick a day"}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", paddingRight: 4, marginRight: -4 }}>
            {daySlots.map((s) => (
              <button key={s.start} type="button" onClick={() => setSlot(s)} style={pill(s.start === slot?.start, true)}>{fmtTime(s.start, tz)}</button>
            ))}
            {daySlots.length === 0 && (
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Nothing open — try another day.</span>
            )}
          </div>
        </div>
      </div>

      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
        Times shown in {tzLabel(tz)} — we detected your timezone, switch it above if that&rsquo;s wrong.
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Cta disabled={slot == null} onClick={() => { if (slot != null) { setSubmitError(""); setFallbackNote(false); setStep(2) } }}>
          {slot == null || !dayKey ? "Pick a time to continue" : `Continue · ${dayShort(dayKey)} at ${fmtTime(slot.start, tz)}`}
        </Cta>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>
          Two fields and you&rsquo;re booked · calendar invite sent instantly
        </span>
      </div>
    </div>
  )
}

/* ---------- the section ---------- */
export default function BookingSection({
  eyebrow = "See it on your pipeline",
  heading = "Watch your sales process run on monday CRM.",
  sub = "Pick a time and we'll map your pipeline live on the call — your stages, your handoffs, your reporting. No slides.",
  email = "contact@fruitionservices.io",
  offices = "Sydney · New York · London · Singapore · Bengaluru",
  proof = "Platinum monday.com partner · 500+ implementations",
  duration = 30,
  askTeamSize = true,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
}: BookingSectionProps) {
  return (
    <section className="fr-booking-section" style={{ position: "relative", background: "linear-gradient(-38deg,#8015e8 0%,#4b0d8f 42%,#10003a 100%)", padding: "84px 72px", overflow: "hidden" }}>
      {/* brand glow motif */}
      <div aria-hidden="true" style={{ position: "absolute", top: -160, right: -120, width: 620, height: 620, borderRadius: "50%", opacity: 0.5, mixBlendMode: "screen", pointerEvents: "none", background: "radial-gradient(circle, rgba(255,255,255,0.28), rgba(255,255,255,0))" }} />

      <div style={{ position: "relative", maxWidth: 1276, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="fr-booking-grid">
        <div>
          <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--purple-light)" }}>{eyebrow}</span>
          <h2 style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-.02em", color: "#fff", margin: "16px 0 18px", textWrap: "pretty" }}>{heading}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.78)", margin: 0, maxWidth: 460, textWrap: "pretty" }}>{sub}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 38 }}>
            <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#fff", fontSize: 15, fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>
              {email}
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: 12, color: "#fff", fontSize: 15, fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
              {offices}
            </span>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,.18)", margin: "32px 0 20px", maxWidth: 460 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "flex", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ca72" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fdab3d" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e2445c" }} />
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.72)", letterSpacing: ".01em" }}>{proof}</span>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 34px 70px -26px rgba(8,0,32,.65)", padding: 30, minHeight: 474 }}>
          <BookingCard duration={duration} askTeamSize={askTeamSize} calendlyUrl={calendlyUrl} />
        </div>
      </div>

      {/* stack on mobile */}
      <style>{`
        @media (max-width: 960px) {
          .fr-booking-section { padding: 64px 20px !important; }
          .fr-booking-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .fr-booking-grid h2 { font-size: 34px !important; }
        }
        @media (max-width: 560px) {
          .fr-booking-card-grid { grid-template-columns: 1fr !important; }
          .fr-booking-times {
            padding-left: 0 !important;
            border-left: none !important;
            border-top: 1px solid var(--border-ui);
            padding-top: 14px;
            min-height: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
