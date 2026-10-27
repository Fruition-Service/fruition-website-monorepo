"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { bookingHref } from "@/lib/bookingLink"
import {
  DEFAULT_INPUT,
  MODULE_OPTIONS,
  STARTING_POINT_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TIER_SUMMARY,
  TIMELINE_OPTIONS,
  estimateImplementation,
  formatUsd,
  type CalculatorInput,
  type Module,
  type Range,
} from "@/lib/implementationCalculator"

const LABEL = "font-mono text-[12px] font-semibold tracking-[0.14em] text-muted uppercase"

/**
 * Shared look for every selectable option: the native input is visually
 * hidden inside the label, and the label reacts to its checked and
 * keyboard-focus state, so arrow keys, Space and screen readers all behave
 * as they do on a plain radio or checkbox.
 */
const OPTION =
  "flex min-h-11 cursor-pointer rounded-chip border border-ui bg-surface transition-colors hover:border-brand has-checked:border-brand has-checked:bg-brand-soft has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2"

function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string
  hint?: string
  children: ReactNode
}) {
  return (
    <fieldset className="border-t border-ui pt-6 first:border-t-0 first:pt-0">
      <legend className="float-left w-full">
        <span className="block text-[17px] font-semibold text-ink">{legend}</span>
        {hint && <span className="mt-1 block text-[14px] text-muted">{hint}</span>}
      </legend>
      <div className="clear-both pt-4">{children}</div>
    </fieldset>
  )
}

function rangeText(r: Range, unit: string, format: (n: number) => string = String): string {
  return r.low === r.high
    ? `${format(r.low)} ${unit}`.trim()
    : `${format(r.low)} to ${format(r.high)} ${unit}`.trim()
}

export default function ImplementationCalculator() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT)
  const estimate = useMemo(() => estimateImplementation(input), [input])

  const set = <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }))

  // At least one workstream stays selected: unticking the last one is ignored.
  const toggleModule = (m: Module) =>
    setInput((prev) => {
      const has = prev.modules.includes(m)
      if (has && prev.modules.length === 1) return prev
      return {
        ...prev,
        modules: has ? prev.modules.filter((x) => x !== m) : [...prev.modules, m],
      }
    })

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-10">
      {/* Inputs */}
      <form
        aria-label="Implementation details"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-8 rounded-card border border-ui bg-surface p-5 shadow-card md:p-8"
      >
        <Fieldset legend="Where are you starting?">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {STARTING_POINT_OPTIONS.map((o) => (
              <label key={o.value} className={`${OPTION} flex-col gap-1 p-4`}>
                <input
                  type="radio"
                  name="startingPoint"
                  value={o.value}
                  checked={input.startingPoint === o.value}
                  onChange={() => set("startingPoint", o.value)}
                  className="sr-only"
                />
                <span className="text-[15px] font-semibold text-ink">{o.label}</span>
                <span className="text-[13.5px] leading-snug text-muted">{o.description}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="How many people will use monday.com?">
          <div className="flex flex-wrap gap-2">
            {TEAM_SIZE_OPTIONS.map((o) => (
              <label key={o.value} className={`${OPTION} items-center px-4`}>
                <input
                  type="radio"
                  name="teamSize"
                  value={o.value}
                  checked={input.teamSize === o.value}
                  onChange={() => set("teamSize", o.value)}
                  className="sr-only"
                />
                <span className="text-[15px] font-semibold text-ink">{o.label}</span>
                <span className="sr-only"> {o.description}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="What do you need built?" hint="Pick every workstream that applies. At least one is required.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {MODULE_OPTIONS.map((o) => {
              const checked = input.modules.includes(o.value)
              return (
                <label key={o.value} className={`${OPTION} items-start gap-3 p-4`}>
                  <input
                    type="checkbox"
                    name="modules"
                    value={o.value}
                    checked={checked}
                    onChange={() => toggleModule(o.value)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-badge border text-[12px] leading-none font-bold ${
                      checked ? "border-brand bg-brand text-white" : "border-ui bg-surface text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold text-ink">{o.label}</span>
                    <span className="text-[13.5px] leading-snug text-muted">{o.description}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </Fieldset>

        <Fieldset legend="What pace do you need?">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {TIMELINE_OPTIONS.map((o) => (
              <label key={o.value} className={`${OPTION} flex-col gap-1 p-4`}>
                <input
                  type="radio"
                  name="timeline"
                  value={o.value}
                  checked={input.timeline === o.value}
                  onChange={() => set("timeline", o.value)}
                  className="sr-only"
                />
                <span className="text-[15px] font-semibold text-ink">{o.label}</span>
                <span className="text-[13.5px] leading-snug text-muted">{o.description}</span>
              </label>
            ))}
          </div>
        </Fieldset>
      </form>

      {/* Result */}
      <section
        aria-labelledby="calculator-result-heading"
        className="rounded-card border border-ui bg-surface p-5 shadow-card md:p-8 lg:sticky lg:top-24"
      >
        <h2 id="calculator-result-heading" className={LABEL}>
          Your indicative estimate
        </h2>

        <div aria-live="polite" aria-atomic="true">
          <dl className="mt-4 flex flex-col">
            <div className="flex flex-col gap-1 border-b border-dashed border-ui pb-4">
              <dt className="text-[14px] font-medium text-muted">Investment</dt>
              <dd className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-ink">
                {rangeText(estimate.price, "", formatUsd)}
                <span className="ml-2 font-mono text-[12px] font-semibold tracking-[0.14em] text-muted">USD</span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ui py-3">
              <dt className="text-[14px] font-medium text-ink">Hours</dt>
              <dd className="font-mono text-[14px] text-muted">{rangeText(estimate.hours, "hours")}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ui py-3">
              <dt className="text-[14px] font-medium text-ink">Delivery</dt>
              <dd className="font-mono text-[14px] text-muted">{rangeText(estimate.weeks, "weeks")}</dd>
            </div>
            <div className="flex flex-col gap-1 pt-4">
              <dt className={LABEL}>Recommended package</dt>
              <dd className="text-[20px] leading-snug font-semibold text-brand">{estimate.tier}</dd>
              <dd className="text-[14px] leading-relaxed text-muted">{TIER_SUMMARY[estimate.tier]}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
          Assumes USD at the US team rate. Excludes monday.com licence fees and GST. A scoping call confirms
          the final scope, price and timeline.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href={bookingHref()}
            data-cta-location="implementation-calculator-result"
            className="cta-btn cta-btn-primary w-full"
          >
            Book a scoping call
          </a>
          <Link
            href="/ask-fruit/workspace"
            className="inline-flex min-h-11 items-center justify-center rounded-pill px-4 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            Ask the Implementation Calculator
          </Link>
        </div>
      </section>
    </div>
  )
}
