import StatsBlockView from "@/components/sections/StatsBlockView"
import type { StatItem, SiteSettingsData } from "./types"

interface JoinStatsSectionProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  stats?: StatItem[]
  footnote?: string
  ctaLabel?: string
  ctaUrl?: string
  siteSettings?: SiteSettingsData
}

export default function JoinStatsSection({
  headingPart1 = "Join ",
  headingAccent = "900+ businesses",
  headingPart2 = " that have leveraged our monday.com expert consultants.",
  subheading,
  stats = [],
  footnote = "Data by",
  ctaLabel,
  ctaUrl,
  siteSettings,
}: JoinStatsSectionProps) {
  if (!stats || stats.length === 0) return null

  return (
    <StatsBlockView
      heading={`${headingPart1}${headingAccent}${headingPart2}`}
      headingAccent={headingAccent}
      subheading={subheading || undefined}
      stats={stats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
      footnote={footnote}
      ctaLabel={ctaLabel}
      ctaUrl={ctaUrl}
      siteSettings={siteSettings as any}
      showMondayPartnersBadge={false}
    />
  )
}
