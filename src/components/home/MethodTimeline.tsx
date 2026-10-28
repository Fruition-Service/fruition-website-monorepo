"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { METHOD_STEPS } from "./data"
import { homeText, type HomeCopy } from "./copy"
import { useReducedMotion } from "./useReducedMotion"

/** One full sweep of the 12-week timeline. */
const CYCLE_MS = 22000
const WEEKS = 12

/** Bar geometry on the gantt, as a share of the 12-week track. */
const BARS = METHOD_STEPS.map((step) => ({
  left: ((step.from - 1) / WEEKS) * 100,
  width: ((step.to - step.from + 1) / WEEKS) * 100,
}))

/**
 * The Fruition method — four phases against a rolling 12-week gantt.
 *
 * A single rAF clock drives the week marker, the bar fills and the per-step
 * progress bars so they can never drift apart. Widths are written straight to
 * the DOM; only the week *number* goes through state, so the sweep costs one
 * re-render per week rather than one per frame.
 *
 * Below `lg` the gantt is dropped (it needs the width to stay legible) and the
 * step list carries the animation on its own.
 */
export default function MethodTimeline({ copy }: { copy: HomeCopy }) {
  const reduced = useReducedMotion()
  const [sweepWeek, setSweepWeek] = useState(1)
  // Reduced motion shows the finished state rather than a frozen week one.
  const week = reduced ? WEEKS : sweepWeek
  const markerRef = useRef<HTMLDivElement>(null)
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const stepRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (reduced) {
      METHOD_STEPS.forEach((_, i) => {
        if (barRefs.current[i]) barRefs.current[i]!.style.width = "100%"
        if (stepRefs.current[i]) stepRefs.current[i]!.style.width = "100%"
      })
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = ((now - start) % CYCLE_MS) / CYCLE_MS
      const elapsedWeeks = p * WEEKS
      setSweepWeek(Math.min(WEEKS, Math.floor(elapsedWeeks) + 1))
      if (markerRef.current) markerRef.current.style.left = `${p * 100}%`
      METHOD_STEPS.forEach((step, i) => {
        const from = step.from - 1
        const to = step.to
        const f = Math.max(0, Math.min(1, (elapsedWeeks - from) / (to - from)))
        const pct = `${f * 100}%`
        if (barRefs.current[i]) barRefs.current[i]!.style.width = pct
        if (stepRefs.current[i]) stepRefs.current[i]!.style.width = pct
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <section id="method" className="relative overflow-hidden bg-surface-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 560px at 28% 12%, rgba(128,21,232,0.22) 0%, rgba(128,21,232,0) 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1348px] px-5 py-16 md:px-8 md:py-20 lg:pt-24 lg:pb-22">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-[760px]">
            <p className="text-micro font-bold tracking-[0.12em] uppercase text-amber">
              {homeText(copy, "method-eyebrow")}
            </p>
            <h2 className="text-section-h2 mt-4 text-white">{homeText(copy, "method-heading")}</h2>
            <p className="text-body mt-4 max-w-[640px] text-white/70 lg:text-[17px]">
              {homeText(copy, "method-lead")}
            </p>
          </div>
          <Image
            src="/images/logo-fruition-white.svg"
            alt=""
            width={110}
            height={28}
            unoptimized
            className="mt-2 hidden h-7 w-auto md:block"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:mt-15 lg:grid-cols-[330px_1fr]">
          {/* Steps — rows line up 1:1 with the gantt bars on lg. */}
          <div className="flex flex-col lg:pt-[65px]">
            {METHOD_STEPS.map((step, i) => {
              const active = week >= step.from && week <= step.to
              return (
                <div key={step.num} className="flex items-start gap-4 pb-6 lg:h-[84px] lg:pb-0">
                  <span className="flex flex-none flex-col items-center self-stretch">
                    <span
                      className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full font-mono text-xs transition-all duration-400 ${
                        active
                          ? "border border-amber text-amber shadow-[0_0_16px_rgba(253,171,61,0.35)]"
                          : "border border-white/30 text-white/60"
                      }`}
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {step.num}
                    </span>
                    {i < METHOD_STEPS.length - 1 && (
                      <span className="mt-2 block w-px flex-1 bg-white/15" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-baseline gap-2.5">
                      <span className="text-lg font-semibold text-white">{homeText(copy, step.titleSlot)}</span>
                      <span className="font-mono text-[11px] whitespace-nowrap text-white/40">
                        W{step.from}–W{step.to}
                      </span>
                    </span>
                    <span className="text-[13.5px] leading-[1.45] text-white/55">{homeText(copy, step.descSlot)}</span>
                    <span className="mt-2 block h-[3px] w-full max-w-[190px] overflow-hidden rounded-sm bg-white/10">
                      <span
                        ref={(el) => {
                          stepRefs.current[i] = el
                        }}
                        className="block h-full w-0 bg-gradient-to-r from-brand to-brand-light"
                      />
                    </span>
                  </span>
                </div>
              )
            })}
          </div>

          {/* 12-week gantt */}
          <div className="relative hidden h-[376px] lg:block" aria-hidden>
            <div
              className="absolute top-10 right-0 bottom-6 left-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,0.055) 0, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 8.3333%)",
              }}
            />
            {BARS.map((bar, i) => (
              <div
                key={i}
                className="absolute h-9 overflow-hidden rounded-[10px] border border-[rgba(186,131,240,0.28)] bg-[rgba(186,131,240,0.10)]"
                style={{ left: `${bar.left}%`, width: `${bar.width}%`, top: 64 + i * 84 }}
              >
                <span
                  ref={(el) => {
                    barRefs.current[i] = el
                  }}
                  className={`absolute top-0 bottom-0 left-0 block w-0 ${
                    i % 2 === 0 ? "bg-brand" : "bg-brand-light"
                  }`}
                />
              </div>
            ))}
            {/* Milestone elbows between consecutive phases. */}
            {BARS.slice(1).map((bar, i) => (
              <div key={`m${i}`}>
                <div
                  className="absolute h-[84px] w-px bg-[rgba(186,131,240,0.28)]"
                  style={{ left: `${bar.left}%`, top: 82 + i * 84 }}
                />
                <div
                  className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_10px_2px_rgba(186,131,240,0.7)]"
                  style={{ left: `${bar.left}%`, top: 166 + i * 84 }}
                />
              </div>
            ))}
            <div ref={markerRef} className="absolute top-[34px] bottom-5 left-0 z-[2] w-0">
              <div
                className="absolute top-0 bottom-0 left-0 w-[1.5px]"
                style={{
                  background: "linear-gradient(to bottom, var(--accent-amber), rgba(253,171,61,0.06))",
                }}
              />
              <div className="absolute -top-7 left-0 -translate-x-1/2 rounded-pill border border-[rgba(253,171,61,0.7)] bg-surface-dark/90 px-2.5 py-[3px] font-mono text-[11px] font-semibold whitespace-nowrap text-amber">
                W{week}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 left-0 grid grid-cols-12 font-mono text-[11px] text-white/40">
              {Array.from({ length: WEEKS }, (_, i) => (
                <span key={i} className="text-center">
                  W{i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
