import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import FramedMedia from "@/components/common/FramedMedia"
import type { SanityImageRef } from "./types"

interface DiscoverCtaSectionProps {
  badge?: SanityImageRef
  heading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

export default function DiscoverCtaSection({
  badge,
  heading,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
}: DiscoverCtaSectionProps) {
  const badgeSrc = badge?.asset?._ref
    ? (() => {
        // 2x the display width and never cropped, so the strip stays sharp on
        // retina screens whatever its aspect ratio.
        try { return urlFor(badge).width(650).fit("max").auto("format").url() } catch { return null }
      })()
    : null

  if (!heading && !primaryCtaLabel && !secondaryCtaLabel && !badgeSrc) return null

  return (
    <section className="bg-surface-subtle py-20 px-4">
      <div className="mx-auto flex max-w-[900px] flex-col items-center">
        {badgeSrc && (
          <FramedMedia>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeSrc} alt="Certifications" width={325} height={73} className="h-auto max-h-[73px] w-[325px] max-w-full object-contain" />
          </FramedMedia>
        )}
        {heading && (
          <h2 className="mt-7 text-section-h2 text-center text-body text-balance max-w-[720px]">
            {heading}
          </h2>
        )}
        {(primaryCtaLabel || secondaryCtaLabel) && (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            {primaryCtaLabel && primaryCtaUrl && (
              <CtaButton
                href={primaryCtaUrl}
                label={primaryCtaLabel}
                variant="outline"
                className="w-full md:flex-1"
              />
            )}
            {secondaryCtaLabel && secondaryCtaUrl && (
              <CtaButton
                href={secondaryCtaUrl}
                label={secondaryCtaLabel}
                variant="primary"
                className="w-full md:flex-1"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
