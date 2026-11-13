import type { CurrencyCode, CurrencyKit } from "./kit"

/*
 * Browser side of the display currency: remembers the visitor's currency,
 * detects it on the first visit, and rewrites price text on the page.
 *
 * Like createCurrencyKit, `mountCurrency` is SELF-CONTAINED (no imports used at
 * runtime, no outer references): the ad landing pages inline it with
 * String(mountCurrency). The React site calls it once from <CurrencyRuntime/>.
 *
 * Contract with the markup:
 * - Text anywhere under <body> that holds an explicit price ("A$18,000",
 *   "US$2,500", "AUD $24,500", "£14,500") is shown in the display currency.
 * - A bare "$2,500" is converted only inside an element carrying
 *   data-price-base="USD" (or another code), which names what "$" means there.
 * - data-currency-skip opts a subtree out (regional price lists, client
 *   outcomes). Elements with data-price are rendered by <Price/> and skipped.
 * - The original text is kept, so switching back restores it exactly.
 *
 * State lives in localStorage under STORAGE_KEY as {code, source, at}:
 * source "user" (picked in the switcher, wins everywhere) or "geo" (detected).
 */

export interface CurrencyState {
  code: CurrencyCode
  source: "user" | "geo" | "page"
}

export interface CurrencyController {
  get(): CurrencyState | null
  set(code: CurrencyCode): void
  subscribe(fn: (s: CurrencyState) => void): () => void
  /** Re-scan now (tests, or after a large client render). */
  scan(): void
}

export interface MountOptions {
  /** Ad pages: their own market's currency, used unless the visitor picked one. */
  pageDefault?: CurrencyCode | null
  /** Ask /api/visitor-region for the country on a first visit (site only). */
  detect?: boolean
  /** Delay the first DOM pass until after hydration (React site). */
  defer?: boolean
  /** Return false to leave the page as written (staff routes after client navigation). */
  isActive?: () => boolean
}

