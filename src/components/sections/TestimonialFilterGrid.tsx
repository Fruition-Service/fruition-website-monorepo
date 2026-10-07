"use client"

import { useMemo, useState } from "react"
import FramedMedia from "@/components/common/FramedMedia"

export interface CaseStudyCard {
  _key?: string
  title?: string
  /** Pre-resolved on the server (RSC can't pass a resolver function across the boundary). */
  imageUrl?: string | null
  imageSrcSet?: string
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
}

interface Props {
  heading?: string
  subheading?: string
  cards: CaseStudyCard[]
}

const ALL = "All"

/** Distinct, order-preserving non-empty values for one facet. */
function facetValues(cards: CaseStudyCard[], key: "industry" | "product"): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const c of cards) {
    const v = c[key]?.trim()
    if (v && !seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

function FilterRow({
  label,
  options,
  active,
  onPick,
}: {
  label: string
  options: string[]
  active: string
  onPick: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {[ALL, ...options].map((opt) => {
          const isActive = active === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onPick(opt)}
              aria-pressed={isActive}
              className={`cs-filter-pill inline-flex items-center font-semibold px-4 py-2 rounded-full text-sm cursor-pointer border ${
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-ui bg-surface-raised text-body"
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function TestimonialFilterGrid({ heading, subheading, cards }: Props) {
  const industries = useMemo(() => facetValues(cards, "industry"), [cards])
  const solutions = useMemo(() => facetValues(cards, "product"), [cards])

  const [industry, setIndustry] = useState(ALL)
  const [solution, setSolution] = useState(ALL)

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          (industry === ALL || c.industry === industry) &&
          (solution === ALL || c.product === solution),
      ),
    [cards, industry, solution],
  )

  if (cards.length === 0) return null

  const showIndustry = industries.length >= 2
  const showSolution = solutions.length >= 2
  // A stable key per filter combination so the entrance animation replays on change.
  const gridKey = `${industry}|${solution}`

  return (
    <section id="case-studies" className="bg-surface py-24">
      <div className="mx-auto px-4 max-w-[1200px]">
        {(heading || subheading) && (
          <div className="mb-10 max-w-[760px]">
            {heading && (
              <h2 className="text-section-h2 text-balance">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-body-lead text-muted mt-3.5">
                {subheading}
              </p>
            )}
          </div>
        )}

        {(showIndustry || showSolution) && (
          <div
            className="flex flex-col dark:!bg-surface-raised dark:!bg-none gap-[22px] mb-10 p-6 rounded-[20px] border border-ui bg-[linear-gradient(180deg,var(--surface)_0%,var(--purple-soft)_100%)]"
          >
            {showIndustry && (
              <FilterRow label="Filter by industry" options={industries} active={industry} onPick={setIndustry} />
            )}
            {showSolution && (
              <FilterRow label="Filter by solution" options={solutions} active={solution} onPick={setSolution} />
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted text-[13px]" aria-live="polite">
                Showing {filtered.length} of {cards.length} success {cards.length === 1 ? "story" : "stories"}
              </span>
              {(industry !== ALL || solution !== ALL) && (
                <button
                  type="button"
                  onClick={() => {
                    setIndustry(ALL)
                    setSolution(ALL)
                  }}
                  className="font-semibold text-brand text-[13px] cursor-pointer bg-transparent"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-[24px] border border-dashed border-brand/30 text-muted">
            <p className="text-[17px] text-body font-semibold">
              No success stories match those filters yet.
            </p>
            <p className="text-sm mt-1.5">Try a broader combination, or reset.</p>
          </div>
        ) : (
          <div key={gridKey} className="flex flex-col gap-10">
            {filtered.map((study, i) => {
              const imgSrc = study.imageUrl
              return (
                <article
                  key={study._key || study.title || i}
                  className="cs-card relative overflow-hidden p-6 md:p-10 lg:p-14 dark:!bg-surface-raised dark:!bg-none dark:border dark:border-ui rounded-[32px] bg-[linear-gradient(135deg,var(--purple-soft)_0%,var(--surface)_55%,var(--purple-soft)_100%)]"
                  style={{
                    animationDelay: `${Math.min(i, 6) * 70}ms`,
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-[120px] -right-[120px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(128,21,232,0.10)_0%,rgba(128,21,232,0)_70%)]"
                  />

                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="inline-block w-7 h-px bg-brand/30" />
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                        Case Study
                      </span>
                      {study.verifiedSource && (
                        <span
                          className="inline-flex items-center font-semibold gap-1.5 px-3 py-[5px] rounded-full bg-[#e9f7ee] text-[#1f7a45] text-xs"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Verified · {study.verifiedSource}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[clamp(28px,6vw,44px)] leading-[1.2] tracking-[-0.015em] text-body mt-[18px] max-w-[880px] text-balance">
                      {study.title}
                    </h3>

                    {study.services && (
                      <p className="text-lg leading-7 text-muted mt-[18px] max-w-[820px]">
                        {study.services}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-7">
                      {study.industry && (
                        <span className="inline-flex items-center font-semibold gap-2 px-4 py-2 rounded-full bg-brand-soft text-brand-dark text-sm">
                          {study.industry}
                        </span>
                      )}
                      {study.product && (
                        <span className="inline-flex items-center font-semibold gap-2 px-4 py-2 rounded-full bg-brand-soft text-brand-dark text-sm">
                          <span aria-hidden className="w-2 h-2 rounded-full bg-brand" />
                          {study.product}
                        </span>
                      )}
                      {study.timeline && (
                        <span className="inline-flex items-center font-medium gap-2 px-4 py-2 rounded-full border border-ui bg-surface-raised text-body text-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-brand">
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 15 14" />
                          </svg>
                          {study.timeline}
                        </span>
                      )}
                    </div>

                    {imgSrc && (
                      <FramedMedia className="mt-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          srcSet={study.imageSrcSet}
                          sizes={study.imageSrcSet ? "(max-width: 768px) 100vw, 1088px" : undefined}
                          alt={study.title || "Case study"}
                          className="w-full h-auto block rounded-[20px]"
                        />
                      </FramedMedia>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
