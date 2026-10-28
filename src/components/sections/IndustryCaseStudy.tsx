"use client"

import Link from "next/link"

interface StatItem {
  value: string
  label: string
}

export interface IndustryCaseStudyProps {
  /** Uppercase eyebrow label, e.g. "Retail Case Study" */
  eyebrow?: string
  /** Company / client name displayed as a heading */
  companyName?: string
  /** Description paragraph about the company or use-case */
  description?: string
  /** Blockquote testimonial text (rendered with curly quotes) */
  quote?: string
  /** Attribution line below the quote, e.g. "Name | Role, Company" */
  attribution?: string
  /** Stat figures shown at the bottom */
  stats?: StatItem[]
  /** Image shown on the right side of the card */
  imageSrc?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Optional CTA button label */
  ctaLabel?: string
  /** Optional CTA button href */
  ctaHref?: string
}

export default function IndustryCaseStudy({
  eyebrow,
  companyName,
  description,
  quote,
  attribution,
  stats = [],
  imageSrc,
  imageAlt = "Case study",
  ctaLabel,
  ctaHref,
}: IndustryCaseStudyProps) {
  const hasImage = !!imageSrc

  return (
    <section className="bg-surface-dark-2 section-y">
      <div className="site-container">
        <div
          className={`flex flex-col ${hasImage ? "lg:flex-row" : ""} items-stretch gap-12`}
        >
          {/* Text content */}
          <div className="flex flex-col justify-between flex-1">
            <div>
              {eyebrow && (
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light mb-3">
                  {eyebrow}
                </p>
              )}

              {companyName && (
                <h3 className="text-[28px] font-bold text-white mb-2 tracking-[0.04em]">
                  {companyName}
                </h3>
              )}

              {description && (
                <p className="text-[15px] leading-6 text-white/85 mb-6">
                  {description}
                </p>
              )}

              {quote && (
                <blockquote className="text-base leading-[26px] text-brand-light italic border-l-[3px] border-brand-light pl-4 mb-4">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              )}

              {attribution && (
                <p className="text-sm text-white/70">
                  {attribution}
                </p>
              )}
            </div>

            {/* Stats row */}
            {stats.length > 0 && (
              <div className="flex flex-wrap items-end mt-10 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-4xl font-bold ${i === 0 ? "text-brand-light" : "text-white"}`}>
                      {stat.value}
                    </p>
                    <p className="text-[13px] text-white/70">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA button */}
            {ctaLabel && ctaHref && (
              <div className="mt-8">
                <Link href={ctaHref} className="cta-btn cta-btn-primary">
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>

          {/* Right: image */}
          {hasImage && (
            <div className="rounded-card overflow-hidden bg-white flex-1 min-h-[340px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