export function mountCurrency(win: Window, kit: CurrencyKit, opts: MountOptions): CurrencyController {
  const STORAGE_KEY = "fruition-currency"
  const EVENT = "fruition:currency"
  const GEO_TTL = 30 * 24 * 3600 * 1000
  const doc = win.document
  let listeners: Array<(s: CurrencyState) => void> = []
  let state: CurrencyState | null = null
  const originals = new WeakMap<Text, { orig: string; out: string }>()
  let tracked: Text[] = []
  let started = false
  let pending: Node[] = []
  let queued = false
  const SKIP_TAGS: Record<string, boolean> = { SCRIPT: true, STYLE: true, NOSCRIPT: true, TEXTAREA: true, INPUT: true, SELECT: true, OPTION: true, CODE: true, PRE: true, TEMPLATE: true }
  const QUICK = /\d/

  function read(): { code: CurrencyCode; source: "user" | "geo"; at: number } | null {
    try {
      const raw = win.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const v = JSON.parse(raw)
      if (v && kit.isCode(v.code) && (v.source === "user" || v.source === "geo")) return v
    } catch { /* storage blocked */ }
    return null
  }
  function write(code: CurrencyCode, source: "user" | "geo") {
    try { win.localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: code, source: source, at: Date.now() })) } catch { /* storage blocked */ }
  }

  function apply(next: CurrencyState) {
    const changed = !state || state.code !== next.code
    state = next
    doc.documentElement.setAttribute("data-currency", next.code)
    ;(win as unknown as { __fruitionCurrency?: CurrencyState }).__fruitionCurrency = next
    if (changed && started) rescanTracked()
    if (changed && started) walk(doc.body)
    for (let i = 0; i < listeners.length; i++) listeners[i](next)
    try { win.dispatchEvent(new CustomEvent(EVENT, { detail: next })) } catch { /* old browser */ }
  }

  function skipEl(el: Element | null): boolean {
    for (let n: Element | null = el; n; n = n.parentElement) {
      if (SKIP_TAGS[n.tagName]) return true
      if (n.hasAttribute("data-currency-skip") || n.hasAttribute("data-price") || n.getAttribute("contenteditable") === "true") return true
    }
    return false
  }
  function baseFor(el: Element | null): CurrencyCode | null {
    const host = el && el.closest ? el.closest("[data-price-base]") : null
    const b = host ? host.getAttribute("data-price-base") : null
    return kit.isCode(b) ? b : null
  }

  function convertNode(t: Text) {
    if (!state) return
    const rec = originals.get(t)
    const now = t.nodeValue || ""
    const orig = rec && now === rec.out ? rec.orig : now
    if (!rec && !QUICK.test(orig)) return
    const parent = t.parentElement
    if (skipEl(parent)) return
    const out = kit.convertText(orig, state.code, baseFor(parent))
    const shown = out === null ? orig : out
    if (shown !== now) t.nodeValue = shown
    if (out !== null || rec) {
      if (!rec) tracked.push(t)
      originals.set(t, { orig: orig, out: shown })
    }
  }

  function walk(root: Node | null) {
    if (!root || !state) return
    if (opts.isActive && !opts.isActive()) return
    if (root.nodeType === 3) { convertNode(root as Text); return }
    if (root.nodeType !== 1 && root.nodeType !== 11) return
    if (root.nodeType === 1 && skipEl(root as Element)) return
    const tw = doc.createTreeWalker(root, 4)
    let n: Node | null
    while ((n = tw.nextNode())) convertNode(n as Text)
  }

  function rescanTracked() {
    if (opts.isActive && !opts.isActive()) return
    const keep: Text[] = []
    for (let i = 0; i < tracked.length; i++) {
      const t = tracked[i]
      if (!t.isConnected) continue
      keep.push(t)
      convertNode(t)
    }
    tracked = keep
  }

  function flush() {
    queued = false
    const nodes = pending
    pending = []
    for (let i = 0; i < nodes.length; i++) walk(nodes[i])
  }
  function enqueue(n: Node) {
    pending.push(n)
    if (!queued) {
      queued = true
      ;(win.requestAnimationFrame || function (f: () => void) { return win.setTimeout(f, 16) })(flush)
    }
  }

  function start() {
    if (started) return
    started = true
    walk(doc.body)
    try {
      new (win as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver(function (muts: MutationRecord[]) {
        for (let i = 0; i < muts.length; i++) {
          const m = muts[i]
          if (m.type === "characterData") {
            const t = m.target as Text
            const rec = originals.get(t)
            if (rec && t.nodeValue === rec.out) continue
            enqueue(t)
          } else {
            for (let j = 0; j < m.addedNodes.length; j++) enqueue(m.addedNodes[j])
          }
        }
      }).observe(doc.body, { childList: true, subtree: true, characterData: true })
    } catch { /* no observer: the first pass still ran */ }
  }

  function detect(): void {
    let tz = ""
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "" } catch { /* no Intl */ }
    const fromTz = kit.forTimezone(tz)
    const done = function (country: string | null) {
      const cur = read()
      if (cur && cur.source === "user") return
      const code = kit.forCountry(country) || fromTz || kit.FALLBACK
      write(code, "geo")
      apply({ code: code, source: "geo" })
    }
    try {
      win.fetch("/api/visitor-region?tz=" + encodeURIComponent(tz), { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : null })
        .then(function (j) { done(j && typeof j.country === "string" ? j.country : null) })
        .catch(function () { done(null) })
    } catch { done(null) }
  }

  // Initial state: the visitor's own pick, then the page's market (ad pages),
  // then a remembered detection, then a fresh detection.
  const saved = read()
  if (saved && saved.source === "user") state = { code: saved.code, source: "user" }
  else if (opts.pageDefault && kit.isCode(opts.pageDefault)) state = { code: opts.pageDefault, source: "page" }
  else if (saved) state = { code: saved.code, source: "geo" }
  if (state) apply(state)
  if (opts.detect && (!saved || (saved.source === "geo" && Date.now() - (saved.at || 0) > GEO_TTL))) detect()
  else if (!state) apply({ code: kit.FALLBACK, source: "geo" })

  if (opts.defer) {
    const go = function () {
      const ric = (win as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback
      if (ric) ric(start, { timeout: 1200 })
      else win.setTimeout(start, 200)
    }
    if (doc.readyState === "complete") go()
    else win.addEventListener("load", go, { once: true })
  } else if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start, { once: true })
  } else {
    start()
  }

  return {
    get: function () { return state },
    set: function (code: CurrencyCode) {
      if (!kit.isCode(code)) return
      write(code, "user")
      apply({ code: code, source: "user" })
    },
    subscribe: function (fn: (s: CurrencyState) => void) {
      listeners.push(fn)
      return function () { listeners = listeners.filter(function (f) { return f !== fn }) }
    },
    scan: function () { if (started) walk(doc.body) },
  }
}
