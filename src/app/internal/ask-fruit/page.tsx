import Link from "next/link"
import { notFound } from "next/navigation"
import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import StatGrid from "@/components/internal/StatGrid"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requirementRows } from "@/lib/askFruit/requirements"
import { conversation, recentConversations, usageStats, type StaffRow } from "@/lib/askFruit/staff"

export const dynamic = "force-dynamic"

const usd = (n: number) => `$${n.toFixed(2)}`
const when = (iso: string) => new Date(iso).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })

/**
 * Ask Fruit conversations from the public site. Visitors are anonymous, so this
 * is the only place the team sees what prospects asked and were recommended.
 * `?id=` opens one conversation. One route rather than list + [id], because
 * every page route adds ~8 KiB to a Worker that is near its size limit.
 */
export default async function AskFruitStaffPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  const user = await requirePortalUser({ next: id ? `/internal/ask-fruit?id=${encodeURIComponent(id)}` : "/internal/ask-fruit" })

  if (id) {
    const row = await conversation(id)
    if (!row) notFound()
    return (
      <PortalShell email={user.email} title="Ask Fruit">
        <ConversationDetail row={row} />
      </PortalShell>
    )
  }

  const [rows, stats] = await Promise.all([recentConversations(), usageStats()])
  return (
    <PortalShell email={user.email} title="Ask Fruit">
      <PageHeader
        title="Ask Fruit conversations"
        description="What visitors asked Fruit on /ask-fruit, what it captured and what it recommended. Most recent first."
      />
      <StatGrid
        stats={[
          { label: "Conversations", value: String(stats.conversations7d), caption: "Started in the last 7 days" },
          { label: "Turns", value: String(stats.turns7d), caption: `${stats.failed7d} failed in the last 7 days` },
          { label: "Model spend", value: usd(stats.cost7d), caption: "Last 7 days, via OpenRouter" },
          { label: "Spend today", value: usd(stats.costToday), caption: "Rolling 24 hours, counts toward the daily cap" },
        ]}
      />
      <div className="mt-6 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conversation</TableHead>
              <TableHead>Industry / region</TableHead>
              <TableHead>Recommended</TableHead>
              <TableHead className="text-right">Turns</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[320px]">
                    <Link href={`/internal/ask-fruit?id=${encodeURIComponent(r.id)}`} className="font-medium hover:underline">
                      {r.title}
                    </Link>
                    <div className="mt-1 flex gap-1.5">
                      <Badge variant="secondary">{r.stage}</Badge>
                      {r.documents.length ? (
                        <Badge variant="outline">
                          {r.documents.length} brief{r.documents.length > 1 ? "s" : ""}
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {[...(r.requirements.industry ?? []), ...(r.requirements.region ?? [])].join(" · ") || "None"}
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-sm">
                    {r.matches.map((m) => m.title).slice(0, 3).join(", ") || "None"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.messages.filter((m) => m.role === "user").length}</TableCell>
                  <TableCell className="text-right text-sm whitespace-nowrap text-muted-foreground">{when(r.updated_at)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No conversations yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PortalShell>
  )
}

function ConversationDetail({ row }: { row: StaffRow }) {
  const known = requirementRows(row.requirements).filter((r) => r.known)
  return (
    <>
      <PageHeader
        title={row.title}
        description={`Started ${when(row.created_at)}`}
        actions={
          <Link href="/internal/ask-fruit" className="text-sm font-medium hover:underline">
            All conversations
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          {row.messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "self-end rounded-lg bg-muted px-4 py-3 text-sm lg:max-w-[80%]" : "text-sm"}>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {m.role === "user" ? "Visitor" : "Fruit"}
                {m.status === "failed" ? " · failed" : ""}
              </p>
              <p className="whitespace-pre-wrap">{m.markdown || "(no reply)"}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {known.length ? (
                known.map((r) => (
                  <div key={r.key}>
                    <p className="text-xs text-muted-foreground">{r.label}</p>
                    <p>{r.values.join("; ")}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Nothing captured.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recommended</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {row.matches.length ? (
                row.matches.map((m) => (
                  <div key={m.offering_id} className="flex items-center justify-between gap-2">
                    <a href={m.url} target="_blank" rel="noopener" className="hover:underline">
                      {m.title}
                    </a>
                    <span className="flex items-center gap-1.5">
                      {row.shortlist.includes(m.offering_id) ? <Badge variant="secondary">kept</Badge> : null}
                      {m.match_score != null ? <span className="tabular-nums text-muted-foreground">{m.match_score}</span> : null}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recommendation yet.</p>
              )}
            </CardContent>
          </Card>
          {row.documents.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Briefs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                {row.documents.map((d) => (
                  <p key={d.doc_id}>
                    {d.title} <span className="text-muted-foreground">({d.doc_type.replace("_", " ")})</span>
                  </p>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  )
}
