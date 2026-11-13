"use client"

import { useState } from "react"

export interface SolutionOption {
  key: string
  glyph?: string
  label: string
  /** The pain in one line. */
  problem: string
  /** What we configure in monday to solve it. */
  configures: string[]
  /** Headline outcome. */
  outcome: string
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  options: SolutionOption[]
  ctaLabel?: string
  ctaUrl?: string
}

/**
 * Clickable bottleneck selector. The visitor picks the pain they recognize and
 * the panel swaps to show exactly how we configure monday to solve it. Drives
 * dwell time and lets a prospect self-select scope before reaching out.
 */
export default function SolutionSelector({
  eyebrow,
  heading,
  subheading,
  options,
  ctaLabel,
  ctaUrl,
}: Props) {
  const [activeKey, setActiveKey] = useState(options[0]?.key)
  if (!options.length) return null
  const active = options.find((o) => o.key === activeKey) ?? options[0]

  return (
    <section className="px-4 py-20 bg-surface">
      <div className="mx-auto max-w-[1040px]">
        <div className="text-center mx-auto max-w-[680px] mb-9">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-section-h2 text-balance">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-muted text-base leading-[26px] mt-3">{subheading}</p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-[320px_1fr] md:items-stretch">
          {/* Selector list */}
          <div
            role="tablist"
            aria-label="Choose your bottleneck"
            className="flex flex-col gap-2.5"
          >
            {options.map((opt) => {
              const isActive = opt.key === active.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(opt.key)}
                  className="cs-filter-pill flex items-center text-left gap-3 px-4 py-3.5 md:gap-3.5 md:px-5 md:py-[18px] rounded-2xl cursor-pointer"
                  style={{
                    border: isActive ? "1px solid var(--purple-primary)" : "1px solid var(--border-ui)",
                    background: isActive ? "linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-light) 100%)" : "var(--surface-raised)",
                    boxShadow: isActive ? "0 18px 36px -24px color-mix(in srgb, var(--purple-primary) 70%, transparent)" : "none",
                  }}
                >
                  <span aria-hidden className="text-xl md:text-2xl leading-none">
                    {opt.glyph ?? "•"}
                  </span>
                  <span className="flex flex-col">
                    <span className={`font-bold text-sm md:text-[15px] ${isActive ? "text-white" : ""}`}>
                      {opt.label}
                    </span>
                    <span className={`text-[11px] md:text-xs leading-4 mt-[2px] ${isActive ? "text-white/82" : "text-muted"}`}>
                      {opt.problem}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Solution panel — re-keyed so it re-enters on change */}
          <div
            key={active.key}
            role="tabpanel"
            className="cs-card relative overflow-hidden rounded-card flex flex-col p-9 border border-ui dark:!bg-surface-raised dark:!bg-none"
            style={{
              background: "linear-gradient(135deg, #faf7ff 0%, #ffffff 55%, #f9f5ff 100%)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{ top: -120, right: -120, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--purple-primary) 10%, transparent) 0%, color-mix(in srgb, var(--purple-primary) 0%, transparent) 70%)" }}
            />
            <div className="relative">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                How we solve it
              </p>
              <h3 className="text-2xl font-bold leading-[1.25] mt-2 text-balance">
                {active.label}
              </h3>
              <ul className="flex flex-col gap-3 mt-[22px]">
                {active.configures.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex-none inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-brand-soft text-brand mt-[1px]"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[15px] leading-[22px]">{c}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-[26px] pt-[22px] border-t border-ui">
                <p className="font-semibold text-[15px] max-w-[360px]">
                  {active.outcome}
                </p>
                {ctaLabel && ctaUrl && (
                  <a
                    href={ctaUrl}
                    className="cta-btn cta-btn-primary flex-none"
                  >
                    {ctaLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
