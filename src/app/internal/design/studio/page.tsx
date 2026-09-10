import { redirect } from "next/navigation"
import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"

export const dynamic = "force-dynamic"

/**
 * Fruition Design studio — the self-hosted design tool, opened from the portal.
 *
 * The studio itself cannot run here: it is a long-lived Node daemon that spawns
 * agent CLI processes and keeps SQLite state, none of which a Cloudflare Worker
 * can do. It runs on its own always-on machine and this route hands people over
 * to it, so the portal stays the single front door and the portal's own auth
 * still gates who gets sent there.
 *
 * A redirect rather than an iframe, deliberately. Framing meant the studio had
 * to be HTTPS (an https:// page cannot embed http://), had to allow itself to
 * be framed, and had to accept the portal as a cross-origin caller. Redirecting
 * drops all three constraints — the browser simply navigates.
 */
const STUDIO_URL = process.env.DESIGN_STUDIO_URL?.trim()

export default async function DesignStudioPage() {
  const user = await requirePortalUser({ next: "/internal/design/studio" })

  // Auth first: only signed-in staff are handed over to the studio.
  if (STUDIO_URL) redirect(STUDIO_URL)

  // Unconfigured: explain rather than bounce to nowhere.
  return (
    <PortalShell email={user.email} title="Design studio">
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Design studio isn&apos;t connected yet
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The studio runs on its own machine. Set{" "}
          <code className="rounded-badge bg-[var(--purple-tint,#f7f5ff)] px-1.5 py-0.5 font-mono text-xs">
            DESIGN_STUDIO_URL
          </code>{" "}
          to its address and this page will hand you straight over to it.
        </p>
      </div>
    </PortalShell>
  )
}
