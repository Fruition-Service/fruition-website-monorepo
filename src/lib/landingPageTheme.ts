/**
 * Site design system for the Google Ads landing pages under /au, /uk and /us.
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
--brand:#8015e8;--brand-dark:#550e9b;--brand-soft:#f5edfd;--brand-mid:#b98bf0;
--fg:#171717;--muted:#686b82;--faint:#8f92a6;--label:#9a9ab0;
--ui:#dedee5;--lilac:#ece7fb;--lilac-strong:#e5d8fa;
--tint-bg:#f7f5ff;--mist:#f9f8fc;--surface:#ffffff;
--navy:#10003a;--navy-2:#2b074d;--terminal:#15131c;
--cta:#1e40af;--cta-light:#2563eb;--cta-dark:#142b75;--cta-deep:#0a1638;--cta-pale:#93b4fd;
--amber:#fdab3d;--green:#00ca72;
--mono:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace;
--sans:'Poppins',system-ui,sans-serif;
--shadow-whisper:0 4px 24px rgba(0,0,0,.03);
--shadow-lift:0 12px 30px rgba(0,0,0,.06);
--shadow-float:0 24px 60px rgba(16,0,58,.10);
--cta-glow:0 6px 20px rgba(30,64,175,.25);
}`

/** Reset, page frame and the pieces both templates share. */
const BASE = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--fg);background:var(--surface);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{max-width:100%}
a{color:inherit}
.wrap{max-width:1216px;margin:0 auto;padding:0 32px}
section{padding:96px 0}
::selection{background:var(--brand-soft);color:var(--brand-dark)}
:focus-visible{outline:2px solid var(--brand);outline-offset:3px}
input,select,textarea,button{font-family:inherit}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
@media(max-width:767px){.wrap{padding:0 16px}section{padding:56px 0}}
`

export const LP_CONVERSION_CSS = `${TOKENS}
:root{--purple:var(--brand);--deep:var(--fg);--mid:var(--brand-dark);--ink:var(--fg);--soft:var(--muted);--light:var(--faint);--tint:var(--tint-bg);--line:var(--lilac)}
${BASE}
/* Top bar: logo stays non-clickable (zero-leak orphan page), phone + book CTA */
.topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--ui)}
.topbar .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;height:76px}
.topbar img{height:32px;width:auto;display:block}
.topbar .right{display:flex;align-items:center;gap:24px}
.topbar .phone{display:inline-flex;align-items:center;min-height:44px;font-size:15px;font-weight:500;color:var(--fg);text-decoration:none;white-space:nowrap;transition:color .2s}
.topbar .phone:hover{color:var(--brand)}
.topbar .book,.btn,.mcta .book{background-image:linear-gradient(to right,var(--cta),var(--cta-light));color:#fff;text-decoration:none;border:0;border-radius:9999px;cursor:pointer;transition:transform .2s,background-color .2s,box-shadow .2s}
.topbar .book{font-size:14px;font-weight:600;padding:11px 24px;white-space:nowrap;box-shadow:var(--cta-glow)}
.topbar .book:hover,.btn:hover,.mcta .book:hover{background-image:none;background-color:var(--cta-dark);transform:translateY(-1px)}

/* Hero */
.hero{position:relative;overflow:hidden;padding:80px 0 88px;background:radial-gradient(ellipse 60% 70% at 85% 30%,var(--tint-bg) 0%,rgba(247,245,255,0) 70%),var(--surface)}
.hero .wrap{display:grid;grid-template-columns:1.08fr .92fr;gap:64px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--tint-bg);border:1px solid var(--lilac-strong);border-radius:9999px;padding:7px 16px;font-size:13px;font-weight:600;line-height:1.4;color:var(--brand);margin-bottom:28px}
h1{font-size:clamp(32px,4.6vw,52px);font-weight:600;line-height:1.16;letter-spacing:-.02em;color:var(--fg)}
h1 em{font-style:normal;color:var(--brand)}
.hero .sub{font-size:clamp(17px,1.5vw,18px);line-height:1.5;color:var(--muted);margin:24px 0 28px;max-width:560px}
.ticks{list-style:none;margin:0 0 32px;display:grid;gap:12px}
.ticks li{position:relative;padding-left:32px;font-size:15px;font-weight:500;line-height:1.5;color:var(--fg)}
.ticks li::before{content:"✓";position:absolute;left:0;top:1px;width:21px;height:21px;border-radius:50%;background:var(--brand-soft);color:var(--brand);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.badges{display:flex;gap:8px;flex-wrap:wrap}
.badge{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:var(--surface);border:1px solid var(--ui);border-radius:8px;padding:7px 11px}

/* Lead form card */
.formcard{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;box-shadow:var(--shadow-float);padding:36px 32px}
.formcard h2{font-size:22px;font-weight:600;line-height:1.25;letter-spacing:-.01em;color:var(--fg);margin-bottom:6px}
.formcard .fsub{font-size:14px;color:var(--muted);margin-bottom:12px}
.formcard label{display:block;font-size:13px;font-weight:500;color:var(--fg);margin:14px 0 6px}
.formcard input,.formcard select{width:100%;font-size:15px;color:var(--fg);background:var(--surface);border:1px solid var(--ui);border-radius:12px;padding:12px 14px;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;appearance:none}
.formcard select{background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);background-position:calc(100% - 20px) 50%,calc(100% - 15px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:40px}
.formcard input:focus,.formcard select:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(128,21,232,.08)}
.btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:53px;padding:14px 28px;margin-top:24px;font-size:16px;font-weight:700;letter-spacing:.02em;text-align:center;box-shadow:var(--cta-glow)}
.formcard .fine{font-size:12px;color:var(--faint);margin-top:14px;text-align:center}

