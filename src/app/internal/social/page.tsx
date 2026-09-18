import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import SocialDashboard from "@/components/internal/SocialDashboard"
import InsightsPanel from "@/components/internal/insights/InsightsPanel"
import { getSocialInsights } from "@/lib/insights/social"

export const dynamic = "force-dynamic"

/**
 * Everything published (or drafted) through Zernio across all channels, with
 * search + platform/status filters. Posts made outside Zernio don't appear —
 * the API only manages posts it created.
 */
export default async function SocialPostsPage() {
  const user = await requirePortalUser({ next: "/internal/social" })
  // The engagement view that used to sit on /internal/insights. Rendered here
  // and handed to the Performance tab, so social numbers have one home.
  const insights = await getSocialInsights(28).catch(() => null)
  return (
    <PortalShell email={user.email} active="social">
      <SocialDashboard
        insights={
          insights ? <InsightsPanel view={insights} rangeLabel="last 28 days" /> : null
        }
      />
    </PortalShell>
  )
}
