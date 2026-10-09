/**
 * The Client proof band for the Google Ads landing pages under /au, /uk
 * and /us.
 *
 * It is the main site's Client proof treatment rebuilt as plain HTML, because
 * those pages are raw documents that never load React or globals.css:
 *
 * - quotes: `TestimonialsRoll` (two columns rolling in opposite directions on
 *   desktop, a swipe rail below 1024px), fed with the page's own industry quotes
 *   first and then the same Sanity case studies the regional pages show;
 * - logos: `ClientLogoWall` (mist tiles plus the "900+ more" counter, a
 *   self-scrolling band on phones), without the catalog links, so the page
 *   keeps no exits other than the form, the phone number and the calendar.
 *
 * Styles are scoped under `.lpp` with their own custom properties copied from
 * globals.css, so the band renders the same inside every landing page template,
 * whatever stylesheet the page itself carries.
 */

export interface ProofQuote {
  quote: string
  authorName?: string
  authorRole?: string
  company?: string
  photoUrl?: string
}

export interface ProofLogo {
  src: string
  alt: string
}

export interface ProofContent {
  heading: string
  logosLabel: string
  quotes: ProofQuote[]
  logos: ProofLogo[]
  /** Title and description under the logo wall (the regional pages' "Our clients" copy). */
  logosHeading?: string
  logosLead?: string
}

const SANITY = "https://cdn.sanity.io/images/bt6nb58h/production/"
const LOGO_PARAMS = "?w=260&fit=max&auto=format"

/**
 * Approved client logos (Sanity assets already on the site's logo walls) for
 * the names some pages still list as text chips. Acciona, Sekisui House and
 * DCOH have no approved asset, so they are dropped and the wall is topped up
 * from `CHIP_FALLBACKS`.
 */
const CHIP_LOGOS: Record<string, string> = {
  "Honor Credit Union": "d2e6dc4334e1606e67425bc053a37448256f4064-245x65.png",
  "Craters & Freighters": "0d3d62e77fc7cf22ef21c98c635f556b88d4a248-598x139.png",
  "Housing Authority of San Antonio": "1382e1e8f4f564a9edc0b735d4f5be714dec4631-493x267.png",
  "Stout Risius Ross": "eea7f2e6894c62b89b2826a9e7b8c3ffdb4867b6-899x323.png",
  "Kitchen Tune-Up": "15611f5d8faef6072dbba71919d2e6b529afda96-900x205.png",
  "Windfall Bio": "083ae3ffd4c52231b16644e20579e67af884326e-3675x500.png",
  Bielby: "47f46119cde1e03ae657ef7e33b12dd5259de72f-167x56.png",
  Qanstruct: "759b67ae90b27b98db708a19aa0d7f97b6a80e59-900x701.png",
  "Evolve Construction": "09ca61a758adbb476278fde27d53182a18ed95f1-269x114.png",
}

/** Construction clients with approved logos, to fill a wall back up to six. */
const CHIP_FALLBACKS: ProofLogo[] = [
  { alt: "North Australian Contracting", src: "f2217ec4d8bf40fe9d4f6678c5f419a83a0f7f38-822x660.png" },
  { alt: "Roofclad Systems", src: "f7e4751bdc4d00994e1cfaf06bfb8051f39a5429-899x435.png" },
  { alt: "High Voltage Distribution Contracting", src: "79fd8ce19259142c0e0df9dc996771aed44629f9-900x374.png" },
].map((l) => ({ alt: l.alt, src: `${SANITY}${l.src}${LOGO_PARAMS}` }))

function chipLogos(html: string): ProofLogo[] {
  const names = [...html.matchAll(/<span class="chip">([^<]+)<\/span>/g)].map((m) => text(m[1]))
  if (!names.length) return []
  const logos = names
    .filter((n) => CHIP_LOGOS[n])
    .map((n) => ({ alt: n, src: `${SANITY}${CHIP_LOGOS[n]}${LOGO_PARAMS}` }))
  for (const extra of CHIP_FALLBACKS) {
    if (logos.length >= names.length) break
    if (!logos.some((l) => l.alt === extra.alt)) logos.push(extra)
  }
  return logos
}

