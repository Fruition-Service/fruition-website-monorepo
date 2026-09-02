"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PenSquare, Users, UserPlus, FileText, Newspaper, Palette, Sparkles, Receipt, PlusCircle, Share2, Radar } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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
}

const MODULES: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/internal", icon: LayoutDashboard, match: "exact" }],
  },
  {
    label: "Blog Management",
    items: [
      { title: "Blog posts", href: "/internal/blog", icon: Newspaper, match: "exact" },
      { title: "New post", href: "/internal/blog/new", icon: PenSquare, match: "prefix" },
    ],
  },
  {
    label: "Performance",
    items: [
      { title: "Insights", href: "/internal/insights", icon: Radar, match: "prefix" },
    ],
  },
  {
    label: "Social",
    items: [
      { title: "Social posts", href: "/internal/social", icon: Share2, match: "exact" },
      { title: "New post", href: "/internal/social/new", icon: PenSquare, match: "prefix" },
    ],
  },
  {
    label: "Design",
    items: [
      { title: "Documents", href: "/internal/design", icon: Palette, match: "exact" },
      { title: "New document", href: "/internal/design/new", icon: Sparkles, match: "prefix" },
    ],
  },
  {
    label: "Invoicing",
    items: [
      { title: "Invoices", href: "/internal/invoices", icon: Receipt, match: "exact" },
      { title: "New Invoice", href: "/internal/invoices/new", icon: PlusCircle, match: "prefix" },
    ],
  },
  {
    label: "Team Management",
    items: [
      { title: "Team", href: "/internal/team", icon: Users, match: "prefix" },
      { title: "Add member", href: "/internal/onboarding", icon: UserPlus, match: "prefix" },
    ],
  },
]

export function AppSidebar({
  email,
  ...props
}: React.ComponentProps<typeof Sidebar> & { email?: string | null }) {
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
            <SidebarMenu>
              {mod.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
