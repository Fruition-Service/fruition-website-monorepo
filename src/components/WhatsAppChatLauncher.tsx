"use client"

import type { CSSProperties } from "react"
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

/** Clearance in px between the top edge of the sticky CTA bar and the launcher. */
const CLEARANCE = 12

/**
 * simple-icons WhatsApp glyph, inlined so the launcher costs no icon
 * dependency and no network request, and so it inherits `currentColor`.
 */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"

/**
 * Floating WhatsApp chat launcher.
 *
 * Rendered ONCE, site-wide, by <SiteFrame>, next to <SiteStickyCta>; pages do
 * not render this directly. `href` is resolved from Site Settings by the root
 * layout through `src/lib/whatsapp.ts`, which owns the one fallback number.
 *
 * Overlap with the sticky CTA bar. That bar is `fixed inset-x-0 bottom-0`, so
 * at every breakpoint it owns the full width of the viewport floor and there is
 * no column to the side of it to hide in. Instead the launcher reads the bar's
 * measured height out of <StickyCtaProvider> and lifts itself clear of it while
 * the bar is up, then settles back onto the same floor when the visitor scrolls
 * back to the hero or dismisses the bar. The launcher also sits a layer below
 * the bar (z-40 against z-50), so even mid-transition it cannot cover it.
 */
export default function WhatsAppChatLauncher({ href }: { href: string }) {
  const pathname = usePathname()
  const bar = useStickyCtaBar()

  const excluded = EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  )
  if (excluded) return null

  // The reported height already includes the bar's own bottom padding, so
  // lifting by it plus the clearance lands the launcher a clean 12px above the
  // bar at all three breakpoints. Only the measured number travels through
  // inline style; when the bar is down the property is simply absent and the
  // `var()` fallback in the class takes over, which keeps the resting offset,
  // the safe-area allowance and every other dimension in utilities.
  const lift = bar.visible
    ? ({ "--whatsapp-lift": `${bar.height + CLEARANCE}px` } as CSSProperties)
    : undefined

  return (
    <div
      className="fixed right-4 bottom-[var(--whatsapp-lift,max(1rem,env(safe-area-inset-bottom,0px)))] z-40 transition-[bottom] duration-300 motion-reduce:transition-none md:right-6 lg:right-8"
      style={lift}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fruition on WhatsApp"
        data-cta-location="whatsapp-launcher"
        className="flex h-14 w-14 items-center justify-center gap-2.5 rounded-pill bg-[linear-gradient(to_right,var(--purple-primary),var(--purple-light))] text-white shadow-[0_6px_20px_rgba(128,21,232,0.25)] transition duration-150 hover:-translate-y-px hover:bg-none hover:bg-[color:var(--purple-dark)] hover:shadow-[0_8px_26px_rgba(128,21,232,0.35)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[60px] md:w-[60px] lg:w-auto lg:px-6"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-7 w-7 flex-none md:h-8 md:w-8 lg:h-7 lg:w-7"
        >
          <path d={WHATSAPP_PATH} />
        </svg>
        <span className="hidden text-[15px] font-semibold whitespace-nowrap lg:inline">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  )
}
