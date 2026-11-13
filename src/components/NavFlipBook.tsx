"use client"
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  /** Only turn pages while the dropdown is open. */
  active: boolean
  onNavigate: () => void
}

/** How long a page stays before the next one turns. */
const INTERVAL_MS = 4500
/** Length of the page-turn animation (matches --fb-turn in chrome.css). */
const TURN_MS = 1000

function logoUrl(image: unknown): string | null {
  try {
    return urlFor(image as never).width(300).url()
  } catch {
    return null
  }
}

type LogoImage = NonNullable<NavFlipSlide['logos']>[number]

function Logo({ image, size }: { image: LogoImage; size?: 'sm' | 'client' }) {
  const src = logoUrl(image)
  const alt = vercelStegaClean(image?.alt || '')
  return (
    <span className={`fb-logo${size ? ` fb-logo-${size}` : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{alt}</span>}
    </span>
  )
}

/**
 * A dropdown feature card that turns through its pages like a flip book
 * (Claude Design "Nav flip book cards", 13 Nov 2026). Every 4.5 s the current
 * page swings away on its left edge and the next one is revealed underneath.
 * It pauses on hover, keyboard focus and a hidden tab; with reduced motion it
 * crossfades and never turns on its own. The footer link stays put.
 */
export default function NavFlipBook({ kicker, slides, label, href, active, onNavigate }: Props) {
  const total = slides.length
  const [index, setIndex] = useState(0)
  const [turning, setTurning] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hidden, setHidden] = useState(false)
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCase = slides.some((s) => s.metrics?.length)

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

  const go = useCallback(
    (n: number) => {
      const next = (n + total) % total
      if (next === index) return
      if (!reduced) {
        setTurning(index)
        if (turnTimer.current) clearTimeout(turnTimer.current)
        turnTimer.current = setTimeout(() => setTurning(null), TURN_MS + 50)
      }
      setIndex(next)
    },
    [total, reduced, index],
  )

  useEffect(() => {
    if (!active || paused || hidden || reduced || total < 2) return
    const t = setTimeout(() => go(index + 1), INTERVAL_MS)
    return () => clearTimeout(t)
  }, [active, paused, hidden, reduced, total, index, go])

  useEffect(() => () => {
    if (turnTimer.current) clearTimeout(turnTimer.current)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className={`fb${reduced ? ' fb-reduced' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={vercelStegaClean(kicker || 'Featured')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      {kicker && <p className={`fb-kicker${isCase ? ' fb-kicker-corner' : ''}`}>{kicker}</p>}
      <div className="fb-stage">
        {slides.map((s, k) => {
          const state = k === index ? ' is-current' : k === turning ? ' is-turning' : ''
          const revealing = turning !== null && k === index ? ' is-revealing' : ''
          const logos = (s.logos || []).filter(Boolean)
          const metrics = (s.metrics || []).filter((m) => m.value).slice(0, 2)
          return (
            <div
              key={s._key || k}
              className={`fb-page${state}${revealing}`}
              role="group"
              aria-roledescription="page"
              aria-label={`${k + 1} of ${total}`}
              aria-hidden={k !== index}
            >
              {metrics.length > 0 ? (
                <>
                  {logos[0] && <Logo image={logos[0]} size="client" />}
                  {s.quote && <p className="fb-quote">{s.plain ? s.quote : <>&ldquo;{s.quote}&rdquo;</>}</p>}
                  {s.attribution && <p className="fb-who">{s.attribution}</p>}
                  <div className="fb-figs">
                    {metrics.map((m, j) => (
                      <span key={`${m.value}-${j}`} className="fb-fig">
                        <b>{m.value}</b>
                        <span>{m.label}</span>
                      </span>
                    ))}
                  </div>
                </>
              ) : s.title ? (
                <>
                  <div className="fb-row">
                    {logos.slice(0, 3).map((l, j) => (
                      <Logo key={l._key || j} image={l} />
                    ))}
                  </div>
                  <p className="fb-industry">
                    {s.href ? (
                      <Link prefetch={false} href={s.href} onClick={onNavigate} tabIndex={k === index ? undefined : -1}>
                        {s.title}
                      </Link>
                    ) : (
                      s.title
                    )}
                  </p>
                  {s.meta && <p className="fb-builds">{s.meta}</p>}
                </>
              ) : (
                <>
                  {s.quote && <p className="fb-blurb">{s.plain ? s.quote : <>&ldquo;{s.quote}&rdquo;</>}</p>}
                  {logos.length > 0 && (
                    <div className="fb-mosaic">
                      {logos.slice(0, 6).map((l, j) => (
                        <Logo key={l._key || j} image={l} size="sm" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <div className="fb-foot">
        {total > 1 && (
          <div className="fb-nav">
            <div className="fb-dots">
              {slides.map((s, k) => (
                <button
                  key={s._key || k}
                  type="button"
                  className="fb-dot"
                  aria-label={`Page ${k + 1} of ${total}`}
                  aria-current={k === index}
                  onClick={() => go(k)}
                />
              ))}
            </div>
            <span className="fb-count" aria-hidden>
              <b>{pad(index + 1)}</b> / {pad(total)}
            </span>
          </div>
        )}
        {href && label && (
          <Link prefetch={false} href={href} className="fb-link" onClick={onNavigate}>
            {label} <span aria-hidden>&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  )
}
