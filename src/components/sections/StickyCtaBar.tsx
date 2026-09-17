"use client"

import { useEffect, useRef, useState } from "react"
import CtaButton from "@/components/CtaButton"
import { useReportStickyCtaBar } from "@/components/sections/StickyCtaContext"
import { BOOKING_SECTION_ID } from "@/lib/inPageBooking"

interface StickyCtaBarProps {
  /** Site-wide headline. Falls back to the copy the design ships with. */
  heading?: string
  label?: string
  /** Shorter CTA label shown on mobile (below md) so the long CMS label can't
   *  wrap/overflow the button. Defaults to "Schedule a call". */
  mobileLabel?: string
  href?: string
  /** px scrolled before the bar appears */
  showAfter?: number
}

/** Height of the band at the bottom of the viewport the bar occupies. */
const BAR_BAND = 220

/**
 * Whether the booking section is under the bar right now.
 *
 * On a page that renders <BookingSection>, the CTAs scroll to it in place
 * (see `lib/inPageBooking.ts`) rather than leaving for /contact-us — so the bar
 * would end up floating over the form it just sent the visitor to. Same reason
 * <SiteStickyCta> drops the bar on /contact-us entirely; here the destination
 * is only part of the page, so the bar steps aside while it is on screen and
 * comes back once it scrolls past.
 *
 * Looked up per call rather than cached: the bar outlives client-side
 * navigations, so the element it should watch changes under it.
 */
function bookingInView(): boolean {
  const section = document.getElementById(BOOKING_SECTION_ID)
  if (!section) return false
  const rect = section.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > window.innerHeight - BAR_BAND
}

/**
 * Floating bottom CTA that fades in once the visitor scrolls past the hero, so
 * a friction-free conversion path is always one click away. Dismissible.
 *
 * Rendered ONCE, site-wide, by <SiteFrame> via <SiteStickyCta> — pages do not
 * render this directly. A page tunes the copy with <StickyCtaConfig> (see
 * StickyCtaContext.tsx); everything else inherits the Site Settings default.
 *
 * Proportions follow `CTA Banner.dc.html` in Claude Design: the heading sits on
 * one line beside the CTA at `lg` and stacks above it below that. The design
 * keys off container width (560/900); this uses the project's three
 * breakpoints — base = its mobile, `md` = tablet, `lg` = desktop.
 *
 * Scaled to ~0.88 of the design's desktop figures so the card lines up with the
 * 1200px content column the pages actually use rather than the design's 1348px
 * canvas, which read oversized floating above real page content.
 */
export default function StickyCtaBar({
  heading = "Ready to scale your workflows?",
  label,
  mobileLabel = "Schedule a call",
  href,
  showAfter = 600,
}: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const reportBar = useReportStickyCtaBar()
  const showing = Boolean(label) && Boolean(href) && visible && !dismissed

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter && !bookingInView())
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [showAfter])

  // Publish how much of the viewport floor this bar occupies, so the WhatsApp
  // launcher can ride above it rather than under it. The fixed wrapper is
  // measured, not assumed: it includes the bar's own bottom padding, and its
  // height moves with the heading's wrap and with the breakpoint.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!showing || !wrapper) {
      reportBar({ visible: false, height: 0 })
      return
    }
    const measure = () =>
      reportBar({ visible: true, height: wrapper.offsetHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    return () => {
      observer.disconnect()
      reportBar({ visible: false, height: 0 })
    }
  }, [reportBar, showing])

  if (!label || !href || dismissed) return null

  /** Same pill at every breakpoint, only the size and placement change. */
  const closeButton = (extraClass: string, iconSize: number) => (
    <button
      type="button"
      aria-label="Dismiss banner"
      onClick={() => setDismissed(true)}
      className={`flex h-10 w-10 flex-none items-center justify-center rounded-pill border-[1.5px] border-white/40 bg-transparent p-0 text-white transition-colors duration-150 hover:border-[color:var(--blue-press)] hover:bg-[color:var(--blue-press)] ${extraClass}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] transition-all duration-300 md:px-6 lg:px-8"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        role="region"
        aria-label="Consultation banner"
        data-cta-location="sticky"
        className="relative mx-auto flex max-w-[1200px] flex-col gap-4 overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,var(--dark-bg)_0%,var(--dark-bg-secondary)_48%,var(--purple-primary)_110%)] p-[20px_16px_16px_20px] shadow-[0_12px_32px_-14px_rgba(16,0,58,0.4)] md:gap-[18px] md:rounded-3xl md:bg-[linear-gradient(120deg,var(--dark-bg)_0%,var(--dark-bg-secondary)_46%,var(--purple-primary)_105%)] md:p-[24px_24px_24px_28px] md:shadow-[0_16px_40px_-16px_rgba(16,0,58,0.4)] lg:flex-row lg:items-center lg:gap-6 lg:bg-[linear-gradient(99deg,var(--dark-bg)_0%,var(--dark-bg-secondary)_44%,var(--purple-primary)_100%)] lg:rounded-[20px] lg:p-[24px_24px_24px_34px]"
      >
        {/* Lilac glow — bottom-right on phones, top-right from md up. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[100px] -bottom-[140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(186,131,240,0.5),transparent_70%)] mix-blend-screen md:top-[-150px] md:right-[-110px] md:bottom-auto md:h-[380px] md:w-[380px] lg:top-[-160px] lg:right-[-120px] lg:h-[420px] lg:w-[420px]"
        />

        {/* Heading row — carries the close button until lg, where it moves
            beside the CTA. */}
        <div className="relative flex items-start gap-2.5 md:gap-3 lg:min-w-0 lg:flex-1">
          {/* A <p>, not an <h2>. This bar is rendered site-wide from
              <SiteFrame>, and its markup streams ahead of the page's own
              content, so an <h2> here became the first heading in the served
              HTML on every route: agent crawlers read the document as starting
              at level 2 with no H1 (ora.ai check content-no-js). Styling is
              fully explicit, so the rendered bar is unchanged. */}
          <p className="m-0 min-w-0 flex-1 pt-2 text-[19px] leading-[1.35] font-semibold tracking-[-0.01em] text-white md:pt-[5px] md:text-[23px] md:leading-[1.3] lg:pt-0 lg:text-[clamp(19px,1.6vw,23px)]" style={{ textWrap: "pretty" }}>
            {heading}
          </p>
          {closeButton("lg:hidden", 15)}
        </div>

        <div className="relative flex items-center gap-4 lg:flex-none">
          {/* Full-width, shorter pill on phones; the design's 248×53 from md up. */}
          <span className="w-full md:hidden">
            <CtaButton
              href={href}
              label={mobileLabel ?? label}
              variant="onDarkPrimary"
              className="w-full justify-center"
              style={{ height: 48, fontSize: 15, padding: "0 22px" }}
            />
          </span>
          <span className="hidden md:block">
            <CtaButton
              href={href}
              label={label}
              mobileLabel={mobileLabel}
              variant="onDarkPrimary"
              style={{ height: 48, fontSize: 15, padding: "0 24px" }}
            />
          </span>
          {closeButton("hidden lg:flex", 16)}
        </div>
      </div>
    </div>
  )
}
