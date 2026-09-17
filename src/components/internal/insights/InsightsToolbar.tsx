import Link from "next/link"
import { Button } from "@/components/ui/button"

export type InsightsTab = "blog" | "social" | "ai" | "traffic"

const RANGES = [7, 28, 90]

function href(tab: InsightsTab, days: number): string {
  return `/internal/insights?tab=${tab}&days=${days}`
}

/**
 * Tab and range selection, both driven by the URL rather than client state, so
 * a view is linkable and the page can stay a server component that fetches only
 * what the current tab needs.
 */
export default function InsightsToolbar({
  tab,
  days,
  showTraffic = false,
}: {
  tab: InsightsTab
  days: number
  /** The traffic tab only exists once Umami is connected. */
  showTraffic?: boolean
}) {
  const tabs: { key: InsightsTab; label: string }[] = [
    { key: "blog", label: "Blog" },
    { key: "social", label: "Social posts" },
    { key: "ai", label: "AI visibility" },
    ...(showTraffic ? ([{ key: "traffic", label: "Traffic" }] as const) : []),
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="tablist" aria-label="Insights source" className="flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            role="tab"
            aria-selected={t.key === tab}
            variant={t.key === tab ? "default" : "outline"}
            size="sm"
            render={<Link href={href(t.key, days)} />}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2" aria-label="Date range">
        {RANGES.map((r) => (
          <Button
            key={r}
            aria-pressed={r === days}
            variant={r === days ? "default" : "outline"}
            size="sm"
            render={<Link href={href(tab, r)} />}
          >
            {r}d
          </Button>
        ))}
      </div>
    </div>
  )
}
