import { requirePortalUser } from "@/lib/portalAuth"
import { getAllBlogPostsForPortal } from "@/sanity/queries"
import { getBlogPerformance } from "@/lib/googleAnalytics"
import { getAeoVisibility, getCompetitorActivity } from "@/lib/marketaInsights"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import StatGrid from "@/components/internal/StatGrid"
import BlogPerformanceTable from "@/components/internal/BlogPerformanceTable"
import AeoVisibilityPanel from "@/components/internal/AeoVisibilityPanel"
import CompetitorActivityPanel from "@/components/internal/CompetitorActivityPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const WINDOW_DAYS = 28
const nf = new Intl.NumberFormat()

interface SanityPost {
  slug?: string
  title?: string
}

/**
 * Content performance in one place: how each post performs, whether its CTAs get
 * clicked, how often AI answer engines cite us, and what competitors published.
 *
 * Traffic and CTA numbers come from GA4/Search Console; AEO and competitor data
 * from the Marketa brain. Every source degrades independently — a section that
 * cannot load says so rather than taking the page down.
 */
export default async function InsightsPage() {
  const user = await requirePortalUser({ next: "/internal/insights" })

  const [performance, aeo, competitors, posts] = await Promise.all([
    getBlogPerformance(WINDOW_DAYS).catch(() => null),
    getAeoVisibility(90),
    getCompetitorActivity(90),
    getAllBlogPostsForPortal().catch(() => [] as SanityPost[]),
  ])

  const titles = new Map<string, string>()
  for (const p of (posts as SanityPost[]) ?? []) {
    if (p.slug && p.title) titles.set(p.slug, p.title)
  }

  const ctaIdle = performance?.ctaTrackingIdle ?? false

  const stats = [
    {
      label: "Blog views",
      value: performance ? nf.format(performance.totals.views) : "—",
      caption: `GA4 · last ${WINDOW_DAYS} days`,
    },
    {
      label: "Search clicks",
      value: performance ? nf.format(performance.totals.searchClicks) : "—",
      caption: `Search Console · last ${WINDOW_DAYS} days`,
    },
    {
      label: "CTA clicks",
      value: ctaIdle || !performance ? "—" : nf.format(performance.totals.ctaClicks),
      caption: ctaIdle ? "Awaiting the GTM trigger" : `GA4 cta_click · last ${WINDOW_DAYS} days`,
    },
    {
      label: "AI citation rate",
      value: aeo && aeo.totalRuns > 0 ? `${aeo.citationRate.toFixed(0)}%` : "—",
      caption: aeo && aeo.totalRuns > 0 ? `${nf.format(aeo.totalRuns)} answers sampled` : "No scans yet",
    },
  ]

  return (
    <PortalShell email={user.email} active="insights">
      <PageHeader
        title="Content performance"
        description={`Traffic, CTA clicks, AI visibility and competitor activity. Traffic covers the last ${WINDOW_DAYS} days.`}
      />

      <StatGrid stats={stats} />

      {ctaIdle ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              CTA clicks are being pushed to the GTM data layer as{" "}
              <code className="font-mono text-xs">cta_click</code>, but GA4 has not recorded any
              yet. Add a Custom Event trigger on <code className="font-mono text-xs">cta_click</code>{" "}
              in GTM container GTM-PF6XWTL6 and forward it to GA4 — numbers appear here within about
              a day of the first click.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-ink-heading">Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {performance ? (
            <BlogPerformanceTable
              posts={performance.posts}
              titles={titles}
              ctaTrackingIdle={ctaIdle}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Analytics not connected — GA4_PROPERTY_ID or the Google service account is missing.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-ink-heading">AI answer visibility</CardTitle>
        </CardHeader>
        <CardContent>
          {aeo ? (
            <AeoVisibilityPanel data={aeo} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Could not reach the Marketa brain for AEO data.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-ink-heading">Competitors</CardTitle>
        </CardHeader>
        <CardContent>
          {competitors ? (
            <CompetitorActivityPanel competitors={competitors} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Could not reach the Marketa brain for competitor snapshots.
            </p>
          )}
        </CardContent>
      </Card>
    </PortalShell>
  )
}
