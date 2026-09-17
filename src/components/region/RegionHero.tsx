import Link from "next/link"
import RegionMap from "./RegionMap"
import type { RegionContent, RegionSlug } from "./types"

interface Props {
  hero: RegionContent["hero"]
  flag: string
  /** Picks the country's map out of REGION_MAP_DATA. */
  slug: RegionSlug
  /** Defaults to the monday.com Platinum Partner lockup in /public. */
  partnerBadgeSrc?: string | null
  /** ISO 3166-1 alpha-2, lowercased, for the flag medallion (e.g. "au"). */
  flagCode?: string | null
  /** Country name, for the map's and the flag's accessible labels. */
  countryName: string
  primaryCtaLabel?: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/**
 * Region hero — positioning and CTAs beside a map of the region itself.
 *
 * Copy takes 55% of the row and the map 45% from `lg` up, so the headline
 * keeps a comfortable measure without leaving a dead zone beside it.
 *
 * The map is per country (see RegionMap): the six pages used to share one
 * monday.com product illustration, which made six markets look like one page
 * with the nouns swapped. The country's own outline, with a Fruition mark on
 * each city the page's coverage section lists, is the one piece of the hero
 * that could not belong to any other region.
 *
 * The flag medallion sits under the map rather than over it. On the old
 * illustration it filled an empty corner; over a map it would cover territory.
 * It is a real SVG rather than an emoji flag: Windows ships no flag emoji font
 * and renders those as bare letter pairs ("AU"), which at this size would read
 * as a broken image.
 *
 * Below `md` the map is hidden, as the illustration was — the column is narrow
 * enough there that the city labels would sit on top of one another.
 */
export default function RegionHero({
  hero,
  flag,
  slug,
  partnerBadgeSrc = "/images/partner-platinum.png",
  flagCode,
  countryName,
  primaryCtaLabel = "Book a Free Consultation",
  primaryCtaUrl,
  secondaryCtaLabel = "Explore Services",
  secondaryCtaUrl = "#services",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Soft brand wash behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 460px at 75% 25%, var(--purple-tint) 0%, rgba(247,245,255,0) 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-pill border border-lilac-strong bg-tint px-4 py-[7px] pr-[18px] text-[13px] font-semibold text-brand">
              <span aria-hidden className="text-[15px] leading-none">
                {flag}
              </span>
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[620px] text-[34px] font-semibold leading-[1.16] tracking-[-0.02em] text-balance text-foreground md:text-[42px] lg:text-[46px]">
              {hero.heading} <span className="text-brand">{hero.headingAccent}</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-body-lead text-muted text-pretty">
              {hero.subheading}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={primaryCtaUrl} className="cta-btn cta-btn-primary">
                {primaryCtaLabel}
              </Link>
              <Link href={secondaryCtaUrl} className="cta-btn cta-btn-outline">
                {secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {partnerBadgeSrc && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partnerBadgeSrc}
                    alt="monday.com Platinum Partner"
                    className="h-[44px] w-auto rounded-[6px]"
                  />
                  <span aria-hidden className="hidden h-[30px] w-px bg-ui sm:block" />
                </>
              )}
              <span className="text-caption text-muted">{hero.badgeStrap}</span>
            </div>
          </div>

          <div className="hidden w-full flex-col items-center gap-5 md:flex">
            <RegionMap slug={slug} countryName={countryName} />

            {flagCode && (
              <p className="flex items-center gap-2.5 text-caption text-muted">
                <span className="block h-7 w-7 overflow-hidden rounded-full shadow-card ring-2 ring-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/flags/${flagCode}.svg`}
                    alt={`${countryName.replace(/^the /, "")} flag`}
                    className="block aspect-square w-full object-cover"
                    fetchPriority="high"
                  />
                </span>
                Delivering across {countryName}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
