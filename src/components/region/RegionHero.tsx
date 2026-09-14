import Link from "next/link"
import FramedMedia from "@/components/common/FramedMedia"
import type { RegionContent } from "./types"

interface Props {
  hero: RegionContent["hero"]
  flag: string
  /** Defaults to the monday.com Platinum Partner lockup in /public. */
  partnerBadgeSrc?: string | null
  /** Wide product banner from Sanity (`locationPage.heroImage`). */
  heroImageUrl?: string | null
  primaryCtaLabel?: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/**
 * Region hero — positioning and CTAs beside the region's product banner.
 *
 * Copy sits in a narrower left column so the headline keeps a comfortable
 * measure, and the banner fills the right column from `lg` up — a full-width
 * letterboxed strip underneath left a large dead zone beside the copy.
 *
 * The Sanity assets are ~2.8:1 and ~3.2:1 board collages, so they are cropped
 * with `object-cover` inside a fixed-aspect frame rather than stretched. The
 * 7:4 frame keeps roughly the middle 60% of the source, which is the widest
 * crop that still clears the centre board card's left edge — squarer frames
 * slice that card mid-column and read as a mistake. `md` stacks the banner
 * under the copy across the full container, so it takes a wider 5:2 crop.
 */
export default function RegionHero({
  hero,
  flag,
  partnerBadgeSrc = "/images/partner-platinum.png",
  heroImageUrl,
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
        <div
          className={`grid grid-cols-1 items-center gap-10 ${
            // A region without a Sanity banner keeps the single-column hero
            // rather than leaving an empty right-hand column.
            heroImageUrl ? "lg:grid-cols-[1.02fr_0.98fr] lg:gap-14" : ""
          }`}
        >
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

          {heroImageUrl && (
            <FramedMedia className="w-full">
              <div className="aspect-[7/4] w-full overflow-hidden rounded-card bg-surface ring-1 ring-ui md:aspect-[5/2] lg:aspect-[7/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageUrl}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  // Above the fold on every region page — never lazy-load it.
                  fetchPriority="high"
                />
              </div>
            </FramedMedia>
          )}
        </div>
      </div>
    </section>
  )
}
