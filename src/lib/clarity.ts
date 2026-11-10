/**
 * Microsoft Clarity (project "Fruition Website2", owned by Josh): heatmaps and
 * session recordings.
 *
 * The loader runs from DEFERRED_ANALYTICS in src/app/layout.tsx. It records only
 * on the live hosts below, so localhost, *.pages.dev / *.workers.dev previews and
 * staging never fill the project with test sessions. It also honours the
 * fruition-visitor-consent gate (keep in sync with src/components/CookieNotice.tsx)
 * and never loads on the portal or the embedded Studio, so recordings can't
 * capture client names, invoices or draft content.
 *
 * `trackClarityEnquiry` tags a recording with an `enquiry_submitted` event once a
 * lead form has been accepted by /api/leads. It is called from `trackLead`.
 */

declare global {
  interface Window {
    /** Clarity stub/SDK from the gated loader below. Absent when it did not load. */
    clarity?: (...args: unknown[]) => void
  }
}

export const CLARITY_PROJECT_ID = "yp5rx7pre1"

/** www is canonical; the apex 301s to it but is kept for safety. */
export const CLARITY_LIVE_HOSTS: readonly string[] = ["www.fruitionservices.io", "fruitionservices.io"]

export function isClarityLiveHost(hostname: string): boolean {
  return CLARITY_LIVE_HOSTS.includes(hostname)
}

export const CLARITY_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
if(/^\\/(internal|studio)(\\/|$)/.test(window.location.pathname))return;
var LIVE_HOSTS=${JSON.stringify(CLARITY_LIVE_HOSTS)};if(LIVE_HOSTS.indexOf(window.location.hostname)<0)return;
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");
})();`

/** Marks the current Clarity recording as a submitted enquiry. No-op without Clarity. */
export function trackClarityEnquiry(source: string | undefined): void {
  if (typeof window === "undefined") return
  try {
    const clarity = window.clarity
    if (typeof clarity !== "function") return
    clarity("set", "form_source", source || "unknown")
    clarity("set", "page_path", window.location.pathname)
    clarity("event", "enquiry_submitted")
  } catch {
    // Analytics must never break the form.
  }
}
