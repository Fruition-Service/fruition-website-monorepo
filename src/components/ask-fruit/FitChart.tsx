"use client"

import { useState } from "react"
import { FIT_LABEL, type FitMatrix } from "@/lib/askFruit/fit"
import type { FitStatus } from "@/lib/askFruit/types"

/** Ordinal ramp in the brand family: meets, partly, gap, not assessed. */
export const FIT_CELL_CLASS: Record<FitStatus, string> = {
  yes: "bg-brand",
  partial: "bg-purple-mid",
  no: "bg-lilac-strong",
  unknown: "border border-dashed border-ui bg-surface",
}

/**
 * Offerings × requirements heat strip, ported from Proploy's
 * RequirementFitChart. One row per offering, one cell per captured
 * requirement; the line under the chart reads out the hovered cell.
 */
export function FitChart({ matrix }: { matrix: FitMatrix }) {
  const [focus, setFocus] = useState<{ col: number; row: number } | null>(null)
  const focused = focus ? matrix.columns[focus.col] : null
  const focusedRow = focus ? matrix.rows[focus.row] : null
  const focusedCell = focused && focusedRow ? focused.cells[focusedRow.key] : undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2" aria-label="How each option fits your requirements">
        {matrix.columns.map((col, c) => (
          <div key={col.offering.offering_id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
            <span className="truncate text-[12.5px] font-medium text-body" title={col.offering.title}>
              {col.offering.title}
            </span>
            <span className="flex gap-1">
              {matrix.rows.map((row, r) => {
                const status = col.cells[row.key]?.status ?? "unknown"
                return (
                  <button
                    key={row.key}
                    type="button"
                    aria-label={`${col.offering.title}, ${row.label}: ${FIT_LABEL[status]}`}
                    onMouseEnter={() => setFocus({ col: c, row: r })}
                    onFocus={() => setFocus({ col: c, row: r })}
                    onMouseLeave={() => setFocus(null)}
                    className={`h-4 w-4 rounded-[4px] ${FIT_CELL_CLASS[status]} focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand`}
                  />
                )
              })}
            </span>
            <span className="w-10 text-right font-mono text-[11.5px] text-muted">
              {col.counts.met}/{matrix.rows.length}
            </span>
          </div>
        ))}
      </div>

      <p className="min-h-[2.6em] text-[12px] leading-snug text-muted" aria-live="polite">
        {focused && focusedRow ? (
          <>
            <span className="font-semibold text-body">{focusedRow.label}</span> · {FIT_LABEL[focusedCell?.status ?? "unknown"]}
            {focusedCell?.source === "judgement" ? " (Fruit's read)" : focusedCell?.source === "documented" ? " (documented)" : ""}
            {focusedCell?.note ? `: ${focusedCell.note}` : ""}
          </>
        ) : (
          <>Columns: {matrix.rows.map((r) => r.label).join(", ")}. Hover a cell for the reasoning.</>
        )}
      </p>

      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {(["yes", "partial", "no", "unknown"] as const).map((s) => (
          <li key={s} className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${FIT_CELL_CLASS[s]}`} aria-hidden />
            {FIT_LABEL[s]}
          </li>
        ))}
      </ul>
    </div>
  )
}
