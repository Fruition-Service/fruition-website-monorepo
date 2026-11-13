/**
 * Site design system for the Google Ads landing pages under /au, /uk, /us and /sea.
 *
 * Those pages are self-contained HTML documents served from route handlers (see
 * `landingPage.ts`), so they never load `globals.css`. Until 2026-10-07 each one
 * carried its own stylesheet from the agency brief: a muted #5B2D8F purple, square
 * 10px buttons, and on two of them Fraunces + Inter Tight. They read as a different
 * company from fruitionservices.io.
 *
 * Every page now takes one of the two stylesheets below. The page documents keep
 * their copy and structure; only the presentation is shared.
 *
 * - `LP_CONVERSION_CSS`: the form-in-hero template (11 AU industry pages and the
 *   AU/UK/US partner pages).
 * - `LP_CONSULTING_CSS`: the AU consulting template (monday consulting + AI
 *   consulting).
 *
 * `:root` is the only place colours are spelled out. It mirrors the tokens in
 * `src/app/globals.css` (a standalone document cannot read them), so when a token
 * changes there, change it here too. The legacy variable names (`--purple`,
 * `--tint`, `--p7`…) are kept because the page markup references them in inline
 * styles; they now resolve to site tokens.
 */

/** Poppins + JetBrains Mono, the only two families on the site. */
export const LP_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">`

const TOKENS = `
:root{
--brand:#8015e8;--brand-dark:#550e9b;--brand-press:#6a11c2;--brand-soft:#f3ebfd;--brand-tint:#e9d7fd;--brand-on-dark:#c79cf6;--brand-mid:#b98bf0;
--fg:#0f0d14;--muted:rgba(15,13,20,.68);--faint:rgba(15,13,20,.55);--label:rgba(15,13,20,.55);
--ui:rgba(15,13,20,.2);--ui-strong:rgba(15,13,20,.32);--lilac:rgba(15,13,20,.12);--lilac-strong:rgba(15,13,20,.24);
--tint-bg:#f3f2f6;--mist:#f3f2f6;--surface:#ffffff;
--navy:#10003a;--navy-2:#1c0a52;--terminal:#15131c;
--cta:var(--brand);--cta-light:var(--brand);--cta-dark:var(--brand-press);--cta-deep:var(--navy);--cta-pale:var(--brand-tint);
--amber:#fdab3d;--green:#1f9d55;
--r1:8px;--r2:12px;--r3:16px;--r4:24px;--pill:100px;
--mono:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace;
--sans:'Poppins',system-ui,sans-serif;
--shadow-whisper:none;
--shadow-lift:0 16px 40px -12px rgba(15,13,20,.18);
--shadow-float:0 24px 60px -24px rgba(16,0,58,.22);
--shadow-form:0 24px 60px -24px rgba(16,0,58,.22);
--cta-glow:none;
}`

/** Reset, page frame and the pieces both templates share. */
const BASE = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--fg);background:var(--surface);font-size:16px;line-height:1.55;letter-spacing:-.005em;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{max-width:100%}
a{color:inherit}
.wrap{max-width:1344px;margin:0 auto;padding:0 48px}
section{padding:120px 0}
::selection{background:var(--brand-soft);color:var(--brand-dark)}
:focus-visible{outline:2px solid var(--brand);outline-offset:3px}
input,select,textarea,button{font-family:inherit}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
/* Team photos (consultants band, shared by both templates).
   Injected by landingPage.ts on any ad page without a team section of its own. */
