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
}

const HIDDEN_BAR: StickyCtaBarState = { visible: false, height: 0 }

const noop = () => {}

const StickyCtaBarContext = createContext<{
  bar: StickyCtaBarState
  reportBar: (next: StickyCtaBarState) => void
} | null>(null)

/**
 * Holds the current page's sticky-CTA copy, if it declares any, plus the
 * geometry of the bar itself.
 *
 * The bar is rendered ONCE by <SiteFrame> so every page gets one; the copy
 * context is only how a page overrides the site-wide default with its own. The
 * geometry context exists because the bar is `fixed inset-x-0 bottom-0` and so
 * owns the whole viewport floor: anything else floating down there (the
 * WhatsApp launcher) has to know how tall it is to stay clear of it.
 */
export function StickyCtaProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [bar, setBar] = useState<StickyCtaBarState>(HIDDEN_BAR)

  const reportBar = useCallback((next: StickyCtaBarState) => {
    // The ResizeObserver behind this fires on layout changes that often leave
    // the numbers identical; only a real change may re-render the consumers.
    setBar((prev) =>
      prev.visible === next.visible && prev.height === next.height ? prev : next,
    )
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
