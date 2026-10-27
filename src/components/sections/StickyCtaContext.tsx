"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

export interface StickyCtaValue {
  label?: string
  mobileLabel?: string
  href?: string
}

interface Registration extends StickyCtaValue {
  /**
   * Identity of the <StickyCtaConfig> that wrote this. On a client-side
   * navigation the outgoing page's cleanup can run after the incoming page has
   * already registered; comparing owners stops the old page from clearing the
   * new page's copy and leaving the bar on the site-wide default.
   */
  owner: string
}

const StickyCtaContext = createContext<{
  registration: Registration | null
  setRegistration: Dispatch<SetStateAction<Registration | null>>
} | null>(null)

/** What the floating CTA bar currently occupies at the foot of the viewport. */
export interface StickyCtaBarState {
  /** True while the bar is on screen: rendered, scrolled past, not dismissed. */
  visible: boolean
  /**
   * Measured height in px of the bar's fixed wrapper, its own bottom padding
   * included, so this is the full slice of the viewport floor the bar takes.
   * Measured rather than assumed: it changes with how the heading wraps and
   * differs at all three breakpoints.
   */
  height: number
  /**
   * Viewport x of the right edge of the bar's visible card, which is capped at
   * 1200px and centred, so on a wide desktop it stops well short of the right
   * edge of the screen. Anything else floating down there needs this, not just
   * the height: if it clears the card horizontally it can stay on the floor
   * instead of being shoved upwards for a bar it never touches.
   */
  right: number
}

const HIDDEN_BAR: StickyCtaBarState = { visible: false, height: 0, right: 0 }

const noop = () => {}

const StickyCtaBarContext = createContext<{
  bar: StickyCtaBarState
  reportBar: (next: StickyCtaBarState) => void
} | null>(null)

/**
 * What the visitor consent notice currently occupies at the foot of the
 * viewport. Same three fields as the bar, measured the same way: on a phone the
 * notice runs gutter to gutter along the floor, from `md:` it is a card in the
 * bottom-left corner, and only the measurement says which one a given window
 * gets.
 */
export interface ConsentNoticeState {
  /** True while the notice is on screen: mounted, entered, not yet decided. */
  visible: boolean
  /**
   * Px from the viewport floor up to the top of the notice's fixed wrapper,
   * its own bottom padding included.
   */
  height: number
  /** Viewport x of the right edge of the notice's visible card. */
  right: number
}

const HIDDEN_NOTICE: ConsentNoticeState = { visible: false, height: 0, right: 0 }

const ConsentNoticeContext = createContext<{
  notice: ConsentNoticeState
  reportNotice: (next: ConsentNoticeState) => void
} | null>(null)

/** Only a real change in the numbers may re-render the consumers. */
function sameGeometry(
  a: StickyCtaBarState | ConsentNoticeState,
  b: StickyCtaBarState | ConsentNoticeState,
) {
  return a.visible === b.visible && a.height === b.height && a.right === b.right
}

/**
 * Holds the current page's sticky-CTA copy, if it declares any, plus the
 * geometry of the fixed chrome at the viewport floor: the sticky CTA bar and
 * the visitor consent notice.
 *
 * The bar is rendered ONCE by <SiteFrame> so every page gets one; the copy
 * context is only how a page overrides the site-wide default with its own. The
 * geometry contexts exist because the bar and, on a phone, the notice are both
 * `fixed inset-x-0 bottom-0` and so own the whole viewport floor: anything else
 * floating down there (the Implementation Calculator launcher) has to know how
 * much of it each one takes to stay clear of them.
 */
export function StickyCtaProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [bar, setBar] = useState<StickyCtaBarState>(HIDDEN_BAR)

  // The ResizeObserver behind this fires on layout changes that often leave
  // the numbers identical; only a real change may re-render the consumers.
  const reportBar = useCallback((next: StickyCtaBarState) => {
    setBar((prev) => (sameGeometry(prev, next) ? prev : next))
  }, [])

  const value = useMemo(
    () => ({ registration, setRegistration }),
    [registration],
  )
  const barValue = useMemo(() => ({ bar, reportBar }), [bar, reportBar])

  return (
    <StickyCtaContext.Provider value={value}>
      <StickyCtaBarContext.Provider value={barValue}>
        {children}
      </StickyCtaBarContext.Provider>
    </StickyCtaContext.Provider>
  )
}

/** Read the bar's current geometry. Reports hidden outside the provider. */
export function useStickyCtaBar(): StickyCtaBarState {
  return useContext(StickyCtaBarContext)?.bar ?? HIDDEN_BAR
}

/**
 * The reporter <StickyCtaBar> calls to publish its own geometry. Stable across
 * renders, so it is safe as an effect dependency; a no-op outside the provider.
 */
export function useReportStickyCtaBar(): (next: StickyCtaBarState) => void {
  return useContext(StickyCtaBarContext)?.reportBar ?? noop
}

/**
 * Holds the consent notice's geometry, for the same reason the bar's is held
 * above: on a phone the notice owns the viewport floor too. <SiteFrame> wraps
 * the notice and the launcher in it, inside <StickyCtaProvider>.
 */
export function ConsentNoticeProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState<ConsentNoticeState>(HIDDEN_NOTICE)

  const reportNotice = useCallback((next: ConsentNoticeState) => {
    setNotice((prev) => (sameGeometry(prev, next) ? prev : next))
  }, [])

  const value = useMemo(() => ({ notice, reportNotice }), [notice, reportNotice])

  return (
    <ConsentNoticeContext.Provider value={value}>
      {children}
    </ConsentNoticeContext.Provider>
  )
}

/** Read the consent notice's current geometry. Reports hidden outside the provider. */
export function useConsentNotice(): ConsentNoticeState {
  return useContext(ConsentNoticeContext)?.notice ?? HIDDEN_NOTICE
}

/**
 * The reporter <CookieNotice> calls to publish its own geometry. Stable across
 * renders, so it is safe as an effect dependency; a no-op outside the provider.
 */
export function useReportConsentNotice(): (next: ConsentNoticeState) => void {
  return useContext(ConsentNoticeContext)?.reportNotice ?? noop
}

/** The current page's override, or null when it declares none. */
export function useStickyCtaOverride(): StickyCtaValue | null {
  return useContext(StickyCtaContext)?.registration ?? null
}

/**
 * Declares this page's sticky-CTA copy (from its Sanity `croSections`).
 *
 * Renders nothing — the bar lives in <SiteFrame>, so a page cannot
 * accidentally produce a second one. A page that renders no config keeps the
 * site-wide default from Site Settings.
 */
export default function StickyCtaConfig({
  label,
  mobileLabel,
  href,
}: StickyCtaValue) {
  const setRegistration = useContext(StickyCtaContext)?.setRegistration
  const owner = useId()

  useEffect(() => {
    if (!setRegistration) return
    setRegistration({ owner, label, mobileLabel, href })
    return () =>
      setRegistration((prev) => (prev?.owner === owner ? null : prev))
  }, [setRegistration, owner, label, mobileLabel, href])

  return null
}
