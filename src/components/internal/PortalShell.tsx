import { AppSidebar, type SidebarCounts } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getPortalAdmin } from "@/lib/portalAuth"

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  new: "New post",
  profile: "My profile",
  team: "Team",
  blog: "Blog posts",
  social: "Social posts",
  insights: "Content Performance",
  qr: "QR Code Generator",
}

interface Props {
  email?: string | null
  active?: "dashboard" | "new" | "profile" | "team" | "blog" | "social" | "insights" | "qr"
  /** Overrides the header title derived from `active`. */
  title?: string
  children: React.ReactNode
}

/**
 * Counts for the sidebar badges. Head-only counts, run together, each failing
 * on its own — a badge is worth a few milliseconds, never a page.
 */
async function sidebarCounts(): Promise<SidebarCounts> {
  const admin = getPortalAdmin()
  const safe = async (run: () => PromiseLike<{ count: number | null }>): Promise<number | undefined> => {
    try {
      const { count } = await run()
      return count ?? undefined
    } catch {
      return undefined
    }
  }

  const [drafts, queued, designDocs, invoices] = await Promise.all([
    safe(() => admin.from("portal_drafts").select("*", { count: "exact", head: true })),
    safe(() =>
      admin
        .from("social_compositions")
        .select("*", { count: "exact", head: true })
        .not("scheduled_for", "is", null)
        .gte("scheduled_for", new Date().toISOString())
    ),
    safe(() => admin.from("design_docs").select("*", { count: "exact", head: true })),
    safe(() => admin.from("fruition_invoices").select("*", { count: "exact", head: true })),
  ])

  return { drafts, queued, designDocs, invoices }
}

export default async function PortalShell({ email, active, title, children }: Props) {
  const heading = title ?? (active ? TITLES[active] : "Fruition Internal")
  const counts = await sidebarCounts()

  return (
    <TooltipProvider>
      <SidebarProvider className="portal-theme">
        <AppSidebar email={email} counts={counts} />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-semibold text-ink-heading">{heading}</h1>
          </header>
          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
