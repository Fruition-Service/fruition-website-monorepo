/* AdWords landing page document (source: monday item 2873614427 asset uk-monday-partner-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (UK · Google Ads)
  Campaign: UK_Lead_Gen_Search_1Apr2026 (live) &mdash; set this page as final URL (account 8457299561)
  Suggested URL: /uk/monday-partner  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic regional page stays live and untouched;
  this page replaces it ONLY as the ads final URL.

  Fixes vs the organic page (per 5 Oct audit):
  - 35+ nav/footer leaks removed; logo non-clickable; only exits = tel:, privacy, terms
  - Lead form in hero with gclid/utm capture (organic page has NO form)
  - One regional phone number only (organic page shows all six)
  - noindex so paid and organic measurement never mix
  - Sticky Book CTA desktop + mobile call/book bar; ANZ/US/UK-only Calendly routing

  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm_campaign/utm_term);
  CALENDLY -> UK/EMEA round-robin &mdash; UK team ONLY; RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com Platinum Partner UK &mdash; Fixed-Fee Implementation | Fruition</title>
<meta name="description" content="Certified monday.com Platinum Partner with a London office. Fixed-fee implementation, CRM builds and training delivered in 2–4 weeks by UK-hours consultants.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>

<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services"><!-- non-clickable per orphan guidelines -->
<div class="right">
<a class="phone" href="tel:+447822019548">+44 7822 019548</a>
<a class="book" href="#lead">Book a Free Consultation</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">🇬🇧 monday.com Platinum Partner · London · Manchester · Birmingham · Edinburgh</div>
<h1>Your monday.com <em>Platinum Partner</em> in the UK</h1>
<p class="sub">Fixed-fee monday.com implementation, CRM builds, integrations and training &mdash; scoped by a certified UK consultant and live in 2–4 weeks, not months.</p>
<ul class="ticks">
<li>Fixed quote agreed before any build starts &mdash; no hourly surprises</li>
<li>Platinum &amp; Advanced Delivery Partner &mdash; monday.com's highest tiers</li>
<li>900+ implementations, including UK councils, rail and manufacturers</li>
<li>UK-hours consultants with on-site delivery in every major hub</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">UK public-sector experience</span>
</div>
</div>

<form class="formcard" id="lead" method="POST" action="#"><!-- FORM-WEBHOOK: Edward -->
<h2>Get your fixed-fee quote</h2>
<p class="fsub">A UK consultant replies within one business day.</p>
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
<option>Rescue / optimise an existing setup</option>
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
<p>UK teams running on systems Fruition built</p>
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/00d232f066a87d60039ced1ac84e66d4f5b63577-110x99.png?w=260&fit=max&auto=format" alt="Surrey County Council" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/fa94a309680a8ffc0acdce5ffbc76b8f7f8e6d04-900x407.png?w=260&fit=max&auto=format" alt="Avanti West Coast" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/fe9cc210ad37024a1ba6956b2fdb0be81c68c6f5-885x236.png?w=260&fit=max&auto=format" alt="Deckers UK" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f4b246398ec89269fa5c6526d4470b0baa36d90d-900x234.png?w=260&fit=max&auto=format" alt="Bloom Procurement Services" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f233b17f09a5ab430f63071a825d46b2a075c5ab-1427x500.png?w=260&fit=max&auto=format" alt="Givergy" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/fa5e7a98c079be559d85cb901db20ecafa84bd40-390x160.png?w=260&fit=max&auto=format" alt="Joloda Hydraroll" loading="lazy">
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
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+447822019548" style="color:var(--purple);font-weight:700;text-decoration:none">+44 7822 019548</a> · GMT/BST business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; UK/EMEA round-robin &mdash; UK team ONLY -->
Calendly embed &mdash; UK/EMEA round-robin &mdash; UK team ONLY
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
<div class="card"><h3>Integrations &amp; automation</h3><p>Connect Xero, Sage, Microsoft 365, Teams, Salesforce and HubSpot via native integrations, Make or the API &mdash; no more re-keying.</p></div>
<div class="card"><h3>Training &amp; enablement</h3><p>Admin and end-user training on your own boards &mdash; on-site across the UK or remote, with follow-up once the team is live.</p></div>
<div class="card"><h3>Data migration</h3><p>Structured moves from Jira, Asana, Trello, Smartsheet and Excel &mdash; history preserved, process debt left behind.</p></div>
<div class="card"><h3>Managed support &amp; AI</h3><p>Ongoing optimised support plus monday AI setup &mdash; AI Blocks, Sidekick and agents with governance built in.</p></div>
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
<div class="quote"><p>"We found monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues."</p><div class="who"><b>Mairhead McKinley</b> · Delivery Manager, Givergy (UK)</div></div>
<div class="quote"><p>"Having experienced working with Josh directly at monday.com, I'd have no hesitation recommending Josh in any consulting engagement."</p><div class="who"><b>Brad Cannon</b> · Senior Account Executive, monday.com</div></div>
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

<div class="team">
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/0b7cac4a6d1e09efde35a473e3e6bee65f5d91d2-800x800.jpg?w=560&h=560&fit=crop" alt="Kevin Zhao" loading="lazy"><h3>Kevin Zhao</h3><div class="role">Director &mdash; EMEA</div><p>Ex-monday.com, leading UK delivery and best practice across hundreds of builds.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/634ee0c5c7d9e2c0d18d21d8a387822961233fed-512x512.png?w=560&h=560&fit=crop" alt="Alex Bordei" loading="lazy"><h3>Alex Bordei</h3><div class="role">Implementation Manager</div><p>Workflow design, process automation and change management.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/ff248988d44e2d927a796f035b39f8bc5fe7b3f7-512x512.jpg?w=560&h=560&fit=crop" alt="Nevena Gravin" loading="lazy"><h3>Nevena Gravin</h3><div class="role">Implementation Lead</div><p>CRM, work management and ticketing system architecture.</p></div>

</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Is Fruition an official monday.com partner in the UK?</summary><div class="a">Yes &mdash; a certified monday.com Platinum Partner and Advanced Delivery Partner with a London office (Regent Street) and UK-based consultants. Platinum is monday.com's highest tier, awarded on delivery volume and customer outcomes.</div></details>
<details><summary>How much does a monday.com implementation cost in the UK?</summary><div class="a">Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licences are billed separately &mdash; and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does a rollout take?</summary><div class="a">Most UK engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; group-wide rollouts with migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details>
<details><summary>How is UK GDPR handled?</summary><div class="a">monday.com publishes UK and EU data-residency options, a sub-processor list, DPA and security certifications. We design boards and permissions so personal data sits only where your policy allows, and help your team map the platform commitments against your DPIA.</div></details>
<details><summary>Do you work with UK public sector organisations?</summary><div class="a">Yes &mdash; councils, housing associations, universities and charities, including procurement, security questionnaires and supplier onboarding. Insurance certificates and referee details available for tender responses.</div></details>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services · 423 Linen Hall, 162–168 Regent Street, London W1B 5TE · <a href="tel:+447822019548">+44 7822 019548</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> · <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
</div>
</footer>

<div class="mcta">
<a class="call" href="tel:+447822019548">Call UK team</a>
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
