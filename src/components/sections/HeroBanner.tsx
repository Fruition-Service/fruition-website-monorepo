"use client"

import { urlFor } from "@/sanity/image"
import type { ReactNode } from "react"
import CtaButton from "@/components/CtaButton"
import FramedMedia from "@/components/common/FramedMedia"
import type { SanityImageRef, PartnerBadge } from "./types"

interface HeroBannerProps {
  eyebrow?: string
  headingPart1?: string
  headingAccent?: string
  /** When true, render the purple accent on its own line (forces a break before it). */
  accentBlock?: boolean
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  /** Local URL fallback for the hero image. Takes precedence over heroImage when both are set. */
  heroImageUrl?: string
  /** When true, the hero image renders contained (no crop) at natural aspect ratio. */
  heroImageContain?: boolean
  /** Override for the hero image height in px (used with heroImageContain to control vertical space). */
  heroImageMaxHeight?: number
  heroVideoSrc?: string
  /** Accepted for older call sites; the hero does not draw it. */
  certificationBadge?: SanityImageRef
  partnerBadges?: PartnerBadge[]
  /** When set, hides individual partner badges and shows this image below the hero media instead. */
  partnerImageSrc?: SanityImageRef | string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  /** Overrides the icon CtaButton infers from the primary label. */
  primaryCtaIcon?: ReactNode
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  /**
   * Forces the side-by-side layout (copy left, media right) whatever the
   * media's shape. Without it the hero still goes side by side on desktop,
   * except for very wide banner media, which runs full width under the copy.
   */
  splitLayout?: boolean
  /** When true, suppress the partner-badges row at the top of the hero. */
  hidePartnerBadges?: boolean
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).auto("format").url() } catch { return null }
}

function heroImgFromRef(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(2084).auto("format").url() } catch { return null }
}

/**
 * Width / height of the hero media, when it can be known without loading it:
 * Sanity asset refs carry their dimensions (`image-<id>-1249x500-png`), as do
 * most CDN file names. Unknown media (local files, video) returns null.
 */
export function mediaAspect(ref: SanityImageRef, url?: string | null): number | null {
  const source = url || ref?.asset?._ref || ""
  const m = source.match(/-(\d{2,5})x(\d{2,5})(?:[-.]|$)/)
  if (!m) return null
  const w = Number(m[1])
  const h = Number(m[2])
  return w > 0 && h > 0 ? w / h : null
}

/**
 * Media at least this wide (3:1 and up, e.g. the 1042x312 product strips) reads
 * as a banner: squeezed into half a row it would be a thin sliver, so it runs
 * full width under the copy instead.
 */
const BANNER_ASPECT = 3

/** Override specific partner badges with local dark variants */
const DARK_LOGO_OVERRIDES: Record<string, string> = {
  // n8n is served from Sanity (heroPartnerBadges) — the local partner-n8n-dark.avif
  // is mislabelled and holds an Atlassian badge, so it must not override the CMS image.
  aircall: '/images/partner-aircall-dark.avif',
}

function getDarkBadgeSrc(name: string | undefined, fallbackSrc: string | null): string | null {
  const n = (name || '').toLowerCase()
  for (const [key, darkSrc] of Object.entries(DARK_LOGO_OVERRIDES)) {
    if (n.includes(key)) return darkSrc
  }
  return fallbackSrc
}

