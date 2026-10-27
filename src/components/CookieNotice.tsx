"use client"

// Visitor-identification notice + opt-out (RB2B). Notice model: RB2B loads by
// default (legitimate interest), and a stored "declined" choice suppresses the
// loader on future visits. The gate that reads this choice lives inline in the
// document <head> (src/app/layout.tsx) so it runs before RB2B is injected.
//
// Storage key is shared with that head script — keep them in sync.
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useReportConsentNotice } from "@/components/sections/StickyCtaContext"

const CONSENT_KEY = "fruition-visitor-consent"
const EXIT_MS = 260

type Choice = "accepted" | "declined"

export default function CookieNotice() {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const reportNotice = useReportConsentNotice()

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(CONSENT_KEY)
    } catch {
      // Private mode / storage blocked — treat as undecided, show the notice.
    }
    if (stored === "accepted" || stored === "declined") return

    // Mount on the next frame, then flip to the entered state a frame later so
    // the open transition runs. Keeping both setState calls inside rAF avoids a
    // synchronous cascade in the effect body.
    let enterRaf = 0
    const mountRaf = requestAnimationFrame(() => {
      setMounted(true)
      enterRaf = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(mountRaf)
      cancelAnimationFrame(enterRaf)
    }
  }, [])

  // Publish the slice of the viewport floor this notice occupies, so the
  // Implementation Calculator launcher can stay clear of it, the same way the
  // sticky CTA bar does. The height is measured from the wrapper, not the card:
  // the card carries a `translate-y-3` entry transform, the wrapper does not,
  // and the distance from the viewport floor to the wrapper's top already
  // includes its bottom padding. The card's right edge is what says whether the
  // notice spans the floor (phones) or sits in the bottom-left corner (`md:`).
  const showing = mounted && entered
  useEffect(() => {
    const wrapper = wrapperRef.current
    const card = cardRef.current
    if (!showing || !wrapper || !card) {
      reportNotice({ visible: false, height: 0, right: 0 })
      return
    }
    const measure = () =>
      reportNotice({
        visible: true,
        height: window.innerHeight - wrapper.getBoundingClientRect().top,
        right: card.getBoundingClientRect().right,
      })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    // The card's width tracks the window even when its height does not, so the
    // ResizeObserver alone would miss a horizontal-only resize.
    window.addEventListener("resize", measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
      reportNotice({ visible: false, height: 0, right: 0 })
    }
  }, [reportNotice, showing])

  const decide = useCallback((choice: Choice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice)
    } catch {
      // Can't persist — the notice still dismisses for this session.
    }
    setEntered(false)
    window.setTimeout(() => setMounted(false), EXIT_MS)
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={wrapperRef}
      role="region"
      aria-label="Visitor identification notice"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 md:inset-x-auto md:left-6 md:bottom-6 md:justify-start md:px-0 md:pb-0"
    >
      <div
        ref={cardRef}
        style={{
          transitionDuration: `${EXIT_MS}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={[
          "w-full max-w-[27rem] rounded-card border border-ui bg-surface-raised p-5 shadow-card dark:shadow-none",
          "transition-[opacity,transform] will-change-transform",
          "motion-reduce:transition-none",
          entered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 motion-reduce:translate-y-0",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#f4ecfd] text-brand"
          >
            {/* shield-check */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight text-body">
              We recognise business visitors
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
              To understand which companies research our services and follow up,
              we identify business visitors to this site. You can opt out, and it
              never affects how the site works.{" "}
              <Link
                href="/data-privacy"
                className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
              >
                How this works
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-pill bg-[linear-gradient(to_right,#8015e8,#ba83f0)] px-4 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark hover:bg-none"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={() => decide("declined")}
            className="inline-flex h-10 items-center justify-center rounded-pill border border-ui px-4 text-[14px] font-semibold text-muted transition-colors hover:border-[#c9c9d4] hover:text-body"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
