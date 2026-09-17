import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * The dashboard's headline numbers.
 *
 * A metric with no working source is never rendered as a zero — a zero reads as
 * "a bad month" when the truth is "nothing is reporting". Pass `idle` and the
 * tile shows an em dash and says what would have to be fixed.
 */
export interface SectionMetric {
  label: string
  /** Formatted value. Ignored when `idle` is set. */
  value?: string
  /** Where the number comes from, or what is wrong when `idle`. */
  caption: string
  /** True when the feed exists but structurally cannot report. */
  idle?: boolean
}

export function SectionCards({ metrics }: { metrics: SectionMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardHeader>
            <CardDescription>{m.label}</CardDescription>
            <CardTitle
              className={
                m.idle || !m.value
                  ? "text-2xl font-semibold tabular-nums text-muted-foreground"
                  : "text-2xl font-semibold tabular-nums text-ink-heading"
              }
            >
              {m.idle || !m.value ? "—" : m.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={
                m.idle
                  ? "text-xs text-[var(--warning-strong)]"
                  : "text-xs text-muted-foreground"
              }
            >
              {m.caption}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