export default function HeroBanner({
  eyebrow,
  headingPart1 = "",
  headingAccent = "",
  accentBlock = false,
  headingPart2 = "",
  subheading,
  heroImage,
  heroImageUrl,
  heroImageContain = false,
  heroImageMaxHeight,
  heroVideoSrc,
  partnerBadges = [],
  partnerImageSrc,
  primaryCtaLabel,
  primaryCtaUrl,
  primaryCtaIcon,
  secondaryCtaLabel,
  secondaryCtaUrl,
  splitLayout = false,
  hidePartnerBadges = false,
}: HeroBannerProps) {
  const heroImageSrc = heroImageUrl || heroImgFromRef(heroImage)
  const partnerImageUrl = typeof partnerImageSrc === "string"
    ? partnerImageSrc
    : safeImageUrl(partnerImageSrc as SanityImageRef)
  const showPartnerBadges = !hidePartnerBadges && !partnerImageUrl && partnerBadges.length > 0

  const hasMedia = Boolean(heroVideoSrc || heroImageSrc)
  // Video has no readable size; it used to render in the 1042x312 banner frame.
  const aspect = heroVideoSrc ? null : mediaAspect(heroImage, heroImageUrl)
  const banner = hasMedia && !splitLayout && (aspect === null || aspect >= BANNER_ASPECT)
  const sideBySide = hasMedia && !banner
  // Landscape media (wider than 8:5) gets the larger share of the row.
  const wideMedia = aspect !== null && aspect >= 1.6

  const badges = showPartnerBadges && (
    <div className="flex items-center flex-wrap gap-3 md:gap-4 mb-6">
      {partnerBadges.map((badge, i) => {
        const cmsSrc = safeImageUrl(badge.image)
        const src = getDarkBadgeSrc(badge.name, cmsSrc)
        if (!src) return null
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={badge._key || `badge-${i}`}
            src={src}
            alt={badge.name || "Partner badge"}
            width={120}
            height={44}
            className="h-9 md:h-[44px] w-auto rounded-[5px]"
          />
        )
      })}
    </div>
  )

  const copy = (
    <>
      {badges}
      {eyebrow && (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-4">
          {eyebrow}
        </p>
      )}
      <h1 className="text-display">
        <span className="text-body">{headingPart1}</span>
        {headingAccent && (
          <span className={accentBlock ? "text-brand block" : "text-brand"}>
            {headingAccent}
          </span>
        )}
        {headingPart2 && <span className="text-body">{headingPart2}</span>}
      </h1>
      {subheading && (
        <p className="text-body-lead text-muted mt-5 max-w-[60ch] whitespace-pre-line">
          {subheading}
        </p>
      )}
    </>
  )

  const partnerLockup = partnerImageUrl && (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={partnerImageUrl}
      alt="monday.com partner certifications"
      className="w-full max-w-[420px] h-auto"
    />
  )

  // Stacked on desktop (`stacked`), beside each other on a tablet (the row is
  // wide enough there and the media sits underneath anyway), full width on a
  // phone. A hero with no media keeps them in a row on desktop too.
  const hasCtas = Boolean((primaryCtaLabel && primaryCtaUrl) || (secondaryCtaLabel && secondaryCtaUrl))
  const renderCtas = (stacked: boolean) => {
    if (!hasCtas) return null
    const button = stacked ? "w-full md:w-auto lg:w-full" : "w-full md:w-auto"
    return (
      <div
        className={`flex flex-col md:flex-row items-stretch w-full md:w-auto gap-3 ${
          stacked ? "lg:flex-col lg:w-full lg:max-w-[340px]" : ""
        }`}
      >
        {primaryCtaLabel && primaryCtaUrl && (
          <CtaButton
            href={primaryCtaUrl}
            label={primaryCtaLabel}
            icon={primaryCtaIcon}
            variant={secondaryCtaLabel ? "outline" : "primary"}
            className={button}
          />
        )}
        {secondaryCtaLabel && secondaryCtaUrl && (
          <CtaButton
            href={secondaryCtaUrl}
            label={secondaryCtaLabel}
            variant="primary"
            className={button}
          />
        )}
      </div>
    )
  }

  const media = heroVideoSrc ? (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`rounded-card object-contain bg-surface w-full h-auto ${banner ? "aspect-[1042/312]" : ""}`}
    >
      <source src={heroVideoSrc} type="video/mp4" />
    </video>
  ) : heroImageSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={heroImageSrc}
      alt="Hero"
      fetchPriority="high"
      className={`rounded-card bg-surface w-full h-auto object-contain ${sideBySide ? "max-h-[520px]" : ""}`}
      style={heroImageContain && heroImageMaxHeight ? { maxHeight: heroImageMaxHeight } : undefined}
    />
  ) : null

  // Side by side: condensed copy and stacked CTAs left, the visual right.
  if (sideBySide) {
    return (
      <section className="hero-band">
        <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
          <div className={`grid grid-cols-1 items-center gap-10 lg:gap-14 ${wideMedia ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"}`}>
            <div className="flex flex-col items-start min-w-0">
              {copy}
              {(hasCtas || partnerLockup) && (
                <div className="flex flex-col items-start gap-6 mt-8 w-full">
                  {renderCtas(true)}
                  {partnerLockup}
                </div>
              )}
            </div>
            <FramedMedia className="w-full min-w-0 flex justify-center lg:justify-end">
              {media}
            </FramedMedia>
          </div>
        </div>
      </section>
    )
  }

  // No media: one left-aligned column, CTAs in a row under the copy.
  if (!hasMedia) {
    return (
      <section className="hero-band">
        <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
          <div className="flex flex-col items-start max-w-[860px]">
            {copy}
            {(hasCtas || partnerLockup) && (
              <div className="flex flex-col items-start gap-6 mt-8 w-full">
                {renderCtas(false)}
                {partnerLockup}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Banner: copy left with the CTAs stacked beside it, then the wide visual
  // across the container.
  return (
    <section className="hero-band">
      <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end gap-8 lg:gap-14">
          <div className="flex flex-col items-start min-w-0">{copy}</div>
          {(hasCtas || partnerLockup) && (
            <div className="flex flex-col items-start lg:items-stretch gap-6 min-w-0">
              {partnerLockup}
              {renderCtas(true)}
            </div>
          )}
        </div>
        {media && (
          <FramedMedia className="w-full mt-10 lg:mt-12">
            {media}
          </FramedMedia>
        )}
      </div>
    </section>
  )
}
