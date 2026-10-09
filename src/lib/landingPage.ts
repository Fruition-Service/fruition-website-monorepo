import type { LeadRegion } from "@/lib/leadNotify"
import { ogCardUrl } from "@/lib/metadata"
import { extractProof, mergeQuotes, renderProof, type ProofQuote } from "@/lib/landingPageProof"
import { getCaseStudies } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { REGION_BOOKING } from "@/lib/regionBooking"

/**
 * Serving for the Google Ads landing pages under /au, /uk and /us.
 *
 * Those pages are self-contained HTML documents returned from route handlers,
 * so they never pass through `src/app/layout.tsx` and got none of its tags. Until
 * 2026-10-07 that meant no GTM at all on the very pages the ads pointed at: no
 * GA4 page views, no Google Ads tag, and no conversion of any kind. Most of them
 * also shipped with a lead form posting to `#` (submissions silently lost) and a
 * "Calendly embed goes here" placeholder box.
 *
 * `landingPageResponse` fixes all three at serve time, so the page documents
 * stay as authored:
 *
 * - injects the same GTM-PF6XWTL6 container the rest of the site loads;
 * - replaces the `.calendly-box` placeholder with the region's booking calendar
 *   (GTM's Calendly listener then records the booking conversion);
 * - wires any form still posting to `#` to /api/leads, and pushes the same
 *   `generate_lead` dataLayer event as `trackLead()` once the lead is accepted;
 * - adds Open Graph / Twitter tags (built from the page's own title and
 *   description) so a shared link shows a proper preview card;
 * - re-orders the page (`withLandingPageLayout`): hero and form, then the
 *   Client proof band (the main site's testimonial section, see
 *   landingPageProof.ts) in place of the page's own logo strip and quotes, the
 *   rest of the page, and the Calendly booking band last, before the footer.
 *
 * Pages that already post to /api/leads keep their own handler; they push
 * `generate_lead` themselves.
 */

const GTM_ID = "GTM-PF6XWTL6"

