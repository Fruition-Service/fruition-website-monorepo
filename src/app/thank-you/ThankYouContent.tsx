"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { THANK_YOU_MESSAGE_KEY, THANK_YOU_REDIRECT_SECONDS } from "@/lib/thankYou"
import { Arrow } from "@/components/vc/primitives"

export interface ThankYouPost {
  _id?: string
  title?: string
  slug?: string
  excerpt?: string
  charCount?: number
  categories?: { _id?: string; title?: string; slug?: string }[]
}

interface ThankYouContentProps {
  posts: ThankYouPost[]
  /** Where the countdown lands. */
  nextPath: string
}

/** Total dwell time before the redirect fires. */
const TOTAL_SECONDS = THANK_YOU_REDIRECT_SECONDS

/**
 * Elapsed second each step takes over. The last step is the longest because it
 * is the one carrying the articles — the visitor should have time to pick one
 * before the page moves for them.
 */
const STEP_STARTS = [0, 3, 6]

const DEFAULT_MESSAGE = "We'll be in touch within one business day."

/** Step 2: the contact-us message card's field rows, filled in. */
const HANDLING = [
  { label: "Who", value: "The consultant who covers your platform and region." },
  { label: "When", value: "Within one business day, Monday to Friday." },
  { label: "First question", value: "What you run now, and what isn't working." },
]

export default function ThankYouContent({ posts, nextPath }: ThankYouContentProps) {
  const router = useRouter()
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [paused, setPaused] = useState(false)
  /** Set once the visitor drives the sequence themselves. */
  const [pickedStep, setPickedStep] = useState<number | null>(null)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  const elapsed = TOTAL_SECONDS - remaining
  const autoStep = STEP_STARTS.reduce((acc, start, i) => (elapsed >= start ? i : acc), 0)
  const step = pickedStep ?? autoStep
  const progress = Math.min(1, elapsed / TOTAL_SECONDS)

  // The line the form that sent them here promised, if it left one. Read on
  // mount rather than during render: the server has no session storage, so the
  // default line is what hydrates.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.sessionStorage.getItem(THANK_YOU_MESSAGE_KEY)
    } catch {
      /* private mode / storage disabled — the default line is already correct */
    }
    if (!stored) return
    const line = stored
    // Deferred, not synchronous, to keep the effect body free of a setState
    // cascade — and a timeout rather than rAF, because rAF does not run while
    // the tab is in the background and the line would then never appear.
    // Clearing happens inside the callback, not before it: a cancelled effect
    // (Strict Mode double-invokes this in dev) must leave the line in storage
    // for the run that sticks.
    const id = window.setTimeout(() => {
      setMessage(line)
      try {
        window.sessionStorage.removeItem(THANK_YOU_MESSAGE_KEY)
      } catch {
        /* nothing to clean up if storage was unavailable */
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    router.prefetch(nextPath)
  }, [router, nextPath])

  // One timeout per second rather than an interval: pausing and resuming is
  // then just a re-run of this effect, with no drift to reconcile.
  useEffect(() => {
    if (paused) return
    if (remaining <= 0) {
      router.replace(nextPath)
      return
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [paused, remaining, router, nextPath])

  /** Driving the sequence by hand stops the clock — WCAG 2.2.1. */
  const selectStep = useCallback((i: number) => {
    setPickedStep(i)
    setPaused(true)
  }, [])

  const steps = [
    {
      label: "Received",
      title: "What we have",
      body: (
        <div className="ty-body">
          <p>{message}</p>
          <p className="small">
            There is nothing else to do right now. If it is urgent, reply to the confirmation
            email and it goes straight to the consultant rather than back through the queue.
          </p>
        </div>
      ),
    },
    {
      label: "Who picks it up",
      title: "How it gets handled",
      body: (
        <dl className="ty-body">
          {HANDLING.map((row) => (
            <div key={row.label} className="fld">
              <dt className="label">{row.label}</dt>
              <dd className="small">{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      label: "Read next",
      title: posts.length > 0 ? "Recent writing" : "Where we are sending you",
      body:
        posts.length > 0 ? (
          <ul className="ty-posts">
            {posts.map((post) => {
              const readTime = post.charCount
                ? Math.max(1, Math.round(post.charCount / 5 / 200))
                : 5
              return (
                <li key={post._id ?? post.slug}>
                  <Link href={`/post/${post.slug}`}>
                    <span>{post.title}</span>
                    <span className="label">{readTime} min</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="ty-body">
            <p className="small">
              Our consultants write up the builds they ship: the migrations, the automations, and
              the parts that went wrong on the way.
            </p>
          </div>
        ),
    },
  ]

  const current = steps[step]

  return (
    <div className="vc vc-p-contact-us vc-p-thank-you">
      <section className="hero" data-sec="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="badge">
              <i />
              Received
            </span>
            <h1 className="display">
              Thanks, we have <span className="acc">your request.</span>
            </h1>
            <div className="ctas">
              <Link className="btn" href={nextPath}>
                <span className="roll">
                  <span>Read the blog now</span>
                  <span aria-hidden="true">Read the blog now</span>
                </span>
                <Arrow />
              </Link>
              {!paused && (
                <button type="button" className="btn outline" onClick={() => setPaused(true)}>
                  <span className="roll">
                    <span>Stay on this page</span>
                    <span aria-hidden="true">Stay on this page</span>
                  </span>
                </button>
              )}
            </div>

            {/* The countdown: one hairline that fills as the clock runs, with
                its reading beside it. */}
            <div className="ty-clock">
              <div className="ty-rule" aria-hidden="true">
                <i style={{ "--p": progress } as React.CSSProperties} />
              </div>
              <p className="label">
                {paused
                  ? "Countdown stopped"
                  : `Opening the blog in ${String(Math.max(0, remaining)).padStart(2, "0")}s`}
              </p>
            </div>
            <p className="sr-only">
              This page opens the consulting blog automatically about ten seconds after it loads.
              Choose &ldquo;Stay on this page&rdquo; to stop that.
            </p>
          </div>

          <div className="frame">
            <div className="msg">
              {/* Step selector: picking one takes the sequence off the clock. */}
              <div className="tabs ty-steps">
                {steps.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => selectStep(i)}
                    aria-current={i === step ? "step" : undefined}
                    className={i === step ? "on" : undefined}
                  >
                    {String(i + 1).padStart(2, "0")} {s.label}
                  </button>
                ))}
              </div>
              <h2>{current.title}</h2>
              {current.body}
            </div>
          </div>
        </div>

        {/* Live region: the step, not the ticking number. A per-second
            announcement would talk over everything else on the page. */}
        <p role="status" className="sr-only">
          Step {step + 1} of {steps.length}: {current.title}
        </p>
      </section>
    </div>
  )
}
