"use client"

import Link from "next/link"

export interface OfficeLocation {
  _key?: string
  flag?: string
  city?: string
  region?: string
  address?: string
}

export interface RemoteFeature {
  _key?: string
  emoji?: string
  label?: string
}

interface RemoteTeamSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  offices?: OfficeLocation[]
  features?: RemoteFeature[]
  ctaLabel?: string
  ctaUrl?: string
  bg?: string
  children?: React.ReactNode
}

export default function RemoteTeamSection({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  offices = [],
  features = [],
  ctaLabel,
  ctaUrl,
  bg = "var(--surface-subtle)",
  children,
}: RemoteTeamSectionProps) {
  if (!heading && !headingAccent && offices.length === 0) return null

  return (
    <section className="py-[80px]" style={{ backgroundColor: bg }}>
      <div className="site-container">
        {eyebrow && (
          <div className="text-center font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            {eyebrow}
          </div>
        )}
        {(heading || headingAccent) && (
          <h2 className={`text-section-h2 text-center text-body ${subheading ? "mb-4" : "mb-12"}`}>
            {heading}
            {headingAccent && <span className="text-brand">{headingAccent}</span>}
          </h2>
        )}
        {subheading && (
          <p className="text-body text-center mx-auto text-muted max-w-[820px] mb-12 whitespace-pre-line">
            {subheading}
          </p>
        )}

        {children}

        {offices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
            {offices.map((o, i) => (
              <div
                key={o._key || i}
                className="bg-surface-raised rounded-card border border-ui dark:shadow-none p-5 text-center shadow-whisper"
              >
                {o.flag && (
                  <div className="text-[32px] leading-none mb-2">
                    {o.flag}
                  </div>
                )}
                {o.city && (
                  <h3 className="text-lg font-bold text-body mb-0.5">
                    {o.city}
                  </h3>
                )}
                {o.region && (
                  <div className="text-[13px] text-brand font-semibold mb-2.5">
                    {o.region}
                  </div>
                )}
                {o.address && (
                  <p className="text-[13px] leading-normal text-muted whitespace-pre-line">
                    {o.address}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div
            className={`flex flex-wrap items-center justify-center gap-3 ${ctaLabel ? "mb-10" : ""}`}
          >
            {features.map((f, i) => (
              <div
                key={f._key || i}
                className="bg-surface-raised rounded-full border border-ui dark:shadow-none inline-flex items-center gap-2 px-[18px] py-2.5 text-sm font-semibold text-body shadow-whisper"
              >
                {f.emoji && <span className="text-base">{f.emoji}</span>}
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}

        {ctaLabel && ctaUrl && (
          <div className="flex justify-center">
            <Link href={ctaUrl} className="cta-btn cta-btn-primary">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
