import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

/**
 * Onboarding guide for developers joining the website: architecture, hosting, DNS, Sanity,
 * integrations and the Claude Code setup. The document itself is served by ./doc/route.ts.
 */
export default async function HandoverPage() {
  const user = await requirePortalUser({ next: "/internal/handover" })
  return (
    <PortalShell email={user.email} title="Developer handover">
      <PageHeader
        title="Developer handover"
        description="How the website is built, hosted and shipped, and how to set up Claude Code to work on it."
        actions={
          <Button variant="outline" render={<a href="/internal/handover/doc" target="_blank" rel="noopener" />}>
            Open full page
          </Button>
        }
      />
      <iframe
        src="/internal/handover/doc"
        title="Fruition website developer handover"
        className="h-[calc(100dvh-13rem)] min-h-[32rem] w-full rounded-xl border border-border bg-background"
      />
    </PortalShell>
  )
}
