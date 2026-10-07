/* AdWords landing page document (source: monday item 2873580748 asset monday-executive-okrs-dashboards.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU · Google Ads)
  Campaign: NEW &mdash; Executive OKRs & Dashboards search campaign (Google Ads account 8457299561)
  Suggested URL: /au/monday-for-executives  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
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
<title>monday.com Executive OKRs & Dashboards | Fruition</title>
<meta name="description" content="Executive OKRs and live dashboards on monday.com. Strategy to execution visibility for Australian leadership teams &mdash; built by a Platinum Partner.">
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
<div class="eyebrow">🎯 monday.com Platinum Partner · Executive &amp; Strategy · Australia</div>
<h1>Executive <em>OKRs &amp; Dashboards</em> on monday.com</h1>
<p class="sub">Company objectives connected to the work that delivers them, with live dashboards for the leadership table &mdash; not a quarterly slide that's stale by week two.</p>
<ul class="ticks">
<li>OKRs cascaded from company to team to initiative</li>
<li>Live portfolio dashboards for the exec and board</li>
<li>Initiative status rolled up automatically from real work</li>
<li>One source of truth across departments and entities</li>
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
<option>OKR framework build</option>
<option>Executive / board dashboards</option>
<option>Portfolio & initiative tracking</option>
<option>Multi-entity reporting</option>
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
<p>Australian leadership teams running on Fruition builds</p>
<!-- CLIENT-CHIPS: Edward &mdash; swap to grayscale logos only where permission is signed off -->
<div class="chip-row">
<span class="chip">Tourism Northern Territory</span>
<span class="chip">CSIRO</span>
<span class="chip">Specsavers</span>
<span class="chip">G8 Education</span>
<span class="chip">Clean Power Australia</span>
<span class="chip">HVAC Australia</span>
</div>
</div>
</div>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">From strategy day to Monday morning</h2>
<p class="lede">Delivered by certified Australian monday.com consultants &mdash; fixed fee agreed before any build starts, no offshore hand-offs.</p>
<div class="grid3">
<div class="card"><h3>OKR architecture</h3><p>Company objectives cascaded to teams with measurable key results and clear owners.</p></div>
<div class="card"><h3>Executive dashboards</h3><p>Live views of initiatives, KPIs and risks that replace the Friday slide-deck scramble.</p></div>
<div class="card"><h3>Initiative &amp; portfolio tracking</h3><p>Every strategic initiative with status, owner and blockers rolled up from the actual work.</p></div>
<div class="card"><h3>Board reporting</h3><p>Consistent monthly views exportable for board packs &mdash; numbers that match operations.</p></div>
<div class="card"><h3>Cross-entity visibility</h3><p>Roll-ups across business units or companies for groups running multiple entities.</p></div>
<div class="card"><h3>Cadence &amp; reviews</h3><p>Check-in workflows that keep OKRs honest &mdash; updates in minutes, not meeting hours.</p></div>
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
<div class="quote"><p>"Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally."</p><div class="who"><b>Emily Hill</b> · International Markets Manager, Tourism Northern Territory</div></div>
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
<details open><summary>How is this different from an OKR tool?</summary><div class="a">It lives where the work lives. Because monday.com runs the initiatives themselves, key results update from real delivery data instead of a separate OKR app no one opens after week three.</div></details>
<details><summary>What do executives actually see?</summary><div class="a">A live dashboard of objectives, initiative health, KPIs and risks &mdash; filterable by department or entity, always current, exportable for board packs.</div></details>
<details><summary>Can it span multiple companies or entities?</summary><div class="a">Yes &mdash; group structures with roll-ups across entities are a Fruition specialty, including permissions that keep each entity's detail private.</div></details>
<details><summary>How long does this take to stand up?</summary><div class="a">An OKR framework and executive dashboard layer typically goes live inside two to three weeks, then iterates each quarter.</div></details>
</div>
</section>

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
