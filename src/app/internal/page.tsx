import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getGa4Overview, getGscClicksByPage, getBlogPerformance } from "@/lib/googleAnalytics"
import { getAeoVisibility, getCompetitorActivity } from "@/lib/marketaInsights"
import { getUmamiInsights, isUmamiConfigured } from "@/lib/insights/umami"
import type { InsightsView as InsightsViewLike } from "@/lib/insights/types"
import AeoVisibilityPanel from "@/components/internal/AeoVisibilityPanel"
import CompetitorActivityPanel from "@/components/internal/CompetitorActivityPanel"
import InsightsPanel from "@/components/internal/insights/InsightsPanel"
import { getAllBlogPostsForPortal } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import NeedsYou, { type NeedsYouItem } from "@/components/internal/NeedsYou"
import DashboardDetail from "@/components/internal/DashboardDetail"
import { SectionCards, type SectionMetric } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive-dynamic"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FileText, PenSquare, Share2 } from "lucide-react"

export const dynamic = "force-dynamic"

const WINDOW_DAYS = 28
/** A draft nobody has touched in this long is a decision, not a work in progress. */
const STALE_DAYS = 30

interface DraftRow {
  id: string
  title: string | null
  metadata: Record<string, unknown> | null
  updated_at: string
}

interface CompositionRow {
  id: string
  title: string | null
  scheduled_for: string | null
}

function fmt(d?: string): string {
  if (!d) return ""
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return d
  }
}

/** "Today 19:30" / "Wed 11:30" — a send time reads better than a date. */
function whenLabel(iso: string): string {
  const at = new Date(iso)
  const today = new Date()
  const sameDay =
    at.getFullYear() === today.getFullYear() &&
    at.getMonth() === today.getMonth() &&
    at.getDate() === today.getDate()
  const time = at.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  return sameDay ? `Today ${time}` : `${at.toLocaleDateString(undefined, { weekday: "short" })} ${time}`
}

