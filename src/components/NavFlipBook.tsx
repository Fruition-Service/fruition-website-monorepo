"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { vercelStegaClean } from '@vercel/stega'
import { urlFor } from '@/sanity/image'

export interface NavFlipSlide {
  _key?: string
  title?: string
  meta?: string
  quote?: string
  plain?: boolean
  attribution?: string
  logos?: ({ _key?: string; alt?: string } & Record<string, unknown>)[]
  metrics?: { value?: string; label?: string }[]
  href?: string
}

interface Props {
  kicker?: string
  slides: NavFlipSlide[]
  label?: string
  href?: string
  /** Only move while the dropdown is open. */
  active: boolean
  onNavigate: () => void
}

/** How long a page stays before the next one slides in. */
const INTERVAL_MS = 4500
/** The CSS has a position rule for up to this many pages. */
const MAX_PAGES = 8

type LogoImage = NonNullable<NavFlipSlide['logos']>[number]

function logoUrl(image: unknown): string | null {
  try {
    return urlFor(image as never).width(300).url()
  } catch {
    return null
  }
}

function Logo({ image, client }: { image: LogoImage; client?: boolean }) {
  const src = logoUrl(image)
  const alt = vercelStegaClean(image?.alt || '')
  return (
    <span className={`fb-logo${client ? ' fb-logo-client' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{alt}</span>}
    </span>
  )
}

/**
 * A dropdown feature card that slides through its pages on its own: client
 * logos per industry for the use case hub, one case study per page under
 * Pricing. The whole card is one link (the card's href); the dots only show
 * where it is. It pauses on hover, keyboard focus and a hidden tab, and with
 * reduced motion it stays on the first page.
 */
export default function NavFlipBook({ kicker, slides, label, href, active, onNavigate }: Props) {
  const pages = slides.slice(0, MAX_PAGES)
  const total = pages.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    const vis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', vis)
    return () => {
      mq.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  useEffect(() => {
    if (!active || paused || hidden || reduced || total < 2) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL_MS)
    return () => clearTimeout(t)
  }, [active, paused, hidden, reduced, total, index])

  const isCase = pages.some((s) => s.metrics?.length)

  return (
    <Link
      prefetch={false}
      href={href || '#'}
      className="fb"
      aria-label={vercelStegaClean([kicker, label].filter(Boolean).join(': ')) || undefined}
      onClick={onNavigate}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="fb-top">
        {kicker && <span className="fb-kicker">{kicker}</span>}
        {total > 1 && (
          <span className="fb-dots" aria-hidden>
            {pages.map((s, k) => (
              <span key={s._key || k} className={`fb-dot${k === index ? ' is-on' : ''}`} />
            ))}
          </span>
        )}
      </span>
      <span className="fb-view">
        <span className="fb-track" data-i={index}>
          {pages.map((s, k) => {
            const logos = (s.logos || []).filter(Boolean)
            const metrics = (s.metrics || []).filter((m) => m.value).slice(0, 2)
            return (
              <span key={s._key || k} className="fb-page" aria-hidden={k !== index}>
                {isCase ? (
                  <>
                    {logos[0] && <Logo image={logos[0]} client />}
                    {s.quote && <span className="fb-quote">{s.plain ? s.quote : <>&ldquo;{s.quote}&rdquo;</>}</span>}
                    {s.attribution && <span className="fb-who">{s.attribution}</span>}
                    {metrics.length > 0 && (
                      <span className="fb-figs">
                        {metrics.map((m, j) => (
                          <span key={`${m.value}-${j}`} className="fb-fig">
                            <b>{m.value}</b>
                            <span>{m.label}</span>
                          </span>
                        ))}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {logos.length > 0 && (
                      <span className="fb-row">
                        {logos.slice(0, 3).map((l, j) => (
                          <Logo key={l._key || j} image={l} />
                        ))}
                      </span>
                    )}
                    {s.title && <span className="fb-industry">{s.title}</span>}
                    {s.meta && <span className="fb-builds">{s.meta}</span>}
                    {!s.title && s.quote && <span className="fb-blurb">{s.quote}</span>}
                  </>
                )}
              </span>
            )
          })}
        </span>
      </span>
    </Link>
  )
}
