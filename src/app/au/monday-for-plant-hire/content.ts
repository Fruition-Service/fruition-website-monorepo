/* AdWords landing page document (source: monday item 2873580748 asset monday-plant-equipment-hire.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU · Google Ads)
  Campaign: NEW &mdash; Plant & Equipment Hire search campaign (Google Ads account 8457299561)
  Suggested URL: /au/monday-for-plant-hire  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
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
<title>monday.com for Plant & Equipment Hire | Fruition</title>
<meta name="description" content="monday.com for Australian plant and equipment hire companies. Asset registers, hire schedules, maintenance and utilisation &mdash; built by a Platinum Partner.">
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
<div class="eyebrow">🚜 monday.com Platinum Partner · Plant &amp; Equipment Hire · Australia</div>
<h1>monday.com for <em>Plant &amp; Equipment Hire</em> companies</h1>
<p class="sub">Asset registers, hire schedules, prestarts, maintenance and utilisation in one system &mdash; so you always know where the gear is, what it's earning and what's due for service.</p>
<ul class="ticks">
<li>Live asset register with location, status and hire history</li>
<li>Hire scheduling with conflicts flagged before they happen</li>
<li>Preventative maintenance triggered by hours or dates</li>
<li>Utilisation and revenue-per-asset dashboards</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
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
<option>Asset register & tracking</option>
<option>Hire scheduling workflow</option>
<option>Maintenance & prestarts</option>
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
<p>Australian contractors and hire-adjacent teams on Fruition builds</p>
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
<h2 class="sec">From the yard to the jobsite, every asset accounted for</h2>
<p class="lede">Delivered by certified Australian monday.com consultants &mdash; fixed fee agreed before any build starts, no offshore hand-offs.</p>
<div class="grid3">
<div class="card"><h3>Asset register</h3><p>Every machine with rego, serials, attachments, location and current status in one searchable register.</p></div>
<div class="card"><h3>Hire scheduling</h3><p>Bookings, off-hires and transport movements on a timeline &mdash; double-bookings flagged automatically.</p></div>
<div class="card"><h3>Maintenance &amp; prestarts</h3><p>Services triggered by engine hours or calendar, with prestart checklists completed from the phone.</p></div>
<div class="card"><h3>Breakdowns &amp; defects</h3><p>Defect reports with photos from site, triaged to workshop queues with downtime tracked.</p></div>
<div class="card"><h3>Customer &amp; contract hire</h3><p>Client accounts, rates and hire agreements connected to the assets they're running.</p></div>
<div class="card"><h3>Utilisation reporting</h3><p>Utilisation, revenue per asset and idle gear surfaced on live dashboards for the owners.</p></div>
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
<div class="quote"><p>"monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts."</p><div class="who"><b>Jason Doan</b> · VP of Heavy Rental & Sales, HOLT CAT</div></div>
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
<details open><summary>Can monday.com track equipment location and status?</summary><div class="a">Yes &mdash; each asset carries live status (on hire, in yard, in workshop, in transit), site location and hire history. Telematics feeds can be integrated where your fleet supports them.</div></details>
<details><summary>How does maintenance scheduling work?</summary><div class="a">Services are triggered by engine hours or dates, creating workshop jobs automatically. Prestarts and defect reports come in from phones on site with photos attached.</div></details>
<details><summary>Does it replace dedicated hire software?</summary><div class="a">For many independent hire companies, yes &mdash; and with far more flexibility. Where specialist rental software stays, monday.com becomes the operations and maintenance layer around it.</div></details>
<details><summary>How quickly can we be live?</summary><div class="a">Typically two to four weeks from kickoff including asset data migration from spreadsheets. Fixed fee agreed before any build starts.</div></details>
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