export default async function DashboardPage() {
  const user = await requirePortalUser({ next: "/internal" })
  const admin = getPortalAdmin()

  // Shared team workspace — surface everyone's drafts, not just your own. Each
  // read is independent so one outage cannot blank the dashboard.
  const [draftRes, queueRes] = await Promise.all([
    (async () => {
      try {
        const { data } = await admin
          .from("portal_drafts")
          .select("id, title, metadata, updated_at")
          .order("updated_at", { ascending: false })
          .limit(500)
        return (data as DraftRow[] | null) ?? []
      } catch {
        return []
      }
    })(),
    (async () => {
      try {
        const { data } = await admin
          .from("social_compositions")
          .select("id, title, scheduled_for")
          .not("scheduled_for", "is", null)
          .gte("scheduled_for", new Date().toISOString())
          .order("scheduled_for", { ascending: true })
          .limit(3)
        return (data as CompositionRow[] | null) ?? []
      } catch {
        return []
      }
    })(),
  ])

  const allDrafts: DraftRow[] = draftRes
  const unpublished = allDrafts.filter(
    (d) => ((d.metadata ?? {}) as Record<string, unknown>).status !== "published"
  )
  const staleCutoff = new Date().getTime() - STALE_DAYS * 86_400_000
  const stale = unpublished.filter((d) => Date.parse(d.updated_at) < staleCutoff)
  const drafts = allDrafts.slice(0, 8)

  const showTraffic = isUmamiConfigured()
  const [ga4, gsc, performance, aeo, posts, competitors, umami] = await Promise.all([
    getGa4Overview(WINDOW_DAYS).catch(() => null),
    getGscClicksByPage(WINDOW_DAYS).catch(() => null),
    getBlogPerformance(WINDOW_DAYS).catch(() => null),
    getAeoVisibility(90),
    // Titles only — analytics reports paths, and a slug reads badly in a table.
    getAllBlogPostsForPortal().catch(() => [] as { slug?: string; title?: string }[]),
    // The two views that used to live on /internal/insights, now that the
    // dashboard is where visibility questions get asked.
    getCompetitorActivity(90),
    // getUmamiInsights reports its own unavailability, so a throw here is a
    // genuine outage. Swallowing it to null hid the tab entirely, which reads
    // as "we do not measure this" rather than "this source is down".
    showTraffic
      ? getUmamiInsights(WINDOW_DAYS).catch(
          (err: unknown): InsightsViewLike => ({
            metrics: [],
            sections: [],
            notes: [],
            available: false,
            unavailableReason: `Umami is connected but did not answer: ${
              err instanceof Error ? err.message : String(err)
            }`,
          })
        )
      : Promise.resolve(null),
  ])

  // Today is a partial day and would render as a cliff at the right edge of the
  // chart, which reads as a traffic collapse rather than an incomplete day.
  const todayIso = new Date().toISOString().slice(0, 10)
  const trafficSeries = (ga4?.daily ?? [])
    .filter((d) => d.date < todayIso)
    .map((d) => ({ date: d.date, visitors: d.users }))

  const postTitles = new Map<string, string>()
  for (const p of (posts as { slug?: string; title?: string }[]) ?? []) {
    if (p.slug && p.title) postTitles.set(p.slug, p.title)
  }
  const nf = (n: number) => n.toLocaleString()

  // A feed that is wired up but structurally cannot report is named, not zeroed.
  const ctaIdle = performance?.ctaTrackingIdle ?? false
  const conversionsIdle = Boolean(ga4) && ga4?.conversions === 0
  const deadFeeds: { label: string; detail: string }[] = []
  if (ctaIdle) deadFeeds.push({ label: "CTA clicks", detail: "no cta_click trigger in GTM" })
  if (conversionsIdle) {
    deadFeeds.push({ label: "Conversions", detail: "no key event set on the GA4 property" })
  }

  const metrics: SectionMetric[] = [
    {
      label: "Visitors",
      value: ga4 ? nf(ga4.totalUsers) : undefined,
      caption: ga4
        ? `GA4 · ${nf(ga4.sessions)} sessions, last ${WINDOW_DAYS} days`
        : "Connect GA4 to populate",
    },
    {
      label: "Page views",
      value: ga4 ? nf(ga4.pageViews) : undefined,
      caption: ga4
        ? `GA4 · ${(ga4.pageViews / Math.max(ga4.sessions, 1)).toFixed(1)} a session`
        : "Connect GA4 to populate",
    },
    {
      label: "Search clicks",
      value: gsc ? nf(gsc.totalClicks) : undefined,
      caption: gsc
        ? `Search Console · from ${nf(gsc.totalImpressions)} impressions`
        : "Connect Search Console to populate",
    },
    {
      label: "Blog views",
      value: performance ? nf(performance.totals.views) : undefined,
      caption:
        performance && ga4 && ga4.pageViews > 0
          ? `${Math.round((performance.totals.views / ga4.pageViews) * 100)}% of all page views`
          : "GA4 · posts only",
    },
  ]

  const needsYou: NeedsYouItem[] = []
  if (queueRes.length > 0) {
    needsYou.push({
      kind: "schedule",
      title: `${queueRes.length} social post${queueRes.length === 1 ? "" : "s"} still to go out`,
      lines: queueRes.map((c) => ({
        label: c.scheduled_for ? whenLabel(c.scheduled_for) : "Unscheduled",
        detail: c.title ?? "Untitled post",
      })),
      href: "/internal/social",
      action: "Open the queue",
    })
  }
  if (stale.length > 0) {
    needsYou.push({
      kind: "backlog",
      title: `${unpublished.length} drafts waiting on a decision`,
      lines: [
        {
          label: `${stale.length} untouched`,
          detail: `for more than ${STALE_DAYS} days`,
        },
        {
          label: "Oldest",
          detail: fmt(stale[stale.length - 1]?.updated_at),
        },
      ],
      href: "/internal/blog",
      action: "Review the stale drafts",
    })
  }
  if (deadFeeds.length > 0) {
    needsYou.push({
      kind: "broken",
      title: `${deadFeeds.length} feed${deadFeeds.length === 1 ? " is" : "s are"} reporting nothing`,
      lines: deadFeeds,
      href: "/internal/blog?view=performance",
      action: "See what is missing",
    })
  }

  return (
    <PortalShell email={user.email} active="dashboard">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Welcome{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {needsYou.length > 0
              ? "A few things want you today, then the numbers."
              : "Nothing is waiting on you. Here are the numbers."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" render={<Link href="/internal/social/new" />}>
            <Share2 />
            New social post
          </Button>
          <Button variant="brand" render={<Link href="/internal/blog/new" />}>
            <PenSquare />
            New blog post
          </Button>
        </div>
      </div>

      <NeedsYou items={needsYou} />

      <SectionCards metrics={metrics} />

      <ChartAreaInteractive data={trafficSeries} />

      {performance && performance.posts.length > 0 ? (
        <DashboardDetail
          posts={performance.posts}
          titles={postTitles}
          ctaTrackingIdle={ctaIdle}
          aeo={
            aeo && aeo.totalRuns > 0
              ? {
                  citationRate: aeo.citationRate,
                  totalRuns: aeo.totalRuns,
                  totalCitations: aeo.totalCitations,
                  competitors: aeo.topCompetitors.slice(0, 4),
                }
              : null
          }
          aeoDetail={
            aeo && aeo.totalRuns > 0 ? (
              <div className="flex flex-col gap-6">
                <AeoVisibilityPanel data={aeo} />
                {competitors ? <CompetitorActivityPanel competitors={competitors} /> : null}
              </div>
            ) : null
          }
          traffic={
            umami ? <InsightsPanel view={umami} rangeLabel={`last ${WINDOW_DAYS} days`} /> : null
          }
          countries={(ga4?.topCountries ?? []).slice(0, 5)}
        />
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Recent drafts</CardTitle>
              <CardDescription>
                Everyone&rsquo;s, newest first — the whole team writes into one workspace.
              </CardDescription>
            </div>
            {unpublished.length > 0 ? (
              <Link
                href="/internal/blog"
                className="text-sm font-medium text-[var(--purple-primary)]"
              >
                All {unpublished.length} drafts →
              </Link>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>No drafts yet</EmptyTitle>
                <EmptyDescription>
                  Start a new post and hit “Save draft” — it’ll show up here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button render={<Link href="/internal/blog/new" />}>
                  New blog post
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {drafts.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0 truncate text-sm font-medium text-ink-heading">
                    {d.title || "Untitled draft"}
                  </span>
                  <span className="flex shrink-0 items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>edited {fmt(d.updated_at)}</span>
                    <Link
                      href={`/internal/blog/${d.id}/edit`}
                      className="font-medium text-[var(--purple-primary)]"
                    >
                      Edit →
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </PortalShell>
  )
}