/* Client strip */
.clients{padding:56px 0;background:var(--surface);border-top:1px solid var(--lilac);border-bottom:1px solid var(--lilac)}
.clients p{text-align:center;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:24px}
.logo-row{display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap}
.logo-row img{height:80px;width:168px;object-fit:contain;padding:14px 20px;background:var(--mist);border:1px solid var(--lilac);border-radius:16px}

/* Section heads */
.alt{background:var(--tint-bg)}
.k{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:16px}
h2.sec,.final h2{font-size:clamp(28px,3.6vw,44px);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--fg);margin-bottom:16px;max-width:820px}
.lede{font-size:clamp(16px,1.5vw,18px);line-height:1.55;color:var(--muted);max-width:640px;margin-bottom:48px}

/* Cards: numbered with a mono tag, hairline + whisper, hover lift */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;counter-reset:cap}
.card,.step,.member,.quote{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;box-shadow:var(--shadow-whisper);transition:transform .2s,box-shadow .2s,border-color .2s}
.card:hover,.step:hover,.member:hover{transform:translateY(-3px);box-shadow:var(--shadow-lift);border-color:var(--lilac-strong)}
.card{padding:32px 30px}
.card::before{counter-increment:cap;content:counter(cap,decimal-leading-zero);display:block;font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.14em;color:var(--brand);margin-bottom:20px}
.card h3,.step h3,.member h3{font-size:clamp(18px,1.8vw,20px);font-weight:600;line-height:1.3;letter-spacing:-.01em;color:var(--fg);margin-bottom:10px}
.card p,.step p{font-size:15px;line-height:1.6;color:var(--muted)}

/* Process steps */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.step{padding:30px 26px}
.step .n{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;padding:0 10px;border-radius:8px;background:var(--brand-soft);color:var(--brand);font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;margin-bottom:22px}
.step .n::before{content:"0"}

