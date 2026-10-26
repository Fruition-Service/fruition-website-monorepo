"use client"
import { useState } from 'react'
import type { TestimonialCard } from '@/lib/testimonials'

/**
 * Filterable testimonial quotes. Every card is in the HTML; a filter only
 * hides the cards that don't match, so crawlers read all of them.
 */
export default function TestimonialQuoteGrid({ cards, tags }: { cards: TestimonialCard[]; tags: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  const matches = (c: TestimonialCard) => !active || c.industry === active || c.platform === active

  return (
    <div>
      {tags.length > 0 && (
        <div role="group" aria-label="Filter testimonials" className="flex flex-wrap gap-2">
          {[null, ...tags].map((tag) => {
            const on = active === tag
            return (
              <button
                key={tag ?? 'all'}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(tag)}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold transition-colors ${
                  on ? 'bg-brand text-white' : 'border border-ui bg-surface-raised text-body hover:border-brand hover:text-brand'
                }`}
              >
                {tag ?? 'All'}
              </button>
            )
          })}
        </div>
      )}
      <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((c) => (
          <li
            key={c.id}
            className={`${matches(c) ? 'flex' : 'hidden'} flex-col rounded-card bg-surface-raised p-6 ring-1 ring-ui shadow-whisper`}
          >
            <figure className="flex h-full flex-col">
              <blockquote className="text-base leading-relaxed text-body">&ldquo;{c.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-5 text-sm text-muted">
                <span className="font-semibold text-body">{c.name}</span>
                {c.byline && <> · {c.byline}</>}
              </figcaption>
              {(c.industry || c.platform) && (
                <p className="mt-3 flex flex-wrap gap-1.5">
                  {[c.industry, c.platform].filter(Boolean).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand"
                    >
                      {t}
                    </span>
                  ))}
                </p>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
