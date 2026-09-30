"use client"

import { Check, Minus, ShieldAlert, X } from "lucide-react"
import { fitCounts, FIT_LABEL } from "@/lib/askFruit/fit"
import type { BriefDocument, ComparisonBrief, FitStatus, ImplementationBrief, Offering } from "@/lib/askFruit/types"

const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.14em] uppercase"
const BOOKING_URL = "/contact-us#book"

function FitPill({ status, note }: { status: FitStatus; note?: string }) {
  const icon = status === "yes" ? <Check size={12} /> : status === "no" ? <X size={12} /> : status === "partial" ? <Minus size={12} /> : null
  return (
    <span className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-[11.5px] font-semibold ${
          status === "yes" ? "bg-brand text-white" : status === "partial" ? "bg-tint-deep text-brand" : status === "no" ? "bg-lilac-strong text-body" : "border border-dashed border-ui text-muted"
        }`}
      >
        {icon}
        {FIT_LABEL[status]}
      </span>
      {note ? <span className="text-[12px] leading-snug text-muted">{note}</span> : null}
    </span>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid border-t border-ui pt-5">
      <h3 className={`${EYEBROW} mb-3 text-brand`}>{label}</h3>
      {children}
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-[14px] leading-snug text-body">
          <Check size={14} className="mt-1 shrink-0 text-brand" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-snug text-body">
          <span className="font-mono text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
          {item}
        </li>
      ))}
    </ol>
  )
}

function OfferingLink({ offering }: { offering: Offering }) {
  return (
    <a href={offering.url} target="_blank" rel="noopener" className="font-semibold text-body hover:text-brand">
      {offering.title}
    </a>
  )
}

export function ComparisonBriefView({ data }: { data: ComparisonBrief }) {
  const ids = data.offerings.map((o) => o.offering_id)
  const recommended = data.offerings.find((o) => o.offering_id === data.recommendation.offering_id)
  return (
    <div className="flex flex-col gap-6">
      {data.buyer_context ? <p className="text-body-lead text-muted">{data.buyer_context}</p> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.offerings.map((o) => {
          const counts = fitCounts(data.requirements.map((r) => r.fit[o.offering_id]?.status ?? "unknown"))
          const pick = o.offering_id === data.recommendation.offering_id
          return (
            <div key={o.offering_id} className={`rounded-chip border p-4 ${pick ? "border-brand bg-tint" : "border-ui bg-surface"}`}>
              <p className={`${EYEBROW} ${pick ? "text-brand" : "text-muted"}`}>{pick ? "Fruit's pick" : o.kind}</p>
              <p className="mt-1 text-[15px] font-semibold">
                <OfferingLink offering={o} />
              </p>
              {counts.percent != null ? (
                <p className="mt-2 font-mono text-[12px] text-muted">
                  {counts.percent}% fit · {counts.met} met · {counts.partial} partly · {counts.missing} gaps
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      {data.requirements.length ? (
        <Section label="Requirements fit">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr>
                  <th className={`${EYEBROW} border-b border-ui py-2 pr-3 text-muted`}>Requirement</th>
                  {data.offerings.map((o) => (
                    <th key={o.offering_id} className={`${EYEBROW} border-b border-ui px-3 py-2 text-muted`}>
                      {o.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.requirements.map((row, i) => (
                  <tr key={i} className="border-b border-dashed border-ui align-top">
                    <td className="py-3 pr-3 text-[13.5px]">
                      <span className="font-medium text-body">{row.requirement}</span>
                      {row.why_it_matters ? <span className="mt-1 block text-[12px] text-muted">{row.why_it_matters}</span> : null}
                    </td>
                    {ids.map((id) => (
                      <td key={id} className="px-3 py-3">
                        <FitPill status={row.fit[id]?.status ?? "unknown"} note={row.fit[id]?.note} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : null}

      <Section label="Strengths and watch-outs">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.offerings.map((o) => (
            <div key={o.offering_id} className="flex flex-col gap-2 rounded-chip border border-ui p-4">
              <p className="text-[14px] font-semibold text-body">{o.title}</p>
              {(data.strengths[o.offering_id] ?? []).length ? <Bullets items={data.strengths[o.offering_id]} /> : null}
              {(data.watch_outs[o.offering_id] ?? []).map((w, i) => (
                <p key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
                  {w}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section label="Fruit recommends">
        <p className="text-[15px] leading-relaxed text-body">
          {recommended ? <OfferingLink offering={recommended} /> : null}
          {data.recommendation.reason ? <>{recommended ? ". " : ""}{data.recommendation.reason}</> : null}
        </p>
      </Section>

      {data.next_steps.length ? (
        <Section label="Next steps">
          <Numbered items={data.next_steps} />
        </Section>
      ) : null}
    </div>
  )
}

export function ImplementationBriefView({ data }: { data: ImplementationBrief }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
        {data.executive_summary ? <p className="text-[15px] leading-relaxed text-body">{data.executive_summary}</p> : <span />}
        <div className="rounded-chip border border-brand bg-tint p-4">
          <p className={`${EYEBROW} text-brand`}>Built around</p>
          <p className="mt-1 text-[15px] font-semibold">
            <OfferingLink offering={data.recommended} />
          </p>
          {data.recommended.summary ? <p className="mt-2 text-[12.5px] leading-snug text-muted">{data.recommended.summary}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {(
          [
            ["Objectives", data.business_objectives],
            ["Key requirements", data.key_requirements],
            ["Success criteria", data.success_criteria],
          ] as const
        )
          .filter(([, items]) => items.length)
          .map(([label, items]) => (
            <Section key={label} label={label}>
              <Bullets items={[...items]} />
            </Section>
          ))}
      </div>

      <Section label="Delivery plan">
        <ol className="flex flex-col">
          {data.phases.map((p, i) => (
            <li key={i} className="grid grid-cols-[32px_1fr] gap-3 border-b border-dashed border-ui py-3 last:border-0">
              <span className="font-mono text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[14.5px] font-semibold text-body">{p.phase}</p>
                {p.duration || p.owner ? (
                  <p className="mt-0.5 font-mono text-[11.5px] text-muted">
                    {[p.duration, p.owner].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {p.activities.length ? (
                  <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[13.5px] text-body marker:text-muted">
                    {p.activities.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {data.risks.length ? (
        <Section label="Risks">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {data.risks.map((r, i) => (
              <div key={i} className="rounded-chip border border-ui p-4">
                <p className="flex gap-2 text-[13.5px] font-semibold text-body">
                  <ShieldAlert size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  {r.risk}
                </p>
                {r.mitigation ? <p className="mt-1.5 text-[13px] leading-snug text-muted">{r.mitigation}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.considered.length ? (
        <Section label="Also considered">
          <ul className="flex flex-col gap-1.5">
            {data.considered.map((o) => (
              <li key={o.offering_id} className="text-[13.5px]">
                <OfferingLink offering={o} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {data.next_steps.length ? (
        <Section label="Next steps">
          <Numbered items={data.next_steps} />
        </Section>
      ) : null}
    </div>
  )
}

export function BriefBody({ document }: { document: BriefDocument }) {
  return document.doc_type === "comparison_brief" ? (
    <ComparisonBriefView data={document.data} />
  ) : (
    <ImplementationBriefView data={document.data} />
  )
}

export function BriefFooter() {
  return (
    <div className="mt-8 flex flex-col items-start gap-3 rounded-chip bg-surface-dark p-5 text-white md:flex-row md:items-center md:justify-between">
      <p className="text-[14px] leading-snug">
        Prepared by Fruit, Fruition&apos;s assistant. Scope, pricing and timelines are confirmed with a consultant.
      </p>
      <a href={BOOKING_URL} className="cta-btn cta-btn-on-dark-primary shrink-0 print:hidden">
        <span className="cta-btn-label">Book a discovery call</span>
      </a>
    </div>
  )
}