.lp-team{padding:120px 0;background:var(--surface)}
.lp-team.alt{background:var(--tint-bg)}
.lp-team:not(.alt) .lp-team-card{background:var(--tint-bg)}
.lp-team:not(.alt) .lp-team-k{background:var(--tint-bg)}
.lp-team .wrap{display:grid;grid-template-columns:3fr 2fr;column-gap:48px;align-items:end}
.lp-team .wrap>*{grid-column:1/-1}
.lp-team-k{grid-column:1!important;grid-row:1;justify-self:start;display:inline-flex;align-items:center;gap:10px;height:32px;padding:0 14px 0 10px;border-radius:var(--pill);background:var(--surface);border:1px solid var(--lilac);font:400 12px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em;color:var(--fg);margin-bottom:24px}
.lp-team-k::before{content:"";width:16px;height:8px;border-radius:4px;background:var(--brand);flex:none}
.lp-team h2{grid-column:1!important;grid-row:2;font-size:48px;font-weight:500;line-height:1.06;letter-spacing:-.03em;color:var(--fg);margin:0 0 42px;text-wrap:balance}
.lp-team h2 em{font-style:normal;color:var(--brand)}
.lp-team-lede{grid-column:2!important;grid-row:1/3;align-self:end;font-size:18px;line-height:1.55;color:var(--muted);margin:0 0 42px}
.lp-team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp-team-card{background:var(--surface);border:1px solid var(--lilac);border-radius:var(--r3);overflow:hidden;text-align:left;transition:border-color .2s}
.lp-team-card:hover{border-color:var(--lilac-strong)}
.lp-team-card img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;object-position:center 20%}
.lp-team-card h3{font-size:20px;font-weight:500;line-height:1.25;letter-spacing:-.015em;color:var(--fg);margin:22px 24px 6px}
.lp-team-role{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted);margin:0 24px 12px}
.lp-team-card p{font-size:14px;line-height:1.6;color:var(--muted);margin:0 24px 24px}
/* Mid-page banner and closing band, added at serve time (landingPageBands.ts) */
.lp-audit-sec{padding:64px 0 120px}
.lp-audit{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:48px;background:var(--navy);color:#fff;border-radius:var(--r4);padding:88px 72px}
.lp-audit>*{position:relative;z-index:1}
.lp-audit h2{color:#fff;margin:0;text-align:left;font-size:44px;font-weight:500;line-height:1.08;letter-spacing:-.035em;max-width:720px;text-wrap:balance}
.lp-audit h2 em{font-style:normal;color:var(--brand-tint)}
.lp-audit p{text-align:left;max-width:640px;margin:16px 0 0;color:rgba(255,255,255,.72);font-size:17px}
.lp-audit::after{content:"";position:absolute;right:-48px;top:78%;width:440px;height:400px;transform:translateY(-50%) rotate(-8deg);background:url(/images/fruit-mark.svg) no-repeat center/contain;opacity:.09;pointer-events:none}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:48px;padding:0 22px;border-radius:var(--pill);font:500 13px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em;white-space:nowrap;text-decoration:none;border:1px solid var(--surface);background:var(--surface);color:var(--fg);flex:none;transition:background-color .2s,border-color .2s}
.lp-btn:hover{background:var(--brand-tint);border-color:var(--brand-tint)}
.lp-btn.ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.3)}
.lp-btn.ghost:hover{background:rgba(255,255,255,.08);border-color:#fff}
.lp-closing{background:var(--brand);color:#fff;text-align:center;padding:120px 0}
.lp-closing .lp-k{display:inline-flex;align-items:center;gap:10px;height:32px;padding:0 14px 0 10px;border-radius:var(--pill);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);font:400 12px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em}
.lp-closing .lp-k::before{content:"";width:16px;height:8px;border-radius:4px;background:#fff;flex:none}
.lp-closing h2{color:#fff;text-align:center;font-size:48px;font-weight:500;line-height:1.06;letter-spacing:-.03em;max-width:860px;margin:24px auto 0;text-wrap:balance}
.lp-closing h2 em{font-style:normal;color:var(--brand-tint)}
.lp-closing p{text-align:center;color:rgba(255,255,255,.84);font-size:18px;line-height:1.55;max-width:640px;margin:24px auto 0}
.lp-closing .lp-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:40px}
.lp-soc{display:flex;gap:6px;flex-wrap:wrap}
.lp-soc a{width:28px;height:28px;border-radius:50%;background:#fff;display:grid;place-items:center;transition:background-color .2s}
.lp-soc a:hover{background:var(--brand-tint)}
.lp-soc svg{width:13px;height:13px;fill:var(--navy)}
@media(max-width:1023px){.lp-team,.lp-closing{padding:80px 0}.lp-audit-sec{padding-bottom:80px}.lp-team .wrap{grid-template-columns:1fr}.lp-team-lede{grid-column:1!important;grid-row:auto;margin-top:-22px}.lp-team h2,.lp-closing h2{font-size:40px}.lp-team-grid{grid-template-columns:repeat(2,1fr)}.lp-audit{padding:64px 48px}.lp-audit h2{font-size:36px}}
@media(max-width:767px){.wrap{padding:0 16px}section{padding:64px 0}.lp-team,.lp-closing{padding:64px 0}.lp-audit-sec{padding-bottom:64px}.lp-team h2,.lp-closing h2{font-size:32px}.lp-team-lede,.lp-closing p{font-size:16px}.lp-team-grid{grid-template-columns:1fr}.lp-audit{flex-direction:column;align-items:flex-start;gap:28px;padding:48px 24px}.lp-audit h2{font-size:30px}.lp-audit .lp-btn,.lp-closing .lp-btn{width:100%}.lp-audit::after{width:300px;height:280px;right:-80px;top:auto;bottom:-60px;transform:rotate(-8deg)}}
`

/** The site's FAQ section (FaqAccordion), shared by both templates; landingPage.ts withFaq builds the markup. */
const FAQ = `
/* FAQ: the site's FaqAccordion. Sticky heading and "prefer a person" aside on
   the left, numbered questions with a chevron on the right. landingPage.ts
   (withFaq) builds the two columns from the page's own heading and questions. */
.lp-faq .wrap{display:grid;grid-template-columns:.8fr 1.2fr;column-gap:88px;align-items:start}
.lp-faq-head{position:sticky;top:112px}
.lp-faq-k{font:600 12px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin:0 0 16px}
.lp-faq-head h2,.lp-faq-head h2.sec{margin:0}
.lp-faq-lede{margin-top:20px;max-width:340px;font-size:16px;line-height:1.6;color:var(--muted)}
.lp-faq-ask{margin-top:36px;padding-top:28px;border-top:1px solid var(--lilac)}
.lp-faq-ask p{max-width:300px;margin:0 0 16px;font-size:15px;line-height:1.55;color:var(--muted)}
.lp-faq-ask a{display:inline-block;padding:10px 0;margin:-10px 0;font-size:15px;font-weight:600;color:var(--brand);text-decoration:none;transition:color .2s}
.lp-faq-ask a:hover{color:var(--brand-dark)}
.lp-faq-list{min-width:0;counter-reset:faq}
.lp-faq details{border-bottom:1px solid var(--lilac);counter-increment:faq}
.lp-faq summary{cursor:pointer;list-style:none;display:flex;align-items:flex-start;gap:20px;padding:24px 0;font-size:19px;font-weight:500;line-height:1.45;letter-spacing:-.01em;color:var(--fg);text-wrap:pretty;transition:color .2s}
.lp-faq summary:hover{color:var(--brand)}
.lp-faq summary::-webkit-details-marker{display:none}
.lp-faq summary::before{content:counter(faq,decimal-leading-zero);flex:none;width:24px;padding-top:6px;font:600 13px/1 var(--mono);color:var(--brand-mid)}
.lp-faq summary::after{content:"";flex:none;margin-left:auto;margin-top:5px;width:18px;height:18px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238015e8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat center/contain;transition:transform .2s}
.lp-faq details[open] summary::after{transform:rotate(180deg)}
.lp-faq details .a{padding:0 0 28px 44px;font-size:16px;line-height:1.7;color:var(--muted);text-wrap:pretty}
@media(max-width:1023px){.lp-faq .wrap{grid-template-columns:1fr;row-gap:40px}.lp-faq-head{position:static}}
@media(max-width:767px){.lp-faq summary{font-size:17px;gap:16px}.lp-faq details .a{padding-left:0}}
`

export const LP_CONVERSION_CSS = `${TOKENS}
:root{--purple:var(--brand);--deep:var(--fg);--mid:var(--brand-dark);--ink:var(--fg);--soft:var(--muted);--light:var(--faint);--tint:var(--tint-bg);--line:var(--lilac)}
${BASE}
/* Top bar: logo stays non-clickable (zero-leak orphan page), phone + book CTA */
.topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--lilac)}
.topbar .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;height:72px}
.topbar img{height:26px;width:auto;display:block}
.topbar .right{display:flex;align-items:center;gap:24px}
.topbar .phone{display:inline-flex;align-items:center;min-height:44px;font:500 13px/1 var(--mono);letter-spacing:.02em;color:var(--fg);text-decoration:none;white-space:nowrap;transition:color .2s}
.topbar .phone:hover{color:var(--brand)}
.topbar .book,.btn,.mcta .book{background:var(--brand);color:#fff;text-decoration:none;border:1px solid var(--brand);border-radius:var(--pill);cursor:pointer;font:500 13px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em;transition:background-color .2s,border-color .2s}
.topbar .book{display:inline-flex;align-items:center;height:40px;padding:0 18px;white-space:nowrap}
.topbar .book:hover,.btn:hover,.mcta .book:hover{background:var(--brand-press);border-color:var(--brand-press)}

/* Hero: badge, display heading with accent, lead, ticks; lead form on the right */
.hero{position:relative;padding:96px 0;background:var(--surface)}
.hero .wrap{display:grid;grid-template-columns:1.12fr .88fr;gap:64px;align-items:center}
.hero .wrap>*,.final .inner>*{min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:10px;min-height:32px;padding:6px 14px 6px 10px;border-radius:var(--pill);background:var(--tint-bg);border:1px solid var(--lilac);font:400 12px/1.35 var(--mono);text-transform:uppercase;letter-spacing:.02em;color:var(--fg);margin-bottom:28px}
.eyebrow::before{content:"";width:16px;height:8px;border-radius:4px;background:var(--brand);flex:none}
.eyebrow{max-width:100%}
h1{font-size:60px;font-weight:500;line-height:1.04;letter-spacing:-.035em;color:var(--fg);text-wrap:balance}
h1 em{font-style:normal;color:var(--brand)}
.hero .sub{font-size:18px;line-height:1.55;color:var(--muted);margin:28px 0 28px;max-width:560px;text-wrap:pretty}
.ticks{list-style:none;margin:0 0 32px;display:grid;gap:12px}
.ticks li{position:relative;padding-left:30px;font-size:15px;line-height:1.5;color:var(--fg)}
.ticks li::before{content:"";position:absolute;left:0;top:3px;width:18px;height:18px;border-radius:50%;background:var(--brand-soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238015e8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") no-repeat center/11px}
.badges{display:flex;gap:8px;flex-wrap:wrap}
.badge{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--fg);background:var(--surface);border:1px solid var(--lilac);border-radius:var(--pill);padding:7px 12px}

/* Lead form card */
.formcard{background:var(--surface);border:1px solid var(--lilac);border-radius:var(--r4);box-shadow:0 24px 60px -24px rgba(16,0,58,.22);padding:32px}
.formcard h2{font-size:24px;font-weight:500;line-height:1.2;letter-spacing:-.02em;color:var(--fg);margin-bottom:6px}
.formcard .fsub{font-size:14px;color:var(--muted);margin-bottom:8px}
.formcard label{display:block;font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted);margin:16px 0 8px}
.formcard input,.formcard select{width:100%;height:48px;font-size:15px;color:var(--fg);background:var(--surface);border:1px solid var(--ui);border-radius:var(--r2);padding:0 14px;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;appearance:none}
.formcard select{background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);background-position:calc(100% - 20px) 50%,calc(100% - 15px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:40px}
.formcard input:focus,.formcard select:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-soft)}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:52px;padding:0 22px;margin-top:24px;text-align:center;white-space:nowrap}
.formcard .fine{font-size:12px;color:var(--faint);margin-top:14px;text-align:center}