const GTM_HEAD = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>`

const GTM_BODY = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

const CALENDLY_PLACEHOLDER = /<div class="calendly-box">[\s\S]*?<\/div>/

function calendlyEmbed(url: string): string {
  return `<style>.lp-calendly{min-width:300px;height:680px;border-radius:14px;overflow:hidden;background:#fff}</style>
<div class="calendly-inline-widget lp-calendly" data-url="${url}?hide_gdpr_banner=1"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>`
}

/**
 * Posts every `action="#"` form to /api/leads. Field names vary by page, so
 * everything other than the identity fields travels in `fields`, with phone under
 * "Phone" — the key the monday sink reads for its phone column.
 */
function leadFormScript(source: string): string {
  return `<script>
(function(){
  var SOURCE=${JSON.stringify(source)};
  var forms=document.querySelectorAll('form');
  forms.forEach(function(f){
    if((f.getAttribute('action')||'')!=='#')return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(f.reportValidity&&!f.reportValidity())return;
      var btn=f.querySelector('button[type=submit],button:not([type])');
      var original=btn?btn.textContent:'';
      var data={};
      new FormData(f).forEach(function(v,k){data[k]=String(v).trim();});
      var fields={};
      Object.keys(data).forEach(function(k){
        if(['name','email','company','website'].indexOf(k)>-1||!data[k])return;
        fields[k==='phone'?'Phone':k]=data[k];
      });
      var payload={
        name:data.name||(data.email||'').split('@')[0]||'AdWords lead',
        email:data.email||'',
        company:data.company||'',
        website:data.website||'',
        source:SOURCE,
        fields:fields
      };
      if(btn){btn.disabled=true;btn.textContent='Sending\\u2026';}
      fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json();})
        .then(function(j){
          if(!j.ok)throw new Error(j.error||'failed');
          try{(window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',form_source:SOURCE,page_path:location.pathname});}catch(_){}
          f.innerHTML='<div style="text-align:center;padding:18px 0"><div style="font-size:34px;line-height:1">\\u2713</div><h3 style="margin:10px 0 6px;font-size:19px">Request received</h3><p style="font-size:14px;opacity:.75;line-height:1.5">Thanks, a consultant will be in touch within one business day.</p></div>';
        })
        .catch(function(){
          if(btn){btn.disabled=false;btn.textContent=original;}
          alert('Sorry, something went wrong sending your request. Please email hello@fruitionservices.io instead.');
        });
    });
  });
})();
</script>`
}

const REGION_LABEL: Record<LeadRegion, string> = {
  APAC: "Australia",
  SEA: "Singapore",
  IND: "India",
  NA: "US",
  UK: "UK",
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

/** Social preview tags for pages that were authored without any. */
function socialTags(html: string, region: LeadRegion): string {
  const decode = (v: string) =>
    v.replace(/&amp;/g, "&").replace(/&mdash;/g, "\u2014").replace(/&ndash;/g, "\u2013").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "")
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "")
  if (!title) return ""
  const image = ogCardUrl(title, "", `monday.com Partner · ${REGION_LABEL[region]}`)
  const tags = [
    ["property", "og:type", "website"],
    ["property", "og:site_name", "Fruition"],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:image", image],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
    ["name", "twitter:image", image],
  ]
  return tags
    .filter(([, , v]) => v)
    .map(([attr, key, v]) => `<meta ${attr}="${key}" content="${escapeAttr(v)}">`)
    .join("\n")
}

/**
 * Index just past the element that opens at `start`, counting nested tags of
 * the same name. -1 if it never closes.
 */
function elementEnd(html: string, start: number, tag: string): number {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, "gi")
  re.lastIndex = start
  let depth = 0
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[0].startsWith("</") ? -1 : 1
    if (depth === 0) return m.index + m[0].length
  }
  return -1
}

/** Removes the first element matched by `open`; returns the html and where it stood. */
function cut(html: string, open: RegExp, tag: string): { html: string; at: number; removed: string } {
  const m = open.exec(html)
  if (!m) return { html, at: -1, removed: "" }
  const end = elementEnd(html, m.index, tag)
  if (end < 0) return { html, at: -1, removed: "" }
  return { html: html.slice(0, m.index) + html.slice(end), at: m.index, removed: html.slice(m.index, end) }
}

/**
 * Section order for every landing page template: hero (with the lead form),
 * Client proof quotes + client logos, the page's own sections, then the Calendly
 * band last. Pure, exported for tests.
 */
export function withLandingPageLayout(html: string, sharedQuotes: ProofQuote[] = []): string {
  if (html.includes('class="lpp"')) return html
  const proof = extractProof(html)

  // 1. The logo strip right under the hero becomes the proof band.
  let step = cut(html, /<div class="clients">/, "div")
  if (step.at < 0) step = cut(html, /<div class="trust">/, "div")
  let out = step.html
  let anchor = step.at

  // 2. The page's own "Client proof" section is folded into it (its rating tiles are dropped).
  const proofSection = /<section\b[^>]*>(?:(?!<section\b)[\s\S])*?<p class="k">Client proof<\/p>/.exec(out)
  if (proofSection) {
    const end = elementEnd(out, proofSection.index, "section")
    if (end > 0) {
      out = out.slice(0, proofSection.index) + out.slice(end)
      if (proofSection.index < anchor) anchor -= end - proofSection.index
    }
  }

  const band = renderProof({ ...proof, quotes: mergeQuotes(proof.quotes, sharedQuotes) })
  if (anchor < 0) {
    // No logo strip: put the band straight after the hero.
    const hero = /<(section|header) class="hero"/.exec(out)
    anchor = hero ? elementEnd(out, hero.index, hero[1]) : -1
  }
  if (anchor >= 0) out = out.slice(0, anchor) + band + out.slice(anchor)

  // 3. The booking band moves to the end, just before the footer.
  const booking = cut(out, /<section class="final" id="book">/, "section")
  if (booking.removed) {
    const footer = booking.html.search(/<footer\b/)
    out =
      footer >= 0
        ? `${booking.html.slice(0, footer)}${booking.removed}\n\n${booking.html.slice(footer)}`
        : booking.html.replace(/<\/body>/i, `${booking.removed}\n</body>`)
  }
  return out
}

/** Pure transform, exported for tests. */
export function withLandingPageTracking(
  html: string,
  { source, region }: { source: string; region: LeadRegion },
): string {
  let out = html
  out = out.replace(/<head([^>]*)>/i, (m) => `${m}\n${GTM_HEAD}`)
  if (!/property="og:image"/i.test(out)) {
    const tags = socialTags(out, region)
    if (tags) out = out.replace(/<\/head>/i, `${tags}\n</head>`)
  }
  out = out.replace(/<body([^>]*)>/i, (m) => `${m}\n${GTM_BODY}`)
  out = out.replace(CALENDLY_PLACEHOLDER, calendlyEmbed(REGION_BOOKING[region].calendlyUrl))
  if (!out.includes("/api/leads")) {
    out = out.replace(/<\/body>/i, `${leadFormScript(source)}\n</body>`)
  }
  return out
}

/**
 * The client quotes the regional pages show (caseStudy docs with a quote),
 * cached per Worker isolate for 10 minutes. A Sanity failure only drops them:
 * the page still renders with its own quotes.
 */
let sharedQuotesCache: { at: number; quotes: ProofQuote[] } | null = null
const SHARED_QUOTES_TTL = 10 * 60 * 1000

async function sharedQuotes(): Promise<ProofQuote[]> {
  if (sharedQuotesCache && Date.now() - sharedQuotesCache.at < SHARED_QUOTES_TTL) return sharedQuotesCache.quotes
  try {
    const docs: {
      quote?: string
      clientName?: string
      clientRole?: string
      clientCompany?: string
      profilePhoto?: { asset?: { _ref?: string } }
    }[] = (await getCaseStudies()) ?? []
    const quotes = docs
      .filter((d) => d.quote?.trim())
      .map((d) => ({
        quote: d.quote!.trim(),
        authorName: d.clientName,
        authorRole: d.clientRole,
        company: d.clientCompany,
        photoUrl: d.profilePhoto?.asset?._ref
          ? urlFor(d.profilePhoto).width(92).height(92).fit("crop").auto("format").url()
          : undefined,
      }))
    sharedQuotesCache = { at: Date.now(), quotes }
    return quotes
  } catch (err) {
    console.error("[landing-page] shared quotes unavailable", err)
    return sharedQuotesCache?.quotes ?? []
  }
}

export async function landingPageResponse(
  html: string,
  opts: { source: string; region: LeadRegion },
): Promise<Response> {
  const laidOut = withLandingPageLayout(html, await sharedQuotes())
  return new Response(withLandingPageTracking(laidOut, opts), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Paid-traffic page: must stay out of organic search.
      "X-Robots-Tag": "noindex",
    },
  })
}
