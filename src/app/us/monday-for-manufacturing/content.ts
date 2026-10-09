/* AdWords landing page document (source: monday item 2876510374 asset us-monday-for-manufacturing-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (US Manufacturing · Google Ads)
  Ad group: Manufacturing &mdash; market US (account 8457299561)
  Suggested URL: /us/monday-for-manufacturing  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> US/North America round-robin &mdash; North America team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com for Manufacturing US | Fruition</title>
<meta name="description" content="monday.com for manufacturers in the US. Production tracking, quality, maintenance and orders in one system &mdash; built by a Platinum Partner.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>
<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services">
<div class="right">
<a class="phone" href="tel:+13023302496">+1 302 330 2496</a>
<a class="book" href="#lead">Book a Free Consultation</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">🇺🇸 monday.com Platinum Partner · Manufacturing · New York · Chicago · Austin · San Francisco</div>
<h1>monday.com for <em>Manufacturing</em></h1>
<p class="sub">Production schedules, work orders, quality and maintenance in one connected system &mdash; visible from the floor to the boardroom.</p>
<ul class="ticks">
<li>Production and work-order tracking the floor can update</li>
<li>Quality checks and NCRs with photo evidence</li>
<li>Preventative maintenance triggered by dates or usage</li>
<li>Order-to-dispatch visibility without spreadsheet relays</li>
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
<option>Production / work-order tracking</option>
<option>Quality & maintenance workflows</option>
<option>Order & inventory management</option>
<option>Rescue an existing setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /us/thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>US organizations running on systems Fruition built</p>
<!-- CLIENT-LOGOS: Edward &mdash; swap chips for grayscale Sanity logos where permission is signed off -->
<div class="chip-row">
<span class="chip">Honor Credit Union</span>
<span class="chip">Craters &amp; Freighters</span>
<span class="chip">Housing Authority of San Antonio</span>
<span class="chip">Stout Risius Ross</span>
<span class="chip">Kitchen Tune-Up</span>
<span class="chip">Windfall Bio</span>
</div>
</div>
</div>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">From order intake to dispatch, one source of truth</h2>
<p class="lede">Delivered by certified monday.com consultants working your hours &mdash; fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>Production scheduling</h3><p>Work orders, line schedules and status the whole plant can see.</p></div>
<div class="card"><h3>Quality &amp; NCRs</h3><p>Checks, holds and non-conformances with evidence and dispositions.</p></div>
<div class="card"><h3>Maintenance</h3><p>Preventative schedules and breakdown queues with downtime tracked.</p></div>
<div class="card"><h3>Inventory &amp; purchasing</h3><p>Stock triggers, PO approvals and supplier tracking connected to production.</p></div>
<div class="card"><h3>Order management</h3><p>From sales order to dispatch with promise dates everyone trusts.</p></div>
<div class="card"><h3>Floor-to-exec reporting</h3><p>OEE-style dashboards and daily huddle boards, live not lagged.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
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
<div class="quote"><p>"We are now utilizing monday.com to its full potential, from lead through design and production teams &mdash; everyone knows what stage our projects are in."</p><div class="who"><b>Jade Wood</b> · Managing Director, Popology</div></div>
<div class="quote"><p>"monday.com has given us the visibility we need to get everyone on the same page and keep track of all the moving parts."</p><div class="who"><b>Jason Doan</b> · VP of Heavy Rental &amp; Sales, HOLT CAT</div></div>
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

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with a certified monday.com partner consultant</h2>
<p class="lede">Engagements are scoped and delivered personally &mdash; no hand-offs to an offshore bench.</p>
<div class="team">
<div class="member"><div class="avatar">ZW</div><h3>Zach Weller</h3><div class="role">Director &mdash; North America</div><p>Leads US delivery from New York &mdash; hands-on through scoping, build and training.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/194c9ab129a70bab635384976fc43ecc0661b587-500x500.jpg?w=560&h=560&fit=crop" alt="Nikhil Tiwari" loading="lazy"><h3>Nikhil Tiwari</h3><div class="role">Sales &amp; Implementation Lead</div><p>Certified monday.com and Make consultant with an ML and GenAI background.</p></div>
<div class="member"><div class="avatar">VM</div><h3>Valeria Marin</h3><div class="role">Implementation Consultant</div><p>Optimizes business processes and ensures seamless project transitions for US clients.</p></div>

</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Is monday.com an MRP/ERP replacement?</summary><div class="a">No &mdash; and that's the point. It's the operations layer around your ERP: scheduling, quality, maintenance and coordination workflows your ERP is too rigid for, integrated rather than duplicated.</div></details>
<details><summary>How much does it cost?</summary><div class="a">Quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licenses are billed separately &mdash; and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does it take?</summary><div class="a">Most engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; wider rollouts with migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details>
<details><summary>Can operators update it from the floor?</summary><div class="a">Yes &mdash; tablet and phone-friendly boards with barcode-style simplicity: tap a status, attach a photo, done. Training is part of every build.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation &mdash; a frank read on scope, fit and cost from a certified Platinum Partner. If monday.com isn't the right fit, we'll say so.</p>
<a class="btn" style="max-width:300px" href="#lead">Book My Free Consultation →</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+13023302496" style="color:var(--purple);font-weight:700;text-decoration:none">+1 302 330 2496</a> · ET–PT business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; US/North America round-robin &mdash; North America team ONLY -->
Calendly embed &mdash; US/North America round-robin &mdash; North America team ONLY
</div>
</div>
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
