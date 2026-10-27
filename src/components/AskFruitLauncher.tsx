"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStickyCtaBar } from "@/components/sections/StickyCtaContext"

/**
 * Path prefixes that never get the launcher:
 *
 * - `/internal`  - the staff portal. <SiteFrame> already returns before this
 *   component renders; listed so the rule survives if that ever changes.
 * - `/studio`    - Sanity Studio. Also an internal tool, not a marketing page.
 * - `/ask-fruit` - the landing page has the prompt box in its hero, and the
 *   workspace under it is chromeless, so a button pointing at the Implementation Calculator from
 *   inside the Implementation Calculator only gets in the way.
 */
const EXCLUDED_PREFIXES = ["/internal", "/studio", "/ask-fruit"]

/** Clearance in px between the sticky CTA bar and the launcher, either way. */
const CLEARANCE = 12

/**
 * Floating Implementation Calculator launcher, bottom right, every marketing page. A plain
 * button: no hover tag or hover motion, a click opens the workspace.
 *
 * Rendered ONCE, site-wide, by <SiteFrame>, next to <SiteStickyCta>; pages do
 * not render this directly. It replaced the SEA-only WhatsApp launcher, so it
 * shows to every visitor: the Implementation Calculator answers in any region, at any hour.
 *
 * The Fruition mark is drawn as a CSS mask over a white fill rather than an
 * <img>, because the SVG paints in `currentColor` and an <img> would render it
 * black on the gradient.
 *
 * Overlap with the sticky CTA bar. The bar's wrapper is `fixed inset-x-0
 * bottom-0`, but the card inside it is capped at 1200px and centred, so how
 * much of the viewport floor it really reaches depends on the window: on a
 * narrow screen it runs gutter to gutter and there is nowhere beside it to
 * stand, while on a wide desktop it stops short of the right edge and leaves a
 * column the launcher fits in. So the launcher compares its own left edge with
 * the card's measured right edge, published through <StickyCtaProvider>, and
 * lifts by the bar's height only when the two would actually meet. The
 * launcher also sits a layer below the bar (z-40 against z-50), so even
 * mid-transition it cannot cover it.
 */
export default function AskFruitLauncher() {
  const pathname = usePathname()
  const bar = useStickyCtaBar()
  const [left, setLeft] = useState<number | null>(null)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const excluded = EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  )

  // Where the launcher sits horizontally. Only its `bottom` ever changes, so
  // this measurement survives the lift and cannot feed back into it; the
  // document is observed rather than the window listened to because a
  // ResizeObserver delivers its first observation too, which is the initial
  // read, and both arrive asynchronously rather than during the effect.
  useEffect(() => {
    if (excluded) return
    const el = anchorRef.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setLeft(el.getBoundingClientRect().left),
    )
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [excluded])

  if (excluded) return null

  // Only a bar whose card actually reaches this far across the window is in the
  // way; on a wide desktop it stops short and the launcher keeps the floor.
  // `left === null` means the first measurement has not landed yet, which is
  // also the first frame the bar can be up, so assume a collision until it has.
  const collides =
    bar.visible && (left === null || bar.right + CLEARANCE > left)

  // The reported height already includes the bar's own bottom padding, so
  // lifting by it plus the clearance lands the launcher a clean 12px above it.
  const lift = collides
    ? ({ "--launcher-lift": `${bar.height + CLEARANCE}px` } as CSSProperties)
    : undefined

  return (
    <div
      ref={anchorRef}
      className="fixed right-4 bottom-[var(--launcher-lift,max(1rem,env(safe-area-inset-bottom,0px)))] z-40 transition-[bottom] duration-300 motion-reduce:transition-none md:right-6 lg:right-8"
      style={lift}
    >
      <Link
        href="/ask-fruit/workspace"
        aria-label="Get a rough implementation quote from the Implementation Calculator"
        data-cta-location="ask-fruit-launcher"
        className="flex h-14 w-14 items-center justify-center rounded-pill bg-linear-135 from-brand via-fruit-orchid to-fruit-pink shadow-lg shadow-fruit-orchid/40 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none md:h-[60px] md:w-auto md:gap-2.5 md:px-5"
      >
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 bg-white [mask:url(/images/logo-fruition-mark.svg)_center/contain_no-repeat] md:h-8 md:w-8"
        />
        {/* Mobile keeps the 56px circle; from md the launcher says what it is. */}
        <span aria-hidden="true" className="hidden text-[14px] font-semibold whitespace-nowrap text-white md:inline">
          Get a quote
        </span>
      </Link>
    </div>
  )
}
