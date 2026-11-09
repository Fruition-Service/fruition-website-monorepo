/**
 * Ryze tracking pixel (get-ryze.ai). The rz_pk_ key is a public key: it ships
 * in every page's HTML, like the Clarity and PostHog ids.
 *
 * px.js reads the key from the ?key= query of its own <script> element, so the
 * element must stay in the DOM with this exact URL. It defines window.ryze as
 * an object (ryze.track("lead")) and replays a pre-load queue: anything pushed
 * to window.ryzeq as [method, ...args] before or after px.js arrives is sent.
 *
 * Ryze auto-captures clicks and form submits. The only event sent by hand is
 * `lead` (one of Ryze's standard immediate events) on a Calendly booking.
 */

export const RYZE_PIXEL_KEY = "rz_pk_7654460176d69d2f0bcdc138eca3264f"
export const RYZE_PIXEL_URL = `https://px.get-ryze.ai/px.js?key=${RYZE_PIXEL_KEY}`

/**
 * Root layout loader, run from the deferred analytics bootstrap. Honours the
 * same fruition-visitor-consent gate as REB2B and Clarity (keep in sync with
 * src/components/CookieNotice.tsx) and never loads on the portal or the
 * embedded Studio. The ryzeq queue itself is created up front by the bootstrap.
 */
export const RYZE_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
if(/^\\/(internal|studio)(\\/|$)/.test(window.location.pathname))return;
var s=document.createElement("script");s.async=true;s.src="${RYZE_PIXEL_URL}";var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f);
})();`

/**
 * Head snippet for the ad landing pages, which bypass the root layout. Creates
 * the queue, loads px.js async behind the same consent gate, and records a
 * Calendly booking as a Ryze `lead` (BookingEventTracker does this on normal
 * pages, but it is a React component and these pages have no React).
 */
export const RYZE_LANDING_HEAD = `<script>(function(){window.ryzeq=window.ryzeq||[];
window.addEventListener("message",function(e){try{if(e.origin!=="https://calendly.com")return;if(!e.data||e.data.event!=="calendly.event_scheduled")return;window.ryzeq=window.ryzeq||[];window.ryzeq.push(["track","lead"]);}catch(err){}});
try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
var s=document.createElement("script");s.async=true;s.src="${RYZE_PIXEL_URL}";var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f);
})();</script>`

declare global {
  interface Window {
    /** Ryze pre-load queue, replayed by px.js. Entries are [method, ...args]. */
    ryzeq?: unknown[][]
  }
}

/** Queues a Ryze `lead` event. Safe before and after px.js has loaded. */
export function trackRyzeLead(): void {
  window.ryzeq = window.ryzeq || []
  window.ryzeq.push(["track", "lead"])
}