/* Proof numbers: the dark midnight band the homepage uses for its method section */
.stats{position:relative;overflow:hidden;color:#fff;background:radial-gradient(ellipse 55% 90% at 90% 0%,rgba(128,21,232,.45) 0%,rgba(128,21,232,0) 70%),linear-gradient(160deg,var(--navy) 0%,var(--navy-2) 100%)}
.stats .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.stats .grid4>div{padding:8px 28px;border-left:1px solid rgba(255,255,255,.14)}
.stats .grid4>div:first-child{border-left:0;padding-left:0}
.stats .v{font-size:clamp(36px,4vw,46px);font-weight:600;line-height:1;letter-spacing:-.025em;color:#fff}
.stats .l{font-size:14px;line-height:1.5;color:rgba(255,255,255,.72);margin-top:14px;max-width:220px}
.stats .note{font-family:var(--mono);font-size:12px;letter-spacing:.04em;line-height:1.6;color:rgba(255,255,255,.5);margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,.12)}

/* Testimonials + review profiles */
.quotes{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.quote{padding:36px 32px;display:flex;flex-direction:column}
.quote::before{content:"“";font-size:56px;line-height:.8;font-weight:600;color:var(--brand-mid);margin-bottom:12px}
.quote p{font-size:clamp(16px,1.5vw,18px);line-height:1.55;color:var(--fg);flex:1}
.quote .who{margin-top:24px;padding-top:20px;border-top:1px dashed var(--ui);font-size:14px;color:var(--muted)}
.quote .who b{color:var(--fg);font-weight:600}
.ratings{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}
.rating{display:block;text-align:center;text-decoration:none;background:var(--mist);border:1px solid var(--lilac);border-radius:16px;padding:20px;transition:border-color .2s,background-color .2s}
.rating:hover{border-color:var(--brand);background:var(--surface)}
.rating .score{font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1.1;color:var(--fg)}
.rating .stars{color:var(--amber);font-size:14px;letter-spacing:2px;margin:6px 0 8px}
.rating .src{font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}

/* Team (partner pages) */
.team{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.member{padding:32px 28px;text-align:center}
.member img,.member .avatar{width:88px;height:88px;border-radius:50%;margin:0 auto 18px;display:block}
.member img{object-fit:cover;box-shadow:0 0 0 4px var(--brand-soft)}
.member .avatar{background:var(--brand-soft);color:var(--brand);font-size:28px;font-weight:600;display:flex;align-items:center;justify-content:center}
.member .role{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin:0 0 12px}
.member p{font-size:14px;line-height:1.6;color:var(--muted)}

/* FAQ: hairline-ruled list with mono numbers, as on the homepage */
section:has(details){counter-reset:faq}
details{max-width:880px;border-bottom:1px solid var(--ui);counter-increment:faq}
section:has(details) h2.sec{margin-bottom:32px}
details:first-of-type{border-top:1px solid var(--ui)}
summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:20px;padding:22px 0;font-size:clamp(16px,1.6vw,18px);font-weight:500;line-height:1.4;color:var(--fg);transition:color .2s}
summary:hover{color:var(--brand)}
summary::-webkit-details-marker{display:none}
summary::before{content:counter(faq,decimal-leading-zero);flex:none;font-family:var(--mono);font-size:12px;font-weight:600;color:var(--brand-mid)}
summary::after{content:"";flex:none;margin-left:auto;width:8px;height:8px;border-right:2px solid var(--brand);border-bottom:2px solid var(--brand);transform:translateY(-3px) rotate(45deg);transition:transform .2s}
details[open] summary::after{transform:translateY(2px) rotate(-135deg)}
details .a{padding:0 40px 24px 40px;font-size:15px;line-height:1.65;color:var(--muted)}

/* Closing booking band: the homepage "Book a time" blue gradient */
.final{--light:rgba(255,255,255,.72);--purple:#fff;color:#fff;background:radial-gradient(ellipse 50% 70% at 100% 0%,rgba(147,180,253,.18) 0%,rgba(147,180,253,0) 70%),linear-gradient(-38deg,var(--cta-light) 0%,var(--cta) 42%,var(--cta-deep) 100%)}
.final .inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.final h2{color:#fff}
.final p{font-size:clamp(16px,1.5vw,18px);line-height:1.55;color:rgba(255,255,255,.8);margin-bottom:28px}
.final p.k{font-size:12px;line-height:1.4;color:var(--cta-pale);margin-bottom:16px}
.final .btn{display:inline-flex;width:auto;margin-top:0;white-space:nowrap;background-image:none;background-color:#fff;color:var(--cta);box-shadow:0 6px 20px rgba(10,22,56,.25)}
.final .btn:hover{background-color:#fff;color:var(--cta-dark)}
.final .calendly-box,.final .lp-calendly{border-radius:24px;box-shadow:0 24px 60px rgba(10,22,56,.35)}
.calendly-box{background:var(--surface);color:var(--muted);min-height:320px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:14px}

/* Footer */
footer{background:linear-gradient(120deg,var(--navy) 0%,var(--navy-2) 100%);color:rgba(255,255,255,.65);padding:32px 0;font-size:13px;line-height:1.6}
footer .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
footer img{height:28px;width:auto;display:block}
footer a{color:var(--brand-mid);text-decoration:none}
footer a:hover{color:#fff}

/* Mobile sticky CTA bar */
.mcta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:60;gap:10px;padding:10px 16px;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--ui)}
.mcta a{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 12px;font-size:15px;font-weight:700;white-space:nowrap;border-radius:9999px;text-decoration:none}
.mcta .call{background:var(--surface);border:1px solid var(--cta);color:var(--cta)}

/* Tablet */
@media(max-width:1023px){
.hero{padding:56px 0 64px}
.hero .wrap,.final .inner{grid-template-columns:1fr;gap:40px}
.grid3,.team,.steps,.ratings{grid-template-columns:repeat(2,1fr)}
.stats .grid4{grid-template-columns:repeat(2,1fr);row-gap:40px}
.stats .grid4>div:nth-child(3){border-left:0;padding-left:0}
.topbar .book{display:none}
.mcta{display:flex}
body{padding-bottom:68px}
}
/* Mobile */
@media(max-width:767px){
.topbar .wrap{height:64px}
.topbar img{height:28px}
.hero{padding:40px 0 48px}
.eyebrow{font-size:12px;margin-bottom:20px}
.grid3,.team,.steps,.quotes{grid-template-columns:1fr}
.formcard{padding:28px 20px;border-radius:20px}
.card,.step,.quote{padding:26px 22px}
.stats .grid4>div{padding:0 16px}
.stats .grid4>div:nth-child(odd){border-left:0;padding-left:0}
.stats .l{font-size:13px}
.clients{padding:40px 0}
.logo-row img{width:140px;height:64px;padding:10px 14px}
details .a{padding:0 0 20px 40px}
.lede{margin-bottom:32px}
footer .wrap{flex-direction:column;align-items:flex-start}
.topbar .phone{font-size:14px}
.btn{min-height:52px;padding:14px 20px;font-size:15px;letter-spacing:0;white-space:nowrap}
.final .btn{display:flex;width:100%}
.mcta{gap:8px;padding:10px 12px}
.mcta a{font-size:14px;padding:0 10px}
}
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
.hero-form{background:var(--surface);border:1px solid var(--lilac);border-radius:24px;padding:20px;box-shadow:var(--shadow-float);max-width:520px}
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
`
