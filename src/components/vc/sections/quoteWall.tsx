import { vercelStegaClean } from "@vercel/stega"
import { QuoteAvatar } from "../primitives"
import type { VcQuoteData } from "../types"

/**
 * The scrolling client-quote wall on the right of every "What our customers
 * say" section. One component for every page (home, customer stories, service,
 * partner and industry pages) so the wall looks and moves the same everywhere;
 * only the heading side differs per page. The quotes themselves come from one
 * list too: see the vcProof projection in src/sanity/vcQueries.ts.
 */

/**
 * Seconds each quote takes to scroll past. The loop length grows with the
 * number of quotes, so a long list moves at the same pace as a short one
 * (a fixed 45s loop made the 18-quote wall run three times faster).
 */
export const QUOTE_WALL_SECONDS_PER_QUOTE = 15

function Quote({ q, hidden }: { q: VcQuoteData; hidden?: boolean }) {
  return (
    <figure className="q" aria-hidden={hidden || undefined}>
      {q.org && <span className="label">{hidden ? vercelStegaClean(q.org) : q.org}</span>}
      <blockquote>&ldquo;{hidden ? vercelStegaClean(q.quote ?? "") : q.quote}&rdquo;</blockquote>
      <figcaption className="who">
        <QuoteAvatar q={q} />
        <div>
          <b>{hidden ? vercelStegaClean(q.name ?? "") : q.name}</b>
          <span className="small">{hidden ? vercelStegaClean(q.role ?? "") : q.role}</span>
        </div>
      </figcaption>
    </figure>
  )
}

function QuoteCol({ quotes, dir }: { quotes: VcQuoteData[]; dir: "up" | "down" }) {
  const seconds = Math.max(quotes.length, 1) * QUOTE_WALL_SECONDS_PER_QUOTE
  return (
    <div className={`mq-col ${dir}`}>
      <div className="mq-track" style={{ animationDuration: `${seconds}s` }}>
        {quotes.map((q, i) => (
          <Quote key={`${q._id}-${i}`} q={q} />
        ))}
        {quotes.map((q, i) => (
          <Quote key={`${q._id}-${i}-dup`} q={q} hidden />
        ))}
      </div>
    </div>
  )
}

/** Two columns, the first half of the quotes scrolling up and the second half down. */
export function VcQuoteWall({ quotes }: { quotes: VcQuoteData[] }) {
  const half = Math.ceil(quotes.length / 2)
  return (
    <div className="quotes mq">
      <QuoteCol quotes={quotes.slice(0, half)} dir="up" />
      <QuoteCol quotes={quotes.slice(half)} dir="down" />
    </div>
  )
}
