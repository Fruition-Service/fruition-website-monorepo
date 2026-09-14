"use client"

import { urlFor } from "@/sanity/image"
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
  certificationBadge?: SanityImageRef
  partnerBadges?: PartnerBadge[]
  /** When set, hides individual partner badges and shows this image below the hero media instead. */
  partnerImageSrc?: SanityImageRef | string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  /** When true, render text on the left and the hero image on the right (single row). */
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
  certificationBadge,
  partnerBadges = [],
  partnerImageSrc,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  splitLayout = false,
  hidePartnerBadges = false,
}: HeroBannerProps) {
  const heroImageSrc = heroImageUrl || heroImgFromRef(heroImage)
  const certBadgeSrc = safeImageUrl(certificationBadge)
  const partnerImageUrl = typeof partnerImageSrc === "string"
    ? partnerImageSrc
    : safeImageUrl(partnerImageSrc as SanityImageRef)
  const showPartnerBadges = !hidePartnerBadges && !partnerImageUrl && partnerBadges.length > 0

  if (splitLayout) {
    return (
      <section className="bg-surface">
        <div
          className="mx-auto px-4 md:px-16 lg:px-24 max-w-[1588px] w-full py-20"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: text */}
            <div className="flex-1 flex flex-col items-start text-left max-w-[640px] w-full">
              {showPartnerBadges && (
                <div className="flex items-center flex-wrap gap-[22px] mb-8">
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
                        className="h-[44px] w-auto rounded-[5px]"
                      />
                    )
                  })}
                </div>
              )}
              {eyebrow && (
                <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-4">
                  {eyebrow}
                </div>
              )}
              <h1 className="text-display mt-0">
                <span className="text-body">{headingPart1}</span>
                {headingAccent && (
                  <span className={accentBlock ? "text-brand block" : "text-brand"}>
                    {headingAccent}
                  </span>
                )}
                {headingPart2 && <span className="text-body">{headingPart2}</span>}
              </h1>
              {subheading && (
                <p className="text-body-lead text-muted mt-6 whitespace-pre-line">
                  {subheading}
                </p>
              )}
              <div className="flex flex-col items-stretch w-full max-w-[330px] gap-4 mt-8">
                {primaryCtaLabel && primaryCtaUrl && (
                  <CtaButton
                    href={primaryCtaUrl}
                    label={primaryCtaLabel}
                    variant={secondaryCtaLabel ? "outline" : "primary"}
                    className="w-full"
                  />
                )}
                {secondaryCtaLabel && secondaryCtaUrl && (
                  <CtaButton
                    href={secondaryCtaUrl}
                    label={secondaryCtaLabel}
                    variant="primary"
                    className="w-full"
                  />
                )}
              </div>
            </div>
            {/* Right: image */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              {heroVideoSrc ? (
                <FramedMedia className="w-full max-w-[560px]">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="rounded-card object-contain bg-surface w-full h-auto"
                  >
                    <source src={heroVideoSrc} type="video/mp4" />
                  </video>
                </FramedMedia>
              ) : heroImageSrc ? (
                <FramedMedia className="w-full max-w-[560px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImageSrc}
                    alt="Hero"
                    className="rounded-card bg-surface w-full h-auto object-contain"
                  />
                </FramedMedia>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface">
      <div
        className="mx-auto flex flex-col items-center px-4 md:px-16 lg:px-24 max-w-[1588px] w-full py-20"
      >
        {/* Partner badges — hidden when a single partnerImageUrl is used or hidePartnerBadges flag is set */}
        {showPartnerBadges && (
          <div className="flex flex-wrap items-center justify-center gap-[22px]">
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
                  className="h-[44px] w-auto rounded-[5px]"
                />
              )
            })}
          </div>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <div
            className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand ${showPartnerBadges ? "mt-8" : "mt-0"}`}
          >
            {eyebrow}
          </div>
        )}

        {/* Heading */}
        <h1
          className={`text-display text-center max-w-[924px] ${eyebrow ? "mt-4" : "mt-[42px]"}`}
        >
          <span className="text-body">{headingPart1}</span>
          {headingAccent && (
            <span className={accentBlock ? "text-brand block" : "text-brand"}>
              {headingAccent}
            </span>
          )}
          {headingPart2 && <span className="text-body">{headingPart2}</span>}
        </h1>

        {/* Subheading */}
        {subheading && (
          <p className="text-body-lead text-center text-muted mt-[31px] max-w-[859px] whitespace-pre-line">
            {subheading}
          </p>
        )}

        {/* Partner image — shown below hero text when partnerImageUrl is resolved */}
        {partnerImageUrl && (
          <div className="mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partnerImageUrl}
              alt="monday.com partner certifications"
              className="w-full max-w-[700px] h-auto"
            />
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-[680px] gap-5 mt-10">
          {primaryCtaLabel && primaryCtaUrl && (
            <CtaButton
              href={primaryCtaUrl}
              label={primaryCtaLabel}
              variant={secondaryCtaLabel ? "outline" : "primary"}
              className="w-full md:flex-1 md:max-w-[330px]"
            />
          )}
          {secondaryCtaLabel && secondaryCtaUrl && (
            <CtaButton
              href={secondaryCtaUrl}
              label={secondaryCtaLabel}
              variant="primary"
              className="w-full md:flex-1 md:max-w-[330px]"
            />
          )}
        </div>

        {/* Hero media — video takes precedence over image */}
        {heroVideoSrc ? (
          <FramedMedia className="w-full max-w-[1042px] mt-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="rounded-card object-contain bg-surface w-full h-auto aspect-[1042/312]"
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </FramedMedia>
        ) : heroImageSrc ? (
          <FramedMedia className="w-full max-w-[1042px] mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageSrc}
              alt="Hero"
              className={`rounded-card bg-surface w-full h-auto object-contain ${heroImageContain ? "" : "aspect-[1042/312]"}`}
              style={heroImageContain ? { maxHeight: heroImageMaxHeight ?? 520 } : undefined}
            />
          </FramedMedia>
        ) : null}

      </div>
    </section>
  )
}
