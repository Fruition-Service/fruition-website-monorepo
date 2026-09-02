import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface Stat {
  label: string
  value: string
  /** Where the number comes from — shown small under the value. */
  caption?: string
}

/**
 * A row of headline numbers. Used by the dashboard, the blog performance
 * section and the insights page so every stat in the portal reads the same.
 */
export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-ink-heading">
              {s.value}
            </CardTitle>
          </CardHeader>
          {s.caption ? (
            <CardContent>
              <p className="text-xs text-muted-foreground">{s.caption}</p>
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
