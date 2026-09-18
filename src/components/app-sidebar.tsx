"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  LayoutDashboard,
  Newspaper,
  Palette,
  Plus,
  QrCode,
  Receipt,
  Share2,
  Users,
  Wand2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  /** How to compute the active state against the current path. */
  match: "exact" | "prefix"
  /** Which count from `counts` to show, if any. */
  badge?: keyof SidebarCounts
}

interface NavGroup {
  label: string
  /** The group's "new" action — replaces a second row per destination. */
  create?: { href: string; label: string }
  items: NavItem[]
}

export interface SidebarCounts {
  /** Unpublished blog drafts. */
  drafts?: number
  /** Social posts scheduled and still to go out. */
  queued?: number
  designDocs?: number
  invoices?: number
  team?: number
}

/**
 * Three groups, not seven. Each destination appears once, with its own count,
 * and the "New …" row that used to double every entry is the group's + button.
 */
const MODULES: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/internal", icon: LayoutDashboard, match: "exact" }],
  },
  {
    label: "Content",
    create: { href: "/internal/blog/new", label: "New blog post" },
    items: [
      { title: "Blog", href: "/internal/blog", icon: Newspaper, match: "prefix", badge: "drafts" },
      { title: "Social", href: "/internal/social", icon: Share2, match: "prefix", badge: "queued" },
    ],
  },
  {
    label: "Studio",
    create: { href: "/internal/design/new", label: "New design document" },
    items: [
      { title: "Design docs", href: "/internal/design", icon: Palette, match: "exact", badge: "designDocs" },
      { title: "Design studio", href: "/internal/design/studio", icon: Wand2, match: "prefix" },
      { title: "Invoices", href: "/internal/invoices", icon: Receipt, match: "prefix", badge: "invoices" },
      { title: "QR codes", href: "/internal/qr", icon: QrCode, match: "prefix" },
    ],
  },
  {
    label: "Admin",
    create: { href: "/internal/onboarding", label: "Add a team member" },
    items: [{ title: "Team", href: "/internal/team", icon: Users, match: "prefix", badge: "team" }],
  },
]

export function AppSidebar({
  email,
  counts,
  ...props
}: React.ComponentProps<typeof Sidebar> & { email?: string | null; counts?: SidebarCounts }) {
  const pathname = usePathname() ?? ""

  const isActive = (item: NavItem) =>
    item.match === "exact" ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/internal" className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[var(--purple-primary)] text-white">
            <FileText className="size-4" />
          </div>
          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-ink-heading">Fruition Internal</span>
            <span className="truncate text-xs text-[var(--color-text-secondary)]">Content portal</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {MODULES.map((mod) => (
          <SidebarGroup key={mod.label}>
            <SidebarGroupLabel>{mod.label}</SidebarGroupLabel>
            {mod.create && (
              <SidebarGroupAction
                title={mod.create.label}
                render={<Link href={mod.create.href} aria-label={mod.create.label} />}
              >
                <Plus />
              </SidebarGroupAction>
            )}
            <SidebarMenu>
              {mod.items.map((item) => {
                const count = item.badge ? counts?.[item.badge] : undefined
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive(item)}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {typeof count === "number" && count > 0 && (
                      <SidebarMenuBadge>{count}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {email && (
        <SidebarFooter>
          <NavUser user={{ email }} />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
