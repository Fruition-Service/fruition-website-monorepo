"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, CSSProperties, ReactNode } from "react"
import { useOfficeStrap } from "@/components/OfficeStrapProvider"

/**
 * Unified contact + booking section — dark brand band, big left copy, and a
 * white card on the right.
 *
 * BOOKING_MODE decides only what fills that card. Everything else — the band,
 * the left copy, the proof strap, the responsive rules — is identical either
 * way:
 *
 *   "consultant"  the custom picker: month grid + time column, three-step flow
 *                 (pick time → details → confirm) against the real calendar of
 *                 whoever covers the visitor's region
 *   "global"      Calendly's own inline widget on the shared account
 *
 * Both stay built and working; flipping the constant swaps the card back. The
 * picker below must not be deleted while "consultant" is still a mode.
 *
 * Availability comes from /api/scheduling/availability, which reads the shared
 * account's event type for the visitor's region (detected from Cloudflare's
 * cf-ipcountry, and correctable with the region switch above the grid). Slots
 * arrive as UTC instants; the visitor's timezone is auto-detected and
 * switchable, and all day grouping and time labels are derived client-side
 * with Intl.
 *
 * Details are captured by /api/scheduling/lead *before* the booking is
 * confirmed — that records the enquiry on the ILE board even if the visitor
 * never finishes — and the visitor then confirms on that regional booking page,
 * deep-linked to the slot they already chose with their details prefilled. The
 * consultant named on the card is who takes the call and owns the lead; the
 * meeting itself lands on the shared calendar. Nothing in the flow can block a
 * booking: every failure path still lands them on a calendar.
 */

/** A bookable slot: UTC ISO start, and which consultant owns it. */
interface Slot {
  start: string
  /** Consultant.key — a region may pool several calendars. */
  host: string
}

/** Mirrors LeadRegion in @/lib/leadNotify — redeclared so this client
 *  component doesn't pull the server-only lead pipeline into the bundle. */
export type BookingRegion = "APAC" | "SEA" | "IND" | "NA" | "UK"

/** A consultant in the region's pool. */
interface ConsultantInfo {
  key?: string
  name?: string
  firstName?: string
  /** Their own booking page — the fallback when live availability fails. */
  calendlyUrl?: string
  /** Sanity team photo — the same one used on /fruition-team. */
  photoUrl?: string | null
  role?: string | null
}

export type BookingMode = "global" | "consultant"

/**
 * What fills the booking card, site-wide. "global" while regional routing is
 * settled in Calendly — flip to "consultant" to bring the picker back.
 */
export const BOOKING_MODE: BookingMode = "consultant"

export interface BookingSectionProps {
  eyebrow?: string
  heading?: string
  sub?: string
  email?: string
  /** Overrides the CMS-driven office strap. Leave unset on real pages. */
  offices?: string
  proof?: string
  duration?: number
  askTeamSize?: boolean
  calendlyUrl?: string
  /** Defaults to BOOKING_MODE; pass it to override a single placement. */
  mode?: BookingMode
  /**
   * Pins the desk instead of detecting it, so one page can show every region
   * side by side. Only /contactustest passes this — real placements leave it
   * unset so cf-ipcountry decides and the visitor can still correct it.
   */
  forceRegion?: BookingRegion
}

const TZS: [string, string][] = [
  ["Australia/Sydney", "Sydney (AEST)"],
  ["Asia/Singapore", "Singapore (SGT)"],
  ["Asia/Kolkata", "India (IST)"],
  ["Europe/London", "London (BST)"],
  ["America/New_York", "New York (EDT)"],
  ["America/Los_Angeles", "Los Angeles (PDT)"],
]
/** The platforms we implement — answers "What should we prepare for?". */
const PLATFORMS = ["monday.com", "HubSpot", "ClickUp", "Make", "n8n", "Aircall", "Other"]

