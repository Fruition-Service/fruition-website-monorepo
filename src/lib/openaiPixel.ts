/**
 * OpenAI Ads (ChatGPT ads) measurement pixel, `oaiq`. The pixel id is public:
 * it ships in every page's HTML, like the Clarity and PostHog ids.
 *
 * Two conversion events are sent, both with the `customer_action` data shape:
 *
 * - `appointment_scheduled` on a completed Calendly booking
 *   (`calendly.event_scheduled` postMessage from calendly.com);
 * - `lead_created` once /api/leads has accepted a lead form (the same moment
 *   `trackLead()` pushes `generate_lead`, never on a bare submit).
 *
 * The SDK reads the `oppref` click reference off the landing URL by itself, so
 * no page_viewed event is needed for attribution.
 *
 * Consent: every loader honours the fruition-visitor-consent "declined" gate,
 * keep in sync with src/components/CookieNotice.tsx. When the visitor declined,
 * `window.oaiq` never exists and every measure call below is a no-op.
 */

export const OAIQ_PIXEL_ID = "RNJ1b2hooXBRHiYSWb3K6h"
const OAIQ_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js"

export type OpenAiConversion = "appointment_scheduled" | "lead_created"

/** Stub + async SDK + init. Stubbing the queue first means no early call drops. */
const BASE = `!(function(o,a,i,q){if(o.oaiq)return;var n=o.oaiq=function(){n.queue.push(arguments)};n.queue=[];var s=a.createElement(i);s.async=!0;s.src=q;var e=a.getElementsByTagName(i)[0];e.parentNode.insertBefore(s,e)}(window,document,"script","${OAIQ_SDK_URL}"));
oaiq("init", { pixelId: "${OAIQ_PIXEL_ID}" });`

/** Root layout loader, run from the deferred analytics bootstrap in layout.tsx. */
export const OAIQ_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
${BASE}
})();`

/**
 * Head snippet for the ad landing pages, which bypass the root layout and have
 * no React. Loads the pixel behind the consent gate (not deferred: these pages
 * exist to convert ad clicks) and sends `appointment_scheduled` for a Calendly
 * booking. Their lead form script calls `window.fruitionOpenAiLead()` for
 * `lead_created` once the lead is accepted.
 */
export const OAIQ_LANDING_HEAD = `<script>(function(){
function m(ev){try{if(typeof window.oaiq==="function")window.oaiq("measure",ev,{type:"customer_action"});}catch(e){}}
window.fruitionOpenAiLead=function(){m("lead_created");};
window.addEventListener("message",function(e){if(e.origin!=="https://calendly.com")return;if(!e.data||e.data.event!=="calendly.event_scheduled")return;m("appointment_scheduled");});
try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}
${BASE}
})();</script>`

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

/** Sends one OpenAI conversion. No-op when the pixel is absent (consent declined, SSR). */
export function trackOpenAiConversion(event: OpenAiConversion): void {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return
  try {
    window.oaiq("measure", event, { type: "customer_action" })
  } catch {
    // Analytics must never break a form or a booking.
  }
}
