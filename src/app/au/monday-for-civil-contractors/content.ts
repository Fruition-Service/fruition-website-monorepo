/* AdWords landing page document (source: monday item 2873580748 asset monday-civil-formwork-concreting.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU · Google Ads)
  Campaign: NEW &mdash; Civil / Formwork / Concreting search campaign (Google Ads account 8457299561)
  Suggested URL: /au/monday-for-civil-contractors  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only.

  Built to Vadim's orphan landing-page guidelines:
  - Zero-leak navigation: no header menu, no footer link farm, logo NON-clickable
  - Sticky "Book a Free Consultation" CTA (top-right desktop, bottom bar mobile)
  - Exact-match keyword alignment in H1/H2s; statement-form headings
  - Booking/CTA routes to the Australia & New Zealand team ONLY

  FOR EDWARD:
  1. FORM-WEBHOOK: point form action at the lead webhook -> monday.com CRM board; map hidden gclid/utm fields.
  2. CALENDLY: replace placeholder with the AU/NZ round-robin Calendly inline embed (ANZ only).
  3. RATINGS: insert live profile URLs. Real linked values only, no review counts (19 Aug call rule).
  4. CLIENT-CHIPS: swap text chips for grayscale Sanity logos ONLY where logo permission is signed off
     (industry client logos pending permissions &mdash; open item from 19 Aug call). Until then, chips stay text.
  FOR VADIM:
  5. GTAG-CONVERSION: fire Google Ads conversion on form success (primary) + tel: click (secondary).
  6. Assign this page as final URL for the matching ad group; keep ad copy aligned to the H1.
-->
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com for Civil, Formwork & Concreting Contractors | Fruition</title>
<meta name="description" content="monday.com built for Australian civil, formwork and concreting contractors. Jobsites, pour schedules, ITPs, subbies and claims &mdash; delivered by a Platinum Partner.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>

<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services">
<div class="right">
<a class="phone" href="tel:+61483955931">+61 483 955 931</a>
<a class="book" href="#lead">Book a Free Consultation</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">🚧 monday.com Platinum Partner · Civil &amp; Concrete · Australia</div>
<h1>monday.com for <em>Civil, Formwork &amp; Concreting</em> contractors</h1>
<p class="sub">Jobsites, pour schedules, ITPs, subbie coordination and progress claims in one system your site teams will actually use &mdash; phone-first, built by a Platinum Partner.</p>
<ul class="ticks">
<li>Pour schedules and lookaheads visible to site and office</li>
<li>ITPs, QA checklists and NCR tracking with photo evidence</li>
<li>Subbie dockets, variations and claims in one place</li>
<li>Used by Australian contractors incl. Bielby, Qanstruct and DCOH</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">Site-first mobile rollouts</span>
</div>
</div>

<form class="formcard" id="lead" method="POST" action="#"><!-- FORM-WEBHOOK: Edward -->
<h2>Get your fixed-fee quote</h2>
<p class="fsub">An Australian consultant replies within one business day.</p>
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
<option>Site / pour scheduling setup</option>
<option>QA, ITP & NCR workflows</option>
<option>Subbie & claims management</option>
<option>Rescue an existing setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim &mdash; on success fire gtag conversion, then redirect to /au/thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>Australian contractors running on systems Fruition built</p>
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/09ca61a758adbb476278fde27d53182a18ed95f1-269x114.png?w=260&fit=max&auto=format" alt="Evolve Constructions" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/47f46119cde1e03ae657ef7e33b12dd5259de72f-167x56.png?w=260&fit=max&auto=format" alt="Bielby" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/759b67ae90b27b98db708a19aa0d7f97b6a80e59-900x701.png?w=260&fit=max&auto=format" alt="Qanstruct" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f2217ec4d8bf40fe9d4f6678c5f419a83a0f7f38-822x660.png?w=260&fit=max&auto=format" alt="North Australian Contracting" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f7e4751bdc4d00994e1cfaf06bfb8051f39a5429-899x435.png?w=260&fit=max&auto=format" alt="Roofclad Systems" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/79fd8ce19259142c0e0df9dc996771aed44629f9-900x374.png?w=260&fit=max&auto=format" alt="High Voltage Distribution Contracting" loading="lazy">
</div>
</div>
</div>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation with Fruition's Australian team &mdash; a frank read on scope, fit and cost from a certified Platinum Partner. If monday.com isn't the right fit, we'll say so.</p>
<a class="btn" href="#lead">Book My Free Consultation →</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+61483955931" style="color:var(--purple);font-weight:700;text-decoration:none">+61 483 955 931</a> · AEST/AEDT business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; AU/NZ round-robin inline embed. Australia &amp; New Zealand team ONLY. -->
Calendly embed &mdash; Australia &amp; New Zealand consultation round-robin goes here
</div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">Built for how civil and concrete crews actually work</h2>
<p class="lede">Delivered by certified Australian monday.com consultants &mdash; fixed fee agreed before any build starts, no offshore hand-offs.</p>
<div class="grid3">
<div class="card"><h3>Job &amp; pour scheduling</h3><p>Lookaheads, pour bookings and crew allocation that update from the ute, not just the site office.</p></div>
<div class="card"><h3>QA, ITPs &amp; NCRs</h3><p>Inspection test plans, hold points and non-conformances with photos attached from the phone.</p></div>
<div class="card"><h3>Subbie coordination</h3><p>Dockets, SWMS status, insurances and performance tracked per subcontractor per job.</p></div>
<div class="card"><h3>Variations &amp; progress claims</h3><p>Capture site instructions as they happen and roll them into monthly claims without re-keying.</p></div>
<div class="card"><h3>Plant &amp; crew allocation</h3><p>See which gear and gangs are where, and what's free for the next pour.</p></div>
<div class="card"><h3>Head-contract reporting</h3><p>Dashboards per project and portfolio for PMs, CMs and directors &mdash; live, not Friday-night Excel.</p></div>
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
<div class="quote"><p>"The monday.com mobile app gives our technicians on raw construction sites instant access to the project information they need and makes connecting with the team at HQ easy."</p><div class="who"><b>Allie Swindlehurst</b> · Operations Manager, Falkbuilt</div></div>
<div class="quote"><p>"This system will save hundreds of thousands of dollars a year guaranteed."</p><div class="who"><b>Brandon-Lee Horridge</b> · Managing Director, BL Air Conditioning</div></div>
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
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Will site crews actually use it?</summary><div class="a">That's the design goal. We build phone-first boards &mdash; big buttons, photo uploads, minimal typing &mdash; and train supervisors on their own jobs. The monday.com mobile app is the front end; the office gets the dashboards.</div></details>
<details><summary>Can it handle ITPs and QA records?</summary><div class="a">Yes. ITPs, hold/witness points, checklists and NCRs are built as structured workflows with photo evidence and sign-offs, exportable when the superintendent asks.</div></details>
<details><summary>How does it work with our claims process?</summary><div class="a">Site instructions and variations are captured at the source and flow into a claims register, so monthly progress claims are assembled from live data rather than rebuilt from emails.</div></details>
<details><summary>How fast can we be live?</summary><div class="a">Most contractors run their first jobs on monday.com within two to four weeks. Fixed fee agreed up front; licences billed separately by monday.com.</div></details>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services Pty Ltd · ABN 12 667 454 006 · Level 12, 64 York Street, Sydney NSW 2000 · <a href="tel:+61483955931">+61 483 955 931</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> · <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
</div>
</footer>

<div class="mcta">
<a class="call" href="tel:+61483955931">Call AU team</a>
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
