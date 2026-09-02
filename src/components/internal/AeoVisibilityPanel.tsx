import type { AeoVisibility } from "@/lib/marketaInsights"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const nf = new Intl.NumberFormat()

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

/**
 * How often AI answer engines cite us, and who they cite instead.
 * Source: Marketa's weekly `/api/internal/aeo/scan` cron.
 */
export default function AeoVisibilityPanel({ data }: { data: AeoVisibility }) {
  if (data.totalRuns === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No AEO scans recorded yet. The scan runs weekly on Mondays.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Citation rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-ink-heading">
              {data.citationRate.toFixed(0)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {nf.format(data.totalCitations)} of {nf.format(data.totalRuns)} answers mentioned us
            </p>
          </CardContent>
        </Card>
        {data.byEngine.slice(0, 2).map((e) => (
          <Card key={e.engine}>
            <CardHeader>
              <CardDescription className="capitalize">{e.engine}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-ink-heading">
                {e.citationRate.toFixed(0)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {nf.format(e.citations)} of {nf.format(e.runs)} runs
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.topCompetitors.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink-heading">
            Who the answers cite instead
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.topCompetitors.map((c) => (
              <Badge key={c.name} variant="secondary" className="font-normal">
                {c.name}
                <span className="ml-1.5 tabular-nums text-muted-foreground">{c.mentions}</span>
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prompt</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Cited</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Best rank</TableHead>
              <TableHead className="text-right">Last run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.byQuery.map((q) => (
              <TableRow key={q.query}>
                <TableCell className="max-w-[26rem]">
                  <span className="block truncate text-ink-heading">{q.query}</span>
                  {q.citedOn.length > 0 ? (
                    <span className="text-xs text-muted-foreground">
                      cited on {q.citedOn.join(", ")}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">{q.runs}</TableCell>
                <TableCell className="text-right tabular-nums">{q.citations}</TableCell>
                <TableCell className="text-right tabular-nums">
                  <Badge variant={q.citationRate > 0 ? "default" : "secondary"}>
                    {q.citationRate.toFixed(0)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{q.bestRank ?? "—"}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {fmtDate(q.lastRunAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
