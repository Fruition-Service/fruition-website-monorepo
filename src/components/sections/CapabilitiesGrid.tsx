"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import type { CapabilityCard, SectionTheme } from "./types"

interface CapabilitiesGridProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  cards?: CapabilityCard[]
  theme?: SectionTheme
  columns?: 2 | 3
  ctaLabel?: string
  ctaUrl?: string
  ctaSecondaryLabel?: string
  ctaSecondaryUrl?: string
}

export default function CapabilitiesGrid({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  cards = [],
  theme = "light",
  columns,
  ctaLabel,
  ctaUrl,
  ctaSecondaryLabel,
  ctaSecondaryUrl,
}: CapabilitiesGridProps) {
  if (cards.length === 0) return null

  const isDark = theme === "dark"

  const cols = columns ?? (cards.length <= 4 ? 2 : 3)
  const gridClass =
    cols === 2
      ? "grid grid-cols-1 md:grid-cols-2"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className={`section-y ${isDark ? "bg-surface-dark-2" : "bg-surface-subtle"}`}>
      <div className="site-container">
        {eyebrow && (
          <div
            className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] mb-4 ${
              isDark ? "text-white/75" : "text-brand"
            }`}
          >
            {eyebrow}
          </div>
        )}
        {(heading || headingAccent) && (
          <h2
            className={`text-section-h2 max-w-[860px] ${isDark ? "text-white" : ""} ${
              subheading ? "mb-4" : "mb-10"
            }`}
          >
            {heading}
            {/* Copy (and Sanity, which trims) often omits the trailing space. */}
            {heading && headingAccent && !/\s$/.test(heading) && " "}
            {headingAccent && (
              <span className="text-brand">{headingAccent}</span>
            )}
          </h2>
        )}
        {subheading && (
          <p
            className={`text-body-lead max-w-[64ch] mb-10 whitespace-pre-line ${
              isDark ? "text-white/80" : "text-muted"
            }`}
          >
            {subheading}
          </p>
        )}
        <div className={`${gridClass} gap-6`}>
          {cards.map((card, i) => {
            const hasBullets = (card.bullets?.length ?? 0) > 0
            return (
              <div
                key={card._key || i}
                className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised dark:shadow-none p-6 md:p-7 text-left"
              >
                {card.emoji && (
                  <div
                    className="text-[32px] leading-none mb-4"
                  >
                    {card.emoji}
                  </div>
                )}
                <h3 className="text-card-title text-body mb-2.5">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-body-sm text-muted whitespace-pre-line">
                    {card.description}
                  </p>
                )}
                {hasBullets && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {card.bullets!.map((b, bi) => {
                      const bulletEmoji = (b as { emoji?: string }).emoji
                      return (
                        <li
                          key={b._key || bi}
                          className="flex items-start gap-2.5 text-body-sm text-body"
                        >
                          <span
                            aria-hidden
                            className={`inline-flex items-center justify-center h-5 shrink-0 mt-px font-bold ${
                              bulletEmoji ? "w-5 text-base" : "w-4 text-sm text-brand"
                            }`}
                          >
                            {bulletEmoji || <Check size={14} aria-hidden />}
                          </span>
                          <span>{b.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        {((ctaLabel && ctaUrl) || (ctaSecondaryLabel && ctaSecondaryUrl)) && (
          <div className="flex flex-wrap mt-10 gap-4">
            {ctaLabel && ctaUrl && (
              <Link href={ctaUrl} className="cta-btn cta-btn-primary">
                {ctaLabel}
              </Link>
            )}
            {ctaSecondaryLabel && ctaSecondaryUrl && (
              <Link
                href={ctaSecondaryUrl}
                className={`cta-btn ${isDark ? "cta-btn-on-dark-outline" : "cta-btn-outline"}`}
              >
                {ctaSecondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
