/**
 * The developer handover guide, served by ./route.ts behind the portal login and shown
 * inside /internal/handover. It is a standalone HTML document (its own Fruition-themed
 * tokens in :root, inline SVG diagrams), the same pattern as the ad landing pages'
 * content.ts files, so it does not use the portal's shadcn theme.
 *
 * Edit the HTML in place. Keep it free of secret values: this repository is public.
 * String.raw keeps the backslashes in the inline script intact; the document must not
 * contain backticks or "${".
 */
export const HANDOVER_HTML = String.raw`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex, nofollow"><style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
<title>Fruition Website Handover</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap">
<style>
/* Layout: Fruition "consultant's terminal". White paper, mono-labelled precision, one voltage-purple accent.
   Sticky contents rail on desktop, single column on phones. Diagrams are inline SVG in their own scroll boxes. */
:root {
  --paper: #ffffff;
  --cool: #ecf1fc;
  --raised: #ffffff;
  --sunk: #f7f6fb;
  --ink: #242323;
  --ink-soft: #686b82;
  --hair: #dedee5;
  --brand: #8015e8;
  --brand-ink: #550e9b;
  --brand-soft: #f5edfd;
  --brand-line: #d6bdf6;
  --code-bg: #15131c;
  --code-fg: #ecebf3;
  --code-dim: #9b97b3;
  --ok: #0c7d55;
  --warn: #a35a00;
  --risk: #c0262d;
  --risk-soft: #fdeeee;
  --warn-soft: #fff4e5;
  --hero-a: #10003a;
  --hero-b: #2b074d;
  --hero-c: #550e9b;
  --hero-fg: #ffffff;
  --hero-dim: #cdb4f5;
  --font-sans: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --r-card: 20px;
  --r-chip: 10px;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #0e0a1c; --cool: #150f27; --raised: #18112d; --sunk: #120d24;
    --ink: #eeecf6; --ink-soft: #a9a5c2; --hair: #2e2649;
    --brand: #b77cf2; --brand-ink: #d9bcfb; --brand-soft: #231543; --brand-line: #4b2e7e;
    --code-bg: #07050e; --code-fg: #ecebf3; --code-dim: #8d89a6;
    --ok: #4cc79a; --warn: #f0a44b; --risk: #f27a7f; --risk-soft: #2c1420; --warn-soft: #2a1d0e;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --paper: #0e0a1c; --cool: #150f27; --raised: #18112d; --sunk: #120d24;
  --ink: #eeecf6; --ink-soft: #a9a5c2; --hair: #2e2649;
  --brand: #b77cf2; --brand-ink: #d9bcfb; --brand-soft: #231543; --brand-line: #4b2e7e;
  --code-bg: #07050e; --code-fg: #ecebf3; --code-dim: #8d89a6;
  --ok: #4cc79a; --warn: #f0a44b; --risk: #f27a7f; --risk-soft: #2c1420; --warn-soft: #2a1d0e;
  color-scheme: dark;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  background: var(--paper); color: var(--ink);
  font-family: var(--font-sans); font-size: 15px; line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--brand); text-underline-offset: 3px; }
a:focus-visible, button:focus-visible, input:focus-visible, summary:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 6px; }
code, .mono { font-family: var(--font-mono); font-size: 0.86em; }
p code, li code, td code, dd code, .note code {
  background: var(--brand-soft); color: var(--brand-ink);
  padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere;
}
h1, h2, h3 { text-wrap: balance; margin: 0; }
p { margin: 0; }
ul, ol { margin: 0; padding-left: 1.2em; }

/* ---------- hero ---------- */
.hero {
  background: linear-gradient(128deg, var(--hero-a) 0%, var(--hero-b) 52%, var(--hero-c) 100%);
  color: var(--hero-fg);
  padding-inline: 20px; padding-block: 56px 44px;
}
.hero-in { max-width: 1240px; margin: 0 auto; display: grid; gap: 28px; }
.eyebrow { font-family: var(--font-mono); font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.hero .eyebrow { color: var(--hero-dim); }
.hero h1 { font-size: clamp(2.1rem, 5.4vw, 4rem); font-weight: 700; line-height: 1.04; letter-spacing: -0.035em; max-width: 16ch; }
.hero h1 span { color: var(--hero-dim); }
.hero .lede { font-size: clamp(1rem, 1.5vw, 1.15rem); max-width: 64ch; color: #ece4fb; }
.facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.14); border-radius: 16px; overflow: hidden; }
@media (min-width: 768px) { .facts { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.facts div { background: rgba(16,0,58,0.55); padding: 14px 16px; min-width: 0; }
.facts dt { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hero-dim); }
.facts dd { margin: 4px 0 0; font-family: var(--font-mono); font-size: 13.5px; overflow-wrap: anywhere; }
.facts dd a { color: #fff; }

/* ---------- layout ---------- */
.wrap { max-width: 1240px; margin: 0 auto; padding-inline: 20px; padding-block: 36px 80px; display: grid; gap: 40px; }
@media (min-width: 1024px) { .wrap { grid-template-columns: 210px minmax(0, 1fr); gap: 48px; } }
.rail { min-width: 0; }
@media (min-width: 1024px) { .rail nav { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 20px); max-height: calc(100vh - 40px); overflow-y: auto; } }
.rail .eyebrow { color: var(--ink-soft); display: block; margin-bottom: 10px; }
.rail ol { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
@media (min-width: 1024px) { .rail ol { display: grid; gap: 2px; } }
.rail a { display: flex; gap: 10px; align-items: baseline; text-decoration: none; color: var(--ink); font-size: 13.5px; padding: 6px 10px; border-radius: 10px; border: 1px solid var(--hair); background: var(--raised); }
@media (min-width: 1024px) { .rail a { border-color: transparent; background: transparent; } .rail a:hover { background: var(--brand-soft); } }
.rail a span { font-family: var(--font-mono); font-size: 11px; color: var(--brand); }

main { min-width: 0; display: grid; gap: 72px; }
.sec { display: grid; gap: 22px; scroll-margin-top: 20px; min-width: 0; }
.sec-head { display: grid; gap: 8px; }
.sec-head .eyebrow { color: var(--brand); }
.sec h2 { font-size: clamp(1.6rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
.sec h3 { font-size: 1.08rem; font-weight: 600; letter-spacing: -0.01em; }
.prose { max-width: 70ch; display: grid; gap: 12px; color: var(--ink); }
.prose.soft, .soft { color: var(--ink-soft); }

.grid2 { display: grid; gap: 16px; }
.grid3 { display: grid; gap: 14px; }
@media (min-width: 768px) { .grid2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1180px) { .grid3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.card { background: var(--raised); border: 1px solid var(--hair); border-radius: var(--r-card); padding: 20px; display: grid; gap: 10px; align-content: start; min-width: 0; }
.card.tint { background: var(--brand-soft); border-color: var(--brand-line); }
.card h3 { display: flex; gap: 10px; align-items: baseline; }
.card ul { display: grid; gap: 6px; }
.card .k { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

.note { border-left: 3px solid var(--brand); background: var(--brand-soft); padding: 14px 16px; border-radius: 0 14px 14px 0; max-width: 78ch; }
.note.risk { border-color: var(--risk); background: var(--risk-soft); }
.note.warn { border-color: var(--warn); background: var(--warn-soft); }
.note strong { font-weight: 600; }

/* ---------- tables ---------- */
.tbl { overflow-x: auto; border: 1px solid var(--hair); border-radius: 16px; background: var(--raised); }
table { border-collapse: collapse; width: 100%; font-size: 13.5px; }
th, td { text-align: left; vertical-align: top; padding: 10px 14px; border-bottom: 1px solid var(--hair); }
tr:last-child td { border-bottom: 0; }
th { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); background: var(--sunk); }
td.m, td .m { font-family: var(--font-mono); font-size: 12.5px; }
td { min-width: 120px; }

/* ---------- code ---------- */
.code { position: relative; background: var(--code-bg); color: var(--code-fg); border-radius: 16px; padding: 40px 18px 16px; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; overflow-x: auto; margin: 0; white-space: pre; }
.code .c { color: var(--code-dim); }
.copy { position: absolute; top: 10px; right: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--code-fg); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 4px 10px; cursor: pointer; }
.copy:hover { background: rgba(255,255,255,0.16); }

/* ---------- steps ---------- */
.steps { list-style: none; padding: 0; display: grid; gap: 14px; counter-reset: s; }
.steps > li { counter-increment: s; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 14px; align-items: start; }
.steps > li::before { content: counter(s, decimal-leading-zero); font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--brand); border: 1px solid var(--brand-line); background: var(--brand-soft); border-radius: 10px; height: 32px; display: grid; place-items: center; }
.steps .body { display: grid; gap: 10px; min-width: 0; padding-top: 4px; }

/* ---------- diagrams ---------- */
figure.dia { margin: 0; background: var(--sunk); border: 1px solid var(--hair); border-radius: var(--r-card); padding: 18px; display: grid; gap: 12px; min-width: 0; }
.dia .scroll { overflow-x: auto; }
.dia svg { display: block; width: 100%; height: auto; min-width: 760px; color: var(--ink-soft); }
.dia figcaption { font-size: 13.5px; color: var(--ink-soft); max-width: 80ch; }
.dia figcaption b { color: var(--ink); font-weight: 600; }
.b { fill: var(--raised); stroke: var(--hair); stroke-width: 1.2; }
.bw { fill: var(--brand-soft); stroke: var(--brand); stroke-width: 1.4; }
.br { fill: var(--raised); stroke: var(--brand-line); stroke-width: 1.2; }
.bx { fill: var(--raised); stroke: var(--brand); stroke-width: 1.3; stroke-dasharray: 5 4; }
.bk { fill: var(--risk-soft); stroke: var(--risk); stroke-width: 1.2; }
.t { fill: var(--ink); font-family: var(--font-sans); font-size: 13px; font-weight: 600; }
.tl { fill: var(--ink); font-family: var(--font-sans); font-size: 15px; font-weight: 700; }
.s { fill: var(--ink-soft); font-family: var(--font-mono); font-size: 11px; }
.sp { fill: var(--brand); font-family: var(--font-mono); font-size: 11px; font-weight: 600; }
.ln { stroke: var(--ink-soft); stroke-width: 1.4; fill: none; }
.lnb { stroke: var(--brand); stroke-width: 1.6; fill: none; }
.lnd { stroke: var(--ink-soft); stroke-width: 1.4; fill: none; stroke-dasharray: 5 4; }
.lnr { stroke: var(--risk); stroke-width: 1.4; fill: none; stroke-dasharray: 5 4; }
.ah { fill: var(--ink-soft); }
.ahb { fill: var(--brand); }

/* ---------- swatches ---------- */
.sw { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 10px; }
.sw div { border: 1px solid var(--hair); border-radius: 14px; overflow: hidden; background: var(--raised); }
.sw i { display: block; height: 52px; }
.sw span { display: block; padding: 8px 10px; font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); }
.sw b { display: block; color: var(--ink); font-family: var(--font-sans); font-size: 12px; font-weight: 600; }

/* ---------- gotchas ---------- */
.tag { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--brand-line); color: var(--brand-ink); background: var(--brand-soft); white-space: nowrap; }
.tag.r { border-color: var(--risk); color: var(--risk); background: var(--risk-soft); }
.tag.w { border-color: var(--warn); color: var(--warn); background: var(--warn-soft); }
.gotcha { gap: 8px; }
.gotcha .top { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
.gotcha p { font-size: 13.5px; color: var(--ink-soft); }
.gotcha p strong { color: var(--ink); font-weight: 600; }

/* ---------- zone file ---------- */
.zone { background: var(--code-bg); color: var(--code-fg); border-radius: 16px; padding: 16px 18px; overflow-x: auto; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.75; }
.zone .h { color: var(--code-dim); }
.zone .p { color: #f6a54a; }
.zone .g { color: #8be0b6; }
.zone .v { color: #c9a4f7; }
.zone table { font-size: 12.5px; min-width: 620px; }
.zone td, .zone th { border: 0; padding: 2px 14px 2px 0; min-width: 0; background: transparent; color: inherit; }
.zone th { color: var(--code-dim); font-size: 10.5px; }

/* ---------- env chips ---------- */
.env { display: grid; gap: 0; border: 1px solid var(--hair); border-radius: 16px; overflow: hidden; background: var(--raised); }
.env > div { display: grid; gap: 8px; padding: 14px 16px; border-bottom: 1px solid var(--hair); }
.env > div:last-child { border-bottom: 0; }
@media (min-width: 768px) { .env > div { grid-template-columns: 170px minmax(0, 1fr); gap: 16px; } }
.env h4 { margin: 0; font-size: 13px; font-weight: 600; }
.env h4 small { display: block; font-weight: 400; color: var(--ink-soft); font-size: 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; align-content: start; }
.chips code { font-size: 11.5px; background: var(--sunk); color: var(--ink); border: 1px solid var(--hair); padding: 2px 8px; border-radius: 8px; }
.chips code.pub { border-color: var(--brand-line); color: var(--brand-ink); background: var(--brand-soft); }

/* ---------- checklist ---------- */
.check { list-style: none; padding: 0; display: grid; gap: 0; border: 1px solid var(--hair); border-radius: 16px; overflow: hidden; background: var(--raised); }
.check li { border-bottom: 1px solid var(--hair); }
.check li:last-child { border-bottom: 0; }
.check label { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 12px; align-items: start; padding: 12px 16px; cursor: pointer; }
.check input { width: 18px; height: 18px; margin-top: 3px; accent-color: var(--brand); }
.check .what { display: grid; gap: 2px; }
.check .what b { font-weight: 600; font-size: 14px; }
.check .what span { color: var(--ink-soft); font-size: 13px; }
.check .who { font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); white-space: nowrap; padding-top: 3px; }
.check input:checked ~ .what b { text-decoration: line-through; color: var(--ink-soft); }
.progress { font-family: var(--font-mono); font-size: 12px; color: var(--ink-soft); }

dl.gl { display: grid; gap: 0; margin: 0; border: 1px solid var(--hair); border-radius: 16px; overflow: hidden; background: var(--raised); }
dl.gl div { display: grid; gap: 4px; padding: 12px 16px; border-bottom: 1px solid var(--hair); }
dl.gl div:last-child { border-bottom: 0; }
@media (min-width: 768px) { dl.gl div { grid-template-columns: 220px minmax(0, 1fr); gap: 16px; } }
dl.gl dt { font-family: var(--font-mono); font-size: 12.5px; font-weight: 600; color: var(--brand-ink); }
dl.gl dd { margin: 0; font-size: 13.5px; color: var(--ink); }

footer.end { border-top: 1px solid var(--hair); padding-top: 22px; color: var(--ink-soft); font-size: 13px; display: grid; gap: 6px; }
</style>

</head>
<body>
<header class="hero">
  <div class="hero-in">
    <div class="eyebrow">Developer handover · for Ben Ma · 15 Oct 2026</div>
    <h1>Fruition Website <span>Handover</span></h1>
    <p class="lede">Everything you need to work on fruitionservices.io: how the monorepo is built, where it runs, how changes ship, what talks to what (Sanity, Cloudflare, monday.com, Marketa, Resend, Calendly) and how to set up Claude Code so it works the way the repo expects. Diagrams first, prose second.</p>
    <dl class="facts">
      <div><dt>Live</dt><dd><a href="https://www.fruitionservices.io">www.fruitionservices.io</a></dd></div>
      <div><dt>Repo (public)</dt><dd><a href="https://github.com/Fruition-Service/fruition-website-monorepo">Fruition-Service/<wbr>fruition-website-monorepo</a></dd></div>
      <div><dt>Mainline</dt><dd>production (no main)</dd></div>
      <div><dt>Runs on</dt><dd>CF Worker fruition-landing</dd></div>
      <div><dt>Stack</dt><dd>Next.js 16, React 19, OpenNext</dd></div>
      <div><dt>CMS</dt><dd>Sanity bt6nb58h / production</dd></div>
      <div><dt>Node</dt><dd>22 (what CI uses)</dd></div>
      <div><dt>Done means</dt><dd>test + typecheck + lint green</dd></div>
    </dl>
  </div>
</header>

<div class="wrap">
  <aside class="rail" aria-label="Contents">
    <nav>
      <span class="eyebrow">Contents</span>
      <ol>
        <li><a href="#start"><span>01</span>Start here</a></li>
        <li><a href="#map"><span>02</span>System map</a></li>
        <li><a href="#setup"><span>03</span>Claude Code + MCP</a></li>
        <li><a href="#repo"><span>04</span>Repo layout</a></li>
        <li><a href="#ship"><span>05</span>Shipping changes</a></li>
        <li><a href="#request"><span>06</span>Request path + cache</a></li>
        <li><a href="#sanity"><span>07</span>Content (Sanity)</a></li>
        <li><a href="#dns"><span>08</span>DNS + email</a></li>
        <li><a href="#integrations"><span>09</span>Leads, booking, social</a></li>
        <li><a href="#marketa"><span>10</span>Marketa contract</a></li>
        <li><a href="#monday"><span>11</span>monday.com boards</a></li>
        <li><a href="#design"><span>12</span>Design rules</a></li>
        <li><a href="#gotchas"><span>13</span>Gotchas</a></li>
        <li><a href="#env"><span>14</span>Env vars</a></li>
        <li><a href="#debt"><span>15</span>Known issues</a></li>
        <li><a href="#glossary"><span>16</span>Glossary</a></li>
      </ol>
    </nav>
  </aside>

  <main>

  <!-- 01 -->
  <section class="sec" id="start">
    <div class="sec-head">
      <div class="eyebrow">01 · Start here</div>
      <h2>Your first day, in order</h2>
    </div>
    <div class="prose">
      <p>One Next.js app, deployed as one Cloudflare Worker, serves the whole site: about 106 marketing pages, 47 Google Ads landing pages, a public AI assistant, the staff portal at <code>/internal</code>, the embedded Sanity Studio and every API route. Merging to <code>production</code> deploys it. That last fact shapes most of the rules below.</p>
    </div>
    <ol class="steps">
      <li><div class="body"><h3>Get access</h3><p class="soft">Work through the checklist below with Edward. Worker secrets cannot be read back from Cloudflare, so values come from the team password manager.</p></div></li>
      <li><div class="body"><h3>Run it locally</h3><p class="soft">The four values pre-filled in <code>.env.example</code> are enough for the public pages. Portal, booking, forms and the assistant each need their own secrets.</p>
<pre class="code">gh repo clone Fruition-Service/fruition-website-monorepo
cd fruition-website-monorepo
npm install                 <span class="c"># also copies the pdf.js worker into public/</span>
cp .env.example .env.local
npm run dev                 <span class="c"># http://localhost:3000</span></pre></div></li>
      <li><div class="body"><h3>Read three files</h3><p class="soft"><code>CLAUDE.md</code> (rules and gotchas, written for agents but best for humans too), <code>DESIGN.md</code> (the design system) and <code>docs/architecture.md</code>. They are kept accurate on purpose: if you change something they describe, fix the doc in the same PR.</p></div></li>
      <li><div class="body"><h3>Set up Claude Code and the MCP servers</h3><p class="soft">Section 03. Start Claude in the repo root so the project rules, hooks and skills load.</p></div></li>
      <li><div class="body"><h3>Ship something small</h3><p class="soft">Branch from <code>production</code>, open a PR, check the preview URL the bot comments, squash-merge when CI is green, then smoke-test the live page. Section 05.</p></div></li>
    </ol>

    <div class="sec-head" style="margin-top:8px"><h3>Access checklist</h3><p class="progress" id="progress">0 of 14 done</p></div>
    <ul class="check" id="checklist">
      <li><label><input type="checkbox" id="acc-gh"><span class="what"><b>GitHub</b><span>Write on Fruition-Service/fruition-website-monorepo (and marketa-monorepo if touching the blog pipeline)</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-cf"><span class="what"><b>Cloudflare</b><span>Member of the "Fruition Services" account: Workers, KV, DNS for both zones</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-sanity"><span class="what"><b>Sanity</b><span>Member of project bt6nb58h (admin if you will run <code>npx sanity deploy</code>)</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-supa"><span class="what"><b>Supabase</b><span>Portal project, plus Marketa's brain project if you need the dashboard data</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-pm"><span class="what"><b>Password manager</b><span>Entry holding every value named in .env.example</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-google"><span class="what"><b>@fruitionservices.io Google account</b><span>Needed to sign in to /internal (domain-locked SSO)</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-monday"><span class="what"><b>monday.com</b><span>Fruition workspace: the dev task board and the lead boards</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-slack"><span class="what"><b>Slack</b><span>#website-blogs and the leads channel, to see what the site posts</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-cal"><span class="what"><b>Calendly</b><span>Shared global account (only if you touch booking)</span></span><span class="who">Josh</span></label></li>
      <li><label><input type="checkbox" id="acc-or"><span class="what"><b>OpenRouter</b><span>All LLM calls go through one key</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-resend"><span class="what"><b>Resend</b><span>Contact form email, domain send.fruitionservices.io</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-zernio"><span class="what"><b>Zernio, RB2B, Umami, GTM</b><span>Only for social, visitor ID, analytics or tagging work</span></span><span class="who">Edward</span></label></li>
      <li><label><input type="checkbox" id="acc-claude"><span class="what"><b>Claude Code</b><span>Installed and signed in (section 03)</span></span><span class="who">You</span></label></li>
      <li><label><input type="checkbox" id="acc-wrangler"><span class="what"><b>wrangler login</b><span>On the Fruition Cloudflare account, for the hand-deployed og-card Worker and secrets</span></span><span class="who">You</span></label></li>
    </ul>
  </section>

  <!-- 02 -->
  <section class="sec" id="map">
    <div class="sec-head">
      <div class="eyebrow">02 · System map</div>
      <h2>One Worker, six surfaces, ten services</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1120 630" role="img" aria-label="Visitors reach Cloudflare, which routes to the fruition-landing Worker serving six surfaces. The Worker talks to ten external services. Marketa, a separate Vercel app, writes into Sanity and shares the portal Supabase table and owns the brain Supabase project. A separate og-card Worker serves social preview images.">
        <defs>
          <marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
          <marker id="a1b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahb"/></marker>
        </defs>
        <!-- visitors -->
        <rect x="20" y="290" width="120" height="70" rx="12" class="b"/>
        <text x="80" y="321" text-anchor="middle" class="t">Visitors</text>
        <text x="80" y="340" text-anchor="middle" class="s">browsers, bots</text>
        <line x1="140" y1="325" x2="168" y2="325" class="ln" marker-end="url(#a1)"/>
        <!-- edge -->
        <rect x="170" y="240" width="160" height="170" rx="12" class="b"/>
        <text x="250" y="272" text-anchor="middle" class="t">Cloudflare</text>
        <text x="250" y="296" text-anchor="middle" class="s">DNS, TLS, CDN</text>
        <text x="250" y="316" text-anchor="middle" class="s">fruitionservices.io</text>
        <text x="250" y="334" text-anchor="middle" class="s">fruitionmonday.com</text>
        <text x="250" y="362" text-anchor="middle" class="sp">static files</text>
        <text x="250" y="378" text-anchor="middle" class="sp">served first</text>
        <line x1="330" y1="325" x2="358" y2="325" class="lnb" marker-end="url(#a1b)"/>
        <!-- og card -->
        <line x1="250" y1="410" x2="250" y2="468" class="ln" marker-end="url(#a1)"/>
        <text x="258" y="444" class="s">/og-card*</text>
        <rect x="170" y="470" width="160" height="76" rx="12" class="b"/>
        <text x="250" y="499" text-anchor="middle" class="t">fruition-og-card</text>
        <text x="250" y="519" text-anchor="middle" class="s">og:image cards</text>
        <text x="250" y="536" text-anchor="middle" class="s">deployed by hand</text>
        <!-- worker -->
        <rect x="360" y="40" width="300" height="568" rx="18" class="bw"/>
        <text x="510" y="72" text-anchor="middle" class="tl">fruition-landing</text>
        <text x="510" y="94" text-anchor="middle" class="s">Worker: Next.js 16 + OpenNext</text>
        <rect x="380" y="116" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="143" class="t">Marketing site</text><text x="398" y="164" class="s">~106 pages, ISR 60s</text>
        <rect x="380" y="196" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="223" class="t">Ad landing pages</text><text x="398" y="244" class="s">/au /uk /us, 47 HTML routes</text>
        <rect x="380" y="276" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="303" class="t">Implementation Calculator</text><text x="398" y="324" class="s">/ask-fruit, public AI chat</text>
        <rect x="380" y="356" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="383" class="t">Staff portal</text><text x="398" y="404" class="s">/internal, Google SSO</text>
        <rect x="380" y="436" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="463" class="t">Sanity Studio</text><text x="398" y="484" class="s">/studio, Sanity login</text>
        <rect x="380" y="516" width="260" height="66" rx="10" class="br"/>
        <text x="398" y="543" class="t">API + webhooks</text><text x="398" y="564" class="s">/api/*, /s/&lt;code&gt;</text>
        <!-- services -->
        <g>
          <line x1="660" y1="63" x2="728" y2="63" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="40" width="230" height="46" rx="10" class="b"/><text x="744" y="60" class="t">Sanity bt6nb58h</text><text x="744" y="77" class="s">CDN reads, token writes</text>
          <line x1="660" y1="121" x2="728" y2="121" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="98" width="230" height="46" rx="10" class="b"/><text x="744" y="118" class="t">Workers KV</text><text x="744" y="135" class="s">ISR page + tag cache</text>
          <line x1="660" y1="179" x2="728" y2="179" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="156" width="230" height="46" rx="10" class="b"/><text x="744" y="176" class="t">Supabase: portal</text><text x="744" y="193" class="s">auth, drafts, invoices, logs</text>
          <line x1="660" y1="237" x2="728" y2="237" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="214" width="230" height="46" rx="10" class="b"/><text x="744" y="234" class="t">Supabase: brain</text><text x="744" y="251" class="s">Marketa's, read-only here</text>
          <line x1="660" y1="295" x2="728" y2="295" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="272" width="230" height="46" rx="10" class="b"/><text x="744" y="292" class="t">monday.com</text><text x="744" y="309" class="s">lead boards, RB2B, onboarding</text>
          <line x1="660" y1="353" x2="728" y2="353" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="330" width="230" height="46" rx="10" class="b"/><text x="744" y="350" class="t">Calendly</text><text x="744" y="367" class="s">shared global account</text>
          <line x1="660" y1="411" x2="728" y2="411" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="388" width="230" height="46" rx="10" class="b"/><text x="744" y="408" class="t">Resend</text><text x="744" y="425" class="s">contact form email</text>
          <line x1="660" y1="469" x2="728" y2="469" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="446" width="230" height="46" rx="10" class="b"/><text x="744" y="466" class="t">Slack</text><text x="744" y="483" class="s">lead fallback, RB2B alerts</text>
          <line x1="660" y1="527" x2="728" y2="527" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="504" width="230" height="46" rx="10" class="b"/><text x="744" y="524" class="t">OpenRouter</text><text x="744" y="541" class="s">every LLM call</text>
          <line x1="660" y1="585" x2="728" y2="585" class="ln" marker-end="url(#a1)"/>
          <rect x="730" y="562" width="230" height="46" rx="10" class="b"/><text x="744" y="582" class="t">Zernio</text><text x="744" y="599" class="s">social scheduling</text>
        </g>
        <!-- marketa -->
        <rect x="1000" y="40" width="108" height="220" rx="12" class="bx"/>
        <text x="1054" y="112" text-anchor="middle" class="t">Marketa</text>
        <text x="1054" y="130" text-anchor="middle" class="s">Vercel app</text>
        <text x="1054" y="146" text-anchor="middle" class="s">blog engine</text>
        <line x1="1000" y1="63" x2="962" y2="63" class="lnb" marker-end="url(#a1b)"/>
        <text x="1008" y="67" class="sp">writes</text>
        <line x1="1000" y1="179" x2="962" y2="179" class="lnb" marker-end="url(#a1b)"/>
        <text x="1008" y="183" class="sp">shares</text>
        <line x1="1000" y1="237" x2="962" y2="237" class="lnb" marker-end="url(#a1b)"/>
        <text x="1008" y="241" class="sp">owns</text>
      </svg>
      </div>
      <figcaption><b>Everything that serves traffic is one Worker.</b> It reads Sanity through the CDN, caches pages in Workers KV and calls every other service server-side from <code>src/lib/</code>. Marketa is a separate app on Vercel that never calls the site's API; it couples to the site through shared data (purple arrows, section 10).</figcaption>
    </figure>

    <div class="tbl"><table>
      <thead><tr><th>Surface</th><th>Path</th><th>What to know</th></tr></thead>
      <tbody>
        <tr><td>Marketing site</td><td class="m">most routes</td><td>Statically rendered, ISR every 60s. Copy is a mix of code (<code>src/data/*</code>) and Sanity.</td></tr>
        <tr><td>Ad landing pages</td><td class="m">/au/* /uk/* /us/*</td><td><code>route.ts</code> + an HTML string in <code>content.ts</code>. They bypass the React root layout and use <code>src/lib/landingPage.ts</code> and a hand-mirrored theme.</td></tr>
        <tr><td>Implementation Calculator</td><td class="m">/ask-fruit + launcher</td><td>Public AI assistant (was "Ask Fruit", then "Fruitai"). Streams from OpenRouter with per-visitor, per-IP and daily dollar limits stored in Supabase.</td></tr>
        <tr><td>Staff portal</td><td class="m">/internal/*</td><td>Blog editor, social composer, design docs, invoices, QR, team, onboarding. Supabase Auth + Google SSO, <code>@fruitionservices.io</code> only. shadcn/ui only.</td></tr>
        <tr><td>Sanity Studio</td><td class="m">/studio</td><td>Embedded, ships with every deploy. A second, hosted Studio exists on sanity.io (section 07).</td></tr>
        <tr><td>API + webhooks</td><td class="m">/api/*, /s/&lt;code&gt;</td><td>Leads, booking, the assistant, portal APIs, Calendly / monday / RB2B webhooks, link shortener.</td></tr>
      </tbody>
    </table></div>
  </section>

  <!-- 03 -->
  <section class="sec" id="setup">
    <div class="sec-head">
      <div class="eyebrow">03 · Claude Code + MCP</div>
      <h2>Set up Claude so it follows the repo's rules</h2>
    </div>
    <div class="prose"><p>Most work on this repo is done with Claude Code. The repo ships its own agent configuration in <code>.claude/</code>, and it only loads when Claude is started from the repo root. The MCP servers below give Claude direct access to Sanity, monday.com, Supabase and Cloudflare logs.</p></div>

    <ol class="steps">
      <li><div class="body"><h3>Install and start Claude Code in the repo root</h3>
<pre class="code">npm install -g @anthropic-ai/claude-code
cd fruition-website-monorepo
claude</pre>
        <p class="soft">Starting it from a parent folder means none of the project skills, hooks or the <code>/ship</code> command load. The desktop app works too: open the repo folder as the project.</p></div></li>
      <li><div class="body"><h3>Know what loads automatically</h3>
        <div class="tbl"><table>
          <thead><tr><th>File</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td class="m">CLAUDE.md, AGENTS.md</td><td>Working rules and the gotchas list. AGENTS.md points other agents (Codex, Cursor) at the same file.</td></tr>
            <tr><td class="m">.claude/settings.json</td><td>Allows tests, lint, typecheck and read-only git without prompting. <b>Asks</b> before deploy, upload, <code>git push</code>, <code>gh pr merge</code>. <b>Denies</b> reading <code>.env*</code> and <code>.dev.vars</code>, and force-push.</td></tr>
            <tr><td class="m">.claude/hooks/design-guard.mjs</td><td>Runs after every edit under <code>src/</code>. Blocks raw hex colours, inline layout styles and off-system breakpoints. If it fires, fix the code; do not bypass it.</td></tr>
            <tr><td class="m">.claude/skills/*</td><td><code>/design-system</code>, <code>/page-authoring</code>, <code>/sanity-content</code>, <code>/cloudflare-deploy</code>, <code>/integrations</code>. Claude picks them up by task; you can also call them by name.</td></tr>
            <tr><td class="m">.claude/agents/*</td><td>Two review subagents: <code>content-tracer</code> (where does this copy come from) and <code>page-auditor</code>.</td></tr>
            <tr><td class="m">.claude/commands/ship.md</td><td><code>/ship</code>: commit, push, open the PR, wait for CI, squash-merge. Section 05.</td></tr>
            <tr><td class="m">.claude/launch.json</td><td>Dev server definitions (<code>dev</code> on 3000, <code>dev-nav-v2</code> on 3005) for the desktop app's preview pane.</td></tr>
          </tbody>
        </table></div></div></li>
      <li><div class="body"><h3>Add the MCP servers (once, user scope)</h3>
        <p class="soft">All four are hosted servers that sign you in with OAuth the first time you use them (run <code>/mcp</code> inside Claude to authenticate or check status). They act as <em>you</em>, so they see only what your accounts can see.</p>
<pre class="code"><span class="c"># Sanity: content queries, patches, schema inspection</span>
claude mcp add --scope user --transport http sanity https://mcp.sanity.io

<span class="c"># monday.com: dev task board, lead boards</span>
claude mcp add --scope user --transport http monday https://mcp.monday.com/mcp

<span class="c"># Supabase: portal project, read-only (migrations are applied by hand)</span>
claude mcp add --scope user --transport http supabase "https://mcp.supabase.com/mcp?project_ref=jnmdtrgtxdjfhbdkdvja&amp;read_only=true"

<span class="c"># Cloudflare: Worker logs and errors (deploys stay on wrangler)</span>
claude mcp add --scope user --transport http cf-observability https://observability.mcp.cloudflare.com/mcp</pre>
        <p class="soft">Using claude.ai or the desktop app instead? Enable the Sanity, monday.com and Supabase connectors under Settings, Connectors. Same tools, no CLI step.</p></div></li>
      <li><div class="body"><h3>Sign in the CLIs Claude will call</h3>
<pre class="code">gh auth login                <span class="c"># PRs, CI status, merges</span>
npx wrangler login           <span class="c"># pick the Fruition Services account</span>
npx wrangler whoami          <span class="c"># confirm it is Fruition, not a personal account</span></pre></div></li>
    </ol>

    <div class="tbl"><table>
      <thead><tr><th>Server</th><th>Use it for</th><th>Rules to give Claude</th></tr></thead>
      <tbody>
        <tr><td class="m">sanity</td><td>Reading documents, checking the deployed schema, patching content, publishing drafts.</td><td>Always pass project <code>bt6nb58h</code>, dataset <code>production</code>. Run <code>get_schema</code> before writing. Document ids containing a dot are private and invisible to the public site. Never rewrite page copy during design work.</td></tr>
        <tr><td class="m">monday</td><td>Reading the dev task board, checking where a lead landed, board/column ids.</td><td>Boards are production. Never leave a real person in an Owner column on a test item (it notifies them). Delete test items immediately.</td></tr>
        <tr><td class="m">supabase</td><td>Inspecting portal tables (drafts, invoices, assistant logs, short links).</td><td>Keep it read-only. Schema changes go in <code>supabase/migrations/</code> and are pasted into the SQL editor by hand.</td></tr>
        <tr><td class="m">cf-observability</td><td>Worker errors and logs after a deploy.</td><td>Deploys, secrets and rollbacks go through wrangler and GitHub Actions, not MCP.</td></tr>
        <tr><td class="m">google-ads-fruition</td><td>Optional. Lives on Edward's machine (<code>docs/google-ads-mcp.md</code>).</td><td>Writes are dry runs by default; live spend is about A$350/day. Ask before applying anything.</td></tr>
      </tbody>
    </table></div>

    <div class="note warn"><strong>Verifying UI with Claude.</strong> The desktop app's browser pane can return blank screenshots on this site and report every image as unloaded. Use DOM checks there, and Playwright for real pixels: the script must live inside the repo, and launch with <code>chromium.launch({ channel: 'chromium' })</code>. Check 375, 768 and 1440 wide.</div>
  </section>

  <!-- 04 -->
  <section class="sec" id="repo">
    <div class="sec-head">
      <div class="eyebrow">04 · Repo layout</div>
      <h2>Where things live</h2>
    </div>
    <div class="grid2">
      <div class="card">
        <span class="k">src/</span>
        <ul>
          <li><code>app/</code> every route, flat (no route groups). <code>globals.css</code> holds all design tokens.</li>
          <li><code>components/sections/</code> shared marketing building blocks. <code>ui/</code> is shadcn, portal only.</li>
          <li><code>data/</code> code-owned copy: practice pages, region pages, messaging channels, offices, nav.</li>
          <li><code>features/content/loaders.ts</code> + <code>sanity/queries.ts</code> all Sanity reads.</li>
          <li><code>lib/</code> every server-side integration client, portal auth, metadata, tests.</li>
          <li><code>sanity/schemas/</code> document types, registered in <code>index.ts</code>.</li>
          <li><code>middleware.ts</code> canonical host 301s, markdown twins for agents.</li>
          <li><code>redirects.ts</code> (892 Wix redirects), <code>tagRedirects.ts</code> (241): generated, never hand-edit.</li>
        </ul>
      </div>
      <div class="card">
        <span class="k">Outside src/</span>
        <ul>
          <li><code>workers/og-card/</code> separate Worker for og:image cards. Deployed by hand.</li>
          <li><code>supabase/migrations/</code> portal SQL, applied by hand in the SQL editor.</li>
          <li><code>scripts/</code> one-off migrations, Sanity seeds, generators, Playwright QA (<code>qa-*.mjs</code>).</li>
          <li><code>public/</code> static assets, PDFs, <code>llms.txt</code>, markdown twins, <code>ask-fruit-knowledge.json</code> (generated).</li>
          <li><code>docs/</code> architecture, cloud, topic notes. <code>docs/archive/</code> is history only.</li>
          <li><code>.github/workflows/</code> <code>ci.yml</code>, <code>deploy.yml</code>, <code>vault-sync.yml</code>.</li>
          <li><code>wrangler.jsonc</code>, <code>open-next.config.ts</code> Worker and cache config.</li>
        </ul>
      </div>
    </div>
    <div class="tbl"><table>
      <thead><tr><th>Command</th><th>What it does</th><th>When</th></tr></thead>
      <tbody>
        <tr><td class="m">npm test</td><td>vitest, about 470 tests, ~6s</td><td>Every change</td></tr>
        <tr><td class="m">npm run typecheck</td><td>tsc against tsconfig.ci.json (src/ only)</td><td>Every change, CI gate</td></tr>
        <tr><td class="m">npm run lint</td><td>ESLint, 0 errors required, warnings allowed</td><td>Every change, CI gate</td></tr>
        <tr><td class="m">npm run build</td><td>next build, ~2 min, reads live Sanity</td><td>next.config, deps, route structure</td></tr>
        <tr><td class="m">npm run preview</td><td>OpenNext build, then the real Worker locally</td><td>Anything that depends on the Workers runtime</td></tr>
      </tbody>
    </table></div>
  </section>

  <!-- 05 -->
  <section class="sec" id="ship">
    <div class="sec-head">
      <div class="eyebrow">05 · Shipping changes</div>
      <h2>Merging to production is deploying</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1080 300" role="img" aria-label="A feature branch becomes a pull request into production. CI runs typecheck, test and lint while deploy.yml uploads a preview Worker version and comments its URL. After a squash-merge, deploy.yml runs npm run deploy and the site is live within minutes. Rollback is a git revert or wrangler rollback.">
        <defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
        <marker id="a2b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahb"/></marker></defs>
        <rect x="20" y="110" width="170" height="64" rx="12" class="b"/><text x="36" y="137" class="t">Feature branch</text><text x="36" y="157" class="s">cut from production</text>
        <line x1="190" y1="142" x2="228" y2="142" class="ln" marker-end="url(#a2)"/>
        <rect x="230" y="110" width="170" height="64" rx="12" class="b"/><text x="246" y="137" class="t">Pull request</text><text x="246" y="157" class="s">into production</text>
        <polyline points="400,142 420,142 420,72 438,72" class="ln" marker-end="url(#a2)"/>
        <polyline points="420,142 420,212 438,212" class="ln" marker-end="url(#a2)"/>
        <rect x="440" y="40" width="190" height="64" rx="12" class="b"/><text x="456" y="67" class="t">ci.yml</text><text x="456" y="87" class="s">typecheck, test, lint</text>
        <rect x="440" y="180" width="190" height="64" rx="12" class="b"/><text x="456" y="207" class="t">deploy.yml: preview</text><text x="456" y="227" class="s">upload, URL on the PR</text>
        <polyline points="630,72 650,72 650,142 668,142" class="ln" marker-end="url(#a2)"/>
        <polyline points="630,212 650,212 650,142" class="ln"/>
        <rect x="670" y="110" width="160" height="64" rx="12" class="bw"/><text x="686" y="137" class="t">Squash-merge</text><text x="686" y="157" class="s">only when green</text>
        <line x1="830" y1="142" x2="868" y2="142" class="lnb" marker-end="url(#a2b)"/>
        <rect x="870" y="110" width="190" height="64" rx="12" class="b"/><text x="886" y="137" class="t">deploy.yml: deploy</text><text x="886" y="157" class="s">npm run deploy</text>
        <line x1="965" y1="174" x2="965" y2="228" class="lnb" marker-end="url(#a2b)"/>
        <rect x="870" y="230" width="190" height="56" rx="12" class="bw"/><text x="886" y="254" class="t">www.fruitionservices.io</text><text x="886" y="273" class="s">live in a few minutes</text>
        <polyline points="870,262 750,262 750,177" class="lnr" marker-end="url(#a2)"/>
        <text x="758" y="198" class="s">rollback:</text>
        <text x="758" y="213" class="s">git revert, or</text>
        <text x="758" y="228" class="s">wrangler rollback</text>
      </svg>
      </div>
      <figcaption><b>Two workflows run on every PR.</b> <code>ci.yml</code> gates the merge; <code>deploy.yml</code> uploads a new Worker version without moving traffic and comments a <code>*.workers.dev</code> preview URL. After the merge, <code>deploy.yml</code> deploys to the live Worker. ISR pages can keep serving the old render for up to 60s after a deploy or rollback.</figcaption>
    </figure>
    <div class="grid2">
      <div class="card">
        <h3>The normal release</h3>
        <ul>
          <li>Branch from <code>origin/production</code>, never from a long-lived feature branch: they drift behind fast. Rebase before assuming a conflict is real.</li>
          <li>Open the preview URL from the PR comment and test the change there, not only in <code>next dev</code>.</li>
          <li>Squash-merge, wait for the deploy job, then smoke-test production: home, a region page, <code>/pricing</code>, a blog post, <code>/contact-us#book</code>, and <code>/internal</code> login if you touched the portal.</li>
          <li>In Claude, <code>/ship</code> does the whole sequence and refuses to merge on a red or pending check.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Not deployed by CI</h3>
        <ul>
          <li><b>og-card Worker:</b> <code>cd workers/og-card &amp;&amp; npm install &amp;&amp; npx wrangler deploy</code>. Bump <code>OG_CARD_VERSION</code> in <code>src/lib/metadata.ts</code> after a design change.</li>
          <li><b>Supabase migrations:</b> paste into the portal project's SQL editor; keep the file as the record.</li>
          <li><b>Hosted Sanity Studio:</b> <code>npx sanity login &amp;&amp; npx sanity deploy</code> from a clean <code>production</code> checkout.</li>
          <li><b>Runtime secrets:</b> <code>npx wrangler secret put NAME</code> or the dashboard. CI passes only the three public Sanity values.</li>
        </ul>
      </div>
    </div>
    <div class="note risk"><strong><code>.claude/scripts/ship.sh</code> is not safe to poke at.</strong> A bare run really pushes, opens a PR and merges to production. Use <code>--dry-run</code> to test it. <code>ship.sh --help</code> is not a help flag: unknown first arguments become the commit message, and it ships. Read <code>.claude/commands/ship.md</code> instead.</div>
    <div class="note"><strong>If PR checks never start:</strong> GitHub silently skips <code>pull_request</code> workflows on a conflicting PR, and occasionally just fails to schedule them. Rebase, or close and reopen the PR. The workflows have no manual trigger.</div>
  </section>

  <!-- 06 -->
  <section class="sec" id="request">
    <div class="sec-head">
      <div class="eyebrow">06 · Request path + cache</div>
      <h2>What happens to one request</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1080 250" role="img" aria-label="A request needs a proxied DNS record before any Worker route fires. Static files are served before the Worker runs. middleware.ts then redirects legacy hosts and markdown requests. A KV cache hit returns cached HTML; a miss renders on the Worker, reading Sanity via the CDN.">
        <defs><marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>
        <rect x="20" y="40" width="150" height="70" rx="12" class="b"/><text x="34" y="70" class="t">Request</text><text x="34" y="90" class="s">any of 4 hosts</text>
        <line x1="170" y1="75" x2="198" y2="75" class="ln" marker-end="url(#a3)"/>
        <rect x="200" y="40" width="150" height="70" rx="12" class="b"/><text x="214" y="70" class="t">Proxied DNS</text><text x="214" y="90" class="s">record exists?</text>
        <line x1="350" y1="75" x2="378" y2="75" class="ln" marker-end="url(#a3)"/>
        <rect x="380" y="40" width="150" height="70" rx="12" class="b"/><text x="394" y="70" class="t">Static file?</text><text x="394" y="90" class="s">public/, _next/static</text>
        <line x1="530" y1="75" x2="558" y2="75" class="ln" marker-end="url(#a3)"/>
        <rect x="560" y="40" width="150" height="70" rx="12" class="bw"/><text x="574" y="70" class="t">middleware.ts</text><text x="574" y="90" class="s">host + Accept</text>
        <line x1="710" y1="75" x2="738" y2="75" class="ln" marker-end="url(#a3)"/>
        <rect x="740" y="40" width="150" height="70" rx="12" class="b"/><text x="754" y="70" class="t">ISR cache</text><text x="754" y="90" class="s">Workers KV</text>
        <line x1="890" y1="75" x2="918" y2="75" class="ln" marker-end="url(#a3)"/>
        <text x="896" y="66" class="s">miss</text>
        <rect x="920" y="40" width="150" height="70" rx="12" class="bw"/><text x="934" y="70" class="t">Render</text><text x="934" y="90" class="s">Next.js on Worker</text>

        <line x1="275" y1="110" x2="275" y2="168" class="lnr" marker-end="url(#a3)"/><text x="283" y="144" class="s">no</text>
        <rect x="200" y="170" width="150" height="64" rx="12" class="bk"/><text x="214" y="197" class="t">Route never fires</text><text x="214" y="217" class="s">the site goes dark</text>
        <line x1="455" y1="110" x2="455" y2="168" class="ln" marker-end="url(#a3)"/><text x="463" y="144" class="s">yes</text>
        <rect x="380" y="170" width="150" height="64" rx="12" class="b"/><text x="394" y="197" class="t">Served directly</text><text x="394" y="217" class="s">Worker never runs</text>
        <line x1="635" y1="110" x2="635" y2="168" class="ln" marker-end="url(#a3)"/><text x="643" y="144" class="s">redirect</text>
        <rect x="560" y="170" width="150" height="64" rx="12" class="b"/><text x="574" y="197" class="t">301 / 307</text><text x="574" y="217" class="s">to www or .md twin</text>
        <line x1="815" y1="110" x2="815" y2="168" class="ln" marker-end="url(#a3)"/><text x="823" y="144" class="s">hit</text>
        <rect x="740" y="170" width="150" height="64" rx="12" class="b"/><text x="754" y="197" class="t">Cached HTML</text><text x="754" y="217" class="s">s-maxage=60</text>
        <line x1="995" y1="110" x2="995" y2="168" class="ln" marker-end="url(#a3)"/><text x="1003" y="144" class="s">reads</text>
        <rect x="920" y="170" width="150" height="64" rx="12" class="b"/><text x="934" y="197" class="t">Sanity via CDN</text><text x="934" y="217" class="s">result kept in KV</text>
      </svg>
      </div>
      <figcaption><b>Static files win before your code runs.</b> That is why a middleware <em>rewrite</em> to a file in <code>public/</code> works in <code>next dev</code> and 404s on Cloudflare: use a redirect, and verify middleware changes on the PR preview URL.</figcaption>
    </figure>
    <div class="grid3">
      <div class="card"><h3>Static by default</h3><p class="soft">Marketing routes are prerendered. A <code>headers()</code> or <code>cookies()</code> call anywhere in <code>src/app/layout.tsx</code> turns every route dynamic. It happened once: 163 of 165 routes went <code>no-store</code> with 1.4 to 2.3s TTFB. Request-specific data is fetched client-side (see <code>/api/visitor-region</code>).</p></div>
      <div class="card"><h3>60 seconds, everywhere</h3><p class="soft">The root layout sets <code>revalidate = 60</code> and the lowest value wins, so every page refreshes within a minute. There is <b>no Sanity webhook</b>: Studio edits and Marketa publishes appear on the next request after the window.</p></div>
      <div class="card"><h3>On-demand revalidation</h3><p class="soft">Portal publishes call <code>revalidateBlogPaths()</code> in <code>src/lib/revalidateSite.ts</code>. It only works because <code>NEXT_TAG_CACHE_KV</code> is bound in <code>wrangler.jsonc</code>; remove it and revalidation silently does nothing. Pass concrete URLs, untyped.</p></div>
      <div class="card"><h3>10 MiB Worker limit</h3><p class="soft">The Worker sits close to Cloudflare's compressed size cap (about 115 KiB headroom at last measure). Prefer dynamic imports for heavy client libraries, check the size in deploy output, and never add wasm-heavy dependencies. That is why og-card is its own Worker.</p></div>
      <div class="card"><h3>Runtime switches that stay put</h3><p class="soft">Keep <code>src/middleware.ts</code> (Next 16's <code>proxy.ts</code> compiles to Node, which OpenNext rejects). Keep <code>keep_names: false</code> in <code>wrangler.jsonc</code>; turning it on throws <code>__name is not defined</code> on every page.</p></div>
      <div class="card"><h3>Local Worker testing</h3><p class="soft"><code>npm run preview</code> redirects to <code>www.localhost</code> because of the canonical-host middleware. After a build, run <code>npx wrangler dev --local-upstream www.fruitionservices.io --port 8787</code>, and move <code>.wrangler/state</code> aside to bypass the prerendered cache.</p></div>
    </div>
  </section>

  <!-- 07 -->
  <section class="sec" id="sanity">
    <div class="sec-head">
      <div class="eyebrow">07 · Content (Sanity)</div>
      <h2>Five ways in, one way out</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1080 360" role="img" aria-label="Five writers put content into the Sanity lake: the staff portal through one shared token, the embedded and hosted Studios, Marketa, and the monday onboarding webhook. Pages read it through the CDN read client, which rewrites Calendly links, and merge it with code-owned copy where an editor field exists.">
        <defs><marker id="a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>
        <rect x="20" y="30" width="230" height="52" rx="10" class="b"/><text x="34" y="52" class="t">Staff portal /internal</text><text x="34" y="70" class="s">one shared write token</text>
        <rect x="20" y="94" width="230" height="52" rx="10" class="b"/><text x="34" y="116" class="t">Embedded Studio /studio</text><text x="34" y="134" class="s">Sanity login, paid seats</text>
        <rect x="20" y="158" width="230" height="52" rx="10" class="b"/><text x="34" y="180" class="t">Hosted Studio (sanity.io)</text><text x="34" y="198" class="s">needs npx sanity deploy</text>
        <rect x="20" y="222" width="230" height="52" rx="10" class="bx"/><text x="34" y="244" class="t">Marketa (Vercel)</text><text x="34" y="262" class="s">publishes blog posts</text>
        <rect x="20" y="286" width="230" height="52" rx="10" class="b"/><text x="34" y="308" class="t">monday onboarding webhook</text><text x="34" y="326" class="s">creates teamMember docs</text>
        <line x1="250" y1="56" x2="298" y2="56" class="ln" marker-end="url(#a4)"/>
        <line x1="250" y1="120" x2="298" y2="120" class="ln" marker-end="url(#a4)"/>
        <line x1="250" y1="184" x2="298" y2="184" class="ln" marker-end="url(#a4)"/>
        <line x1="250" y1="248" x2="298" y2="248" class="ln" marker-end="url(#a4)"/>
        <line x1="250" y1="312" x2="298" y2="312" class="ln" marker-end="url(#a4)"/>
        <rect x="300" y="30" width="210" height="308" rx="18" class="bw"/>
        <text x="405" y="160" text-anchor="middle" class="tl">Sanity lake</text>
        <text x="405" y="182" text-anchor="middle" class="s">bt6nb58h / production</text>
        <text x="405" y="204" text-anchor="middle" class="s">~25 document types</text>
        <rect x="570" y="30" width="200" height="76" rx="10" class="b"/><text x="584" y="54" class="t">Code-owned copy</text><text x="584" y="74" class="s">src/data/*, home/data.ts</text><text x="584" y="92" class="s">*Content.tsx</text>
        <line x1="510" y1="188" x2="568" y2="188" class="ln" marker-end="url(#a4)"/><text x="522" y="180" class="s">reads</text>
        <rect x="570" y="150" width="200" height="76" rx="10" class="b"/><text x="584" y="174" class="t">Read client</text><text x="584" y="194" class="s">useCdn: true</text><text x="584" y="212" class="s">rewriteBookingLinks()</text>
        <polyline points="770,68 795,68 795,160 828,160" class="ln" marker-end="url(#a4)"/>
        <line x1="770" y1="188" x2="828" y2="188" class="ln" marker-end="url(#a4)"/>
        <rect x="830" y="110" width="230" height="120" rx="12" class="bw"/>
        <text x="846" y="138" class="t">Rendered page</text>
        <text x="846" y="160" class="s">code copy is the default;</text>
        <text x="846" y="178" class="s">Sanity overrides it where</text>
        <text x="846" y="196" class="s">an editor field exists</text>
        <text x="846" y="216" class="sp">no generic block renderer</text>
      </svg>
      </div>
      <figcaption><b>Pages are hand-written React, not assembled from Sanity blocks.</b> Sanity supplies data (logos, testimonials, FAQs, posts, region overrides). Adding a block type in Sanity renders nothing. Every Sanity read passes through <code>rewriteBookingLinks()</code>, which turns any stored Calendly URL into <code>/contact-us#book</code>.</figcaption>
    </figure>
    <div class="grid2">
      <div class="card">
        <h3>The seat trick</h3>
        <p class="soft">Sanity charges per editor seat. Staff write through the portal, which publishes with one shared <code>SANITY_WRITE_TOKEN</code> (<code>src/lib/sanityWriteClient.ts</code>), so they never need a seat. The same token is set in Marketa: rotating it means updating Cloudflare and Vercel.</p>
      </div>
      <div class="card">
        <h3>Two Studios, two deploys</h3>
        <p class="soft"><code>/studio</code> on the site is current the moment a PR merges. The hosted Studio on sanity.io (the one the content team uses) only updates on <code>npx sanity deploy</code>, which needs a human login because the write token lacks deploy rights. Stale hosted schema shows up as "Unknown field" banners for editors.</p>
      </div>
    </div>
    <div class="tbl"><table>
      <thead><tr><th>Content trap</th><th>What to do</th></tr></thead>
      <tbody>
        <tr><td>FAQs have two sources</td><td>A page's own <code>faqTabs</code> field and central <code>faqItem</code> documents. Always go through <code>resolveFaqTabs()</code>. FAQ JSON-LD comes only from <code>FaqAccordion</code>, built from the tabs it renders.</td></tr>
        <tr><td>"900+ implementations"</td><td>Lives in code strings, Sanity strings and the <code>proofStats</code> singleton. Change all three together.</td></tr>
        <tr><td>Videos</td><td>A video added in Sanity emits no <code>VideoObject</code> until <code>scripts/sync-video-catalog.mjs</code> regenerates the catalog.</td></tr>
        <tr><td>Blog body images</td><td>Must be Sanity-hosted. A remote <code>![](url)</code> publishes as a link; the publish paths sideload images first.</td></tr>
        <tr><td>Document ids with dots</td><td>Are private: unauthenticated queries cannot see them. Public ids must be dot-free.</td></tr>
        <tr><td>Old Wix image refs</td><td>Some legacy refs are malformed and make <code>urlFor()</code> throw. Guard with try/catch.</td></tr>
        <tr><td>NDA clients</td><td>Must never appear in client lists or logo walls, even when the list is regenerated from the CRM. Check with Edward before regenerating.</td></tr>
        <tr><td>GROQ projections</td><td>Not type-checked. A field missing from the projection is <code>undefined</code> at runtime, silently.</td></tr>
      </tbody>
    </table></div>
  </section>

  <!-- 08 -->
  <section class="sec" id="dns">
    <div class="sec-head">
      <div class="eyebrow">08 · DNS + email (Cloudflare)</div>
      <h2>Two zones, one Worker, Google mail, Resend for the site</h2>
    </div>
    <div class="prose"><p>Both domains are Cloudflare zones on the <b>Fruition Services</b> account (nameservers <code>rayne</code> and <code>steven.ns.cloudflare.com</code>). Both were imported from Wix. The Worker is attached by <b>zone routes</b> in <code>wrangler.jsonc</code>, so routing lives in the repo and DNS only has to make each hostname resolvable through Cloudflare's proxy.</p></div>
    <div class="zone" role="region" aria-label="fruitionservices.io records">
      <div class="h">; zone fruitionservices.io (primary)</div>
      <table>
        <thead><tr><th>name</th><th>type</th><th>points to</th><th>proxy</th><th>purpose</th></tr></thead>
        <tbody>
          <tr><td>@</td><td>AAAA</td><td>100::</td><td class="p">proxied</td><td class="h">placeholder so route fruitionservices.io/* fires, then 301 to www</td></tr>
          <tr><td>www</td><td>CNAME</td><td>apex</td><td class="p">proxied</td><td class="h">route www.fruitionservices.io/* to fruition-landing</td></tr>
          <tr><td>www/og-card*</td><td>route</td><td class="v">fruition-og-card</td><td></td><td class="h">more specific route wins</td></tr>
          <tr><td>@</td><td>MX</td><td>aspmx.l.google.com (+4 alt)</td><td class="g">dns only</td><td class="h">Google Workspace mail</td></tr>
          <tr><td>@</td><td>TXT</td><td>v=spf1 include:_spf.google.com include:sendgrid.net ~all</td><td class="g">dns only</td><td class="h">SPF</td></tr>
          <tr><td>_dmarc</td><td>TXT</td><td>p=quarantine</td><td class="g">dns only</td><td class="h">DMARC reports to Josh</td></tr>
          <tr><td>send</td><td>MX + TXT</td><td>amazonses (ap-northeast-1)</td><td class="g">dns only</td><td class="h">Resend return path</td></tr>
          <tr><td>resend._domainkey</td><td>TXT</td><td>DKIM key</td><td class="g">dns only</td><td class="h">Resend signing</td></tr>
          <tr><td>s1, s2, sel1._domainkey, sg</td><td>CNAME</td><td>*.ascendbywix.com</td><td class="g">dns only</td><td class="h">legacy Wix/SendGrid mail; left alone on purpose</td></tr>
        </tbody>
      </table>
      <div class="h" style="margin-top:14px">; zone fruitionmonday.com (legacy Wix domain)</div>
      <table>
        <tbody>
          <tr><td>@, www</td><td>proxied</td><td>routes to fruition-landing</td><td class="p">proxied</td><td class="h">middleware 301s to https://www.fruitionservices.io</td></tr>
          <tr><td>@</td><td>MX</td><td>aspmx.l.google.com (+4 alt)</td><td class="g">dns only</td><td class="h">Google Workspace mail</td></tr>
        </tbody>
      </table>
    </div>
    <p class="soft" style="font-size:13px">Record shapes as audited in September 2026 plus a live lookup on 15 Oct. Check the dashboard before editing; it is the source of truth.</p>
    <div class="grid2">
      <div class="note risk"><strong>A Worker route only fires if its hostname has a proxied DNS record.</strong> In August 2026 someone deleted the old Wix A records and the site went down. To change apex records, add the new proxied record first, then delete the old one. A <code>www</code> CNAME cannot coexist with another record, so patch its content in place. Never delete-then-add.</div>
      <div class="note"><strong>House rules for the zones.</strong> Keep Cloudflare's managed <code>robots.txt</code> <b>off</b>; the app serves its own. After changing site-wide cache headers, purge the zone once. <code>fruition-services.io</code> hosts are also 301'd by middleware if they ever reach the Worker.</div>
    </div>
    <div class="grid2">
      <div class="card">
        <h3>Resend (site email)</h3>
        <ul>
          <li>Only the contact form sends email: <code>src/app/api/contact/route.ts</code>.</li>
          <li>Sender defaults to <code>website@fruitionservices.io</code>; override with <code>CONTACT_FROM</code>. Recipient is <code>CONTACT_TO</code>.</li>
          <li>The Resend send must succeed before the lead is written to monday; Slack is the fallback.</li>
          <li>Domain verified via <code>send.</code> (SES, Tokyo region) and <code>resend._domainkey</code>.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Two Cloudflare logins exist</h3>
        <p class="soft">If something 403s, check which identity you are signed in as before asking for permissions. Edward's personal Cloudflare login sees none of Fruition; the <code>@fruitionservices.io</code> login is the one with DNS and Worker rights. <code>npx wrangler whoami</code> tells you which account wrangler is using.</p>
      </div>
    </div>
  </section>

  <!-- 09 -->
  <section class="sec" id="integrations">
    <div class="sec-head">
      <div class="eyebrow">09 · Leads, booking, social</div>
      <h2>Where a form submission goes</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1100 320" role="img" aria-label="The contact form sends a Resend email first, then both form types pass through the leadNotify classifier. Leads land on the Fruition CRM ILE board, non-leads on Website Enquiries, and Slack is the fallback if monday fails. monday automations create regional CRM records, and the ile-regional-linker Worker links them back every five minutes.">
        <defs><marker id="a5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
        <marker id="a5b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahb"/></marker></defs>
        <rect x="20" y="40" width="190" height="64" rx="12" class="b"/><text x="36" y="67" class="t">Contact form</text><text x="36" y="87" class="s">POST /api/contact</text>
        <rect x="20" y="200" width="190" height="64" rx="12" class="b"/><text x="36" y="227" class="t">Ad + CRO forms</text><text x="36" y="247" class="s">POST /api/leads</text>
        <line x1="210" y1="72" x2="248" y2="72" class="ln" marker-end="url(#a5)"/>
        <rect x="250" y="40" width="180" height="64" rx="12" class="b"/><text x="266" y="67" class="t">Resend email</text><text x="266" y="87" class="s">must succeed first</text>
        <polyline points="430,72 450,72 450,140 468,140" class="ln" marker-end="url(#a5)"/>
        <polyline points="210,232 450,232 450,164 468,164" class="ln" marker-end="url(#a5)"/>
        <rect x="470" y="120" width="200" height="64" rx="12" class="bw"/><text x="486" y="147" class="t">leadNotify.ts</text><text x="486" y="167" class="s">LLM classifier, fails open</text>
        <polyline points="670,145 694,145 694,58 718,58" class="lnb" marker-end="url(#a5b)"/>
        <line x1="670" y1="158" x2="718" y2="158" class="ln" marker-end="url(#a5)"/>
        <polyline points="670,170 694,170 694,268 718,268" class="lnd" marker-end="url(#a5)"/>
        <rect x="720" y="30" width="180" height="56" rx="10" class="bw"/><text x="734" y="52" class="t">Fruition CRM (ILE)</text><text x="734" y="71" class="s">lead: region + owner</text>
        <rect x="720" y="130" width="180" height="56" rx="10" class="b"/><text x="734" y="152" class="t">Website Enquiries</text><text x="734" y="171" class="s">not a lead: vendor, other</text>
        <rect x="720" y="240" width="180" height="56" rx="10" class="bx"/><text x="734" y="262" class="t">Slack leads channel</text><text x="734" y="281" class="s">if monday write fails</text>
        <line x1="900" y1="58" x2="938" y2="58" class="ln" marker-end="url(#a5)"/>
        <rect x="940" y="24" width="150" height="76" rx="10" class="b"/><text x="952" y="46" class="t">Regional CRMs</text><text x="952" y="65" class="s">made by automation</text><text x="952" y="83" class="s">APAC NA UK SEA I&amp;UAE</text>
        <rect x="940" y="140" width="150" height="76" rx="10" class="bx"/><text x="952" y="162" class="t">ile-regional-linker</text><text x="952" y="181" class="s">CF Worker, every 5m</text><text x="952" y="199" class="s">links record back</text>
        <line x1="1015" y1="140" x2="1015" y2="102" class="lnd" marker-end="url(#a5)"/>
      </svg>
      </div>
      <figcaption><b>The classifier never blocks a lead.</b> If the LLM call fails, the submission is treated as a lead. Spam detection is off by default (<code>LEAD_CLASSIFIER_SPAM</code>) since it once filed a real enquiry as a scam. Region comes from Cloudflare's <code>cf-ipcountry</code> header, so you cannot fake another region with a query parameter.</figcaption>
    </figure>
    <div class="note risk"><strong>Forms, PR previews and local dev all hit the live boards, Calendly, Resend and Slack.</strong> Never submit junk. If a test has to write to monday, clear the Owner (<code>people</code>) column and delete the item within seconds, then check both boards are clean.</div>
    <div class="grid3">
      <div class="card"><h3>Booking</h3><p class="soft"><code>BookingSection.tsx</code> is the only booking component. <code>BOOKING_MODE</code> is <code>"global"</code>: the Calendly widget on the <b>shared global account</b>. A consultant picker mode exists in the same file and must be kept. Never link personal Calendly pages; booking CTAs scroll to the page's own <code>#book</code> section.</p></div>
      <div class="card"><h3>RB2B visitor ID</h3><p class="soft"><code>/api/webhooks/rb2b</code> receives identified visitors, enriches them (Reachly, Brandfetch) and writes the monday RB2B board plus a Slack alert. Outbound email to those leads is Marketa's job, not the site's.</p></div>
      <div class="card"><h3>Team onboarding</h3><p class="soft">A new item on the monday People board fires <code>/api/webhooks/monday</code>, which creates a Sanity <code>teamMember</code>. Subscriptions are created by <code>scripts/subscribe-monday-webhook.mjs</code>.</p></div>
      <div class="card"><h3>Social (Zernio)</h3><p class="soft">One draft per platform (X, LinkedIn, Instagram, Pinterest, Reddit, YouTube, Google Business Profile AU/UK/US), media hosted on Sanity, a short link per channel. Automatic drafts per blog are off (<code>BLOG_AUTO_SOCIAL_DRAFTS</code>); Marketa's approval flow forces them on for its own posts.</p></div>
      <div class="card"><h3>LLMs</h3><p class="soft">Every call goes through OpenRouter: the Implementation Calculator, design docs, social captions, the lead classifier. Models come from env vars with defaults in code.</p></div>
      <div class="card"><h3>Analytics + tags</h3><p class="soft">GA4, Google Ads conversions and Calendly conversion live in GTM <code>GTM-PF6XWTL6</code>, not in this repo. The layout loads GTM, Clarity, RB2B, the OpenAI pixel and Umami; Clarity, RB2B and the pixel respect the cookie choice.</p></div>
    </div>
  </section>

  <!-- 10 -->
  <section class="sec" id="marketa">
    <div class="sec-head">
      <div class="eyebrow">10 · Marketa contract</div>
      <h2>Coupled by data, not by API</h2>
    </div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1080 400" role="img" aria-label="The website and Marketa both read and write five shared things: the Sanity blogPost schema and ids, the portal_drafts metadata JSON, the brain Supabase project, public URLs, and shared secrets. The only direct call is the website posting to MARKETA_URL when content is marked complete.">
        <defs><marker id="a6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
        <marker id="a6b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahb"/></marker></defs>
        <rect x="20" y="30" width="200" height="316" rx="18" class="bw"/>
        <text x="120" y="170" text-anchor="middle" class="tl">Website</text>
        <text x="120" y="192" text-anchor="middle" class="s">Cloudflare Worker</text>
        <text x="120" y="210" text-anchor="middle" class="s">portal blog editor</text>
        <rect x="860" y="30" width="200" height="316" rx="18" class="bx"/>
        <text x="960" y="170" text-anchor="middle" class="tl">Marketa</text>
        <text x="960" y="192" text-anchor="middle" class="s">Vercel, private repo</text>
        <text x="960" y="210" text-anchor="middle" class="s">marketa-monorepo (main)</text>

        <rect x="330" y="30" width="420" height="52" rx="10" class="b"/><text x="346" y="52" class="t">Sanity blogPost schema + document ids</text><text x="346" y="70" class="s">id = sanity_doc_id, else blog-portal-&lt;slug&gt;</text>
        <rect x="330" y="96" width="420" height="52" rx="10" class="b"/><text x="346" y="118" class="t">portal_drafts.metadata (one JSON blob)</text><text x="346" y="136" class="s">both read-modify-write; keep unknown keys</text>
        <rect x="330" y="162" width="420" height="52" rx="10" class="b"/><text x="346" y="184" class="t">Supabase brain</text><text x="346" y="202" class="s">Marketa owns it; the portal dashboard reads it</text>
        <rect x="330" y="228" width="420" height="52" rx="10" class="b"/><text x="346" y="250" class="t">Public URLs</text><text x="346" y="268" class="s">/post/&lt;slug&gt; polled for 200; /sitemap.xml read</text>
        <rect x="330" y="294" width="420" height="52" rx="10" class="b"/><text x="346" y="316" class="t">Shared secrets</text><text x="346" y="334" class="s">write token, Supabase, Zernio, OpenRouter, Slack</text>

        <line x1="220" y1="56" x2="328" y2="56" class="ln" marker-end="url(#a6)"/>
        <line x1="220" y1="122" x2="328" y2="122" class="ln" marker-end="url(#a6)"/>
        <line x1="220" y1="188" x2="328" y2="188" class="ln" marker-end="url(#a6)"/>
        <line x1="220" y1="254" x2="328" y2="254" class="ln" marker-end="url(#a6)"/>
        <line x1="220" y1="320" x2="328" y2="320" class="ln" marker-end="url(#a6)"/>
        <line x1="860" y1="56" x2="752" y2="56" class="lnb" marker-end="url(#a6b)"/>
        <line x1="860" y1="122" x2="752" y2="122" class="lnb" marker-end="url(#a6b)"/>
        <line x1="860" y1="188" x2="752" y2="188" class="lnb" marker-end="url(#a6b)"/>
        <line x1="860" y1="254" x2="752" y2="254" class="lnb" marker-end="url(#a6b)"/>
        <line x1="860" y1="320" x2="752" y2="320" class="lnb" marker-end="url(#a6b)"/>

        <polyline points="120,346 120,378 960,378 960,348" class="lnd" marker-end="url(#a6)"/>
        <text x="540" y="370" text-anchor="middle" class="s">the one direct call: POST to MARKETA_URL on "Mark content complete"</text>
      </svg>
      </div>
      <figcaption><b>Nothing fails loudly when these drift.</b> Rename a <code>blogPost</code> field, change the id rule or drop unknown keys from <code>portal_drafts.metadata</code>, and Marketa's next publish breaks without a type error anywhere. Read <code>docs/architecture.md</code> §9 before touching blog schemas or the portal blog editor.</figcaption>
    </figure>
    <div class="grid2">
      <div class="card">
        <h3>What Marketa does</h3>
        <ul>
          <li>Daily blog: scans news feeds, ranks a story with an LLM, drafts a post, posts an approval card to <b>#website-blogs</b>.</li>
          <li>"Approve and publish" in Slack: Sanity upsert, waits until <code>/post/&lt;slug&gt;</code> answers 200, then sends the Zernio social posts.</li>
          <li>Also renders blog videos, scans AI citations (AEO) and runs RB2B outbound email.</li>
          <li>Its repo uses <code>main</code>, deploys on Vercel, and holds the blog generation code. No Marketa code lives in the website repo; do not add it back.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Contract checklist before you merge</h3>
        <ul>
          <li>Blog posts live at <code>/post/&lt;slug&gt;</code>, never <code>/blog/</code>.</li>
          <li><code>blogPost</code> fields Marketa writes: title, slug, body, publishedAt, author, excerpt, industry, seoKeyword, seoTitle, seoDescription, mondayItemId, coverImage.</li>
          <li>"Mark content complete" must write <code>review_stage: "content_complete"</code> before calling Marketa.</li>
          <li>Marketa deep-links to <code>/internal/blog/&lt;uuid&gt;/edit</code> and <code>/internal/blog/monday/&lt;pulseId&gt;/edit</code>.</li>
          <li>Rotating a shared secret means Cloudflare <b>and</b> Vercel.</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 11 -->
  <section class="sec" id="monday">
    <div class="sec-head">
      <div class="eyebrow">11 · monday.com boards</div>
      <h2>Where development work comes from</h2>
    </div>
    <div class="prose"><p>Website requests arrive as items on the <b>Tasks: Fruition Website</b> board (id <code>1865338949</code>). Today an AI agent harness on a separate machine watches that board and delivers items automatically. Agree with Edward which items are yours, so you and the agent do not build the same thing.</p></div>
    <figure class="dia">
      <div class="scroll">
      <svg viewBox="0 0 1090 220" role="img" aria-label="An item on the Tasks Fruition Website board is claimed by a webhook or a 30-minute poll, set to Working on it, built by an agent as a branch and PR, checked by CI and at three widths, then merged with screenshots on the card. A watchdog resumes a session idle for 30 minutes once, then alerts.">
        <defs><marker id="a7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>
        <rect x="20" y="40" width="190" height="64" rx="12" class="bw"/><text x="36" y="67" class="t">Item on Tasks board</text><text x="36" y="87" class="s">board 1865338949</text>
        <line x1="210" y1="72" x2="236" y2="72" class="ln" marker-end="url(#a7)"/>
        <rect x="238" y="40" width="190" height="64" rx="12" class="b"/><text x="254" y="67" class="t">Claimed</text><text x="254" y="87" class="s">"Working on it"</text>
        <line x1="428" y1="72" x2="454" y2="72" class="ln" marker-end="url(#a7)"/>
        <rect x="456" y="40" width="190" height="64" rx="12" class="b"/><text x="472" y="67" class="t">Agent builds</text><text x="472" y="87" class="s">branch + PR</text>
        <line x1="646" y1="72" x2="672" y2="72" class="ln" marker-end="url(#a7)"/>
        <rect x="674" y="40" width="190" height="64" rx="12" class="b"/><text x="690" y="67" class="t">CI + preview</text><text x="690" y="87" class="s">375 / 768 / 1440</text>
        <line x1="864" y1="72" x2="890" y2="72" class="ln" marker-end="url(#a7)"/>
        <rect x="892" y="40" width="190" height="64" rx="12" class="bw"/><text x="908" y="67" class="t">Merged + reported</text><text x="908" y="87" class="s">PR + screenshots on card</text>
        <text x="333" y="128" text-anchor="middle" class="s">webhook, or poll every 30 min</text>
        <polyline points="551,104 551,170 333,170 333,140" class="lnd" marker-end="url(#a7)"/>
        <text x="560" y="160" class="s">idle 30 min: one automatic resume, then a Telegram alert</text>
      </svg>
      </div>
      <figcaption><b>A card stuck on "Working on it" with no PR</b> usually means a stalled delivery, not active work. Check the card's updates and open PRs before starting the same task yourself.</figcaption>
    </figure>
    <div class="tbl"><table>
      <thead><tr><th>Board</th><th>Id</th><th>Written by</th></tr></thead>
      <tbody>
        <tr><td>Tasks: Fruition Website</td><td class="m">1865338949</td><td>People filing website work; the delivery agent</td></tr>
        <tr><td>Fruition CRM (ILE)</td><td class="m">5030276917</td><td>Website leads and bookings (<code>leadNotify.ts</code>)</td></tr>
        <tr><td>Website Enquiries</td><td class="m">5030270944</td><td>Non-lead submissions (vendor, other)</td></tr>
        <tr><td>RB2B</td><td class="m">5028658425</td><td>RB2B webhook</td></tr>
        <tr><td>Marketa blog pipeline</td><td class="m">5028637584</td><td>Marketa's draft stage machine</td></tr>
        <tr><td>Regional CRMs</td><td class="m">APAC 1924922135 · NA 1925296156 · UK 1924931935 · SEA 2025830242 · I&amp;UAE 2025832555</td><td>monday automations from ILE; linked back by ile-regional-linker</td></tr>
      </tbody>
    </table></div>
    <div class="note warn"><strong>monday API quirks that cost time:</strong> the phone column rejects spaces, and one bad value fails the whole multi-column write (the code retries without the rejected column). <code>items(ids:)</code> returns deleted items, so check <code>state == "active"</code>. Legacy automations on ILE cannot be deleted through the API; that is a UI job.</div>
  </section>

  <!-- 12 -->
  <section class="sec" id="design">
    <div class="sec-head">
      <div class="eyebrow">12 · Design rules</div>
      <h2>The Consultant's Terminal</h2>
    </div>
    <div class="prose"><p>White surface, mono-labelled precision, one voltage-purple accent. <code>DESIGN.md</code> is the spec; <code>/ai-capability-assessment</code> is the reference page when in doubt. The design-guard hook enforces the mechanical rules on every edit.</p></div>
    <div class="sw">
      <div><i style="background:#8015e8"></i><span><b>Voltage purple</b>#8015e8 brand</span></div>
      <div><i style="background:#550e9b"></i><span><b>Royal depth</b>#550e9b hover</span></div>
      <div><i style="background:#ba83f0"></i><span><b>Lilac glow</b>#ba83f0 on dark</span></div>
      <div><i style="background:#10003a"></i><span><b>Midnight violet</b>#10003a bands</span></div>
      <div><i style="background:#242323"></i><span><b>Ink</b>#242323 text</span></div>
      <div><i style="background:#686b82"></i><span><b>Ink soft</b>#686b82 secondary</span></div>
      <div><i style="background:#ecf1fc"></i><span><b>Cool paper</b>#ecf1fc sections</span></div>
      <div><i style="background:#dedee5"></i><span><b>Hairline</b>#dedee5 borders</span></div>
    </div>
    <p class="soft" style="font-size:13px">Swatches are for reference only. In code, use the semantic tokens from <code>src/app/globals.css</code> (<code>bg-brand</code>, <code>text-ink</code>, <code>ring-ui</code>), never hex.</p>
    <div class="grid3">
      <div class="card"><span class="k">Tokens</span><p class="soft">Semantic tokens only. No raw hex, no inline <code>style</code> for layout or type. Cards: <code>rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised</code>.</p></div>
      <div class="card"><span class="k">Breakpoints</span><p class="soft">Exactly three: base, <code>md:</code> 768px, <code>lg:</code> 1024px. Mobile type is one step down. No <code>sm:</code>, <code>xl:</code>, <code>2xl:</code>.</p></div>
      <div class="card"><span class="k">Type</span><p class="soft">Poppins for everything, JetBrains Mono for eyebrows and labels (<code>font-mono text-xs uppercase tracking-[0.14em]</code>). Nothing else.</p></div>
      <div class="card"><span class="k">Done at three widths</span><p class="soft">Works at 375, 768 and 1440: one column on mobile, no horizontal overflow, 44px tap targets.</p></div>
      <div class="card"><span class="k">Copy is sacred</span><p class="soft">Visual work never rewrites page copy or Sanity content. Supplied HTML or agency drops give you copy and structure only; rebuild them in this system.</p></div>
      <div class="card"><span class="k">Portal</span><p class="soft"><code>/internal</code> uses shadcn/ui only, with its own neutral theme in <code>globals.css</code>, isolated from the marketing palette.</p></div>
    </div>
  </section>

  <!-- 13 -->
  <section class="sec" id="gotchas">
    <div class="sec-head">
      <div class="eyebrow">13 · Gotchas</div>
      <h2>Things that already cost someone a day</h2>
    </div>
    <div class="grid3">
      <div class="card gotcha"><div class="top"><h3>No main branch</h3><span class="tag r">git</span></div><p><strong><code>production</code> is mainline.</strong> Branch from it, PR into it, squash-merge. Merge means live.</p></div>
      <div class="card gotcha"><div class="top"><h3>Public repository</h3><span class="tag r">security</span></div><p><strong>Never commit secret values</strong>, <code>.env*</code> (except <code>.env.example</code>) or <code>.dev.vars</code>. Docs name variables; values live in the password manager.</p></div>
      <div class="card gotcha"><div class="top"><h3>Portal auth is per page</h3><span class="tag r">security</span></div><p>No middleware gate. <strong>Every <code>/internal</code> page calls <code>requirePortalUser()</code></strong> and every <code>/api/internal</code> route <code>getPortalApiUser()</code>.</p></div>
      <div class="card gotcha"><div class="top"><h3>Previews are production</h3><span class="tag r">live data</span></div><p>PR previews share production secrets, Sanity, Supabase, monday and Calendly. <strong>Treat them as live.</strong></p></div>
      <div class="card gotcha"><div class="top"><h3>Root layout stays static</h3><span class="tag w">performance</span></div><p><strong>No <code>headers()</code> or <code>cookies()</code> in <code>layout.tsx</code>.</strong> Check the build's static/dynamic counts after layout changes.</p></div>
      <div class="card gotcha"><div class="top"><h3>Worker size</h3><span class="tag w">deploy</span></div><p><strong>About 115 KiB of headroom</strong> under the 10 MiB cap. A heavy dependency can fail the deploy.</p></div>
      <div class="card gotcha"><div class="top"><h3>Generated redirects</h3><span class="tag">routing</span></div><p><strong>Never hand-edit <code>redirects.ts</code> or <code>tagRedirects.ts</code>.</strong> New redirects go in <code>auditRedirects</code> in <code>next.config.ts</code>.</p></div>
      <div class="card gotcha"><div class="top"><h3>Sitemap is manual</h3><span class="tag">seo</span></div><p><strong>New pages must be added to <code>STATIC_PATHS</code></strong> in <code>src/app/sitemap.ts</code> by hand.</p></div>
      <div class="card gotcha"><div class="top"><h3>Soft 404 partner pages</h3><span class="tag">routing</span></div><p>An unknown <code>/partnerships/&lt;slug&gt;</code> <strong>returns 200 with an empty shell</strong>. Link checkers cannot catch bad nav links there.</p></div>
      <div class="card gotcha"><div class="top"><h3>Ad pages skip the layout</h3><span class="tag">ads</span></div><p>Site-wide layout changes <strong>do not reach <code>/au /uk /us</code></strong>. Their theme in <code>landingPageTheme.ts</code> mirrors <code>globals.css</code> by hand; <code>landingPageLayout.test.ts</code> must pass.</p></div>
      <div class="card gotcha"><div class="top"><h3>Build needs Sanity</h3><span class="tag">build</span></div><p><code>getaddrinfo ENOTFOUND *.apicdn.sanity.io</code> during <code>npm run build</code> is <strong>a network blip, not your code</strong>. Retry first.</p></div>
      <div class="card gotcha"><div class="top"><h3>Stale CSS in dev</h3><span class="tag">dev</span></div><p>Turbopack can serve an <strong>old <code>globals.css</code></strong> after edits. If a new class is missing, <code>rm -rf .next</code> and restart.</p></div>
      <div class="card gotcha"><div class="top"><h3>Flaky preview build</h3><span class="tag">ci</span></div><p>The CI preview job sometimes fails with a <code>next/font/google</code> resolve error on GitHub runners only. <strong>Rerun it</strong>; local builds pass.</p></div>
      <div class="card gotcha"><div class="top"><h3>Middleware rewrites</h3><span class="tag w">runtime</span></div><p>A rewrite to a <code>public/</code> file <strong>works locally and 404s on Cloudflare</strong>. Redirect instead and test on the preview URL.</p></div>
      <div class="card gotcha"><div class="top"><h3>Two Supabase owners</h3><span class="tag">data</span></div><p>Portal migrations exist in this repo and in Marketa's. <strong>Agree on one owner</strong> before the next schema change.</p></div>
    </div>
  </section>

  <!-- 14 -->
  <section class="sec" id="env">
    <div class="sec-head">
      <div class="eyebrow">14 · Env vars</div>
      <h2>Names only; values are in the password manager</h2>
    </div>
    <div class="prose soft"><p>Local: <code>.env.local</code> for <code>next dev</code>, <code>.dev.vars</code> for <code>npm run preview</code>. Production: Worker secrets. Purple names are inlined at build time, and CI only passes the three Sanity ones, so other <code>NEXT_PUBLIC_*</code> values set as Worker secrets never reach the browser.</p></div>
    <div class="env">
      <div><h4>Sanity<small>reads + portal writes</small></h4><div class="chips"><code class="pub">NEXT_PUBLIC_SANITY_PROJECT_ID</code><code class="pub">NEXT_PUBLIC_SANITY_DATASET</code><code class="pub">NEXT_PUBLIC_SANITY_API_VERSION</code><code>SANITY_WRITE_TOKEN</code></div></div>
      <div><h4>Site</h4><div class="chips"><code class="pub">NEXT_PUBLIC_SITE_URL</code></div></div>
      <div><h4>Portal Supabase<small>auth, all portal data</small></h4><div class="chips"><code>PORTAL_SUPABASE_URL</code><code>PORTAL_SUPABASE_ANON_KEY</code><code>PORTAL_SUPABASE_SERVICE_ROLE_KEY</code><code>PORTAL_ALLOWED_EMAIL_DOMAIN</code></div></div>
      <div><h4>Marketa<small>brain reads, webhook</small></h4><div class="chips"><code>MARKETA_SUPABASE_URL</code><code>MARKETA_SUPABASE_SERVICE_ROLE_KEY</code><code>MARKETA_URL</code></div></div>
      <div><h4>OpenRouter<small>every LLM call</small></h4><div class="chips"><code>OPENROUTER_API_KEY</code><code>ASK_FRUIT_MODEL</code><code>DESIGN_DOC_MODEL</code><code>LEAD_CLASSIFIER_MODEL</code><code>LEAD_CLASSIFIER_SPAM</code><code>MARKETA_SOCIAL_MODEL</code></div></div>
      <div><h4>Assistant limits<small>kill switch + budgets</small></h4><div class="chips"><code>ASK_FRUIT_ENABLED</code><code>ASK_FRUIT_IP_SALT</code><code>ASK_FRUIT_VISITOR_HOURLY_TURNS</code><code>ASK_FRUIT_VISITOR_DAILY_TURNS</code><code>ASK_FRUIT_IP_DAILY_TURNS</code><code>ASK_FRUIT_DAILY_BUDGET_USD</code></div></div>
      <div><h4>monday.com</h4><div class="chips"><code>MONDAY_API_TOKEN</code><code>MONDAY_READ_TOKEN</code><code>MONDAY_WEBHOOK_SECRET</code><code>MONDAY_LEADS_BOARD_ID</code><code>MONDAY_LEADS_GROUP_ID</code><code>MONDAY_LEADS_EMAIL_COLUMN</code><code>MONDAY_LEADS_NOTES_COLUMN</code><code>MONDAY_LEADS_COMPANY_COLUMN</code></div></div>
      <div><h4>Slack + email</h4><div class="chips"><code>SLACK_BOT_TOKEN</code><code>SLACK_USER_TOKEN</code><code>SLACK_LEADS_CHANNEL_ID</code><code>INTERNAL_API_KEY</code><code>RESEND_API_KEY</code><code>CONTACT_TO</code><code>CONTACT_FROM</code></div></div>
      <div><h4>Calendly</h4><div class="chips"><code>CALENDLY_API_TOKEN</code><code>CALENDLY_WEBHOOK_SECRET</code><code>SCHEDULER_TEST_MODE</code></div></div>
      <div><h4>RB2B</h4><div class="chips"><code>RB2B_WEBHOOK_SECRET</code><code>REACHLY_API_KEY</code><code>BRANDFETCH_CLIENT_ID</code></div></div>
      <div><h4>Zernio<small>social</small></h4><div class="chips"><code>ZERNIO_API_KEY</code><code>ZERNIO_DASHBOARD_URL</code><code>ZERNIO_{X,LINKEDIN,INSTAGRAM,PINTEREST,REDDIT,YOUTUBE}_ACCOUNT_ID</code><code>ZERNIO_GBP_ACCOUNT_ID</code><code>ZERNIO_GBP_{AU,UK,US}_ACCOUNT_ID</code><code>ZERNIO_PINTEREST_BOARD_ID</code><code>ZERNIO_REDDIT_SUBREDDIT</code><code>BLOG_AUTO_SOCIAL_DRAFTS</code></div></div>
      <div><h4>Analytics<small>portal dashboard</small></h4><div class="chips"><code>GA4_PROPERTY_ID</code><code>GSC_SITE_URL</code><code>GOOGLE_SA_KEY_B64</code><code>UMAMI_API_KEY</code><code>UMAMI_API_URL</code><code>UMAMI_WEBSITE_ID</code><code class="pub">NEXT_PUBLIC_UMAMI_WEBSITE_ID</code><code class="pub">NEXT_PUBLIC_UMAMI_SCRIPT_URL</code></div></div>
      <div><h4>Misc</h4><div class="chips"><code>DESIGN_STUDIO_URL</code><code>NAV_V2_PREVIEW</code></div></div>
    </div>
  </section>

  <!-- 15 -->
  <section class="sec" id="debt">
    <div class="sec-head">
      <div class="eyebrow">15 · Known issues</div>
      <h2>Open tech debt you may trip over</h2>
    </div>
    <div class="tbl"><table>
      <thead><tr><th>Issue</th><th>Where</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Unknown partner slugs return 200</td><td class="m">partnerships/[slug]/page.tsx</td><td>No <code>notFound()</code>. Check nav links by hand.</td></tr>
        <tr><td>No Sanity revalidation webhook</td><td class="m">n/a</td><td>Studio edits rely on the 60s ISR window.</td></tr>
        <tr><td><code>short_links</code> has no migration</td><td class="m">supabase/</td><td>Created by hand. Recreate from the live schema before any rebuild.</td></tr>
        <tr><td>Client-side Umami may be missing</td><td class="m">layout.tsx, deploy.yml</td><td><code>NEXT_PUBLIC_UMAMI_WEBSITE_ID</code> is not passed at build time by CI.</td></tr>
        <tr><td>Stale <code>origin/staging</code> branch</td><td class="m">GitHub</td><td>Hundreds of commits behind and triggers nothing. Safe to delete once confirmed.</td></tr>
        <tr><td>Portal migrations in two repos</td><td class="m">supabase/migrations/</td><td>Pick one owner (this repo or Marketa).</td></tr>
        <tr><td>Hosted Studio can go stale</td><td class="m">sanity.io</td><td>Updates only on a manual <code>npx sanity deploy</code>.</td></tr>
        <tr><td>Legacy Wix email records</td><td class="m">both zones</td><td>Old DKIM CNAMEs chain to SendGrid, which is still in SPF. The September audit also found a proxied <code>_dmarc</code> CNAME on fruitionmonday.com that breaks DMARC there. Fix with Edward; do not delete mail records blind.</td></tr>
      </tbody>
    </table></div>
  </section>

  <!-- 16 -->
  <section class="sec" id="glossary">
    <div class="sec-head">
      <div class="eyebrow">16 · Glossary</div>
      <h2>Words you will hear</h2>
    </div>
    <dl class="gl">
      <div><dt>fruition-landing</dt><dd>The Cloudflare Worker that serves the whole website.</dd></div>
      <div><dt>OpenNext</dt><dd>The adapter (<code>@opennextjs/cloudflare</code>) that turns the Next.js build into a Worker.</dd></div>
      <div><dt>ISR</dt><dd>Incremental static regeneration: prerendered pages refreshed in the background, here every 60s, stored in Workers KV.</dd></div>
      <div><dt>Portal</dt><dd>The staff app at <code>/internal</code>, and also the name of its Supabase project.</dd></div>
      <div><dt>Marketa</dt><dd>Fruition's AI marketing engine: daily blog, blog video, AEO scans, RB2B outbound. Separate repo, runs on Vercel.</dd></div>
      <div><dt>Brain</dt><dd>Marketa's Supabase project (pgvector content, drafts, AEO data). Free tier, kept awake by the <code>supabase-keepalive</code> Worker.</dd></div>
      <div><dt>ILE</dt><dd>The "Fruition CRM (ILE)" monday board where website leads land before being copied to the regional CRMs.</dd></div>
      <div><dt>Implementation Calculator</dt><dd>The public AI assistant. Formerly "Ask Fruit" and "Fruitai"; routes and env vars still say <code>ask-fruit</code>.</dd></div>
      <div><dt>AEO</dt><dd>Answer engine optimisation: how often AI assistants cite Fruition. Shown on the portal dashboard.</dd></div>
      <div><dt>RB2B</dt><dd>Service that identifies website visitors. Its webhook feeds the monday RB2B board.</dd></div>
      <div><dt>Zernio</dt><dd>Social scheduling API used by the portal composer and Marketa.</dd></div>
      <div><dt>Markdown twins</dt><dd><code>/index.md</code>, <code>/pricing.md</code>, <code>/about-us.md</code>: plain versions served to AI agents that ask for <code>text/markdown</code>.</dd></div>
    </dl>

    <footer class="end">
      <p>Checked against <code>production</code> at commit <code>673b6b7</code> (15 Oct 2026), the repo's <a href="https://github.com/Fruition-Service/fruition-website-monorepo/blob/production/docs/architecture.md">architecture.md</a> and <a href="https://github.com/Fruition-Service/fruition-website-monorepo/blob/production/docs/cloud.md">cloud.md</a>, and live DNS lookups.</p>
      <p>When this page and the repo disagree, the repo wins. Questions: Edward.</p>
    </footer>
  </section>

  </main>
</div>

<script>
(function () {
  // Copy buttons on code blocks
  document.querySelectorAll('pre.code').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = Array.prototype.map.call(pre.childNodes, function (n) {
        return n === btn ? '' : n.textContent;
      }).join('').replace(/(^|[ \t]+)#[^\n]*/gm, '').replace(/\n{2,}/g, '\n').trim();
      function done(label) { btn.textContent = label; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); }
      try {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { selectPre(); done('Selected'); });
      } catch (e) { selectPre(); done('Selected'); }
      function selectPre() {
        var r = document.createRange(); r.selectNodeContents(pre);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
    });
    pre.appendChild(btn);
  });

  // External links open in a new tab (the page is shown inside the portal's iframe)
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Access checklist, remembered per viewer
  var KEY = 'fruition-handover-checklist';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#checklist input'));
  var progress = document.getElementById('progress');
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
  function render() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    progress.textContent = n + ' of ' + boxes.length + ' done';
  }
  boxes.forEach(function (b) {
    if (saved[b.id]) b.checked = true;
    b.addEventListener('change', function () {
      saved[b.id] = b.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
      render();
    });
  });
  render();
})();
</script>

</body></html>`