/**
 * The desks a visitor can book, and what to call them. Detection is right most
 * of the time and wrong loudly: a US company browsing from a Sydney office got
 * offered the ANZ desk, and there was no way to say otherwise. Picking here
 * re-fetches availability against that region's event type, so the correction
 * lands on the calendar as well as the CRM.
 */
const REGION_LABELS: [BookingRegion, string][] = [
  ["APAC", "Australia & NZ"],
  ["SEA", "South-East Asia"],
  ["IND", "India & UAE"],
  ["UK", "UK & Europe"],
  ["NA", "US & Canada"],
]
const SIZES = ["1–10", "11–50", "51–200", "200+"]
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ---------- helpers ---------- */
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
/* flex:none — the slot list is a scrolling flex column, so pills would
   otherwise shrink to their text height instead of scrolling. */
const pill = (sel: boolean, wide?: boolean): CSSProperties => ({
  display: "flex", alignItems: "center", justifyContent: "center", height: 38, flex: "none", padding: "0 16px",
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

/**
 * The consultant's face, from the same Sanity photo as /fruition-team.
 *
 * Falls back to their initials rather than a generic mark: not every team
 * member has a photo, and "NG" still tells the visitor a specific person is
 * taking the call. A plain <img> (not next/image) keeps the Sanity CDN out of
 * the remotePatterns config for what is a single 38px thumbnail.
 */
function Avatar({ name, photoUrl }: { name?: string; photoUrl?: string | null }) {
  const [broken, setBroken] = useState(false)
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
  const base: CSSProperties = {
    width: 38, height: 38, borderRadius: "50%", flex: "none",
    background: "var(--color-brand-soft)", color: "var(--purple-primary)",
  }
  if (photoUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl} alt={name ? `${name}, Fruition consultant` : ""}
        onError={() => setBroken(true)}
        style={{ ...base, objectFit: "cover" }}
      />
    )
  }
  return (
    <div aria-hidden={!initials} style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center", fontSize: initials.length > 1 ? 14 : 17, fontWeight: 700 }}>
      {initials || "F"}
    </div>
  )
}

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
const ERROR_COLOR = "#e2445c"

/**
 * `error` shows whenever the field holds something invalid and isn't currently
 * focused — no "touched" tracking, because a value that fails validation was
 * necessarily typed. Suppressing it while focused avoids correcting someone
 * mid-word; showing it the moment they look away is what stops a rejected
 * email from looking like a form that simply refuses to submit.
 */
function Field({ label: l, name, type = "text", placeholder, value, onChange, error }: {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
}) {
  const [focus, setFocus] = useState(false)
  const show = Boolean(error) && !focus
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={name} style={label}>{l}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
        aria-invalid={show || undefined}
        aria-describedby={show ? `${name}-error` : undefined}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          ...field,
          borderColor: show ? ERROR_COLOR : focus ? "var(--purple-primary)" : "var(--color-border)",
          boxShadow: focus ? `0 0 0 3px ${show ? "rgba(226,68,92,.22)" : "rgba(186,131,240,.25)"}` : "none",
        }}
      />
      {show && (
        <span id={`${name}-error`} role="alert" style={{ fontSize: 12.5, color: ERROR_COLOR }}>{error}</span>
      )}
    </div>
  )
}

/* ---------- the booking card ---------- */
interface BlankCell { blank: true; id: string }
interface DayCell { blank?: false; id: string; label: string; key: string; disabled: boolean }
type CalCell = BlankCell | DayCell

/** The account page every booking goes through. */
const CALENDLY_ACCOUNT = "https://calendly.com/global-calendar-fruitionservices"

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void
    }
  }
}
const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js"

/**
 * Calendly's own inline widget, filling the section's white card.
 *
 * `calendlyUrl` reaches us from Sanity via `bookingHref`, which rewrites
 * Calendly links to the on-site anchor (/contact-us#book) so CTA buttons stay
 * on the site. That's right for a link and very wrong for an embed — feeding it
 * in made the page iframe itself — so anything that isn't an absolute
 * calendly.com URL falls back to the account page.
 */
