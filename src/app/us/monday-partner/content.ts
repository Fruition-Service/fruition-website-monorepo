/* AdWords landing page document (source: monday item 2873614427 asset us-monday-partner-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (US · Google Ads)
  Campaign: NEW US search campaign (mirror UK_Lead_Gen structure) &mdash; no live US campaign yet (account 8457299561)
  Suggested URL: /us/monday-partner  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic regional page stays live and untouched;
  this page replaces it ONLY as the ads final URL.

  Fixes vs the organic page (per 5 Oct audit):
  - 35+ nav/footer leaks removed; logo non-clickable; only exits = tel:, privacy, terms
  - Lead form in hero with gclid/utm capture (organic page has NO form)
  - One regional phone number only (organic page shows all six)
  - noindex so paid and organic measurement never mix
  - Sticky Book CTA desktop + mobile call/book bar; ANZ/US/UK-only Calendly routing

  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm_campaign/utm_term);
  CALENDLY -> US/North America round-robin &mdash; North America team ONLY; RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com Platinum Partner US &mdash; Fixed-Fee Implementation | Fruition</title>
<meta name="description" content="Certified monday.com Platinum Partner with a New York office. Fixed-fee implementation, CRM builds and training delivered in 2–4 weeks by US-hours consultants.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>

<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services"><!-- non-clickable per orphan guidelines -->
<div class="right">
<a class="phone" href="tel:+13023302496">+1 302 330 2496</a>
<a class="book" href="#lead">Book a Free Consultation</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">🇺🇸 monday.com Platinum Partner · New York · Chicago · Austin · San Francisco</div>
<h1>Your monday.com <em>Platinum Partner</em> in the US</h1>
<p class="sub">Fixed-fee monday.com implementation, CRM builds, integrations and training &mdash; scoped by a certified US-hours consultant and live in 2–4 weeks, not months.</p>
<ul class="ticks">
<li>Fixed quote agreed on before any build starts &mdash; no hourly surprises</li>
<li>Platinum &amp; Advanced Delivery Partner &mdash; monday.com's highest tiers</li>
<li>900+ implementations, from credit unions to franchises and biotech</li>
<li>US-hours consultants, New York HQ, coast-to-coast coverage</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">New York office</span>
</div>
</div>

<form class="formcard" id="lead" method="POST" action="#"><!-- FORM-WEBHOOK: Edward -->
<h2>Get your fixed-fee quote</h2>
<p class="fsub">A US consultant replies within one business day.</p>
<label for="f-name">Full name</label>
<input id="f-name" name="name" type="text" autocomplete="name" required>
<label for="f-email">Work email</label>
<input id="f-email" name="email" type="email" autocomplete="email" required>
<label for="f-phone">Phone</label>
<input id="f-phone" name="phone" type="tel" autocomplete="tel">
<label for="f-company">Company</label>
<input id="f-company" name="company" type="text" autocomplete="organization" required>
<label for="f-need">What do you need?</label>
<select id="f-need" name="need">
<option>New monday.com implementation</option>
<option>monday CRM build / migration</option>
<option>Integrations &amp; automation</option>
<option>Training &amp; adoption</option>
<option>Rescue / optimize an existing setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim &mdash; on success fire gtag conversion, then redirect to thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>US organizations running on systems Fruition built</p>
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/d2e6dc4334e1606e67425bc053a37448256f4064-245x65.png?w=260&fit=max&auto=format" alt="Honor Credit Union" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/0d3d62e77fc7cf22ef21c98c635f556b88d4a248-598x139.png?w=260&fit=max&auto=format" alt="Craters &amp; Freighters" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/1382e1e8f4f564a9edc0b735d4f5be714dec4631-493x267.png?w=260&fit=max&auto=format" alt="Housing Authority of San Antonio" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/eea7f2e6894c62b89b2826a9e7b8c3ffdb4867b6-899x323.png?w=260&fit=max&auto=format" alt="Stout Risius Ross" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/15611f5d8faef6072dbba71919d2e6b529afda96-900x205.png?w=260&fit=max&auto=format" alt="Kitchen Tune-Up" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/083ae3ffd4c52231b16644e20579e67af884326e-3675x500.png?w=260&fit=max&auto=format" alt="Windfall Bio" loading="lazy">
</div>
</div>
</div>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation &mdash; a frank read on scope, fit and cost from a certified Platinum Partner. If monday.com isn't the right fit, we'll say so.</p>
<a class="btn" href="#lead">Book My Free Consultation →</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+13023302496" style="color:var(--purple);font-weight:700;text-decoration:none">+1 302 330 2496</a> · ET–PT business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; US/North America round-robin &mdash; North America team ONLY -->
Calendly embed &mdash; US/North America round-robin &mdash; North America team ONLY
</div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">monday.com consulting services for every workflow</h2>
<p class="lede">Delivered by certified monday.com consultants working your hours &mdash; clear communication, faster decisions, no offshore hand-offs.</p>
<div class="grid3">
<div class="card"><h3>monday.com implementation</h3><p>Boards, automations, dashboards and permissions built to your workflows by a certified monday implementation consultant &mdash; launched in days, not months.</p></div>
<div class="card"><h3>monday CRM consultants</h3><p>Tailored pipelines, quoting and forecasting &mdash; migrated from Salesforce, HubSpot, Zoho or spreadsheets with your full history preserved.</p></div>
<div class="card"><h3>Integrations &amp; automation</h3><p>Connect QuickBooks, Salesforce, HubSpot, Microsoft 365, Teams and Slack via native integrations, Make or the API &mdash; no more re-keying.</p></div>
<div class="card"><h3>Training &amp; enablement</h3><p>Admin and end-user training on your own boards &mdash; remote across every US time zone or on-site, with follow-up once the team is live.</p></div>
<div class="card"><h3>Data migration</h3><p>Structured moves from Jira, Asana, Trello, Smartsheet and Excel &mdash; history preserved, process debt left behind.</p></div>
<div class="card"><h3>Managed support &amp; AI</h3><p>Ongoing optimized support plus monday AI setup &mdash; AI Blocks, Sidekick and agents with governance built in.</p></div>
</div>
</div>
</section>

<section class="alt">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a monday.com implementation works</h2>
<p class="lede">A proven, fixed-fee framework &mdash; the same methodology behind 900+ delivered systems.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Discovery &amp; scoping</h3><p>We map your workflows and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Solution architecture</h3><p>Boards, automations and dashboards built around how you actually operate.</p></div>
<div class="step"><div class="n">3</div><h3>Data migration</h3><p>Historical records moved in with everything essential preserved.</p></div>
<div class="step"><div class="n">4</div><h3>Training &amp; adoption</h3><p>Champions trained, end users enabled, system owned by your team.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">900+</div><div class="l">implementations delivered across six offices</div></div>
<div><div class="v">2–4 wks</div><div class="l">typical kickoff to a live, working system</div></div>
<div><div class="v">260+</div><div class="l">hours saved per year by a typical client team</div></div>
<div><div class="v">20–30%</div><div class="l">of team time recovered from manual re-keying</div></div>
</div>
<p class="note">Figures are typical outcomes drawn from Fruition engagements and published monday.com research. Individual results vary with scope, team size and adoption.</p>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about Fruition's monday.com consultants</h2>
<div class="quotes">
<div class="quote"><p>"monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts."</p><div class="who"><b>Jason Doan</b> · VP of Heavy Rental &amp; Sales, HOLT CAT</div></div>
<div class="quote"><p>"The Fruition team helped me get the most out of monday.com &mdash; in-depth instruction, custom templates and solutions unique to our early stage company's needs."</p><div class="who"><b>Louis Stenmark</b> · Co-Founder, Windfall Bio</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs. Real linked values only; no review counts. -->
<div class="ratings">
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">monday.com partner directory</div></a>
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">Google Reviews</div></a>
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">G2</div></a>
<a class="rating" href="#"><div class="score">4.0</div><div class="stars">★★★★☆</div><div class="src">Trustpilot</div></a>
</div>
</div>
</section>

<section class="alt">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with a certified monday.com partner consultant</h2>
<p class="lede">Engagements are scoped and delivered personally &mdash; no hand-offs to an offshore bench.</p>
<!-- TEAM-PHOTOS: Edward &mdash; swap initials avatars using Sanity assets: Zach cf374b7d32b3925ddec53b799e10e0d0cc759207, Valeria 4179badfb046d5720f83fc8ed82e088cde8578bc -->
<div class="team">
<div class="member"><div class="avatar">ZW</div><h3>Zach Weller</h3><div class="role">Director &mdash; North America</div><p>Leads US delivery from New York &mdash; hands-on through scoping, build and training.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/194c9ab129a70bab635384976fc43ecc0661b587-500x500.jpg?w=560&h=560&fit=crop" alt="Nikhil Tiwari" loading="lazy"><h3>Nikhil Tiwari</h3><div class="role">Sales &amp; Implementation Lead</div><p>Certified monday.com and Make consultant with a machine learning and GenAI background.</p></div>
<div class="member"><div class="avatar">VM</div><h3>Valeria Marin</h3><div class="role">Implementation Consultant</div><p>Optimizes business processes and ensures seamless project transitions for US clients.</p></div>

</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Is Fruition an official monday.com partner in the US?</summary><div class="a">Yes &mdash; a certified monday.com Platinum Partner and Advanced Delivery Partner with a New York office (205 W 37th St) and US-hours consultants. Platinum is monday.com's highest tier, awarded on delivery volume and customer outcomes.</div></details>
<details><summary>How much does a monday.com implementation cost in the US?</summary><div class="a">Implementations are quoted as a fixed fee in USD after a scoping call, so the number is agreed on before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licenses are billed separately &mdash; and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does a rollout take?</summary><div class="a">Most US engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; company-wide rollouts with migration and finance integrations run longer. The schedule is agreed on during scoping, not discovered halfway through.</div></details>
<details><summary>Can you migrate us from Salesforce, HubSpot or Asana?</summary><div class="a">Yes &mdash; structured migrations with contacts, deals, activities and files preserved, pipelines rebuilt around how you actually sell, and a parallel-run cutover so work never stops.</div></details>
<details><summary>Are your consultants actually in the US?</summary><div class="a">Yes &mdash; US engagements are scoped and delivered by consultants working US hours, led from New York with coverage across every time zone. Our global team is available for follow-the-sun coverage as an option, not the default.</div></details>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services · 205 W 37th St, New York, NY 10018 · <a href="tel:+13023302496">+1 302 330 2496</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> · <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
</div>
</footer>

<div class="mcta">
<a class="call" href="tel:+13023302496">Call US team</a>
<a class="book" href="#lead">Book free consult</a>
</div>

<script>
(function(){try{
var p=new URLSearchParams(location.search);
var m={"f-gclid":"gclid","f-utmc":"utm_campaign","f-utmt":"utm_term"};
for(var id in m){var v=p.get(m[id]);if(v)document.getElementById(id).value=v;}
}catch(e){}})();
</script>
</body>
</html>
`
