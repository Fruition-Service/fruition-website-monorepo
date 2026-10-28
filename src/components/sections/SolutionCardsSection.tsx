"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import FramedMedia from "@/components/common/FramedMedia"
import type { SanityImageRef } from "./types"

interface SolutionCard {
  _key?: string
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: SanityImageRef
  /** Local image path override (takes precedence over Sanity image). */
  imageSrc?: string
}

interface SolutionCardsSectionProps {
  cards?: SolutionCard[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(400).auto("format").url() } catch { return null }
}

export default function SolutionCardsSection({
  cards = [],
}: SolutionCardsSectionProps) {
  if (cards.length === 0) return null

  return (
    <section className="bg-surface section-y">
      <div className="site-container">
        <div className="flex flex-col gap-14 lg:gap-20">
          {cards.map((card, i) => {
            const imageSrc = card.imageSrc || safeImageUrl(card.image)
            const isEven = i % 2 === 0
            return (
              <div
                key={card._key || i}
                className={`flex flex-col items-center gap-8 md:gap-12 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  {card.eyebrow && (
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                      {card.eyebrow}
                    </p>
                  )}
                  {card.heading && (
                    <h3 className={`text-[28px] font-semibold ${card.eyebrow ? "mt-2" : ""}`}>
                      {card.heading}
                    </h3>
                  )}
                  {card.body && (
                    <p className="text-body text-muted mt-4 max-w-[60ch] whitespace-pre-line">
                      {card.body}
                    </p>
                  )}
                  {card.ctaLabel && card.ctaUrl && (
                    <Link
                      href={card.ctaUrl}
                      className="cta-btn cta-btn-primary mt-6"
                    >
                      {card.ctaLabel}
                    </Link>
                  )}
                </div>
                {imageSrc && (
                  <FramedMedia
                    className="rounded-card overflow-hidden shadow-whisper bg-surface-raised flex items-center justify-center dark:shadow-none flex-1 aspect-[16/10]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={card.heading || ""}
                      className="w-full h-full object-contain"
                    />
                  </FramedMedia>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
