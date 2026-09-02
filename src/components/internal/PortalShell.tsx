import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

const TITLES: Record<string, string> = {
  dashboard: "Blog Management",
  new: "New post",
  profile: "My profile",
  team: "Team Management",
  blog: "Blog drafts",
  social: "Social posts",
  insights: "Content Performance",
}

interface Props {
  email?: string | null
  active?: "dashboard" | "new" | "profile" | "team" | "blog" | "social" | "insights"
  /** Overrides the header title derived from `active`. */
  title?: string
  children: React.ReactNode
}

export default function PortalShell({ email, active, title, children }: Props) {
  const heading = title ?? (active ? TITLES[active] : "Fruition Internal")

  return (
    <TooltipProvider>
      <SidebarProvider className="portal-theme">
        <AppSidebar email={email} />
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
