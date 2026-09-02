import Link from "next/link"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import { getGa4Overview, getGscClicksByPage, getBlogPerformance } from "@/lib/googleAnalytics"
import { getAeoVisibility } from "@/lib/marketaInsights"
import { getAllBlogPostsForPortal } from "@/sanity/queries"
import PortalShell from "@/components/internal/PortalShell"
import BlogPerformanceTable from "@/components/internal/BlogPerformanceTable"
import { SectionCards } from "@/components/section-cards"
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
import { FileText } from "lucide-react"

export const dynamic = "force-dynamic"

interface DraftRow {
  id: string
  title: string | null
  updated_at: string
}

function fmt(d?: string): string {
  if (!d) return ""
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return d
  }
}

export default async function DashboardPage() {
  const user = await requirePortalUser({ next: "/internal" })

  let drafts: DraftRow[] = []
  try {
    // Shared team workspace — surface everyone's drafts, not just your own.
    const { data } = await getPortalAdmin()
      .from("portal_drafts")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(25)
    drafts = (data as DraftRow[] | null) ?? []
  } catch {
    // Portal DB not reachable — show an empty drafts state rather than 500.
  }

  // Analytics (null until the Google service-account secret is set). Each source
  // is independent so one outage cannot blank the dashboard.
  const [ga4, gsc, performance, aeo, posts] = await Promise.all([
    getGa4Overview(28).catch(() => null),
    getGscClicksByPage(28).catch(() => null),
    getBlogPerformance(28).catch(() => null),
    getAeoVisibility(90),
    // Titles only — analytics reports paths, and a slug reads badly in a table.
    getAllBlogPostsForPortal().catch(() => [] as { slug?: string; title?: string }[]),
  ])

  const postTitles = new Map<string, string>()
  for (const p of (posts as { slug?: string; title?: string }[]) ?? []) {
    if (p.slug && p.title) postTitles.set(p.slug, p.title)
  }
  const nf = (n: number) => n.toLocaleString()

  return (
    <PortalShell email={user.email} active="dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Welcome{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Write and publish blog posts. No Sanity account needed.
          </p>
        </div>
        <Button
          render={<Link href="/internal/blog/new" />}
          className="bg-[var(--purple-primary)] text-white hover:bg-[var(--purple-primary)]/90"
        >
          New blog post
        </Button>
      </div>

      <SectionCards
        connected={Boolean(ga4)}
        totalVisitors={ga4 ? nf(ga4.totalUsers) : undefined}
        pageViews={ga4 ? nf(ga4.pageViews) : undefined}
        conversions={ga4 ? nf(ga4.conversions) : undefined}
        searchClicks={gsc ? nf(gsc.totalClicks) : undefined}
      />

      <div className="px-1">
        <ChartAreaInteractive />
      </div>

      {performance && performance.posts.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Top posts</CardTitle>
                <CardDescription>
                  Views, search performance and CTA clicks over the last 28 days.
                </CardDescription>
              </div>
              <Link
                href="/internal/insights"
                className="text-sm font-medium text-[var(--purple-primary)]"
              >
                All performance →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <BlogPerformanceTable
              posts={performance.posts}
              titles={postTitles}
              limit={5}
              ctaTrackingIdle={performance.ctaTrackingIdle}
            />
          </CardContent>
        </Card>
      ) : null}

      {aeo && aeo.totalRuns > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>AI answer visibility</CardTitle>
                <CardDescription>
                  {aeo.citationRate.toFixed(0)}% of sampled AI answers cite Fruition
                  {aeo.topCompetitors.length > 0
                    ? ` — most-cited rival: ${aeo.topCompetitors[0].name}`
                    : ""}
                  .
                </CardDescription>
              </div>
              <Link
                href="/internal/insights"
                className="text-sm font-medium text-[var(--purple-primary)]"
              >
                Details →
              </Link>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent drafts</CardTitle>
          <CardDescription>The team&rsquo;s latest unpublished posts.</CardDescription>
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
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {drafts.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm font-medium text-ink-heading">
                    {d.title || "Untitled draft"}
                  </span>
                  <span className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
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
