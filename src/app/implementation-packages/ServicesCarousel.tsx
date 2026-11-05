"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Compass,
  Database,
  Headset,
  Kanban,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Phone,
  Plug,
  ArrowLeftRight,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react"
import { aud, type ServiceGroup } from "./content"

/**
 * Services pricing as a carousel: pills pick the practice, arrows and dots step
 * through, swipe on touch. Layout from Claude Design "Pricing Hero v2.dc.html"
 * (Nikki's 3 Nov 2026 review: less text, more graphic, carousel with pills).
 * Every group keeps its `id` so #ai, #atlassian, #hubspot and #automation links
 * from the overview cards still land here and open the right slide.
 */

const GROUP_ICONS: Record<ServiceGroup["id"], LucideIcon> = {
  ai: Sparkles,
  atlassian: Kanban,
  hubspot: Users,
  automation: Workflow,
}

const GROUP_TABS: Record<ServiceGroup["id"], string> = {
  ai: "AI & agents",
  atlassian: "Atlassian",
  hubspot: "HubSpot",
  automation: "Automation",
}

/** Item icons by link target; anything unmapped falls back to its group icon. */
const ITEM_ICONS: Record<string, LucideIcon> = {
  "/ai-consulting": Compass,
  "/ai-consulting/agent-development": Bot,
  "/ai-consulting/rag-knowledge-systems": Database,
  "/ai-consulting/governance-and-compliance": ShieldCheck,
  "/ai-consulting/marketing-automation": Megaphone,
  "/ai-consulting/sales-outbound": TrendingUp,
  "/ai-consulting/customer-service": Headset,
  "/ai-consulting/operations-back-office": Briefcase,
  "/atlassian-consulting": MessageSquare,
  "/atlassian-consulting#jira": Kanban,
  "/atlassian-consulting#confluence": BookOpen,
  "/atlassian-consulting#jsm": Ticket,
  "/atlassian-consulting#migration": ArrowLeftRight,
  "/hubspot-consulting#implementation": Wrench,
  "/hubspot-consulting#breeze-ai": Sparkles,
  "/hubspot-consulting#integration": Plug,
  "/hubspot-consulting#migration": ArrowLeftRight,
  "/integrations": Plug,
  "/partnerships/make-partners": Workflow,
  "/integrations/zapier": Zap,
  "/partnerships/aircall-partner": Phone,
  "/integrations/twilio": MessageSquare,
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-brand-soft text-brand">
      <Icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
    </span>
  )
}

export default function ServicesCarousel({ groups, priceCaption }: { groups: ServiceGroup[]; priceCaption: string }) {
  const [idx, setIdx] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = groups.length
  const go = (i: number) => setIdx(((i % count) + count) % count)

  // Open the slide a #ai / #atlassian / ... link points at, on load and on hash change.
  useEffect(() => {
    const sync = () => {
      const i = groups.findIndex((g) => `#${g.id}` === window.location.hash)
      if (i >= 0) setIdx(i)
    }
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [groups])

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Service lines"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
      >
        {groups.map((g, i) => {
          const Icon = GROUP_ICONS[g.id]
          const active = i === idx
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`slide-${g.id}`}
              onClick={() => go(i)}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border pl-3.5 pr-[18px] text-body-sm font-semibold transition-colors ${
                active ? "border-brand bg-brand text-white" : "border-ui bg-surface-raised text-body hover:border-brand hover:text-brand"
              }`}
            >
              <Icon aria-hidden className="h-4 w-4" strokeWidth={2} />
              {GROUP_TABS[g.id]}
            </button>
          )
        })}
      </div>

      <div
        className="overflow-hidden rounded-card"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touchX.current ?? 0)
          if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1))
        }}
      >
        <div
          className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${-idx * 100}%)` }}
        >
          {groups.map((g, i) => (
            <article
              key={g.id}
              id={g.id}
              role="tabpanel"
              aria-hidden={i !== idx}
              inert={i !== idx}
              className={`grid min-w-0 flex-[0_0_100%] scroll-mt-24 grid-cols-1 gap-6 rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12 lg:p-10 ${
                // Inactive slides collapse so the track is as tall as the slide on show.
                i === idx ? "" : "invisible max-h-0 overflow-hidden"
              }`}
            >
              <span id={`slide-${g.id}`} className="sr-only">
                {g.eyebrow}
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{g.eyebrow}</p>
                <h3 className="text-card-title text-balance text-body">{g.heading}</h3>
                <p className="text-body-sm text-muted">{g.lead}</p>
                <Link href={g.href} className="mt-2 inline-flex min-h-[44px] items-center self-start text-body-sm font-semibold text-brand hover:text-brand-dark">
                  {g.linkLabel} →
                </Link>
              </div>
              <ul className="grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-2">
                {g.items.map((item) => (
                  <li key={item.href} className="min-w-0">
                    <Link
                      href={item.href}
                      className="flex h-full min-h-[44px] items-center gap-3 rounded-chip border border-ui bg-surface-raised px-3.5 py-3 text-body transition-[border-color,box-shadow] hover:border-brand-light hover:shadow-card"
                    >
                      <IconTile icon={ITEM_ICONS[item.href] ?? GROUP_ICONS[g.id]} />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-body-sm font-medium">{item.name}</span>
                        <span className="flex flex-wrap items-baseline gap-1.5">
                          <span className="text-caption text-muted">{priceCaption}</span>
                          <span className="text-body-sm font-semibold text-brand">{aud(item.fromAud)}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {groups.map((g, i) => (
            <button
              key={g.id}
              type="button"
              aria-label={GROUP_TABS[g.id]}
              onClick={() => go(i)}
              className="flex h-11 items-center"
            >
              <span
                className={`block h-2 rounded-pill transition-[width,background-color] duration-300 ${i === idx ? "w-7 bg-brand" : "w-2 bg-brand-light"}`}
              />
            </button>
          ))}
          <span className="ml-2.5 font-mono text-caption text-muted" aria-live="polite">
            {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Previous service line"
            onClick={() => go(idx - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-pill border border-brand bg-surface-raised text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next service line"
            onClick={() => go(idx + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-pill border border-brand bg-surface-raised text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
