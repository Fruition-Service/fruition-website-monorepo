"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"
import { useStickyCtaBar } from "@/components/sections/StickyCtaContext"

/**
 * Path prefixes that never get the launcher:
 *
 * - `/internal` - the staff portal. <SiteFrame> already returns before this
 *   component renders; listed so the rule survives if that ever changes.
 * - `/studio`   - Sanity Studio. Also an internal tool, not a marketing page.
 *
 * Every marketing route keeps it, `/contact-us` included: there, a second and
 * lower-friction way to reach a human beside the booking form is the point.
 */
const EXCLUDED_PREFIXES = ["/internal", "/studio"]

/** Clearance in px between the sticky CTA bar and the launcher, either way. */
const CLEARANCE = 12

/**
 * simple-icons WhatsApp glyph, inlined so the launcher costs no icon
 * dependency and no network request, and so it inherits `currentColor`.
 */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"

/**
 * Floating WhatsApp chat launcher, South-East Asia only.
 *
 * Rendered ONCE, site-wide, by <SiteFrame>, next to <SiteStickyCta>; pages do
 * not render this directly. `href` is resolved from Site Settings by the root
 * layout through `src/lib/whatsapp.ts`, which owns the one fallback number.
 *
 * Geography. WhatsApp is the default business channel across SEA and close to
 * unused in the other markets we sell into, so the launcher only appears for
 * visitors the shared resolver places in that desk — the same `detectRegion`
 * the booking form and the lead pipeline use, asked for at `/api/visitor-region`.
 * That request happens after hydration rather than in the root layout, because
 * reading `headers()` up there would opt every route out of static rendering.
 * Until the answer arrives, and for every visitor outside SEA, nothing renders:
 * the launcher fading in a beat late is a far cheaper failure than showing an
 * unanswered channel to Sydney, London and New York.
 *
 * Overlap with the sticky CTA bar. The bar's wrapper is `fixed inset-x-0
 * bottom-0`, but the card inside it is capped at 1200px and centred, so how
 * much of the viewport floor it really reaches depends on the window: on a
 * narrow screen it runs gutter to gutter and there is nowhere beside it to
 * stand, while on a wide desktop it stops short of the right edge and leaves a
 * column the launcher fits in. So the launcher compares its own left edge with
 * the card's measured right edge, published through <StickyCtaProvider>, and
 * lifts by the bar's height only when the two would actually meet. Where they
 * do not, it stays put on the floor beside the bar — which is the common case
 * on desktop, and stops the button hopping up the screen the moment a visitor
 * scrolls past the hero. The launcher also sits a layer below the bar (z-40
 * against z-50), so even mid-transition it cannot cover it.
 */
export default function WhatsAppChatLauncher({ href }: { href: string }) {
  const pathname = usePathname()
  const bar = useStickyCtaBar()
  const [inRegion, setInRegion] = useState(false)
  const [left, setLeft] = useState<number | null>(null)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const excluded = EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  )

  useEffect(() => {
    if (excluded || inRegion) return
    let live = true
    // The browser's zone, as a fallback for when the geo header is absent or a
    // placeholder. The route still prefers a real cf-ipcountry when it has one,
    // so a client-supplied string can never override an actual geo signal.
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
    fetch(`/api/visitor-region?tz=${encodeURIComponent(tz)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (live && data?.region === "SEA") setInRegion(true)
      })
      // A failed lookup leaves the launcher hidden, which is the same state as
      // "not in SEA" — there is nothing to recover and nothing to report.
      .catch(() => {})
    return () => {
      live = false
    }
  }, [excluded, inRegion])

  // Where the launcher sits horizontally. Only its `bottom` ever changes, so
  // this measurement survives the lift and cannot feed back into it; the
  // document is observed rather than the window listened to because a
  // ResizeObserver delivers its first observation too, which is the initial
  // read, and both arrive asynchronously rather than during the effect.
  useEffect(() => {
    if (excluded || !inRegion) return
    const el = anchorRef.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setLeft(el.getBoundingClientRect().left),
    )
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [excluded, inRegion])

  if (excluded || !inRegion) return null

  // Only a bar whose card actually reaches this far across the window is in the
  // way; on a wide desktop it stops short and the launcher keeps the floor.
  // `left === null` means the first measurement has not landed yet, which is
  // also the first frame the bar can be up, so assume a collision until it has:
  // starting high and dropping is a harmless correction, starting low and
  // having to jump would be the overlap this is here to avoid.
  const collides =
    bar.visible && (left === null || bar.right + CLEARANCE > left)

  // The reported height already includes the bar's own bottom padding, so
  // lifting by it plus the clearance lands the launcher a clean 12px above the
  // bar at all three breakpoints. Only the measured number travels through
  // inline style; when the bar is down the property is simply absent and the
  // `var()` fallback in the class takes over, which keeps the resting offset,
  // the safe-area allowance and every other dimension in utilities.
  const lift = collides
    ? ({ "--whatsapp-lift": `${bar.height + CLEARANCE}px` } as CSSProperties)
    : undefined

  return (
    <div
      ref={anchorRef}
      className="fixed right-4 bottom-[var(--whatsapp-lift,max(1rem,env(safe-area-inset-bottom,0px)))] z-40 transition-[bottom] duration-300 motion-reduce:transition-none md:right-6 lg:right-8"
      style={lift}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fruition on WhatsApp"
        data-cta-location="whatsapp-launcher"
        // WhatsApp's own green on a plain circle, glyph only. The mark is the
        // label here: it is one of the most recognisable icons on a phone
        // screen, and in its own colour it reads as the channel rather than as
        // another of our blue CTAs competing with the sticky bar below it.
        className="flex h-14 w-14 items-center justify-center rounded-pill bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition duration-150 hover:-translate-y-px hover:bg-[#1DA851] hover:shadow-[0_8px_26px_rgba(37,211,102,0.45)] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[60px] md:w-[60px]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-7 w-7 flex-none md:h-8 md:w-8"
        >
          <path d={WHATSAPP_PATH} />
        </svg>
      </a>
    </div>
  )
}