function CalendlyEmbed({ calendlyUrl, onScheduled }: { calendlyUrl?: string; onScheduled?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const src = calendlyUrl && /^https?:\/\/([a-z0-9-]+\.)?calendly\.com\//i.test(calendlyUrl)
    ? calendlyUrl
    : CALENDLY_ACCOUNT

  /**
   * Calendly's embed posts `calendly.event_scheduled` when a booking completes.
   * This is how the lead reaches "Meeting Booked": the invitee.created webhook
   * is scoped to the shared account and never fires for a consultant's own
   * calendar, so without this the item would stay in New Leads.
   *
   * Kept in a ref so the listener is installed once and can't miss the event by
   * being torn down and re-added on a re-render.
   */
  const scheduledRef = useRef(onScheduled)
  // Synced in an effect, not during render — writing a ref while rendering is
  // unsafe under concurrent rendering, which is why the lint rule flags it.
  useEffect(() => { scheduledRef.current = onScheduled }, [onScheduled])
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // Origin check first — any page can post to us.
      if (e.origin !== "https://calendly.com") return
      const data = e.data as { event?: string } | null
      if (data?.event !== "calendly.event_scheduled") return
      scheduledRef.current?.()
      // Same event also attributes the booking for OpenAI Ads (FRUIT-6). Kept in
      // this listener so the origin check above guards it too.
      const oaiq = (window as unknown as { oaiq?: (...args: unknown[]) => void }).oaiq
      if (typeof oaiq === "function") {
        oaiq("measure", "appointment_scheduled", { type: "customer_action" })
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  useEffect(() => {
    const embedUrl = `${src}${src.includes("?") ? "&" : "?"}hide_gdpr_banner=1&embed_type=Inline`
    const init = () => {
      if (!window.Calendly || !hostRef.current) return
      hostRef.current.innerHTML = ""
      window.Calendly.initInlineWidget({ url: embedUrl, parentElement: hostRef.current })
    }
    if (window.Calendly) {
      init()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener("load", init)
      return () => existing.removeEventListener("load", init)
    }
    const script = document.createElement("script")
    script.src = CALENDLY_SCRIPT
    script.async = true
    script.addEventListener("load", init)
    document.body.appendChild(script)
    return () => script.removeEventListener("load", init)
  }, [src])

  return <div ref={hostRef} style={{ width: "100%", height: 700 }} />
}

function BookingCard({ duration, askTeamSize, calendlyUrl, forceRegion }: {
  duration: number
  askTeamSize: boolean
  calendlyUrl: string
  forceRegion?: BookingRegion
}) {
  const [tz, setTz] = useState("Australia/Sydney")
  /**
   * The timezone we *detected*, kept apart from `tz` (which the visitor can
   * change). Only the detected one picks the region — switching the display
   * timezone to compare times must not reassign the lead to another desk.
   */
  const [detectedTz, setDetectedTz] = useState<string | null>(null)
  const [rawSlots, setRawSlots] = useState<Slot[] | null>(null)
  /**
   * The region the slots were fetched for, echoed back when booking.
   *
   * Both routes derive the region independently, but from different inputs —
   * /availability from the country header alone, /book from country *and* the
   * visitor's timezone. Wherever `cf-ipcountry` is absent those disagree (an
   * Asia/Singapore visitor gets APAC slots, then books against SEA), the slot
   * doesn't exist on that event type, and the booking silently falls back to
   * Calendly. Pinning it keeps both halves on one event type.
   */
  const [region, setRegion] = useState<BookingRegion | null>(null)
  /** Set when the visitor corrects the detected region — or pinned by a preview. */
  const [regionOverride, setRegionOverride] = useState<BookingRegion | null>(forceRegion ?? null)
  /**
   * Everyone covering this region. The card shows whoever owns the selected
   * slot, so in a pooled region the face changes when the visitor picks a time
   * only the second consultant has free.
   */
  const [pool, setPool] = useState<ConsultantInfo[]>([])
  const [failed, setFailed] = useState(false)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  // null = follow availability; a number = the visitor paged with ‹ ›
  const [monthOffsetOverride, setMonthOffsetOverride] = useState<number | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [f, setF] = useState<Record<string, string>>({})
  const [platform, setPlatform] = useState("")
  const [size, setSize] = useState("")
  const [showOptional, setShowOptional] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [bookingUrl, setBookingUrl] = useState("")
  /** The region's shared booking page, used when live availability fails. */
  const [regionBookingUrl, setRegionBookingUrl] = useState("")

  /* auto-detect timezone once. Set in an effect, not a lazy initial state, so
     server and client render the same thing on first paint. */
  useEffect(() => {
    let detected = "Australia/Sydney"
    try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || detected } catch { /* keep default */ }
    setTz(detected)
    setDetectedTz(detected)
  }, [])

  /* fetch the whole availability horizon once — UTC slots, regrouped per
     timezone. Waits for detection so the server can fall back to the browser
     timezone wherever cf-ipcountry is missing. */
  useEffect(() => {
    if (!detectedTz) return
    let live = true
    const q = new URLSearchParams({ tz: detectedTz })
    if (regionOverride) q.set("region", regionOverride)
    fetch(`/api/scheduling/availability?${q}`)
      .then((r) => r.json())
      .then((d: { slots?: Slot[]; region?: BookingRegion; consultants?: ConsultantInfo[]; bookingUrl?: string }) => {
        if (!live) return
        if (d.region) setRegion(d.region)
        if (d.bookingUrl) setRegionBookingUrl(d.bookingUrl)
        if (d.consultants?.length) setPool(d.consultants)
        if (d.slots && d.slots.length > 0) setRawSlots(d.slots)
        else setFailed(true)
      })
      .catch(() => { if (live) setFailed(true) })
    return () => { live = false }
  }, [detectedTz, regionOverride])

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

  /**
   * Whoever the card should be showing: the host of the selected slot, else the
   * region's first choice. In a pooled region picking an overflow time swaps the
   * photo and the name, so the visitor always sees who they'll actually meet.
   */
  const consultant = useMemo(
    () => (slot ? pool.find((c) => c.key === slot.host) : undefined) ?? pool[0],
    [pool, slot],
  )

  /** A slot belongs to the calendar it came from, so a desk change clears it. */
  function onRegionChange(next: BookingRegion) {
    if (next === (regionOverride ?? region)) return
    setRegionOverride(next)
    setRawSlots(null)
    setSlot(null)
    setDayKey(null)
    setMonthOffsetOverride(null)
    setFailed(false)
  }

  const onField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  /**
   * What's still missing, in the order the fields appear. Naming it on the
   * button matters: every field can look filled while the email is quietly
   * rejected, and a blanket "fill in your details" then reads as a form that
   * simply won't submit.
   */
  const emailValue = (f.email ?? "").trim()
  const emailError = emailValue && !EMAIL_RE.test(emailValue) ? "Enter a valid email, like you@company.com" : undefined
  const missing = !f.name?.trim()
    ? "Add your name to continue"
    : !emailValue
      ? "Add your work email to continue"
      : emailError
        ? "Check your work email to continue"
        : !f.company?.trim()
          ? "Add your company to continue"
          : !platform
            ? "Pick what we should prepare for"
            : null
  const ready = missing === null

  /* month grid cells — a day is enabled only if it has ≥1 slot in this tz */
  const todayKey = useMemo(() => dayFmt(tz).format(new Date()), [tz])

  /**
   * Months from now to the first month that actually has a slot. Opening on
   * the current month shows an empty grid whenever the month is booked out —
   * e.g. on 31 July the next opening is 3 August, so the visitor would land on
   * a July grid with every date greyed and assume there is no availability.
   * Derived rather than set from an effect so paging with ‹ › still wins.
   */
  const firstAvailableOffset = useMemo(() => {
    if (dayKeys.length === 0) return 0
    const t = partsOf(todayKey)
    const first = partsOf(dayKeys[0])
    return Math.max(0, (first.y - t.y) * 12 + (first.m - t.m))
  }, [dayKeys, todayKey])
  const monthOffset = monthOffsetOverride ?? firstAvailableOffset
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

  /**
   * Record the enquiry, then move to the confirm step. The lead lands on the
   * board here rather than after the booking, so someone who abandons on
   * Calendly is still a lead we know about — the invitee.created webhook later
   * promotes the ones who do finish.
   */
  async function onContinue() {
    if (!ready || !slot || sending) return
    setSending(true)
    setSubmitError("")
    try {
      const r = await fetch("/api/scheduling/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: slot.start,
          host: slot.host,
          name: f.name ?? "",
          email: f.email ?? "",
          company: f.company ?? "",
          title: f.title ?? "",
          phone: f.phone ?? "",
          service: platform,
          notes: f.message ?? "",
          teamSize: size,
          timezone: tz,
          // Confirm against the same consultant the slots came from.
          ...(region ? { region } : {}),
          // Attributes the lead to the page it was booked from.
          sourcePage: window.location.pathname,
          website: f.website ?? "",
        }),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; bookingUrl?: string }
      // A capture failure must not cost the booking — fall through to the
      // generic calendar rather than stranding them on the form.
      setBookingUrl(r.ok && body.ok && body.bookingUrl ? body.bookingUrl : calendlyUrl)
      setStep(3)
    } catch {
      setBookingUrl(calendlyUrl)
      setStep(3)
    } finally {
      setSending(false)
    }
  }

  /* ---- availability failed or empty: last-resort Calendly link ---- */
  if (failed) {
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18, minHeight: 414, padding: 30 }}>
        <span style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-text-secondary)", maxWidth: 380 }}>
          Live availability couldn&rsquo;t load just now &mdash; pick your time on our booking calendar instead.
        </span>
        {/* The region's own page on the shared account — the same desk the
            picker was about to offer. Only if the region never resolved do we
            fall through to the site-wide link. */}
        <CtaLink href={regionBookingUrl || calendlyUrl}>Open the booking calendar</CtaLink>
      </div>
    )
  }

  /* ---- loading ---- */
  if (rawSlots === null) {
    return (
      <div role="status" style={{ fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 414, padding: 30, fontSize: 15, color: "var(--color-text-secondary)" }}>
        Loading available times…
      </div>
    )
  }

  /* ---- step 3: confirm on the consultant's own calendar ---- */
  if (step === 3 && slot && dayKey) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 30px 14px" }}>
          <button
            type="button" onClick={() => setStep(2)} aria-label="Back to your details"
            style={{ flex: "none", width: 30, height: 30, borderRadius: 9999, border: "1px solid var(--color-border)", background: "#fff", color: "var(--text-dark)", fontSize: 16, lineHeight: 1, cursor: "pointer", fontFamily: "var(--font-sans)" }}
          >
            ‹
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text-dark)" }}>
              Last step — confirm {dayShort(dayKey)} at {fmtTime(slot.start, tz)}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
              {consultant?.firstName ? `${consultant.firstName} has your details already, just press Schedule.` : "Your details are filled in already, just press Schedule."}
            </span>
          </div>
        </div>
        <CalendlyEmbed
          calendlyUrl={bookingUrl || calendlyUrl}
          onScheduled={() => {
            // Fire-and-forget: the booking already exists in Calendly, this
            // only advances our CRM copy. keepalive so it survives the visitor
            // navigating away the moment they see "You are scheduled".
            void fetch("/api/scheduling/booked", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              keepalive: true,
              body: JSON.stringify({
                email: f.email ?? "",
                start: slot.start,
                timezone: tz,
                ...(region ? { region } : {}),
                host: slot.host,
              }),
            }).catch(() => { /* CRM status is best-effort; the meeting is booked either way */ })
          }}
        />
      </div>
    )
  }

  /* ---- step 2: details, slot pinned on top ---- */
  if (step === 2 && slot && dayKey) {
    const dd = partsOf(dayKey)
    return (
      <form
        onSubmit={(e) => { e.preventDefault(); onContinue() }}
        noValidate
        className="fr-booking-pad"
        // WebMCP tool attributes (see src/types/webmcp.d.ts).
        toolname="book_fruition_consultation"
        tooldescription="Book a free 30-minute consultation with a Fruition Services consultant at a chosen date and time. Requires the visitor's name, work email and, where asked, company and what they want to discuss. Confirmation lands on the consultant's calendar."
        style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: 18, padding: 30 }}
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
          <Field label="Name" name="name" placeholder="Alex Morgan" value={f.name || ""} onChange={onField} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Work email" name="email" type="email" placeholder="you@company.com" value={f.email || ""} onChange={onField} error={emailError} />
            <Field label="Company" name="company" placeholder="Acme Pty Ltd" value={f.company || ""} onChange={onField} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={label}>What should we prepare for?</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PLATFORMS.map((t) => (
                <button key={t} type="button" onClick={() => setPlatform(t)} style={chip(t === platform)}>{t}</button>
              ))}
            </div>
          </div>

          {/* The one thing that most changes how the call goes — asked up front,
              not buried behind a disclosure. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="message" style={label}>Anything we should read first? (optional)</label>
            <textarea
              id="message" name="message" rows={3} value={f.message || ""} onChange={onField}
              placeholder="We run sales in spreadsheets and quotes in email…"
              style={{ ...field, height: "auto", padding: "12px 16px", resize: "vertical", lineHeight: 1.55 }}
            />
          </div>

          {/* Everything the call can proceed without. Title and phone are
              genuinely useful to the consultant but asking for them up front
              makes a booking form look like a qualification form. */}
          {showOptional && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 2 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Title" name="title" placeholder="Head of Operations" value={f.title || ""} onChange={onField} />
                <Field label="Phone" name="phone" placeholder="+61 400 000 000" value={f.phone || ""} onChange={onField} />
              </div>
              {askTeamSize && (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={label}>How many people would use it?</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SIZES.map((s) => (
                      <button key={s} type="button" onClick={() => setSize(s)} style={chip(s === size)}>{s} people</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={() => setShowOptional((v) => !v)} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: "2px 0", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--purple-primary)", cursor: "pointer" }}>
            {showOptional
              ? "− Hide extra details"
              : askTeamSize ? "+ Add title, phone or team size (optional)" : "+ Add title or phone (optional)"}
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
          <Cta type="submit" disabled={!ready || sending}>
            {sending ? "One moment…" : (missing ?? "Continue to confirm")}
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
    <div className="fr-booking-pad" style={{ fontFamily: "var(--font-sans)", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: 20, padding: 30 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, flex: "1 1 240px", minWidth: 0 }}>
          <Avatar name={consultant?.name} photoUrl={consultant?.photoUrl} />
          {/* minWidth:0 + ellipsis so a long role ("Founder & CEO,
              ex-monday.com") truncates instead of wrapping the timezone
              picker onto its own line. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>Discovery call · {duration} min</span>
            <span
              title={consultant?.name ? `${consultant.name}${consultant.role ? ` · ${consultant.role}` : ""}` : undefined}
              style={{ fontSize: 12.5, color: "var(--color-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {consultant?.name
                ? `with ${consultant.name}${consultant.role ? ` · ${consultant.role}` : ""}`
                : "with a certified monday consultant"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: "none" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, flex: "none", height: 34, padding: "0 8px 0 12px", border: "1px solid var(--color-border)", borderRadius: 9999, background: "#fff" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M2.5 12h19" /><path d="M12 2.5c2.5 2.6 3.8 6 3.8 9.5S14.5 18.9 12 21.5c-2.5-2.6-3.8-6-3.8-9.5S9.5 5.1 12 2.5Z" /></svg>
          <select
            value={regionOverride ?? region ?? ""}
            onChange={(e) => onRegionChange(e.target.value as BookingRegion)}
            aria-label="Which region are you in?"
            style={{ border: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--color-text-secondary)", outline: "none", cursor: "pointer", height: 32 }}
          >
            {region == null && <option value="">Region</option>}
            {REGION_LABELS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, flex: "none", height: 34, padding: "0 8px 0 12px", border: "1px solid var(--color-border)", borderRadius: 9999, background: "#fff" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5l3 2" /></svg>
          <select value={tz} onChange={(e) => setTz(e.target.value)} style={{ border: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--color-text-secondary)", outline: "none", cursor: "pointer", height: 32 }}>
            {(TZS.some((x) => x[0] === tz) ? TZS : ([[tz, `${tzLabel(tz)} · detected`] as [string, string], ...TZS])).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        </div>
      </div>

      <div className="fr-booking-card-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 20, alignItems: "start" }}>
        {/* month grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>
              {MONTH_FULL[monthBase.getMonth()]} {monthBase.getFullYear()}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" disabled={monthOffset <= firstAvailableOffset} onClick={() => setMonthOffsetOverride(Math.max(firstAvailableOffset, monthOffset - 1))} style={navBtn(monthOffset <= firstAvailableOffset)} aria-label="Previous month">‹</button>
              <button type="button" onClick={() => setMonthOffsetOverride(monthOffset + 1)} style={navBtn(false)} aria-label="Next month">›</button>
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


      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Cta disabled={slot == null} onClick={() => { if (slot != null) { setSubmitError(""); setStep(2) } }}>
          {slot == null || !dayKey ? "Pick a time to continue" : `Continue · ${dayShort(dayKey)} at ${fmtTime(slot.start, tz)}`}
        </Cta>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>
          {consultant?.firstName ? `Live availability \u00b7 you'll meet ${consultant.firstName}` : "Live availability \u00b7 confirmed instantly"}
        </span>
      </div>
    </div>
  )
}

/* ---------- the section ---------- */
export default function BookingSection({
  eyebrow = "See it on your pipeline",
  heading = "Watch your sales process run on monday CRM.",
  sub = "Pick a time and we'll map your pipeline live on the call: your stages, your handoffs, your reporting. No slides.",
  email = "contact@fruitionservices.io",
  offices,
  proof = "Platinum monday.com partner · 500+ implementations",
  duration = 30,
  askTeamSize = true,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
  mode = BOOKING_MODE,
  forceRegion,
}: BookingSectionProps) {
  // The office strap follows the CMS office list (see OfficeStrapProvider) so
  // adding or renaming an office is a single edit in Sanity.
  const officeStrapText = useOfficeStrap()
  return (
    <section id="book" className="fr-booking-section" style={{ position: "relative", scrollMarginTop: 90, background: "linear-gradient(-38deg,#8015e8 0%,#4b0d8f 42%,#10003a 100%)", padding: "84px 72px", overflow: "hidden" }}>
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
              {offices ?? officeStrapText}
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

        {/* No padding here — each step sets its own, because the Calendly
            step is flush to the card edge while the picker and form are inset.
            overflow:hidden keeps the flush iframe inside the rounded corners. */}
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 34px 70px -26px rgba(8,0,32,.65)", overflow: "hidden", minHeight: 474 }}>
          {mode === "consultant" ? (
            <BookingCard duration={duration} askTeamSize={askTeamSize} calendlyUrl={calendlyUrl} forceRegion={forceRegion} />
          ) : (
            // No onScheduled: nothing was captured up front, so there is no lead
            // to promote — the shared account's invitee.created webhook records
            // the booking instead.
            <CalendlyEmbed calendlyUrl={calendlyUrl} />
          )}
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
          .fr-booking-pad { padding: 20px !important; }
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
