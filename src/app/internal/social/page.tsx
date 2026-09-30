import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import SocialDashboard from "@/components/internal/SocialDashboard"
import InsightsPanel from "@/components/internal/insights/InsightsPanel"
import { parseRange } from "@/components/internal/insights/RangeTabs"
import { getSocialInsights } from "@/lib/insights/social"

export const dynamic = "force-dynamic"

/**
 * Everything published (or drafted) through Zernio across all channels, with
 * search + platform/status filters. Posts made outside Zernio don't appear —
 * the API only manages posts it created.
 *
 * `?view=performance&days=7|28|90` opens the Performance tab on that range, the
 * same URL shape as /internal/blog, so a range stays linkable.
 */
export default async function SocialPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requirePortalUser({ next: "/internal/social" })
  const params = await searchParams
  const view = Array.isArray(params.view) ? params.view[0] : params.view
  const days = parseRange(params.days)
  // The engagement view that used to sit on /internal/insights. Rendered here
  // and handed to the Performance tab, so social numbers have one home.
  const insights = await getSocialInsights(days).catch(() => null)
  return (
    <PortalShell email={user.email} active="social">
      <SocialDashboard
        initialTab={view === "performance" ? "performance" : view === "posts" ? "posts" : "queue"}
        days={days}
        insights={
          insights ? <InsightsPanel view={insights} rangeLabel={`last ${days} days`} /> : null
        }
      />
    </PortalShell>
  )
}