/* Client strip (replaced by the proof band at serve time; kept for safety) */
.clients{padding:56px 0;background:var(--surface);border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.clients p{text-align:center;font:400 12px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted);margin-bottom:24px}
.logo-row{display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap}
.logo-row img{height:88px;width:168px;object-fit:contain;padding:18px 24px;background:var(--tint-bg);border-radius:var(--r2)}

/* Section heads: badge + heading left, lead right, 42px to the content */
.alt{background:var(--tint-bg)}
.k{display:inline-flex;align-items:center;gap:10px;height:32px;padding:0 14px 0 10px;border-radius:var(--pill);background:var(--tint-bg);border:1px solid var(--lilac);font:400 12px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em;color:var(--fg);margin-bottom:24px}
.k::before{content:"";width:16px;height:8px;border-radius:4px;background:var(--brand);flex:none}
section[style*="--tint"] .k,.alt .k{background:var(--surface)}
h2.sec,.final h2{font-size:48px;font-weight:500;line-height:1.06;letter-spacing:-.03em;color:var(--fg);text-wrap:balance}
h2.sec em,.final h2 em{font-style:normal;color:var(--brand)}
h2.sec{margin-bottom:42px;max-width:820px}
.lede{font-size:18px;line-height:1.55;color:var(--muted);max-width:640px;margin-bottom:42px;text-wrap:pretty}
.wrap:has(>h2.sec){display:grid;grid-template-columns:3fr 2fr;column-gap:48px;align-items:end}
.wrap:has(>h2.sec)>*{grid-column:1/-1}
.wrap:has(>h2.sec)>.k{grid-column:1;grid-row:1;justify-self:start}
.wrap:has(>h2.sec)>h2.sec{grid-column:1;grid-row:2}
.wrap:has(>h2.sec)>.lede{grid-column:2;grid-row:1/3;align-self:end;margin-bottom:42px}
.wrap:has(>h2.sec)>h2.sec+.lede{max-width:none}

/* Cards: mono number, hairline border, quiet surface */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;counter-reset:cap}
.card,.step,.member,.quote{background:var(--tint-bg);border:1px solid var(--lilac);border-radius:var(--r3);transition:border-color .2s}
.alt .card,.alt .step,.alt .member,.alt .quote,.alt .pkg,.alt .rating{background:var(--surface)}
section[style*="--tint"] .card,.alt .card,section[style*="--tint"] .step,.alt .step{background:var(--surface)}
.card:hover,.step:hover,.member:hover{border-color:var(--ui-strong)}
.card{padding:28px}
.card::before{counter-increment:cap;content:counter(cap,decimal-leading-zero);display:block;font:400 12px/1 var(--mono);letter-spacing:.02em;color:var(--brand);margin-bottom:18px}
.card h3,.step h3,.member h3{font-size:20px;font-weight:500;line-height:1.25;letter-spacing:-.015em;color:var(--fg);margin-bottom:10px}
.card p,.step p{font-size:15px;line-height:1.6;color:var(--muted)}

/* Process steps: big accent numerals, as on the site */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.step{padding:28px}
.step .n{display:block;font-size:44px;font-weight:500;line-height:1;letter-spacing:-.04em;color:var(--brand);margin-bottom:28px}
.step .n::before{content:"0"}

/* Proof numbers: the site's hairline stats strip */
.stats{padding:0;border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.alt+.stats.alt{border-top:0}
.stats .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.stats .grid4>div{padding:40px 32px 36px;border-left:1px solid var(--lilac)}
.stats .grid4>div:first-child{border-left:0;padding-left:0}
.stats .v{font-size:56px;font-weight:500;line-height:1;letter-spacing:-.04em;color:var(--fg)}
.stats .l{font-size:14px;line-height:1.5;color:var(--muted);margin-top:14px;max-width:220px}
.stats .note{font:400 12px/1.6 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--faint);padding:16px 0;border-top:1px solid var(--lilac);text-align:right}

