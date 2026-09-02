import type { CompetitorActivity } from "@/lib/marketaInsights"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

/**
 * Latest snapshot per competitor, newest publishing first.
 * Source: Marketa's weekly `/api/internal/competitors/scan` cron.
 */
export default function CompetitorActivityPanel({
  competitors,
}: {
  competitors: CompetitorActivity[]
}) {
  if (competitors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No competitor snapshots yet. The scan runs weekly on Fridays.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {competitors.map((c) => (
        <Card key={c.competitor}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base text-ink-heading">{c.competitor}</CardTitle>
              <Badge variant="secondary" className="font-normal">
                {c.posts.length} new {c.posts.length === 1 ? "post" : "posts"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Captured {fmtDate(c.capturedAt)}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {c.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
            ) : null}
            {c.posts.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {c.posts.slice(0, 5).map((p, i) => (
                  <li key={`${p.url ?? p.title}-${i}`} className="text-sm">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink-heading hover:underline"
                      >
                        {p.title}
                      </a>
                    ) : (
                      <span className="text-ink-heading">{p.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
