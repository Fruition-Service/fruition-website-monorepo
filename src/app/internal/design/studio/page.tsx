import { ExternalLink } from "lucide-react"
import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"

export const dynamic = "force-dynamic"

/**
 * Fruition Design studio — the self-hosted OpenDesign instance (rebranded),
 * embedded in the portal.
 *
 * The studio itself cannot run here: it is a long-lived Node daemon that spawns
 * agent CLI processes and keeps SQLite state, none of which a Cloudflare Worker
 * can do. It runs on its own always-on machine and this route frames it, so the
 * portal stays the single front door.
 *
 * The frame is loaded by the visitor's browser, not by the Worker, so the URL
 * must be reachable from wherever staff are AND served over HTTPS — a browser
 * refuses to embed http:// inside this https:// page. A plain Tailscale address
 * therefore will not work; it needs a TLS hostname (a Cloudflare Tunnel), which
 * is also what puts Access in front of a service whose own auth is a single
 * shared token rather than per-user.
 */
const STUDIO_URL = process.env.DESIGN_STUDIO_URL?.trim()

export default async function DesignStudioPage() {
  const user = await requirePortalUser({ next: "/internal/design/studio" })

  return (
    <PortalShell email={user.email} title="Design studio">
      {STUDIO_URL ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Prototypes, decks and brand kits, in the Fruition design system.
            </p>
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--purple-primary)] hover:underline"
            >
              Open full screen
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div
            className="overflow-hidden rounded-card bg-surface p-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <iframe
              title="Fruition Design studio"
              src={STUDIO_URL}
              // clipboard-write so copying generated code out of the studio works.
              allow="clipboard-read; clipboard-write"
              className="h-[calc(100vh-13rem)] w-full rounded-[calc(var(--radius-card)-4px)] border border-[var(--color-border)] bg-white"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Design studio isn&apos;t connected yet
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The studio runs on its own machine and this page frames it. Set{" "}
            <code className="rounded-badge bg-[var(--purple-tint,#f7f5ff)] px-1.5 py-0.5 font-mono text-xs">
              DESIGN_STUDIO_URL
            </code>{" "}
            to its HTTPS address to switch it on.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            It must be HTTPS and reachable from the browser — this page is served over HTTPS, so a
            plain <code className="font-mono text-xs">http://</code> address (a Tailscale host, for
            instance) is blocked as mixed content. A Cloudflare Tunnel gives it a TLS hostname and
            lets Cloudflare Access authenticate each person, which matters because the studio&apos;s
            own auth is one shared token rather than per-user.
          </p>
        </div>
      )}
    </PortalShell>
  )
}
