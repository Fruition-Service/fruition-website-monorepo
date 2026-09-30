"use client"

import { useState } from "react"
import { FileText, Maximize2 } from "lucide-react"
import { buildFitMatrix } from "@/lib/askFruit/fit"
import { VERDICT_COPY, requirementCoverage, requirementRows } from "@/lib/askFruit/requirements"
import type { BriefDocument, EvaluationDetail, Offering } from "@/lib/askFruit/types"
import { FitChart } from "./FitChart"
import { OfferingCard } from "./OfferingCard"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"

export function RequirementsCard({
  evaluation,
  onPrefill,
}: {
  evaluation: EvaluationDetail
  onPrefill: (text: string) => void
}) {
  const coverage = requirementCoverage(evaluation.requirements, evaluation.open_questions)
  const rows = requirementRows(evaluation.requirements).filter((r) => r.known)
  const critical = new Set(evaluation.open_questions)

  return (
    <section className="rounded-chip border border-ui bg-surface p-4" aria-labelledby="af-reqs">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="af-reqs" className={`${EYEBROW} text-brand`}>
          What Fruit knows
        </h3>
        <span className="font-mono text-[11.5px] text-muted">
          {coverage.known}/{coverage.total}
        </span>
      </div>
      <div className="mt-2.5 flex gap-1" aria-hidden>
        {Array.from({ length: coverage.total }, (_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-pill ${i < coverage.known ? "bg-brand" : "bg-tint-deep"}`} />
        ))}
      </div>
      <p className="mt-2.5 text-[12.5px] leading-snug text-muted">{VERDICT_COPY[coverage.verdict]}</p>

      {rows.length ? (
        <dl className="mt-3 flex flex-col">
          {rows.map((row) => (
            <div key={row.key} className="flex gap-3 border-t border-dashed border-ui py-2 text-[12.5px]">
              <dt className="w-[92px] shrink-0 font-medium text-body">{row.label}</dt>
              <dd className="min-w-0 flex-1 text-muted">{row.values.join("; ")}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {coverage.gaps.length ? (
        <div className="mt-3">
          <p className="text-[12px] font-medium text-body">Add context</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {coverage.gaps.slice(0, 5).map((gap) => (
              <button
                key={gap.key}
                type="button"
                onClick={() => onPrefill(gap.prompt)}
                className={`rounded-pill border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  critical.has(gap.key)
                    ? "border-lilac-strong bg-tint text-brand hover:border-brand"
                    : "border-ui bg-surface text-body hover:border-brand hover:text-brand"
                }`}
              >
                + {gap.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

type Lane = "matches" | "shortlist" | "briefs"

export function DecisionBoard({
  evaluation,
  busy,
  onToggleKeep,
  onCompare,
  onPlan,
  onOpenBrief,
}: {
  evaluation: EvaluationDetail
  busy: boolean
  onToggleKeep: (id: string) => void
  onCompare: (offerings: Offering[]) => void
  onPlan: (offering: Offering) => void
  onOpenBrief: (doc: BriefDocument) => void
}) {
  const [lane, setLane] = useState<Lane>("matches")
  const kept = evaluation.matches.filter((m) => evaluation.shortlist.includes(m.offering_id))
  const briefs = [...evaluation.documents].reverse()
  const lanes: Array<{ id: Lane; label: string; count: number }> = [
    { id: "matches", label: "Matches", count: evaluation.matches.length },
    { id: "shortlist", label: "Shortlist", count: kept.length },
    { id: "briefs", label: "Briefs", count: briefs.length },
  ]

  return (
    <section aria-label="Decision board" className="flex flex-col gap-3">
      <div role="tablist" className="flex rounded-pill border border-ui bg-surface-subtle p-1">
        {lanes.map((l) => (
          <button
            key={l.id}
            role="tab"
            type="button"
            aria-selected={lane === l.id}
            onClick={() => setLane(l.id)}
            className={`flex-1 rounded-pill px-2 py-1.5 text-[12.5px] font-semibold transition-colors ${
              lane === l.id ? "bg-surface text-body shadow-micro" : "text-muted hover:text-body"
            }`}
          >
            {l.label}
            <span className="ml-1 font-mono text-[11px] text-muted">{l.count}</span>
          </button>
        ))}
      </div>

      {lane === "matches" ? (
        evaluation.matches.length ? (
          evaluation.matches.map((m) => (
            <OfferingCard
              key={m.offering_id}
              offering={m}
              kept={evaluation.shortlist.includes(m.offering_id)}
              onToggleKeep={() => onToggleKeep(m.offering_id)}
            />
          ))
        ) : (
          <EmptyLane text="Recommendations land here once Fruit knows what you are solving." />
        )
      ) : null}

      {lane === "shortlist" ? (
        kept.length ? (
          <>
            <div className="flex flex-col gap-2 rounded-chip border border-lilac bg-tint p-3">
              <p className="text-[12.5px] text-body">Have Fruit write it up:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy || kept.length < 2}
                  onClick={() => onCompare(kept)}
                  className="rounded-pill bg-brand px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
                >
                  Comparison brief
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onPlan(kept[0])}
                  className="rounded-pill border border-brand bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:bg-tint-deep disabled:opacity-40"
                >
                  Implementation brief
                </button>
              </div>
              {kept.length < 2 ? <p className="text-[11.5px] text-muted">Keep two or more to compare them.</p> : null}
            </div>
            {kept.map((m) => (
              <OfferingCard key={m.offering_id} offering={m} kept onToggleKeep={() => onToggleKeep(m.offering_id)} />
            ))}
          </>
        ) : (
          <EmptyLane text="Shortlist the options you want to take further. Fruit can then compare them or plan the build." />
        )
      ) : null}

      {lane === "briefs" ? (
        briefs.length ? (
          briefs.map((doc) => (
            <button
              key={doc.doc_id}
              type="button"
              onClick={() => onOpenBrief(doc)}
              className="group flex items-center gap-3 rounded-chip border border-ui bg-surface p-3 text-left transition-colors hover:border-brand"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-badge bg-surface-dark text-white">
                <FileText size={16} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`${EYEBROW} block text-muted`}>
                  {doc.doc_type === "comparison_brief" ? "Comparison brief" : "Implementation brief"}
                </span>
                <span className="block truncate text-[13.5px] font-semibold text-body">{doc.title}</span>
              </span>
              <Maximize2 size={15} className="text-muted group-hover:text-brand" aria-hidden />
            </button>
          ))
        ) : (
          <EmptyLane text="Comparison and implementation briefs you ask for are kept here." />
        )
      ) : null}
    </section>
  )
}

function EmptyLane({ text }: { text: string }) {
  return <p className="rounded-chip border border-dashed border-ui px-4 py-6 text-center text-[12.5px] leading-snug text-muted">{text}</p>
}

export function ResultsPanel(props: {
  evaluation: EvaluationDetail
  busy: boolean
  onPrefill: (text: string) => void
  onToggleKeep: (id: string) => void
  onCompare: (offerings: Offering[]) => void
  onPlan: (offering: Offering) => void
  onOpenBrief: (doc: BriefDocument) => void
}) {
  const matrix = buildFitMatrix(props.evaluation.matches, props.evaluation.requirements)
  return (
    <div className="flex flex-col gap-4">
      <RequirementsCard evaluation={props.evaluation} onPrefill={props.onPrefill} />
      {matrix ? (
        <section className="rounded-chip border border-ui bg-surface p-4" aria-labelledby="af-fit">
          <h3 id="af-fit" className={`${EYEBROW} mb-3 text-brand`}>
            Requirements fit
          </h3>
          <FitChart matrix={matrix} />
        </section>
      ) : null}
      <DecisionBoard {...props} />
    </div>
  )
}
