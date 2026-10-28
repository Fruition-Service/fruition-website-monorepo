"use client"

import { Check } from "lucide-react"
import type { Bullet, SectionTheme } from "./types"

export interface ServiceCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

interface ServicesCardsGridProps {
  heading?: string
  headingAccent?: string
  subheading?: string
  cards?: ServiceCard[]
  theme?: SectionTheme
}

export default function ServicesCardsGrid({
  heading,
  headingAccent,
  subheading,
  cards = [],
  theme = "dark",
}: ServicesCardsGridProps) {
  if (cards.length === 0) return null

  const isDark = theme === "dark"

  return (
    <section className={`section-y ${isDark ? "bg-surface-dark-2" : "bg-surface-subtle"}`}>
      <div className="site-container">
        {(heading || headingAccent) && (
          <h2
            className={`text-section-h2 text-center ${isDark ? "text-white" : ""} ${
              subheading ? "mb-4" : "mb-12"
            }`}
          >
            {heading}
            {headingAccent && (
              <span className="text-brand-light">{headingAccent}</span>
            )}
          </h2>
        )}
        {subheading && (
          <p
            className={`text-body text-center mx-auto max-w-[820px] mb-12 whitespace-pre-line ${
              isDark ? "text-white/80" : "text-muted"
            }`}
          >
            {subheading}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={card._key || i}
              className="bg-surface-raised rounded-card shadow-whisper p-7 dark:shadow-none dark:border dark:border-ui"
            >
              {card.emoji && (
                <div className="text-[32px] leading-none mb-3">
                  {card.emoji}
                </div>
              )}
              <h3 className="text-xl font-bold mb-2.5">
                {card.title}
              </h3>
              {card.description && (
                <p
                  className={`text-sm leading-[1.55] whitespace-pre-line ${
                    card.bullets?.length ? "mb-4" : ""
                  }`}
                >
                  {card.description}
                </p>
              )}
              {card.bullets && card.bullets.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {card.bullets.map((b, bi) => (
                    <li
                      key={b._key || bi}
                      className="flex items-start gap-2.5 text-sm leading-normal"
                    >
                      <span
                        aria-hidden
                        className="inline-flex items-center justify-center w-4 h-4 shrink-0 mt-[3px] text-brand font-bold"
                      >
                        <Check size={14} aria-hidden />
                      </span>
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
