import Link from "next/link"
import { Button } from "@/components/ui/button"

export const INSIGHT_RANGES = [7, 28, 90] as const

/**
 * The 7/28/90 range control, lifted out of the retired Insights toolbar so the
 * pages that now own each view can keep it. URL-driven, so a view stays
 * linkable and its page stays a server component.
 */
export default function RangeTabs({
  days,
  hrefFor,
}: {
  days: number
  /** Builds the href for a range, so each page keeps its own query shape. */
  hrefFor: (days: number) => string
}) {
  return (
    <div className="flex gap-2" aria-label="Date range">
      {INSIGHT_RANGES.map((r) => (
        <Button
          key={r}
          aria-pressed={r === days}
          variant={r === days ? "default" : "outline"}
          size="sm"
          render={<Link href={hrefFor(r)} />}
        >
          {r}d
        </Button>
      ))}
    </div>
  )
}

/** Clamps an arbitrary `days` query value onto the three ranges we support. */
export function parseRange(raw: string | string[] | undefined): number {
  const value = Number(Array.isArray(raw) ? raw[0] : raw)
  return (INSIGHT_RANGES as readonly number[]).includes(value) ? value : 28
}