/* Testimonials + review profiles */
.quotes{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.quote{padding:28px;display:flex;flex-direction:column}
.quote::before{content:"";display:none}
.quote p{font-size:17px;line-height:1.5;letter-spacing:-.01em;color:var(--fg);flex:1}
.quote .who{margin-top:24px;padding-top:20px;border-top:1px solid var(--lilac);font-size:14px;color:var(--muted)}
.quote .who b{color:var(--fg);font-weight:500}
.ratings{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}
.rating{display:block;text-align:center;text-decoration:none;background:var(--tint-bg);border:1px solid var(--lilac);border-radius:var(--r3);padding:20px;transition:border-color .2s}
.rating:hover{border-color:var(--brand)}
.rating .score{font-size:28px;font-weight:500;letter-spacing:-.03em;line-height:1.1;color:var(--fg)}
.rating .stars{color:var(--amber);font-size:14px;letter-spacing:2px;margin:6px 0 8px}
.rating .src{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted)}

/* Team (partner pages): square portraits like the site's team cards */
.team{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.member{padding:0;overflow:hidden;text-align:left;display:flex;flex-direction:column}
.member img,.member .avatar{width:100%;height:auto;aspect-ratio:1/1;border-radius:0;margin:0;display:block}
.member img{object-fit:cover;object-position:center 20%}
.member .avatar{background:var(--tint-bg);color:var(--brand);font-size:44px;font-weight:500;display:flex;align-items:center;justify-content:center}
.member h3{padding:22px 24px 0}
.member .role{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted);margin:0 24px 12px}
.member p{font-size:14px;line-height:1.6;color:var(--muted);padding:0 24px 24px}
.team[data-split]+.crew{margin-top:24px}
.crew{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.crew .member{padding:20px;text-align:left;flex-direction:row;align-items:flex-start;gap:16px;overflow:visible}
.crew .member.nobio{align-items:center}
.crew .member img,.crew .member .avatar{width:56px;height:56px;aspect-ratio:auto;border-radius:50%;margin:0;flex:none;font-size:20px}
.crew .member h3{font-size:17px;margin-bottom:4px;padding:0}
.crew .member .role{margin:0}
.crew .member p{font-size:13.5px;line-height:1.55;margin-top:4px;padding:0}

/* monday.com implementation packages, "Variant A" (Edward 13 Nov 2026, Claude Design file
   "Package cards variant A"): same card as /implementation-packages. Kicker, title, team-size
   pill, divider, small "From" above the price, divider, Best for, ticks in soft circles,
   full-width button; the featured tier (Lock-Step) on navy. */
.pkgs{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pkg{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--lilac);border-radius:var(--r3);padding:28px;transition:border-color .2s}
.pkg:hover{border-color:var(--ui-strong)}
.pkg .dur{font:400 12px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--brand)}
.pkg h3{font-size:24px;font-weight:500;line-height:1.2;letter-spacing:-.02em;color:var(--fg);margin:10px 0 12px}
.pkg .size{align-self:flex-start;font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--brand-press);background:var(--brand-tint);border-radius:var(--pill);padding:6px 12px;margin-bottom:18px}
.pkg .pricebox{display:flex;flex-direction:column;gap:6px;padding:18px 0;margin-bottom:18px;border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.pkg .from{font:400 12px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--faint)}
.pkg .price{font-size:40px;font-weight:500;letter-spacing:-.035em;line-height:1;color:var(--fg);font-variant-numeric:tabular-nums}
.pkg .price .un{font:400 13px/1 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--faint);margin-left:8px;vertical-align:.35em}
.pkg .bf{font-size:15px;line-height:1.55;color:var(--muted);margin:0 0 16px}
.pkg .bf b{font-weight:500;color:var(--fg)}
.pkg ul{list-style:none;margin:0 0 24px;flex:1}
.pkg li{position:relative;padding-left:28px;margin:0 0 10px;font-size:15px;line-height:1.45;color:var(--fg)}
.pkg li::before{content:"";position:absolute;left:0;top:1px;width:18px;height:18px;border-radius:50%;background:var(--brand-tint) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238015e8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") no-repeat center/11px}
.pkg .btn{margin-top:auto}
.pkg .btn svg{width:16px;height:16px;flex:none;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pkg.feat{background:var(--navy);border-color:var(--navy);color:#fff}
.pkg.feat h3,.pkg.feat .price,.pkg.feat li,.pkg.feat .bf b{color:#fff}
.pkg.feat .dur{color:var(--brand-on-dark)}
.pkg.feat .from,.pkg.feat .price .un{color:rgba(255,255,255,.6)}
.pkg.feat .bf{color:rgba(255,255,255,.72)}
.pkg.feat .pricebox{border-color:rgba(255,255,255,.14)}
.pkg.feat li::before{background-color:#fff}
.pnote{font-size:13px;color:var(--faint);margin-top:20px}

/* Booking band: the site's midnight booking section */
.final{--light:rgba(255,255,255,.72);--purple:#fff;color:#fff;background:var(--navy)}
.final .inner{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.final h2{color:#fff;margin-bottom:20px}
.final h2 em{color:var(--brand-tint)}
.final p{font-size:18px;line-height:1.55;color:rgba(255,255,255,.84);margin-bottom:28px}
.final p.k{display:inline-flex;font-size:12px;line-height:1;color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.28);margin-bottom:24px}
.final p.k::before{background:#fff}
.final .btn{display:inline-flex;width:auto;margin-top:0;white-space:nowrap;background:#fff;border-color:#fff;color:var(--fg)}
.final .btn:hover{background:var(--brand-tint);border-color:var(--brand-tint)}
.final .calendly-box,.final .lp-calendly{border-radius:var(--r4);box-shadow:0 24px 60px -20px rgba(0,0,0,.5)}
.final a:not(.btn){color:#fff}
.calendly-box{background:var(--surface);color:var(--muted);min-height:320px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:14px}

/* Footer */
footer{background:var(--navy);color:rgba(255,255,255,.72);padding:40px 0;border-top:1px solid rgba(255,255,255,.14);font:400 12px/1.6 var(--mono);text-transform:uppercase;letter-spacing:.02em}
footer .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
footer img{height:24px;width:auto;display:block}
footer a{color:#fff;text-decoration:none}
footer a:hover{color:var(--brand-tint)}
.lp-cur{display:flex;align-items:center;gap:10px}
.lp-cur label{display:flex;align-items:center;gap:8px;cursor:pointer}
.lp-cur svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lp-cur-box{position:relative;display:flex}
.lp-cur select{appearance:none;-webkit-appearance:none;margin:0;height:44px;min-width:132px;padding:0 38px 0 16px;border-radius:var(--pill);border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;font:400 12px/1 var(--mono);letter-spacing:.02em;text-transform:uppercase;cursor:pointer;transition:background .2s,border-color .2s}
.lp-cur select:hover{background:rgba(128,21,232,.22);border-color:rgba(255,255,255,.45)}
.lp-cur select:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-color:#fff}
.lp-cur option{background:var(--navy);color:#fff}
.lp-cur-box svg{position:absolute;right:16px;top:15px;pointer-events:none;stroke:#fff}
/* Priced pages: two-row footer with the currency control (Claude Design "Footer currency switcher" 2b, 13 Nov 2026) */
footer.lp-fcur{padding:32px 0}
footer.lp-fcur .wrap{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"logo r" "co cur";align-items:center;gap:20px 0}
footer.lp-fcur .wrap>img{grid-area:logo}
.lp-fr{grid-area:r;display:flex;align-items:center;gap:28px}
.lp-legal{display:flex;align-items:center;gap:8px}
.lp-legal a{display:inline-flex;align-items:center;min-height:44px;color:rgba(255,255,255,.72)}
.lp-legal a:hover{color:#fff}
footer.lp-fcur .lp-soc{gap:8px;flex-wrap:nowrap}
.lp-co{grid-area:co;align-self:stretch;margin:0;display:flex;flex-wrap:wrap;align-content:center;column-gap:8px;row-gap:2px;padding-top:20px;border-top:1px solid rgba(255,255,255,.14)}
.lp-ci{display:flex;gap:8px;white-space:nowrap}
footer.lp-fcur .lp-cur{grid-area:cur;align-self:stretch;padding:20px 0 0 24px;border-top:1px solid rgba(255,255,255,.14)}
@media(max-width:1023px){.lp-co{flex-direction:column;flex-wrap:nowrap;justify-content:center}.lp-ci>.d{display:none}}
@media(max-width:767px){footer.lp-fcur{padding:32px 0 24px}footer.lp-fcur .wrap{grid-template-columns:minmax(0,1fr);grid-template-areas:"logo" "co" "cur" "r";gap:20px}.lp-co{padding-top:0;border-top:0}footer.lp-fcur .lp-cur{padding:0;border-top:0}.lp-fr{justify-content:space-between;gap:16px;padding-top:8px;border-top:1px solid rgba(255,255,255,.14)}footer.lp-fcur .lp-soc{gap:0;margin-right:-8px}footer.lp-fcur .lp-soc a{width:44px;height:44px;background:transparent}footer.lp-fcur .lp-soc a svg{box-sizing:content-box;width:14px;height:14px;padding:7px;border-radius:50%;background:#fff}footer.lp-fcur .lp-soc a:hover{background:transparent}footer.lp-fcur .lp-soc a:hover svg{background:var(--brand-tint)}}

/* Mobile sticky CTA bar */
.mcta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:60;gap:10px;padding:10px 16px;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--lilac)}
.mcta a{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 12px;white-space:nowrap;border-radius:var(--pill);text-decoration:none}
.mcta .call{background:var(--surface);border:1px solid var(--ui-strong);color:var(--fg);font:500 13px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em}

/* Tablet */
@media(max-width:1023px){
section{padding:80px 0}
.hero{padding:64px 0 72px}
h1{font-size:48px}
h2.sec,.final h2{font-size:40px}
.hero .wrap,.final .inner{grid-template-columns:1fr;gap:48px}
.wrap:has(>h2.sec){grid-template-columns:1fr}
.wrap:has(>h2.sec)>.lede{grid-column:1;grid-row:auto;margin-top:-22px}
.grid3,.team,.steps,.ratings{grid-template-columns:repeat(2,1fr)}
.team[data-split]{grid-template-columns:repeat(3,1fr)}
.crew{grid-template-columns:repeat(2,1fr)}
.pkgs{grid-template-columns:1fr;max-width:560px}
.stats .grid4{grid-template-columns:repeat(2,1fr)}
.stats .grid4>div:nth-child(3){border-left:0;padding-left:0}
.stats .grid4>div:nth-child(n+3){border-top:1px solid var(--lilac)}
.topbar .book{display:none}
.mcta{display:flex}
body{padding-bottom:68px}
}
/* Mobile */
@media(max-width:767px){
section{padding:64px 0}
.topbar .wrap{height:64px}
.topbar img{height:24px}
.hero{padding:40px 0 56px}
h1{font-size:38px;line-height:1.08}
h2.sec,.final h2{font-size:32px;line-height:1.1}
.hero .sub,.lede,.final p{font-size:16px}
.eyebrow{font-size:11px;margin-bottom:20px}
.grid3,.team,.steps,.quotes,.ratings{grid-template-columns:1fr}
.team[data-split]{grid-template-columns:1fr}
.crew{grid-template-columns:1fr}
.formcard{padding:24px 20px}
.card,.step,.quote,.pkg{padding:24px}
.step .n{font-size:36px;margin-bottom:20px}
.stats .grid4>div{padding:28px 16px}
.stats .grid4>div:nth-child(odd){border-left:0;padding-left:0}
.stats .v{font-size:40px}
.stats .l{font-size:13px}
.clients{padding:40px 0}
.logo-row img{width:140px;height:64px;padding:12px 16px}
footer .wrap{flex-direction:column;align-items:flex-start}
.topbar .phone{font-size:12px}
.final .btn{display:flex;width:100%}
.mcta{gap:8px;padding:10px 12px}
.mcta a{font-size:12px;padding:0 10px}
}
${FAQ}
`

export const LP_CONSULTING_CSS = `${TOKENS}
:root{--p9:var(--navy);--p7:var(--brand);--p5:var(--brand-dark);--p3:var(--cta-pale);--p1:var(--brand-soft);--p05:var(--tint-bg);--ink:var(--fg);--soft:var(--muted);--light:var(--faint);--lighter:var(--label);--cream:var(--mist);--line:var(--lilac);--gold:var(--amber)}
${BASE}
/* Top bar */
.topbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--ui)}
.topbar-in{display:flex;align-items:center;justify-content:space-between;gap:16px;height:76px;max-width:1216px;margin:0 auto;padding:0 32px}
.logo img{height:32px;width:auto;display:block}
.sticky-cta,.b1,.hf-btn,.form-btn,.mob-cta a{background-image:linear-gradient(to right,var(--cta),var(--cta-light));color:#fff;border:0;border-radius:9999px;text-decoration:none;cursor:pointer;font-weight:700;transition:transform .2s,background-color .2s;box-shadow:var(--cta-glow)}
.sticky-cta:hover,.b1:hover,.hf-btn:hover,.form-btn:hover,.mob-cta a:hover{background-image:none;background-color:var(--cta-dark);transform:translateY(-1px)}
.sticky-cta{font-size:14px;font-weight:600;padding:11px 24px;white-space:nowrap}
.mob-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;padding:10px 16px;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--ui)}
.mob-cta a{display:flex;align-items:center;justify-content:center;min-height:48px;font-size:15px}

/* Hero */
.hero{position:relative;overflow:hidden;padding:80px 0 88px;background:radial-gradient(ellipse 60% 70% at 85% 35%,var(--tint-bg) 0%,rgba(247,245,255,0) 70%),var(--surface)}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}
.badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
.badge{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:9999px;font-size:13px;font-weight:600;line-height:1.4}
.badge-dark,.badge-platinum{background:var(--tint-bg);border:1px solid var(--lilac-strong);color:var(--brand)}
.badge-lite,.badge-adv{background:var(--surface);border:1px solid var(--ui);color:var(--muted)}
.badge-dot{width:7px;height:7px;border-radius:50%;background:var(--brand)}
h1{font-size:clamp(32px,4.6vw,52px);font-weight:600;line-height:1.16;letter-spacing:-.02em;color:var(--fg);margin-bottom:24px}
h1 em{font-style:normal;color:var(--brand)}
.sub{font-size:clamp(17px,1.5vw,18px);line-height:1.5;color:var(--muted);margin-bottom:32px;max-width:560px}
.hero-form{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;padding:20px;box-shadow:var(--shadow-form);max-width:520px}
.hf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.hero-form input,.ff input,.ff textarea{width:100%;padding:12px 14px;font-size:15px;color:var(--fg);background:var(--surface);border:1px solid var(--ui);border-radius:12px;transition:border-color .15s,box-shadow .15s}
.hero-form input:focus,.ff input:focus,.ff textarea:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(128,21,232,.08)}
.hf-btn,.form-btn{width:100%;min-height:53px;padding:14px 28px;font-size:16px;letter-spacing:.02em}
.hf-note,.form-trust{font-size:12px;color:var(--faint);text-align:center;margin-top:12px}
.cta-row{display:flex;gap:16px 20px;align-items:center;flex-wrap:wrap}
.b1{display:inline-flex;align-items:center;min-height:53px;padding:14px 28px;font-size:16px;letter-spacing:.02em}
.cta-note{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}

/* AI pipeline: the site's terminal panel */
.pipe{position:relative;overflow:hidden;background:var(--terminal);border:1px solid #2a2733;border-radius:24px;padding:28px;box-shadow:0 24px 60px rgba(16,0,58,.28);font-family:var(--mono)}
.pipe::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 85% 0%,rgba(128,21,232,.35),rgba(128,21,232,0) 55%);pointer-events:none}
.pipe-title{position:relative;color:#cfd0d6;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-bottom:20px}
.node-row{position:relative;display:flex;align-items:center;gap:10px;margin-bottom:12px}
.node{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px 14px;color:#fff;font-size:12px;font-weight:600}
.node small{display:block;color:#8f8d99;font-weight:500;font-size:10.5px;margin-top:3px}
.node.hot{background:rgba(128,21,232,.18);border-color:rgba(186,131,240,.5)}
.arrow{flex:none;color:var(--brand-mid);font-size:14px}
.pulse{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);margin-right:8px;box-shadow:0 0 8px var(--green);vertical-align:1px}

/* Dashboard mock */
.dash{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;box-shadow:var(--shadow-float);overflow:hidden}
.dash-head{background:var(--terminal);padding:14px 18px;display:flex;gap:6px;align-items:center}
.dash-head .dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.22)}
.dash-head .ttl{color:#cfd0d6;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-left:10px}
.dash-body{padding:16px}
.dash-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;padding:11px 10px;font-size:12.5px;align-items:center;color:var(--muted)}
.dash-row.h{background:var(--mist);border-radius:10px;font-family:var(--mono);font-weight:600;color:var(--muted);font-size:10.5px;text-transform:uppercase;letter-spacing:.08em}
.dash-row:not(.h){border-bottom:1px dashed var(--ui)}
.dash-row:last-child{border-bottom:0}
.pill{padding:4px 8px;border-radius:8px;color:#fff;font-weight:600;text-align:center;font-size:10.5px}
.pg{background:var(--green)}.pa{background:var(--amber)}.pp{background:var(--brand)}
.bar{height:6px;border-radius:9999px;background:var(--brand-soft);overflow:hidden}
.bar i{display:block;height:100%;background:var(--brand);border-radius:9999px}
.dash-name{font-weight:600;color:var(--fg)}

/* Trust strip */
.trust{padding:56px 0;border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.trust-txt{text-align:center;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:24px}
.trust-logos{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;align-items:center}
.trust-logos img{height:80px;width:168px;object-fit:contain;padding:14px 20px;background:var(--mist);border:1px solid var(--lilac);border-radius:16px}

/* Section heads */
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:16px;text-align:center}
h2{font-size:clamp(28px,3.6vw,44px);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--fg);margin:0 auto 16px;text-align:center;max-width:880px}
.lede{font-size:clamp(16px,1.5vw,18px);line-height:1.55;color:var(--muted);max-width:640px;margin:0 auto 48px;text-align:center}
.alt{background:var(--tint-bg)}
h2+.caps,h2+.why,h2+.steps,h2+.team{margin-top:40px}

/* Cards */
.caps,.why,.team{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.caps{counter-reset:cap}
.cap,.why-card,.tm,.step{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;box-shadow:var(--shadow-whisper);transition:transform .2s,box-shadow .2s,border-color .2s}
.cap:hover,.why-card:hover,.tm:hover,.step:hover{transform:translateY(-3px);box-shadow:var(--shadow-lift);border-color:var(--lilac-strong)}
.cap,.why-card{padding:32px 30px}
.cap::before{counter-increment:cap;content:counter(cap,decimal-leading-zero);display:block;font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.14em;color:var(--brand);margin-bottom:20px}
.cap h3,.why-card h3,.step h3{font-size:clamp(18px,1.8vw,20px);font-weight:600;line-height:1.3;letter-spacing:-.01em;color:var(--fg);margin-bottom:10px}
.cap p,.why-card p,.step p,.tm-body p{font-size:15px;line-height:1.6;color:var(--muted)}
.why-num{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;padding:0 10px;border-radius:8px;background:var(--brand-soft);color:var(--brand);font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;margin-bottom:22px}

/* Stat row */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:48px}
.stat{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;padding:28px;box-shadow:var(--shadow-whisper);text-align:left}
.stat b{display:block;font-size:clamp(32px,3.6vw,44px);font-weight:600;line-height:1;letter-spacing:-.025em;color:var(--brand);margin-bottom:12px}
.stat span{font-size:14px;color:var(--muted)}

/* Team */
.tm{overflow:hidden}
.tm-img{aspect-ratio:4/3;display:flex;align-items:flex-end;padding:20px 22px;color:#fff;font-size:18px;font-weight:600;letter-spacing:-.01em;background:radial-gradient(ellipse 80% 80% at 90% 0%,rgba(186,131,240,.45) 0%,rgba(186,131,240,0) 70%),linear-gradient(160deg,var(--navy-2) 0%,var(--navy) 100%)}
.tm-img.has-photo{position:relative;overflow:hidden}
.tm-img.has-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 25%}
.tm-img.has-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,22,56,0) 45%,rgba(10,22,56,.75) 100%)}
.tm-img.has-photo span{position:relative;z-index:1}
.tm-body{padding:24px 26px 28px}
.tm-role{font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}

/* Method */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.step{padding:30px 26px}
.step-n{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;padding:0 10px;border-radius:8px;background:var(--brand-soft);color:var(--brand);font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;margin-bottom:22px}
.step-n::before{content:"0"}

/* Closing form: the homepage "Book a time" blue band */
.close-band{color:#fff;background:radial-gradient(ellipse 50% 70% at 100% 0%,rgba(147,180,253,.18) 0%,rgba(147,180,253,0) 70%),linear-gradient(-38deg,var(--cta-light) 0%,var(--cta) 42%,var(--cta-deep) 100%)}
.close-band .eyebrow{color:var(--cta-pale)}
.close-band h2{color:#fff}
.close-band .lede{color:rgba(255,255,255,.8)}
.form-card{background:var(--surface);color:var(--fg);border-radius:24px;padding:36px 32px;max-width:580px;margin:0 auto;box-shadow:0 24px 60px rgba(10,22,56,.35)}
.ff{margin-bottom:16px}
.ff label{display:block;font-size:13px;font-weight:500;color:var(--fg);margin-bottom:6px}
.ff textarea{min-height:96px;resize:vertical}

/* Footer */
.foot{padding:32px 0;text-align:center;font-size:13px;line-height:1.6;color:rgba(255,255,255,.65);background:linear-gradient(120deg,var(--navy) 0%,var(--navy-2) 100%)}

/* Tablet */
@media(max-width:1023px){
.hero{padding:56px 0 64px}
.hero-grid{grid-template-columns:1fr;gap:40px}
.caps,.why,.team,.steps,.stats{grid-template-columns:repeat(2,1fr)}
.sticky-cta{display:none}
.mob-cta{display:block}
body{padding-bottom:68px}
}
/* Mobile */
@media(max-width:767px){
.topbar-in{height:64px;padding:0 16px}
.logo img{height:28px}
.hero{padding:40px 0 48px}
.pipe,.dash{display:none}
.caps,.why,.team,.steps{grid-template-columns:1fr}
.hf-row{grid-template-columns:1fr}
.cap,.why-card,.step{padding:26px 22px}
.stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.stat{padding:20px 18px}
.stat b{font-size:28px;overflow-wrap:anywhere}
.stat span{font-size:13px}
.form-card{padding:28px 20px;border-radius:20px}
.trust{padding:40px 0}
.trust-logos img{width:140px;height:64px;padding:10px 14px}
}
/* Version C pass (2026-11): the consulting template takes the same type,
   buttons, section headers, cards and dark booking band as the conversion pages. */
.topbar{background:rgba(255,255,255,.92);border-bottom:1px solid var(--lilac)}
.topbar-in{height:72px;max-width:1344px;padding:0 48px}
.logo img{height:26px}
.sticky-cta,.b1,.hf-btn,.form-btn,.mob-cta a{background:var(--brand);border:1px solid var(--brand);border-radius:var(--pill);box-shadow:none;font:500 13px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em}
.sticky-cta:hover,.b1:hover,.hf-btn:hover,.form-btn:hover,.mob-cta a:hover{background:var(--brand-press);border-color:var(--brand-press);transform:none}
.sticky-cta{display:inline-flex;align-items:center;height:40px;padding:0 18px}
.hf-btn,.form-btn,.b1{min-height:52px}
.hero{padding:96px 0;background:var(--surface)}
.hero-grid{grid-template-columns:1.12fr .88fr}
.hero-grid>*{min-width:0}
.badge{font:400 12px/1.3 var(--mono);text-transform:uppercase;letter-spacing:.02em;padding:7px 14px}
.badge-dark,.badge-platinum{background:var(--tint-bg);border:1px solid var(--lilac);color:var(--fg)}
.badge-lite,.badge-adv{background:var(--surface);border:1px solid var(--lilac);color:var(--fg)}
.badge-dot{width:16px;height:8px;border-radius:4px}
h1{font-size:60px;font-weight:500;line-height:1.04;letter-spacing:-.035em;text-wrap:balance;margin-bottom:28px}
.sub{font-size:18px;line-height:1.55}
.hero-form,.form-card,.dash,.pipe{border-radius:var(--r4)}
.hero-form input,.ff input,.ff textarea{border-radius:var(--r2)}
.eyebrow{display:inline-flex;align-items:center;gap:10px;height:32px;padding:0 14px 0 10px;border-radius:var(--pill);background:var(--tint-bg);border:1px solid var(--lilac);font:400 12px/1 var(--mono);text-transform:uppercase;letter-spacing:.02em;color:var(--fg);margin:0 0 24px;text-align:left}
.eyebrow::before{content:"";width:16px;height:8px;border-radius:4px;background:var(--brand);flex:none}
.alt .eyebrow{background:var(--surface)}
h2{font-size:48px;font-weight:500;line-height:1.06;letter-spacing:-.03em;text-align:left;margin:0 0 42px;max-width:820px;text-wrap:balance}
h2 em{font-style:normal;color:var(--brand)}
.lede{text-align:left;margin:0 0 42px;font-size:18px}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2){display:grid;grid-template-columns:3fr 2fr;column-gap:48px;align-items:end}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2)>*{grid-column:1/-1}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2)>.eyebrow{grid-column:1;grid-row:1;justify-self:start}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2)>h2{grid-column:1;grid-row:2}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2)>.lede{grid-column:2;grid-row:1/3;align-self:end;max-width:none}
h2+.caps,h2+.why,h2+.steps,h2+.team{margin-top:0}
.caps,.why,.team,.steps{gap:24px}
.cap,.why-card,.tm,.step{border-radius:var(--r3);box-shadow:none;transition:border-color .2s;background:var(--tint-bg)}
.alt .cap,.alt .why-card,.alt .tm,.alt .step{background:var(--surface)}
.cap:hover,.why-card:hover,.tm:hover,.step:hover{transform:none;box-shadow:none;border-color:var(--lilac-strong)}
.cap,.why-card,.step{padding:28px}
.cap::before{font-weight:400;letter-spacing:.02em}
.cap h3,.why-card h3,.step h3{font-size:20px;font-weight:500;letter-spacing:-.015em}
.why-num,.step-n{display:block;height:auto;min-width:0;padding:0;background:none;font:500 44px/1 var(--sans);letter-spacing:-.04em;color:var(--brand);margin-bottom:28px}
.stats{gap:0;margin-top:42px;border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.stat{background:none;border:0;border-left:1px solid var(--lilac);border-radius:0;box-shadow:none;padding:36px 32px}
.stat:first-child{border-left:0;padding-left:0}
.stat b{font-size:56px;font-weight:500;letter-spacing:-.04em;color:var(--fg)}
.tm-role{font-weight:400;letter-spacing:.02em;color:var(--muted)}
.trust{padding:72px 0}
.trust-txt{font:400 12px/1.3 var(--mono);letter-spacing:.02em;color:var(--muted)}
.trust-logos img{border:0;border-radius:var(--r2);background:var(--tint-bg)}
.close-band{background:var(--navy)}
.close-band>.wrap{display:grid;grid-template-columns:1fr 1fr;column-gap:64px;align-items:center}
.close-band>.wrap>*{grid-column:1}
.close-band>.wrap>.form-card{grid-column:2;grid-row:1/span 4;margin:0;max-width:none;box-shadow:0 24px 60px -20px rgba(0,0,0,.5)}
.close-band>.wrap>.lp-calendly{grid-column:2;grid-row:1/span 4;min-width:0;border-radius:var(--r4);box-shadow:0 24px 60px -20px rgba(0,0,0,.5)}
.close-band .eyebrow{justify-self:start;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.28);color:#fff}
.close-band .eyebrow::before{background:#fff}
.close-band h2{margin-bottom:20px}
.close-band h2 em{color:var(--brand-tint)}
.close-band .lede{color:rgba(255,255,255,.84);margin-bottom:0}
.foot{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;padding:40px 48px;background:var(--navy);text-align:left;font:400 12px/1.6 var(--mono);text-transform:uppercase;letter-spacing:.02em;color:rgba(255,255,255,.72)}
@media(max-width:1023px){
.hero-grid{grid-template-columns:1fr;gap:48px}
section{padding:80px 0}
.hero{padding:64px 0 72px}
h1{font-size:48px}
h2{font-size:40px}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2){grid-template-columns:1fr}
section:not(.close-band):not(.lp-closing)>.wrap:has(>h2)>.lede{grid-column:1;grid-row:auto;margin-top:-22px}
.close-band>.wrap{grid-template-columns:1fr}
.close-band>.wrap>.form-card{grid-column:1;grid-row:auto;margin-top:40px}
.close-band>.wrap>.lp-calendly{grid-column:1;grid-row:auto;margin-top:40px;min-width:0}
.stat:nth-child(3){border-left:0;padding-left:0}
.stat:nth-child(n+3){border-top:1px solid var(--lilac)}
.topbar-in{padding:0 32px}
}
@media(max-width:767px){
section{padding:64px 0}
.topbar-in{height:64px;padding:0 16px}
.logo img{height:24px}
.hero{padding:40px 0 56px}
h1{font-size:38px;line-height:1.08}
h2{font-size:32px;line-height:1.1}
.lede,.sub{font-size:16px}
.stat{padding:24px 16px}
.stat:nth-child(odd){border-left:0;padding-left:0}
.stat b{font-size:36px}
.foot{padding:32px 16px;flex-direction:column;align-items:flex-start}
}
.hero .hero-card{max-width:none;margin:0;padding:32px;border:1px solid var(--lilac);box-shadow:0 24px 60px -24px rgba(16,0,58,.22)}
.hero-card h2{font-size:24px;line-height:1.2;letter-spacing:-.02em;margin:0 0 6px;max-width:none}
.hero-card .fsub{font-size:14px;color:var(--muted);margin-bottom:12px}
.ff label{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted);margin:16px 0 8px}
.ff{margin-bottom:0}
.hero-form input,.ff input{height:48px}
.form-btn{margin-top:24px}
@media(max-width:767px){.hero .hero-card{padding:24px 20px}}
/* Hero ticks and tags: the conversion template's hero list (as on /au/monday-crm-consulting) */
.hero .sub{margin-bottom:28px}
.ticks{list-style:none;margin:0 0 32px;padding:0;display:grid;gap:12px}
.ticks li{position:relative;padding-left:30px;font-size:15px;line-height:1.5;color:var(--fg)}
.ticks li::before{content:"";position:absolute;left:0;top:3px;width:18px;height:18px;border-radius:50%;background:var(--brand-soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238015e8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") no-repeat center/11px}
.hero-tags{display:flex;gap:8px;flex-wrap:wrap}
.hero-tags span{font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--fg);background:var(--surface);border:1px solid var(--lilac);border-radius:var(--pill);padding:7px 12px}
/* Team: the conversion template's square-portrait cards (as on /au/monday-crm-consulting) */
.team{gap:24px}
h2+.lede+.team{margin-top:0}
.member{display:flex;flex-direction:column;overflow:hidden;text-align:left;background:var(--tint-bg);border:1px solid var(--lilac);border-radius:var(--r3);transition:border-color .2s}
.alt .member{background:var(--surface)}
.member:hover{border-color:var(--ui-strong)}
.member img,.member .avatar{display:block;width:100%;height:auto;aspect-ratio:1/1;margin:0}
.member img{object-fit:cover;object-position:center 20%}
.member .avatar{display:flex;align-items:center;justify-content:center;background:var(--brand-soft);color:var(--brand);font-size:44px;font-weight:500;letter-spacing:-.02em}
.alt .member .avatar{background:var(--brand-soft)}
.member h3{padding:22px 24px 0;margin:0 0 10px;font-size:20px;font-weight:500;line-height:1.25;letter-spacing:-.015em;color:var(--fg)}
.member .role{margin:0 24px 12px;font:400 11px/1.3 var(--mono);letter-spacing:.02em;text-transform:uppercase;color:var(--muted)}
.member p{padding:0 24px 24px;font-size:14px;line-height:1.6;color:var(--muted)}
${FAQ}
`
