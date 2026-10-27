"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  useConsentNotice,
  useStickyCtaBar,
  type ConsentNoticeState,
  type StickyCtaBarState,
} from "@/components/sections/StickyCtaContext"

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

/**
 * Clearance in px between the launcher and the sticky CTA bar or the consent
 * notice, either way.
 */
export const CLEARANCE = 12

/** The two destinations the panel offers, in order. */
const PANEL_LINKS = [
  {
    href: "/implementation-calculator",
    title: "Estimate cost and timeline",
    body: "Answer four questions, get an indicative range.",
  },
  {
    href: "/ask-fruit/workspace",
    title: "Ask the Implementation Calculator",
    body: "Describe the problem, get a recommendation and a brief.",
  },
] as const

/**
 * Floating fruitAI launcher, bottom right, every marketing page. A plain
 * button: no hover tag or hover motion. A click opens a compact panel anchored
 * 12px above it with two large link rows: the numeric estimator at
 * /implementation-calculator and the Implementation Calculator chat workspace.
 *
 * The panel is a labelled region. Focus moves to its first link when it opens
 * and back to the button when it closes from the button or Escape. It also
 * closes on a click outside the launcher and on any route change: the open
 * state records the pathname it was opened on, so a new pathname reads as
 * closed without an effect having to reset it. Focus only returns to the
 * button on those two if it was inside the panel, so a click elsewhere on the
 * page keeps its own focus.
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
 * lifts by the bar's height only when the two would actually meet. While it
 * is lifted the launcher sits a layer below the bar (z-40 against z-50), so
 * even mid-transition it cannot cover it. When the bar is up but stops short
 * of it, the launcher goes a layer above (z-60) instead: the bar's wrapper is
 * full width and transparent beside the card, and would otherwise swallow the
 * click, and the open panel, which reaches back over the card, stays on top.
 * The panel is positioned inside the same lifted wrapper, so the lift moves
 * the button and the panel together.
 *
 * Overlap with the visitor consent notice. Until the visitor decides, the
 * notice is `fixed inset-x-0 bottom-0 z-50` on a phone, a card that runs gutter
 * to gutter along the floor, and from `md:` a card in the bottom-left corner.
 * On a phone it would cover the launcher and swallow every tap on it. So the
 * notice publishes its geometry through <ConsentNoticeProvider> the same way
 * the bar does, and the launcher runs the same test against it: when the
 * card's right edge comes within the clearance of the launcher's left edge, it
 * lifts by the notice's height plus the clearance. With both the bar and the
 * notice up it takes the larger of the two lifts, which clears both, since
 * each is measured from the viewport floor. The launcher still sits a layer
 * below the notice; it simply no longer sits under it. When the notice stays in
 * its corner the launcher does not move.
 *
 * The open panel. Once the visitor opens it, the panel is the foreground
 * surface and must never sit behind the fixed chrome. At tablet widths the
 * notice stays in its corner, so the launcher keeps the floor, but the 320px
 * panel reaches back far enough to run behind the notice card. So while the
 * panel is open the launcher takes the layer above the bar and the notice
 * (z-60), whatever its closed layer was. Only the layer changes: the lift is
 * computed exactly as when closed, so opening never makes it jump. And in
 * every case where the launcher is lifted, the geometry already keeps it 12px
 * clear of the bar and the notice, so raising the layer while open cannot
 * cover either of them; it only matters where the panel reaches over a card
 * beside it.
 */