const DEFAULT_HEADING = "What clients say about Fruition's monday.com consultants"
const INTRO = "Operations and IT leaders on what changed after we mapped the process first."
const COUNTER = "900+ more"
const LOGOS_HEADING = "Trusted by teams across 900+ implementations."
/** Dot colours cycle so adjacent cards never repeat (TestimonialsRoll). */
const DOTS = ["#00ca72", "#579bfc", "#8015e8", "#fdab3d"]
const MAX_QUOTES = 10

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

/** Page markup is already HTML-escaped; bring it back to text before re-escaping. */
function text(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function initials(name?: string): string {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

/** Pulls the proof content a landing page was authored with. */
export function extractProof(html: string): ProofContent {
  const quotes: ProofQuote[] = []
  for (const m of html.matchAll(/<div class="quote"><p>([\s\S]*?)<\/p><div class="who">([\s\S]*?)<\/div><\/div>/g)) {
    const quote = text(m[1]).replace(/^["“]|["”]$/g, "")
    const who = m[2]
    const authorName = text(who.match(/<b>([\s\S]*?)<\/b>/)?.[1] ?? "")
    const tail = text(who.replace(/<b>[\s\S]*?<\/b>/, "")).replace(/^[·\s]+/, "")
    const cut = tail.lastIndexOf(", ")
    quotes.push({
      quote,
      authorName,
      authorRole: cut > 0 ? tail.slice(0, cut) : tail,
      company: cut > 0 ? tail.slice(cut + 2) : undefined,
    })
  }

  const strip =
    html.match(/<div class="(?:logo-row|trust-logos)">([\s\S]*?)<\/div>/)?.[1] ?? ""
  const imgLogos: ProofLogo[] = [...strip.matchAll(/<img src="([^"]+)" alt="([^"]*)"/g)].map((m) => ({
    src: m[1],
    alt: text(m[2]),
  }))
  const logos = imgLogos.length ? imgLogos : chipLogos(html)

  const logosLabel = text(
    html.match(/<div class="clients">\s*<div class="wrap">\s*<p>([\s\S]*?)<\/p>/)?.[1] ??
      html.match(/<div class="trust-txt">([\s\S]*?)<\/div>/)?.[1] ??
      "Teams running on systems Fruition built",
  )

  const proofSection = html.match(/<p class="k">Client proof<\/p>\s*<h2 class="sec">([\s\S]*?)<\/h2>/)?.[1]

  return {
    heading: proofSection ? text(proofSection) : DEFAULT_HEADING,
    logosLabel,
    quotes,
    logos,
  }
}

/** Page quotes first, then the shared set, one card per person. */
export function mergeQuotes(own: ProofQuote[], shared: ProofQuote[]): ProofQuote[] {
  const seen = new Set<string>()
  const out: ProofQuote[] = []
  for (const q of [...own, ...shared]) {
    const key = (q.authorName || q.quote).trim().toLowerCase()
    if (!q.quote?.trim() || seen.has(key)) continue
    seen.add(key)
    out.push(q)
  }
  return out.slice(0, MAX_QUOTES)
}

function card(q: ProofQuote, i: number, duplicate = false): string {
  const avatar = q.photoUrl
    ? `<img class="lpp-avatar" src="${esc(q.photoUrl)}" alt="" width="46" height="46" loading="lazy">`
    : `<span class="lpp-avatar lpp-initials">${esc(initials(q.authorName))}</span>`
  return `<figure class="lpp-card"${duplicate ? ' aria-hidden="true"' : ""}>${
    q.company
      ? `<div class="lpp-co"><span class="lpp-dot" style="background:${DOTS[i % DOTS.length]}"></span><span>${esc(q.company)}</span></div>`
      : ""
  }<blockquote>${esc(q.quote)}</blockquote><figcaption>${avatar}<span class="lpp-who"><b>${esc(
    q.authorName ?? "",
  )}</b><span>${esc(q.authorRole ?? "")}</span></span></figcaption></figure>`
}

/** Band tiles load eagerly: lazy images inside a sliding track can stay blank. */
function logoTile(logo: ProofLogo, clone = false, eager = false): string {
  return `<div class="lpp-tile"><img src="${esc(logo.src)}" alt="${clone ? "" : esc(logo.alt)}"${eager ? "" : ' loading="lazy"'}></div>`
}

export function renderProof(content: ProofContent): string {
  const quotes = content.quotes
  const colA = quotes.filter((_, i) => i % 2 === 0)
  const colB = quotes.filter((_, i) => i % 2 === 1)
  const column = (items: ProofQuote[], offset: number, reverse: boolean) =>
    `<div class="lpp-col${reverse ? " lpp-col-b" : ""}">${items.map((q, i) => card(q, i * 2 + offset)).join("")}${items
      .map((q, i) => card(q, i * 2 + offset, true))
      .join("")}</div>`

  const logos = content.logos
  const run = (clone: boolean) =>
    `<div class="lpp-band-run"${clone ? ' aria-hidden="true"' : ""}>${logos
      .map((l) => logoTile(l, clone, true))
      .join("")}<div class="lpp-counter">${COUNTER}</div></div>`

  const heading = content.logosHeading ?? LOGOS_HEADING
  const logoWall = logos.length
    ? `<div class="lpp-wrap lpp-logos">
<p class="lpp-eyebrow lpp-center">${esc(content.logosLabel)}</p>
<div class="lpp-band"><div class="lpp-band-track">${run(false)}${run(true)}</div></div>
<div class="lpp-grid" style="--lpp-n:${Math.min(logos.length + 1, 7)}">${logos.map((l) => logoTile(l)).join("")}<div class="lpp-counter">${COUNTER}</div></div>
<h2 class="lpp-h2 lpp-center lpp-logos-h2">${esc(heading)}</h2>
${content.logosLead ? `<p class="lpp-lead lpp-center lpp-logos-lead">${esc(content.logosLead)}</p>` : ""}
<span class="lpp-rule"></span>
</div>`
    : ""

  return `<style>${LP_PROOF_CSS}</style>
<section class="lpp" id="reviews">
${logoWall}
<div class="lpp-wrap lpp-roll">
<div class="lpp-intro">
<p class="lpp-eyebrow">Client proof</p>
<h2 class="lpp-h2">${esc(content.heading)}</h2>
<p class="lpp-lead">${INTRO}</p>
<a class="lpp-btn" href="#lead">Book My Free Consultation →</a>
</div>
${
  quotes.length
    ? `<div class="lpp-cols"><div class="lpp-track">${column(colA, 0, false)}${column(colB, 1, true)}</div></div>
<div class="lpp-rail">${quotes.slice(0, 6).map((q, i) => card(q, i)).join("")}</div>`
    : ""
}
</div>
</section>
`
}

/**
 * Values copied from globals.css (surface-mist, border-lilac, text-body,
 * text-muted-fg, purple-primary, radius-card, shadow-whisper) so the band does
 * not depend on whichever :root the host page defines. Breakpoints are the
 * site's two: 768px and 1024px.
 */
export const LP_PROOF_CSS = `
.lpp{--lpp-brand:#8015e8;--lpp-fg:#171717;--lpp-body:#242323;--lpp-muted:#686b82;--lpp-mist:#f9f8fc;--lpp-mist-hover:#f4f1fb;--lpp-lilac:#ece7fb;--lpp-lilac-quiet:#e4dcf7;--lpp-tint:#f7f5ff;
background:#fff;padding:64px 0;font-family:Poppins,system-ui,sans-serif;color:var(--lpp-body)}
.lpp *{box-sizing:border-box}
.lpp h2,.lpp p,.lpp blockquote,.lpp figure{text-align:left;max-width:none}
.lpp .lpp-center{text-align:center}
.lpp-wrap{max-width:1348px;margin:0 auto;padding:0 20px}
.lpp-eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lpp-brand);margin:0}
.lpp-center{text-align:center}
.lpp-h2{font-size:28px;font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--lpp-fg);margin:16px 0 0;text-wrap:pretty}
.lpp-lead{font-size:16px;line-height:1.55;color:var(--lpp-muted);margin:18px 0 0;text-wrap:pretty}
.lpp-roll{display:grid;grid-template-columns:1fr;gap:40px;align-items:start}
.lpp-btn{display:inline-flex;align-items:center;justify-content:center;margin-top:28px;min-height:50px;padding:12px 26px;border-radius:9999px;background:var(--lpp-brand);color:#fff;font-size:15px;font-weight:600;text-decoration:none;box-shadow:0 10px 24px -10px rgba(128,21,232,.55)}
.lpp-btn:hover{background:#6a0fc4}
.lpp-card{margin:0 0 20px;border:1px solid var(--lpp-lilac);border-radius:24px;background:#fff;padding:26px 28px;box-shadow:0 4px 24px rgba(0,0,0,.03)}
.lpp-co{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--lpp-muted)}
.lpp-dot{width:7px;height:7px;border-radius:9999px;flex:none}
.lpp-card blockquote{margin:16px 0 0;font-size:16.5px;line-height:1.55;color:var(--lpp-body);text-wrap:pretty}
.lpp-card figcaption{display:flex;align-items:center;gap:14px;margin-top:22px;padding-top:18px;border-top:1px solid #f1edfa}
.lpp-avatar{width:46px;height:46px;flex:none;border-radius:9999px;border:1px solid var(--lpp-lilac);object-fit:cover}
.lpp-initials{display:flex;align-items:center;justify-content:center;background:var(--lpp-tint);color:var(--lpp-brand);font-size:14px;font-weight:600}
.lpp-who{display:flex;flex-direction:column;min-width:0}
.lpp-who b{font-size:14.5px;font-weight:600;color:var(--lpp-body)}
.lpp-who span{font-size:13px;color:var(--lpp-muted)}
.lpp-cols{display:none}
.lpp-rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -20px;padding:0 20px}
.lpp-rail::-webkit-scrollbar{display:none}
.lpp-rail>.lpp-card{flex:0 0 86%;scroll-snap-align:start;margin:0}
.lpp-logos{margin-bottom:56px;text-align:center}
.lpp-rule{display:block;width:228px;height:1px;margin:48px auto 0;background:var(--lpp-lilac-quiet)}
.lpp-logos .lpp-eyebrow{margin-bottom:24px}
.lpp .lpp-logos-h2{margin:40px auto 0;max-width:760px}
.lpp .lpp-logos-lead{margin:16px auto 0;max-width:600px}
.lpp-tile{display:flex;align-items:center;justify-content:center;height:92px;border-radius:12px;background:var(--lpp-mist);padding:14px 16px;transition:background-color .2s}
.lpp-tile:hover{background:var(--lpp-mist-hover)}
.lpp-tile img{max-height:100%;max-width:100%;width:auto;object-fit:contain}
.lpp-counter{display:flex;align-items:center;justify-content:center;height:92px;padding:0 16px;font-size:20px;font-weight:600;line-height:1;letter-spacing:-.02em;color:var(--lpp-brand)}
.lpp-band{overflow-x:auto;scrollbar-width:none;mask-image:linear-gradient(to right,transparent,#000 28px,#000 calc(100% - 28px),transparent);-webkit-mask-image:linear-gradient(to right,transparent,#000 28px,#000 calc(100% - 28px),transparent)}
.lpp-band::-webkit-scrollbar{display:none}
.lpp-band-track{display:flex;width:max-content;animation:lppSlide 38s linear infinite}
.lpp-band-run{display:flex;gap:12px;padding-right:12px}
.lpp-band-run>*{width:136px;flex:none}
.lpp-band:hover .lpp-band-track{animation-play-state:paused}
.lpp-grid{display:none}
@keyframes lppSlide{to{transform:translateX(-50%)}}
@keyframes lppRoll{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@media(min-width:768px){
.lpp{padding:80px 0}
.lpp-wrap{padding:0 32px}
.lpp-h2{font-size:36px}
.lpp-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;overflow:visible;margin:0;padding:0}
.lpp-rail>.lpp-card{margin:0}
.lpp-band{display:none}
.lpp-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
}
@media(min-width:1024px){
.lpp{padding:100px 0 104px}
.lpp-roll{grid-template-columns:400px 1fr;gap:80px}
.lpp-h2{font-size:44px}
.lpp-lead{font-size:17px}
.lpp-rail{display:none}
.lpp-cols{display:block;position:relative;height:660px;overflow:hidden;mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%)}
.lpp-track{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}
.lpp-col{animation:lppRoll 74s linear infinite}
.lpp-col-b{margin-top:-60px;animation-direction:reverse}
.lpp-track:hover>.lpp-col{animation-play-state:paused}
.lpp-grid{grid-template-columns:repeat(var(--lpp-n,5),minmax(0,1fr));gap:16px}
.lpp-tile,.lpp-counter{height:104px}
.lpp-tile{padding:20px 24px}
.lpp-counter{font-size:22px}
}
@media(prefers-reduced-motion:reduce){.lpp-col,.lpp-band-track{animation:none!important}}
`
