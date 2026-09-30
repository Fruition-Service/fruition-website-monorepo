/**
 * Requirement-fit maths shared by the fit chart, the coverage bars and the
 * comparison brief. Ported from Proploy's requirement-fit.ts and brief-types.ts
 * fitCounts, minus the gateway's catalog-owned row split.
 */
import { REQUIREMENT_DEFINITIONS } from "./requirements"
import { REQUIREMENT_KEYS, type FitCell, type FitStatus, type Offering, type RequirementKey, type Requirements } from "./types"

export interface FitCounts {
  met: number
  partial: number
  missing: number
  unknown: number
  assessed: number
  /** Partial counts as half; unknown cells are left out of the denominator. */
  percent: number | null
}

export function fitCounts(statuses: FitStatus[]): FitCounts {
  const met = statuses.filter((s) => s === "yes").length
  const partial = statuses.filter((s) => s === "partial").length
  const missing = statuses.filter((s) => s === "no").length
  const unknown = statuses.length - met - partial - missing
  const assessed = met + partial + missing
  return {
    met,
    partial,
    missing,
    unknown,
    assessed,
    percent: assessed ? Math.round(((met + partial / 2) / assessed) * 100) : null,
  }
}

export interface FitMatrixRow {
  key: RequirementKey
  label: string
}

export interface FitMatrix {
  rows: FitMatrixRow[]
  columns: Array<{ offering: Offering; cells: Record<string, FitCell | undefined>; counts: FitCounts }>
}

/**
 * Offerings × captured requirements. Returns null until the chart would say
 * something: two assessed offerings and two requirement rows at minimum, and at
 * least half the cells judged (same thresholds Proploy shipped with).
 */
export function buildFitMatrix(offerings: Offering[], requirements: Requirements): FitMatrix | null {
  const rows = REQUIREMENT_KEYS.filter((k) => (requirements[k] ?? []).length > 0).map((key) => ({
    key,
    label: REQUIREMENT_DEFINITIONS[key].label,
  }))
  const assessedOfferings = offerings.filter((o) => o.requirement_fit && Object.keys(o.requirement_fit).length > 0)
  if (assessedOfferings.length < 2 || rows.length < 2) return null

  const columns = assessedOfferings.map((offering) => {
    const cells: Record<string, FitCell | undefined> = {}
    for (const row of rows) cells[row.key] = offering.requirement_fit?.[row.key]
    const counts = fitCounts(rows.map((r) => cells[r.key]?.status ?? "unknown"))
    return { offering, cells, counts }
  })
  const totalCells = rows.length * columns.length
  const assessedCells = columns.reduce((sum, c) => sum + c.counts.assessed, 0)
  if (assessedCells / totalCells < 0.5) return null
  return { rows, columns }
}

export const FIT_LABEL: Record<FitStatus, string> = {
  yes: "Meets",
  partial: "Partly meets",
  no: "Gap",
  unknown: "Not assessed",
}

export function matchStrength(score: number | null | undefined): string {
  if (score == null) return "Suggested"
  if (score >= 80) return "Strong match"
  if (score >= 60) return "Good match"
  return "Partial match"
}
