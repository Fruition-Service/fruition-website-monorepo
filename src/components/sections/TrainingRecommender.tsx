"use client"

import { useId, useMemo, useState } from "react"

type Format = {
  name: string
  blurb: string
  fit: string
}

const FORMATS: Record<"selfPaced" | "bootcamp" | "enterprise", Format> = {
  selfPaced: {
    name: "Self-Paced Hybrid",
    blurb: "On-demand modules plus scheduled office hours.",
    fit: "Right for small teams who can learn alongside their work.",
  },
  bootcamp: {
    name: "Live Bootcamp",
    blurb: "Instructor-led sessions over one to two weeks.",
    fit: "Right for a single department onboarding together at pace.",
  },
  enterprise: {
    name: "Custom Enterprise Track",
    blurb: "Role-based curriculum across every layer of the org.",
    fit: "Right for large or multi-department rollouts needing tailored tracks.",
  },
}

const COMPLEXITY = ["One team, simple workflows", "A few connected teams", "Many departments, custom workflows"]

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
}

/**
 * Self-select recommender: team size + workflow complexity drive a suggested
 * training format. Lets a prospect see the exact scope they need before
 * reaching out, and drives on-page interaction.
 */
export default function TrainingRecommender({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
}: Props) {
  const [teamSize, setTeamSize] = useState(15)
  const [complexity, setComplexity] = useState(1) // index into COMPLEXITY
  const uid = useId()

  const rec = useMemo(() => {
    // Complexity dominates; team size nudges. Enterprise for big or complex orgs.
    if (complexity === 2 || teamSize > 75) return FORMATS.enterprise
    if (complexity === 1 || teamSize > 20) return FORMATS.bootcamp
    return FORMATS.selfPaced
  }, [teamSize, complexity])

  return (
    <section className="px-4 py-20 bg-brand-soft">
      <style>{`
        .tr-range {
          -webkit-appearance: none; appearance: none; width: 100%;
          height: 8px; border-radius: 999px; background: #e2d8f7; outline: none; cursor: pointer;
        }
        .tr-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%;
          background: var(--purple-primary); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(128,21,232,0.45); cursor: pointer;
        }
        .tr-range::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 50%; background: var(--purple-primary);
          border: 3px solid #fff; box-shadow: 0 2px 8px rgba(128,21,232,0.45); cursor: pointer;
        }
        .tr-range::-moz-range-track { height: 8px; border-radius: 999px; background: #e2d8f7; }
      `}</style>

      <div className="mx-auto max-w-[920px]">
        <div className="text-center mx-auto max-w-[680px] mb-9">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              {eyebrow}
            </p>
          )}
          {heading && <h2 className="text-section-h2 text-body text-balance">{heading}</h2>}
          {subheading && (
            <p className="text-muted text-[17px] leading-[26px] mt-3">{subheading}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
          {/* Inputs */}
          <div className="rounded-card bg-surface-raised flex flex-col justify-center h-full p-9 border border-brand/15 shadow-[0_18px_36px_-24px_rgba(64,12,140,0.2)] dark:shadow-none dark:border-ui">
            <label htmlFor={`${uid}-size`} className="flex items-baseline justify-between mb-3">
              <span className="font-semibold text-sm">Team size</span>
              <span className="font-bold text-brand text-[15px]">
                {teamSize} {teamSize === 1 ? "person" : "people"}
              </span>
            </label>
            <input
              id={`${uid}-size`}
              className="tr-range"
              type="range"
              min={1}
              max={150}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />

            <div className="h-8" />

            <span className="font-semibold text-sm mb-3 block">
              Workflow complexity
            </span>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Workflow complexity">
              {COMPLEXITY.map((label, i) => {
                const isActive = complexity === i
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setComplexity(i)}
                    className={`cs-filter-pill flex items-center text-left gap-2.5 px-3.5 py-3 rounded-chip cursor-pointer border ${
                      isActive ? "border-brand bg-brand-soft" : "border-ui bg-surface-raised"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex-none inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-surface-raised ${
                        isActive ? "border-[5px] border-brand" : "border-2 border-brand/30"
                      }`}
                    />
                    <span className={`text-sm ${isActive ? "text-brand-dark" : ""}`}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div
            key={rec.name}
            className="cs-card rounded-card flex flex-col justify-center h-full p-9 text-white"
            style={{ background: "linear-gradient(-38deg, var(--purple-primary) 0%, var(--dark-bg) 100%)" }}
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              Recommended track
            </p>
            <p className="font-bold text-[30px] leading-[36px] mt-2.5 text-balance">
              {rec.name}
            </p>
            <p className="text-white/86 text-[15px] leading-6 mt-3">{rec.blurb}</p>
            <p className="text-white/62 text-[13px] leading-5 mt-3.5">{rec.fit}</p>
            {ctaLabel && ctaUrl && (
              <a
                href={ctaUrl}
                className="cta-btn cta-btn-on-dark-primary mt-[26px] h-auto max-w-full self-start whitespace-normal px-5 py-3 text-center leading-snug"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
