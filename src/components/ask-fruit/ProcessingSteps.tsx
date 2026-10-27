"use client"

import { Check, X } from "lucide-react"
import { currentStep, type ProcessingStep, type StepState } from "@/lib/askFruit/steps"

const STATE_TAG: Record<StepState, string> = {
  active: "In progress",
  done: "Done",
  failed: "Failed",
}

function Marker({ state }: { state: StepState }) {
  if (state === "done") return <Check size={14} className="text-muted" aria-hidden />
  if (state === "failed") return <X size={14} className="text-muted" aria-hidden />
  return <span className="h-2 w-2 rounded-pill bg-brand motion-safe:animate-pulse" aria-hidden />
}

/**
 * What the Implementation Calculator is doing right now, one row per real
 * stream boundary (see `src/lib/askFruit/steps.ts`). Labels come from the
 * server and render as-is. The state tag keeps the list readable with
 * reduced motion, where the active marker stops pulsing.
 */
export function ProcessingSteps({ steps }: { steps: ProcessingStep[] }) {
  const now = currentStep(steps)
  return (
    <div className="w-full max-w-[520px] rounded-chip border border-ui bg-surface px-4 py-1.5">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {now ? now.label : ""}
      </p>
      <ol aria-label="Progress" className="flex flex-col">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-center gap-3 border-t border-dashed border-ui py-2 first:border-t-0"
            aria-current={step.state === "active" ? "step" : undefined}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              <Marker state={step.state} />
            </span>
            <span
              className={`min-w-0 flex-1 font-mono text-[12px] leading-snug break-words ${
                step.state === "active" ? "font-semibold text-ink" : "text-muted"
              }`}
            >
              {step.label}
            </span>
            <span
              className={`shrink-0 font-mono text-[10.5px] tracking-[0.14em] uppercase ${
                step.state === "active" ? "text-brand" : "text-faint"
              }`}
            >
              {STATE_TAG[step.state]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
