import { requirePortalUser } from "@/lib/portalAuth"
import { getAllBlogPostsForPortal } from "@/sanity/queries"
import { getBlogPerformance } from "@/lib/googleAnalytics"
import { getBlogInsights } from "@/lib/insights/blog"
import { getSocialInsights } from "@/lib/insights/social"
import { getUmamiInsights, isUmamiConfigured } from "@/lib/insights/umami"
import { getAeoVisibility, getCompetitorActivity } from "@/lib/marketaInsights"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import InsightsToolbar, { type InsightsTab } from "@/components/internal/insights/InsightsToolbar"
import InsightsPanel from "@/components/internal/insights/InsightsPanel"
import BlogPerformanceTable from "@/components/internal/BlogPerformanceTable"
import AeoVisibilityPanel from "@/components/internal/AeoVisibilityPanel"
import CompetitorActivityPanel from "@/components/internal/CompetitorActivityPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const ALLOWED_RANGES = [7, 28, 90]

interface SanityPost {
  slug?: string
  title?: string
}

function parseParams(params: Record<string, string | string[] | undefined>): {
  tab: InsightsTab
  days: number
} {
  const rawTab = Array.isArray(params.tab) ? params.tab[0] : params.tab
  const rawDays = Array.isArray(params.days) ? params.days[0] : params.days
  const days = Number(rawDays)
  const tab: InsightsTab =
    rawTab === "social" || rawTab === "traffic" || rawTab === "ai" ? rawTab : "blog"
  return { tab, days: ALLOWED_RANGES.includes(days) ? days : 28 }
}

/**
 * Content performance, split by source. Blog covers GA4 traffic, Search Console
 * and CTA clicks, plus the AI-answer and competitor reads from the Marketa
 * brain; Social covers Zernio engagement.
 *
 * Only the selected tab's data is fetched — the two sources are unrelated and
 * a Zernio outage should not slow down or break the blog view.
 */
export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requirePortalUser({ next: "/internal/insights" })
  const { tab, days } = parseParams(await searchParams)
  const rangeLabel = `last ${days} days`
  const showTraffic = isUmamiConfigured()

  if (tab === "traffic") {
    const view = await getUmamiInsights(days)
    return (
      <PortalShell email={user.email} active="insights">
        <PageHeader
          title="Content performance"
          description="Where visitors come from, and what they do on the site."
        />
        <InsightsToolbar tab={tab} days={days} showTraffic={showTraffic} />
        <InsightsPanel view={view} rangeLabel={rangeLabel} />
      </PortalShell>
    )
  }

  if (tab === "ai") {
    // The AEO scan is weekly and its own 90-day window; the range control does
    // not apply to it, so it is not passed one.
    const [aeo, competitors] = await Promise.all([getAeoVisibility(90), getCompetitorActivity(90)])
    return (
      <PortalShell email={user.email} active="insights">
        <PageHeader
          title="AI answer visibility"
          description="How often AI answer engines cite Fruition, which prompts earn it, and what the firms named beside us have been publishing. Sampled over the last 90 days."
        />
        <InsightsToolbar tab={tab} days={days} showTraffic={showTraffic} />

        <Card>
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

  if (tab === "social") {
    const view = await getSocialInsights(days)
    return (
      <PortalShell email={user.email} active="insights">
        <PageHeader
          title="Content performance"
          description="How published social posts are performing, by publish date."
        />
        <InsightsToolbar tab={tab} days={days} showTraffic={showTraffic} />
        <InsightsPanel view={view} rangeLabel={rangeLabel} />
      </PortalShell>
    )
  }

  const [view, performance, posts] = await Promise.all([
    getBlogInsights(days),
    getBlogPerformance(days).catch(() => null),
    getAllBlogPostsForPortal().catch(() => [] as SanityPost[]),
  ])

  const titles = new Map<string, string>()
  for (const p of (posts as SanityPost[]) ?? []) {
    if (p.slug && p.title) titles.set(p.slug, p.title)
  }

  return (
    <PortalShell email={user.email} active="insights">
      <PageHeader
        title="Blog performance"
        description="Traffic, search position and CTA clicks, post by post. AI visibility and competitors have their own tab."
      />
      <InsightsToolbar tab={tab} days={days} showTraffic={showTraffic} />

      <InsightsPanel view={view} rangeLabel={rangeLabel}>
        {performance && performance.posts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-ink-heading">Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogPerformanceTable
                posts={performance.posts}
                titles={titles}
                ctaTrackingIdle={performance.ctaTrackingIdle}
              />
            </CardContent>
          </Card>
        ) : null}
      </InsightsPanel>

    </PortalShell>
  )
}