export default function AskFruitLauncher() {
  const pathname = usePathname()
  const bar = useStickyCtaBar()
  const notice = useConsentNotice()
  const [left, setLeft] = useState<number | null>(null)
  const [openOn, setOpenOn] = useState<string | null>(null)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

  // Open only on the pathname it was opened on: navigating closes it.
  const open = openOn !== null && openOn === pathname

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

  const close = useCallback((restoreFocus: boolean) => {
    setOpenOn(null)
    if (restoreFocus) buttonRef.current?.focus()
  }, [])

  // On open, focus the first link; while open, Escape and a click outside close it.
  useEffect(() => {
    if (!open) return
    const button = buttonRef.current
    firstLinkRef.current?.focus()
    const focusInPanel = () => !!panelRef.current?.contains(document.activeElement)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) close(focusInPanel())
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      // Closed by navigation: the old page's panel had focus, hand it back.
      if (focusInPanel()) button?.focus()
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, close])

  if (excluded) return null

  const { lift: liftPx, layer } = launcherPlacement(bar, notice, left, open)
  const lift =
    liftPx > 0
      ? ({ "--launcher-lift": `${liftPx}px` } as CSSProperties)
      : undefined

  return (
    <div
      ref={anchorRef}
      className={`fixed right-4 bottom-[var(--launcher-lift,max(1rem,env(safe-area-inset-bottom,0px)))] ${layer} transition-[bottom] duration-300 motion-reduce:transition-none md:right-6 lg:right-8`}
      style={lift}
    >
      {/* Always in the DOM so aria-controls resolves; `hidden` while closed. */}
      <div
        ref={panelRef}
        id="ask-fruit-launcher-panel"
        hidden={!open}
        role="region"
        aria-labelledby="ask-fruit-launcher-title"
        className="absolute right-0 bottom-full mb-3 w-[min(320px,calc(100vw-2rem))] rounded-card border border-ui bg-surface p-2 shadow-card"
      >
        <p
          id="ask-fruit-launcher-title"
          className="px-3 pt-2 pb-1 font-mono text-[12px] font-semibold tracking-[0.14em] text-brand uppercase"
        >
          fruitAI tools
        </p>
        <ul className="flex flex-col">
          {PANEL_LINKS.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                ref={i === 0 ? firstLinkRef : undefined}
                // A link to the page already open changes no pathname, so close here too.
                onClick={() => close(false)}
                className="flex min-h-11 flex-col gap-0.5 rounded-chip px-3 py-3 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <span className="text-[15px] font-semibold text-ink">{l.title}</span>
                <span className="text-[13px] leading-snug text-muted">{l.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        ref={buttonRef}
        type="button"
        aria-label="fruitAI tools: estimate cost and timeline, or ask the Implementation Calculator"
        aria-expanded={open}
        aria-controls="ask-fruit-launcher-panel"
        data-cta-location="ask-fruit-launcher"
        onClick={() => (open ? close(true) : setOpenOn(pathname))}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-pill bg-linear-135 from-brand via-fruit-orchid to-fruit-pink shadow-lg shadow-fruit-orchid/40 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none md:h-[60px] md:w-[60px]"
      >
        <span
          aria-hidden="true"
          className="h-7 w-7 bg-white [mask:url(/images/logo-fruition-mark.svg)_center/contain_no-repeat] md:h-8 md:w-8"
        />
      </button>
    </div>
  )
}

/**
 * Where the launcher sits given what is on the viewport floor: how far to lift
 * it (0 keeps it on the floor) and which layer it takes. `left` is the
 * launcher's measured left edge, or null before the first measurement lands;
 * `open` is whether the panel is open, which changes only the layer.
 */
export function launcherPlacement(
  bar: StickyCtaBarState,
  notice: ConsentNoticeState,
  left: number | null,
  open: boolean,
): { lift: number; layer: "z-40" | "z-[60]" } {
  // Only a bar whose card actually reaches this far across the window is in the
  // way; on a wide desktop it stops short and the launcher keeps the floor.
  // `left === null` means the first measurement has not landed yet, which is
  // also the first frame the bar can be up, so assume a collision until it has.
  const barCollides =
    bar.visible && (left === null || bar.right + CLEARANCE > left)

  // The same test against the consent notice: on a phone it spans the floor,
  // from `md:` it stays in the bottom-left corner and never reaches this far.
  const noticeCollides =
    notice.visible && (left === null || notice.right + CLEARANCE > left)

  // Both reported heights already include their own bottom padding, so lifting
  // by one plus the clearance lands the launcher a clean 12px above it. Both
  // are measured from the viewport floor, so the larger lift clears both.
  const lift = Math.max(
    barCollides ? bar.height + CLEARANCE : 0,
    noticeCollides ? notice.height + CLEARANCE : 0,
  )

  // Open: the panel is the foreground surface, above the bar and the notice.
  // Closed and beside the bar rather than above it: rise over its transparent
  // wrapper.
  const layer = open || (bar.visible && !barCollides) ? "z-[60]" : "z-40"

  return { lift, layer }
}
