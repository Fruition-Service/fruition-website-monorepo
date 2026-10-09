/* AdWords landing page document (source: monday item 2876510374 asset au-monday-for-marketing-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU Marketing Teams · Google Ads)
  Ad group: Marketing Teams &mdash; market AU (account 8457299561)
  Suggested URL: /au/monday-for-marketing  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> AU/NZ round-robin &mdash; Australia &amp; New Zealand team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com for Marketing Teams Australia | Fruition</title>
<meta name="description" content="monday.com for marketing teams in Australia. Campaigns, content calendars, creative requests and approvals in one system &mdash; by a Platinum Partner.">
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
<div class="eyebrow">🇦🇺 monday.com Platinum Partner · Marketing Teams · Sydney · Melbourne · Brisbane · Perth · Adelaide</div>
<h1>monday.com for <em>Marketing Teams</em></h1>
<p class="sub">Campaigns, content calendars, creative requests and approvals in one system &mdash; so the work stops living in six tools and nobody's head.</p>
<ul class="ticks">
<li>Campaign plans connected to the tasks that deliver them</li>
<li>Creative request intake with briefs that are actually complete</li>
<li>Approval workflows that end the version-7-final chaos</li>
<li>Content calendar every stakeholder can see</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">NSW Gov ICT Scheme &mdash; Advanced supplier</span>
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
<option>Campaign & content workflows</option>
<option>Creative requests & approvals</option>
<option>Marketing budget tracking</option>
<option>Rescue an existing setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /au/thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>Australian organisations running on systems Fruition built</p>
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/034c0b291272f680c860dc42ac88d17776d2f356-900x248.png?w=260&fit=max&auto=format" alt="Telstra" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/ae132b4ca3b3c0a8d8494b5b83b31f7f2ba2478c-354x206.png?w=260&fit=max&auto=format" alt="Reserve Bank of Australia" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format" alt="CSIRO" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/a76238ed023b45602730a252c456f248216a4664-259x280.png?w=260&fit=max&auto=format" alt="Transport for NSW" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f7d89f47cc4927d8c57031744dc8e311370bb591-640x437.png?w=260&fit=max&auto=format" alt="SBS" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format" alt="Specsavers" loading="lazy">
</div>
</div>
</div>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">Marketing operations without the tool sprawl</h2>
<p class="lede">Delivered by certified monday.com consultants working your hours &mdash; fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>Campaign management</h3><p>Plans, budgets, channels and tasks in one connected structure.</p></div>
<div class="card"><h3>Content calendar</h3><p>Every channel's pipeline visible, filterable and reliable.</p></div>
<div class="card"><h3>Creative requests</h3><p>Structured intake with briefs, priorities and SLAs &mdash; no more drive-by asks.</p></div>
<div class="card"><h3>Review &amp; approvals</h3><p>Versioned approvals with annotations, deadlines and auto-chase.</p></div>
<div class="card"><h3>Budget tracking</h3><p>Planned vs committed vs actual per campaign, live.</p></div>
<div class="card"><h3>Performance dashboards</h3><p>Campaign status and results for the CMO without the Friday scramble.</p></div>
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
<div class="quote"><p>"Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally."</p><div class="who"><b>Emily Hill</b> · International Markets Manager, Tourism Northern Territory</div></div>
<div class="quote"><p>"We found monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues."</p><div class="who"><b>Mairhead McKinley</b> · Delivery Manager, Givergy</div></div>
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
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/811213d278aabf0686ff32841b559dec63cce794-1584x1246.jpg?rect=169,0,1246,1246&w=560&h=560&fit=crop" alt="Josh Jebathilak" loading="lazy"><h3>Josh Jebathilak</h3><div class="role">Founder &amp; Managing Director</div><p>Ex-monday.com, personally oversaw system builds for hundreds of organisations before founding Fruition.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/800645656b19c9368a1fcc57c73d2f7956e9e826-593x593.jpg?w=560&h=560&fit=crop" alt="Nikki Glucksman" loading="lazy"><h3>Nikki Glucksman</h3><div class="role">Principal Consultant</div><p>UX-driven product strategist translating business requirements into streamlined workflows.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/56b7495c43a5904dc35ac1955f21b6b6461ee780-1000x1000.jpg?w=560&h=560&fit=crop" alt="Suzzane Castro" loading="lazy"><h3>Suzzane Castro</h3><div class="role">Regional Delivery Manager</div><p>Business automation specialist connecting monday.com with Xero, PandaDoc and Slack.</p></div>

</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Why did Tourism NT choose this setup?</summary><div class="a">Process automation across campaign management, budget management and project approvals &mdash; the exact workflows this build delivers &mdash; saved significant staff time globally and improved cross-team collaboration.</div></details>
<details><summary>How much does it cost?</summary><div class="a">Quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licences are billed separately &mdash; and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does it take?</summary><div class="a">Most engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; wider rollouts with migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details>
<details><summary>Does it integrate with our marketing stack?</summary><div class="a">Yes &mdash; forms, email platforms, social schedulers and Xero, MYOB, QuickBooks, Salesforce, HubSpot and Microsoft 365 connect via native integrations, Make or the API.</div></details>
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
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+61483955931" style="color:var(--purple);font-weight:700;text-decoration:none">+61 483 955 931</a> · AEST/AEDT business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; AU/NZ round-robin &mdash; Australia &amp; New Zealand team ONLY -->
Calendly embed &mdash; AU/NZ round-robin &mdash; Australia &amp; New Zealand team ONLY
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
