"use client"

import Link from "next/link"
import { ArrowUpRight, Bookmark, BookmarkCheck, Check } from "lucide-react"
import type { Offering } from "@/lib/askFruit/types"

const KIND_LABEL: Record<string, string> = {
  solution: "Solution",
  service: "Service",
  platform: "Platform",
  package: "Package",
}

/** The facts worth a glance on a card, in this order. */
const CARD_FACTS = ["price", "hours", "product", "team_size"] as const

export function OfferingCard({
  offering,
  kept,
  onToggleKeep,
  disabled,
}: {
  offering: Offering
  kept: boolean
  onToggleKeep: () => void
  disabled?: boolean
}) {
  const facts = CARD_FACTS.map((k) => [k, offering.facts?.[k]] as const).filter(
    (entry): entry is readonly [(typeof CARD_FACTS)[number], string] => typeof entry[1] === "string",
  )

  return (
    <article className="flex flex-col gap-3 rounded-chip border border-ui bg-surface p-4 shadow-micro">
      <div className="flex items-start gap-3">
        {offering.rank ? (
          <span className="mt-0.5 font-mono text-[11px] font-semibold text-muted">{String(offering.rank).padStart(2, "0")}</span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-brand uppercase">
            {KIND_LABEL[offering.kind] ?? "Offering"}
            {offering.match_strength ? <span className="text-muted"> · {offering.match_strength}</span> : null}
          </p>
          <Link
            href={offering.url}
            target="_blank"
            className="group mt-1 inline-flex items-start gap-1 text-[15px] leading-snug font-semibold text-body hover:text-brand"
          >
            {offering.title}
            <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-muted group-hover:text-brand" aria-hidden />
          </Link>
        </div>
        {offering.match_score != null ? (
          <span className="font-mono text-[18px] leading-none font-semibold text-body">
            {offering.match_score}
            <span className="text-[11px] text-muted">%</span>
          </span>
        ) : null}
      </div>

      {offering.match_score != null ? (
        <div className="h-1 overflow-hidden rounded-pill bg-tint-deep" aria-hidden>
          <div
            className="h-full origin-left rounded-pill bg-brand"
            style={{ transform: `scaleX(${offering.match_score / 100})` }}
          />
        </div>
      ) : null}

      {offering.best_for ? <p className="text-[13.5px] leading-relaxed text-muted">{offering.best_for}</p> : null}

      {offering.reasons?.length ? (
        <ul className="flex flex-col gap-1.5">
          {offering.reasons.map((reason, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-snug text-body">
              <Check size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              {reason}
            </li>
          ))}
        </ul>
      ) : null}

      {offering.considerations?.length ? (
        <p className="text-[12.5px] leading-snug text-muted">
          <span className="font-semibold text-body">Watch out: </span>
          {offering.considerations.join(" ")}
        </p>
      ) : null}

      {facts.length ? (
        <dl className="flex flex-col">
          {facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-t border-dashed border-ui py-1.5 text-[12.5px]">
              <dt className="font-medium text-body capitalize">{k.replace("_", " ")}</dt>
              <dd className="text-right font-mono text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <button
        type="button"
        onClick={onToggleKeep}
        disabled={disabled}
        aria-pressed={kept}
        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-pill border text-[13px] font-semibold transition-colors disabled:opacity-50 ${
          kept ? "border-brand bg-tint text-brand" : "border-ui bg-surface text-body hover:border-brand hover:text-brand"
        }`}
      >
        {kept ? <BookmarkCheck size={15} aria-hidden /> : <Bookmark size={15} aria-hidden />}
        {kept ? "Shortlisted" : "Shortlist"}
      </button>
    </article>
  )
}
