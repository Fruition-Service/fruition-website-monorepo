import { createCurrencyKit, currency, type CurrencyCode } from "./kit"
import { mountCurrency } from "./dom"
import type { LeadRegion } from "@/lib/leadNotify"

/*
 * Display currency for the Google Ads landing pages. They are raw HTML route
 * handlers that bypass the root layout, so React's <CurrencyRuntime/> never
 * reaches them; they get the same kit and DOM converter as an inline script,
 * defaulting to their own market's currency unless the visitor picked one
 * on the site (the choice is shared through localStorage on the same origin).
 */

/** Each ad page's market currency (opts.region of landingPageResponse). */
export const REGION_CURRENCY: Record<LeadRegion, CurrencyCode> = {
  APAC: "AUD",
  UK: "GBP",
  NA: "USD",
  SEA: "SGD",
  IND: "INR",
}

/** True when the page shows at least one explicit price worth converting. */
export function pageHasPrice(html: string): boolean {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<head[\s\S]*?<\/head>/i, "")
  const text = body.replace(/<[^>]+>/g, " ")
  return currency.hasPrice(text)
}

/** The footer control (Claude Design "Footer currency switcher", variant 1b): a native select. */
export function currencySelectHtml(pageDefault: CurrencyCode): string {
  const options = currency.CODES.map(
    (c) => `<option value="${c}"${c === pageDefault ? " selected" : ""}>${c} · ${currency.CURRENCIES[c].prefix.trim()}</option>`,
  ).join("")
  const globe = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  const chevron = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>`
  return `<div class="lp-cur"><label for="lp-currency">${globe}Currency</label><div class="lp-cur-box"><select id="lp-currency" data-currency-select>${options}</select>${chevron}</div></div>`
}

/** Copy line split at its " · " separators, so it only ever breaks between parts (see .lp-co). */
export function copySegments(text: string): string[] {
  const parts = text.split(/\s+·\s+/).map((p) => p.trim()).filter(Boolean)
  if (parts.length < 4) {
    // A long street address splits before the city: "423 Linen Hall, 162-168 Regent Street" · "London W1B 5TE".
    const i = parts.findIndex((p) => p.replace(/<[^>]+>/g, "").length > 34 && p.includes(", "))
    if (i >= 0) {
      const cut = parts[i].lastIndexOf(", ")
      parts.splice(i, 1, parts[i].slice(0, cut), parts[i].slice(cut + 2))
    }
  }
  return parts
}

/**
 * Priced ad pages: rebuild the footer as two rows (logo | legal + socials, then
 * company line | currency), Claude Design "Footer currency switcher" 2b. Pages
 * whose footer does not have the usual shape keep it and get the control appended.
 */
export function withCurrencyFooter(html: string, code: CurrencyCode): string {
  const re = /<footer>\s*<div class="wrap">\s*(<img[^>]*>)\s*<div>([\s\S]*?)<\/div>\s*<div>([\s\S]*?)<\/div>\s*(<div class="lp-soc">[\s\S]*?<\/div>)?\s*<\/div>\s*<\/footer>/i
  const m = html.match(re)
  if (!m) {
    return html.replace(/(<footer[^>]*>\s*<div class="wrap">[\s\S]*?)(<\/div>\s*<\/footer>)/i, (_, open, close) => `${open}${currencySelectHtml(code)}\n${close}`)
  }
  const [, logo, company, links, social = ""] = m
  const parts = copySegments(company)
  // One line on desktop; one part per line on tablet and phone (the dots hide there).
  const co = parts
    .map((p, i) => `<span class="lp-ci">${i > 0 ? '<span class="d" aria-hidden="true">·</span>' : ""}${p}</span>`)
    .join("")
  const legal = links.trim().replace(/\s*·\s*/g, '<span aria-hidden="true">·</span>')
  const footer = `<footer class="lp-fcur">
<div class="wrap">
${logo}
<div class="lp-fr"><nav class="lp-legal" aria-label="Legal">${legal}</nav>${social}</div>
<p class="lp-co">${co}</p>
${currencySelectHtml(code)}
</div>
</footer>`
  return html.replace(m[0], footer)
}

/** The inline runtime: kit + converter, started with the page's market currency. */
export function currencyScript(pageDefault: CurrencyCode): string {
  return `<script>(function(){try{
var kit=(${String(createCurrencyKit)})();
var c=(${String(mountCurrency)})(window,kit,{pageDefault:${JSON.stringify(pageDefault)}});
function sync(){var s=c.get();var els=document.querySelectorAll("[data-currency-select]");for(var i=0;i<els.length;i++){if(s)els[i].value=s.code;}}
document.addEventListener("change",function(e){var t=e.target;if(t&&t.hasAttribute&&t.hasAttribute("data-currency-select"))c.set(t.value);});
c.subscribe(sync);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync);else sync();
}catch(e){}})();</script>`
}
