"use client"

import { useId, useState, type FormEvent } from "react"
import { CalendarDays, CheckCircle2, Send } from "lucide-react"
import { HANDOFF_SOURCE, handoffFields } from "@/lib/askFruit/handoff"
import { buildRoughQuote, totalLine, type RoughQuote } from "@/lib/askFruit/quote"
import type { EvaluationDetail } from "@/lib/askFruit/types"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
export const BOOKING_FALLBACK_URL = "/contact-us#book"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PRIMARY_ACTION =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
export const SECONDARY_ACTION =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border border-brand bg-surface px-5 text-[14px] font-semibold text-brand transition-colors hover:bg-tint focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
const INPUT =
  "h-11 w-full rounded-chip border border-ui bg-surface px-3 text-[14px] text-ink outline-none placeholder:text-faint focus-visible:border-brand"

type SendState = "idle" | "sending" | "sent" | "failed"

/**
 * "Send to our team": a three-field form that files the conversation goal, the
 * matched offerings and the rough quote through the existing /api/leads
 * pipeline (monday first, Slack if monday fails). It never stands between the
 * visitor and a booking; every state keeps the booking path one click away.
 */
export function SendToTeamForm({ evaluation, quote, onDone }: { evaluation: EvaluationDetail; quote: RoughQuote | null; onDone?: () => void }) {
  const id = useId()
  const [state, setState] = useState<SendState>("idle")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [website, setWebsite] = useState("")
  const [touched, setTouched] = useState(false)

  const emailOk = EMAIL_RE.test(email.trim())
  const ready = name.trim() !== "" && emailOk

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!ready || state === "sending") return
    setState("sending")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          source: HANDOFF_SOURCE,
          fields: { ...handoffFields(evaluation, quote), Page: window.location.pathname },
          website,
        }),
      })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean }
      setState(res.ok && body.ok ? "sent" : "failed")
      if (res.ok && body.ok) onDone?.()
    } catch {
      setState("failed")
    }
  }

  if (state === "sent") {
    return (
      <p className="flex items-start gap-2 rounded-chip border border-ui bg-surface p-3 text-[13.5px] leading-snug text-ink" role="status">
        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald" aria-hidden />
        <span>Sent. A Fruition consultant will review your goal, matches and rough quote and reply by email.</span>
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded-chip border border-ui bg-surface p-3">
      <p className="text-[13px] leading-snug text-muted">
        We send your goal, the matched solutions and the rough quote with it, so you do not have to repeat yourself.
      </p>
      <div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink" htmlFor={`${id}-name`}>
          Name
          <input id={`${id}-name`} className={INPUT} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink" htmlFor={`${id}-email`}>
          Work email
          <input
            id={`${id}-email`}
            type="email"
            className={INPUT}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={touched && !emailOk}
          />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink" htmlFor={`${id}-company`}>
          Company (optional)
          <input id={`${id}-company`} className={INPUT} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
        </label>
      </div>
      {/* Honeypot: must stay empty. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="pointer-events-none absolute h-px w-px -translate-x-[9999px] opacity-0"
      />
      {touched && !ready ? (
        <p className="text-[12.5px] text-ink" role="alert">
          {name.trim() ? "Check your work email." : "Add your name and work email."}
        </p>
      ) : null}
      {state === "failed" ? (
        <p className="rounded-chip border border-lilac-strong bg-tint p-3 text-[13px] leading-snug text-ink" role="alert">
          That did not send. Try again, email{" "}
          <a href="mailto:contact@fruitionservices.io" className="font-semibold text-brand underline">
            contact@fruitionservices.io
          </a>
          , or book a call instead.
        </p>
      ) : null}
      <button type="submit" disabled={state === "sending"} className={PRIMARY_ACTION}>
        <Send size={15} aria-hidden />
        {state === "sending" ? "Sending…" : state === "failed" ? "Try again" : "Send to our team"}
      </button>
    </form>
  )
}

/**
 * The two one-click hand-offs. "Book a call" opens the inline booking card
 * when the caller can show one, and otherwise links to the contact page's.
 */
export function HandoffActions({
  evaluation,
  quote,
  onBook,
}: {
  evaluation: EvaluationDetail
  quote: RoughQuote | null
  onBook?: () => void
}) {
  const [sendOpen, setSendOpen] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {onBook ? (
          <button type="button" onClick={onBook} className={`${PRIMARY_ACTION} grow basis-44 whitespace-nowrap`}>
            <CalendarDays size={15} aria-hidden /> Book a call
          </button>
        ) : (
          <a href={BOOKING_FALLBACK_URL} className={`${PRIMARY_ACTION} grow basis-44 whitespace-nowrap`}>
            <CalendarDays size={15} aria-hidden /> Book a call
          </a>
        )}
        <button type="button" onClick={() => setSendOpen((v) => !v)} aria-expanded={sendOpen} className={`${SECONDARY_ACTION} grow basis-44 whitespace-nowrap`}>
          <Send size={15} aria-hidden /> Send to our team
        </button>
      </div>
      {sendOpen ? <SendToTeamForm evaluation={evaluation} quote={quote} /> : null}
    </div>
  )
}

/** Documented package prices for the shortlist (or every match), totalled, plus the hand-off. */
export function RoughQuoteCard({ evaluation, onBook }: { evaluation: EvaluationDetail; onBook?: () => void }) {
  const quote = buildRoughQuote(evaluation)
  if (!quote) return null
  return (
    <section className="flex flex-col gap-3 rounded-chip border border-ui bg-surface p-4" aria-labelledby="af-quote">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="af-quote" className={`${EYEBROW} text-brand`}>
          Rough quote
        </h3>
        <span className="font-mono text-[11px] text-muted">{quote.basis === "shortlist" ? "Your shortlist" : "All matches"}</span>
      </div>
      <dl className="flex flex-col">
        {quote.lines.map((line) => (
          <div key={line.offering_id} className="flex flex-col gap-0.5 border-t border-dashed border-ui py-2 text-[12.5px]">
            <dt className="font-medium text-ink">{line.title}</dt>
            <dd className={`flex flex-wrap justify-between gap-x-3 font-mono ${line.priced ? "text-ink" : "text-muted"}`}>
              <span>{line.price}</span>
              {line.hours ? <span className="text-muted">{line.hours}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-ui pt-3">
        <p className="text-[12px] font-medium text-muted">Total of documented prices</p>
        <p className="mt-0.5 text-[15px] font-semibold text-ink">{totalLine(quote)}</p>
        <p className="mt-1.5 text-[12px] leading-snug text-muted">
          {quote.basis === "matches" ? "Shortlist the options you want and the total follows. " : ""}A consultant confirms scope, price and
          timeline in your proposal.
        </p>
      </div>
      <HandoffActions evaluation={evaluation} quote={quote} onBook={onBook} />
    </section>
  )
}
