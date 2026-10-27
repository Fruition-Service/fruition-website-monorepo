"use client"

import { useState, type FormEvent } from "react"
import { CalendarDays, Send } from "lucide-react"
import { BOOKING_ANCHOR } from "@/lib/bookingLink"
import { trackLead } from "@/lib/leadTracking"
import { quoteRangeLabel } from "@/lib/askFruit/quote"
import type { EvaluationDetail, ImplementationBrief, RoughQuote } from "@/lib/askFruit/types"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
const LEAD_SOURCE = "ask-fruit-quote"
const PRIMARY =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-40"
const SECONDARY =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border border-ui bg-surface px-5 text-[14px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-40"
const INPUT =
  "min-h-11 w-full rounded-chip border border-ui bg-surface px-3.5 text-[16px] text-ink outline-none transition-colors focus:border-brand md:text-[15px]"

/** The newest implementation brief in the conversation: the proposal. */
export function latestImplementationBrief(evaluation: EvaluationDetail): ImplementationBrief | null {
  for (let i = evaluation.documents.length - 1; i >= 0; i--) {
    const doc = evaluation.documents[i]
    if (doc.doc_type === "implementation_brief") return doc.data
  }
  return null
}

export function QuoteBlock({ quote }: { quote?: RoughQuote }) {
  if (!quote) return null
  const priced = quote.kind !== "on_call"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${EYEBROW} text-brand`}>Rough quote</p>
        <span className="rounded-pill border border-lilac-strong bg-tint px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-[0.08em] text-brand uppercase">
          Rough estimate
        </span>
      </div>
      <p className="text-[22px] leading-tight font-bold tracking-[-0.015em] text-ink md:text-[24px]">{quoteRangeLabel(quote)}</p>
      <p className="text-[13px] leading-snug text-muted">
        {priced
          ? "Rough estimate from Fruition's published package prices. A consultant confirms scope, price and timeline."
          : "No published package price covers this scope yet, so the team quotes it after a short scoping call."}
      </p>

      {quote.packages.length ? (
        <dl className="flex flex-col">
          {quote.packages.map((p) => (
            <div key={p.offering_id} className="flex flex-col gap-0.5 border-t border-dashed border-ui py-2 md:flex-row md:items-baseline md:justify-between md:gap-4">
              <dt className="text-[13.5px] font-medium text-ink">{p.title}</dt>
              <dd className="font-mono text-[12px] text-muted md:text-right">{[p.price, p.hours].filter(Boolean).join(" · ")}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {quote.drivers.length ? (
        <div>
          <p className="text-[12.5px] font-semibold text-ink">What moves the range</p>
          <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 text-[12.5px] leading-snug text-muted marker:text-faint">
            {quote.drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {quote.terms ? <p className="text-[12px] leading-snug text-faint">{quote.terms}</p> : null}
    </div>
  )
}

function BookLink() {
  return (
    <a href={BOOKING_ANCHOR} data-cta-location="ask-fruit-proposal" className={PRIMARY}>
      <CalendarDays size={16} aria-hidden /> Book a call
    </a>
  )
}

export function ProposalActions({
  evaluation,
  quote,
  title,
  summary,
}: {
  evaluation: EvaluationDetail
  quote?: RoughQuote
  title: string
  summary?: string
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  const recommended = latestImplementationBrief(evaluation)?.recommended.title ?? evaluation.matches[0]?.title ?? ""

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    const fd = new FormData(e.currentTarget)
    const fields: Record<string, string> = {
      Proposal: title,
      "Rough quote": quote ? quoteRangeLabel(quote) : "Range confirmed on the call",
      Recommended: recommended,
      Packages: (quote?.packages ?? []).map((p) => `${p.title} (${p.price})`).join("; "),
      Conversation: evaluation.evaluation_id,
      Summary: summary ?? "",
    }
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      website: String(fd.get("website") ?? ""), // honeypot
      source: LEAD_SOURCE,
      fields: Object.fromEntries(Object.entries(fields).filter(([, v]) => v)),
    }
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && body.ok) {
        setStatus("sent")
        trackLead(LEAD_SOURCE)
      } else {
        setStatus("error")
        setError(body.error || "Could not send that just now. Try again, or book a call instead.")
      }
    } catch {
      setStatus("error")
      setError("Could not send that just now. Try again, or book a call instead.")
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3">
        <p role="status" className="rounded-chip border border-lilac-strong bg-tint p-3.5 text-[13.5px] leading-snug text-ink">
          Sent. Our team has your proposal and will reply within one business day.
        </p>
        <div className="flex flex-col md:flex-row">
          <BookLink />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
        <BookLink />
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={SECONDARY}>
          <Send size={15} aria-hidden /> Send to our team
        </button>
      </div>

      {open ? (
        // Kept mounted while sending and after an error, so typed values survive a retry.
        <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-chip border border-ui bg-surface-subtle p-3.5">
          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink">
            Name
            <input name="name" type="text" required autoComplete="name" className={INPUT} />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink">
            Work email
            <input name="email" type="email" required autoComplete="email" className={INPUT} />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-ink">
            Company <span className="font-normal text-muted">(optional)</span>
            <input name="company" type="text" autoComplete="organization" className={INPUT} />
          </label>
          {/* Honeypot, hidden from people. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          {status === "error" ? (
            <p role="alert" className="rounded-chip border border-lilac-strong bg-tint px-3 py-2 text-[13px] leading-snug text-ink">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={status === "sending"} className={PRIMARY}>
            {status === "sending" ? "Sending" : "Send the proposal"}
          </button>
        </form>
      ) : null}
    </div>
  )
}

export function ProposalPanel({
  evaluation,
  busy,
  onGenerateProposal,
}: {
  evaluation: EvaluationDetail
  busy: boolean
  onGenerateProposal: () => void
}) {
  const brief = latestImplementationBrief(evaluation)

  if (!brief) {
    if (!evaluation.matches.length) return null
    return (
      <section aria-labelledby="af-proposal" className="flex flex-col gap-3 rounded-chip border border-ui bg-surface p-4">
        <h3 id="af-proposal" className={`${EYEBROW} text-brand`}>
          Proposal
        </h3>
        <p className="text-[13.5px] leading-snug text-ink">
          The Implementation Calculator can turn this into a one-page proposal with a rough quote from Fruition&apos;s published package prices.
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          <button type="button" disabled={busy} onClick={onGenerateProposal} className={PRIMARY}>
            Write the proposal and quote
          </button>
          <a href={BOOKING_ANCHOR} data-cta-location="ask-fruit-proposal" className={SECONDARY}>
            <CalendarDays size={16} aria-hidden /> Book a call
          </a>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="af-proposal" className="flex flex-col gap-4 rounded-chip border border-brand bg-surface p-4">
      <div>
        <h3 id="af-proposal" className={`${EYEBROW} text-brand`}>
          Proposal
        </h3>
        <p className="mt-1.5 text-[16px] leading-snug font-semibold text-ink">{brief.title}</p>
        {brief.executive_summary ? <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{brief.executive_summary}</p> : null}
      </div>

      <div className="border-t border-ui pt-3">
        <p className={`${EYEBROW} text-muted`}>Built around</p>
        <p className="mt-1 text-[14px] font-semibold text-ink">{brief.recommended.title}</p>
      </div>

      {brief.quote?.packages.length ? (
        <div className="border-t border-ui pt-3">
          <p className={`${EYEBROW} text-muted`}>Included</p>
          <ul className="mt-1.5 flex flex-col">
            {brief.quote.packages.map((p) => (
              <li key={p.offering_id} className="flex flex-col gap-0.5 border-t border-dashed border-ui py-2 first:border-0">
                <span className="text-[13.5px] font-medium text-ink">{p.title}</span>
                <span className="font-mono text-[11.5px] text-muted">{[p.price, p.hours].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {brief.phases.length ? (
        <div className="border-t border-ui pt-3">
          <p className={`${EYEBROW} text-muted`}>Phases</p>
          <ol className="mt-1.5 flex flex-col gap-1.5">
            {brief.phases.map((p, i) => (
              <li key={i} className="grid grid-cols-[28px_1fr] gap-2 text-[13.5px] leading-snug text-ink">
                <span className="font-mono text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  {p.phase}
                  {p.duration ? <span className="ml-1.5 font-mono text-[11.5px] text-muted">{p.duration}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {brief.quote ? (
        <div className="border-t border-ui pt-3">
          <QuoteBlock quote={brief.quote} />
        </div>
      ) : null}

      <div className="border-t border-ui pt-3">
        <ProposalActions evaluation={evaluation} quote={brief.quote} title={brief.title} summary={brief.executive_summary} />
      </div>
    </section>
  )
}
