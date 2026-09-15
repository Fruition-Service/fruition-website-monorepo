import Link from "next/link"
import type { RegionContent } from "./types"

interface Props {
  hero: RegionContent["hero"]
  flag: string
  /** Defaults to the monday.com Platinum Partner lockup in /public. */
  partnerBadgeSrc?: string | null
  /** Defaults to the shared region hero illustration in /public. */
  heroImageSrc?: string | null
  primaryCtaLabel?: string
  primaryCtaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

/**
 * Region hero — positioning and CTAs beside the region's product banner.
 *
 * Copy takes 55% of the row and the banner 45% from `lg` up, so the headline
 * keeps a comfortable measure without leaving a dead zone beside it.
 *
 * All six regions share one illustration (`/images/region-hero.webp`) — a
 * transparent-background composite with its own rounded corners and drop
 * shadow baked in. It is therefore rendered whole at its natural aspect ratio
 * with no crop, card, ring or FramedMedia wrapper: cropping it or putting it
 * on a panel would clip the shadow and the floating notetaker tile.
 *
 * Below `md` the illustration is hidden entirely: at phone widths its inner
 * text is unreadable and it only pushes the CTAs below the fold.
 */
export default function RegionHero({
  hero,
  flag,
  partnerBadgeSrc = "/images/partner-platinum.png",
  heroImageSrc = "/images/region-hero.webp",
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
            // A region without an illustration keeps the single-column hero
            // rather than leaving an empty right-hand column.
            heroImageSrc ? "lg:grid-cols-[55fr_45fr] lg:gap-14" : ""
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

          {heroImageSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroImageSrc}
              alt=""
              width={1311}
              height={924}
              className="hidden h-auto w-full md:block"
              // Above the fold on every region page — never lazy-load it.
              fetchPriority="high"
            />
          )}
        </div>
      </div>
    </section>
  )
}
