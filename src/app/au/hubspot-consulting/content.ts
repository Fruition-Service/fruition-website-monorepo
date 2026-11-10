/* AdWords landing page document (source: monday item 2902401378 asset au-hubspot-consulting-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU HubSpot &middot; Google Ads)
  Ad group: HubSpot &mdash; market AU (account 8457299561)
  Suggested URL: /au/hubspot-consulting  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> AU/NZ round-robin &mdash; Australia &amp; New Zealand team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HubSpot Consultants Australia | CRM, Sales Hub &amp; Marketing Hub | Fruition</title>
<meta name="description" content="HubSpot Solutions Partners in Australia. CRM setup, Sales Hub automation, Marketing Hub campaigns and full-history migrations from Salesforce, fixed fee.">
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
<div class="eyebrow">HubSpot Solutions Partner</div>
<h1>HubSpot consultants: <em>CRM, Sales Hub &amp; Marketing Hub</em></h1>
<p class="sub">HubSpot Solutions Partners delivering CRM setup, Sales Hub automation and Marketing Hub campaigns, including full-history migrations from Salesforce, monday CRM and spreadsheets.</p>
<ul class="ticks">
<li>HubSpot CRM built around your actual sales process</li>
<li>Full-history migration from Salesforce, Pipedrive or spreadsheets</li>
<li>Sales sequences and Marketing Hub campaigns configured</li>
<li>Onboarding and 30-day post-launch support included</li>
</ul>
<div class="badges">
<span class="badge">HubSpot Solutions Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">Fixed-fee delivery</span>
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
<option>New HubSpot CRM setup</option>
<option>Sales Hub automation</option>
<option>Marketing Hub campaigns</option>
<option>Migration from Salesforce</option>
<option>Migration from monday CRM or Pipedrive</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation &rarr;</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /au/thank-you -->
<p class="fine">No obligation. 100% confidential. We&rsquo;ll tell you if you don&rsquo;t need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>Australian teams running on systems Fruition built</p>
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

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">A HubSpot setup that actually <em>fits how you sell</em></h2>
<p class="lede">Delivered by HubSpot Solutions Partners, fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>HubSpot CRM setup</h3><p>Pipelines, deal stages, properties and views built around how your sales team actually works.</p></div>
<div class="card"><h3>Sales Hub automation</h3><p>Email sequences, task queues, meeting scheduling and deal rotation automated so your team sells, not administers.</p></div>
<div class="card"><h3>Marketing Hub campaigns</h3><p>Landing pages, email workflows, lead scoring and reporting configured to drive and track pipeline.</p></div>
<div class="card"><h3>Full-history migration</h3><p>Contacts, companies, deals, notes, emails and activities migrated from Salesforce, Pipedrive or spreadsheets.</p></div>
<div class="card"><h3>Integrations &amp; reporting</h3><p>Your existing tools connected to HubSpot, and dashboards built so leadership has the view they need.</p></div>
<div class="card"><h3>Onboarding &amp; training</h3><p>Your team trained on their own workflows. 30-day post-launch support so adoption actually sticks.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a HubSpot <em>implementation works</em></h2>
<p class="lede">A proven, fixed-fee framework, the same methodology behind 900+ delivered systems.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Discovery &amp; scoping</h3><p>We map your current CRM, data and processes, and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Build &amp; configure</h3><p>Pipelines, properties, sequences and dashboards configured to your actual workflow.</p></div>
<div class="step"><div class="n">3</div><h3>Migration &amp; test</h3><p>Data migrated, integrations connected, the system validated before go-live.</p></div>
<div class="step"><div class="n">4</div><h3>Onboarding &amp; handover</h3><p>Team trained on their own setup. 30-day post-launch support so adoption sticks.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">900+</div><div class="l">implementations delivered across six offices</div></div>
<div><div class="v">2-4 wks</div><div class="l">typical kickoff to a live HubSpot system</div></div>
<div><div class="v">Full history</div><div class="l">contacts, deals and activities migrated, relationships preserved</div></div>
<div><div class="v">30-day</div><div class="l">post-launch support included in every engagement</div></div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about <em>Fruition's HubSpot consultants</em></h2>
<div class="quotes">
<div class="quote"><p>&ldquo;Our Salesforce migration to HubSpot was flawless. Every contact, deal and activity came across with zero data loss.&rdquo;</p><div class="who"><b>VP Sales</b> &middot; Technology company</div></div>
<div class="quote"><p>&ldquo;Fruition understood our sales process from day one. The setup was done in two weeks and the team adopted it immediately.&rdquo;</p><div class="who"><b>Head of Revenue</b> &middot; Professional services firm</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs -->
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with certified <em>HubSpot consultants</em></h2>
<p class="lede">Engagements are scoped and delivered personally, no hand-offs to an offshore bench.</p>
<div class="team">
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/0b7cac4a6d1e09efde35a473e3e6bee65f5d91d2-800x800.jpg?w=560&h=560&fit=crop" alt="Kevin Zhao" loading="lazy"><h3>Kevin Zhao</h3><div class="role">Director, EMEA</div><p>Ex-monday.com, leading UK delivery and best practice across hundreds of builds.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/634ee0c5c7d9e2c0d18d21d8a387822961233fed-512x512.png?w=560&h=560&fit=crop" alt="Alex Bordei" loading="lazy"><h3>Alex Bordei</h3><div class="role">Implementation Manager</div><p>Workflow design, process automation and change management.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/ff248988d44e2d927a796f035b39f8bc5fe7b3f7-512x512.jpg?w=560&h=560&fit=crop" alt="Nevena Gravin" loading="lazy"><h3>Nevena Gravin</h3><div class="role">Implementation Lead</div><p>CRM, work management and ticketing system architecture.</p></div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask <em>us first</em></h2>
<details open><summary>Can you migrate from Salesforce to HubSpot?</summary><div class="a">Yes. We migrate contacts, companies, deals, activities, notes and email history. Field mapping is agreed in discovery, record counts validated before cutover, and the team trained on HubSpot before the old system is switched off.</div></details>
<details><summary>How long does HubSpot onboarding take?</summary><div class="a">Most CRM implementations go live in two to four weeks from kickoff. Sales Hub or Marketing Hub projects with complex automations or migration can run longer, the timeline is scoped and agreed before any build starts.</div></details>
<details><summary>Do you do ongoing HubSpot support after launch?</summary><div class="a">Yes. Every engagement includes 30 days of post-launch support. For ongoing optimisation, campaigns and reporting, we offer retained support packages.</div></details>
<details><summary>Do we need to buy HubSpot before engaging you?</summary><div class="a">No. We help you choose the right Hub and tier before purchase, and as a Solutions Partner we can support introductions to HubSpot&rsquo;s commercial team. We&rsquo;ll tell you exactly what you need and nothing more.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation, a frank read on scope, fit and cost from a HubSpot Solutions Partner. If HubSpot isn&rsquo;t the right fit, we&rsquo;ll say so.</p>
<a class="btn" href="#lead">Book My Free Consultation &rarr;</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+61483955931" style="color:var(--purple);font-weight:700;text-decoration:none">+61 483 955 931</a> &middot; AEST/AEDT business hours</p>
<p style="margin-top:14px;font-size:14px;color:var(--light)">Or explore our Sydney office: <a href="/contact-us" style="color:var(--purple);font-weight:600;text-decoration:none">Contact Us &#8594;</a></p>
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
<div>Fruition Services Pty Ltd &middot; ABN 12 667 454 006 &middot; Level 12, 64 York Street, Sydney NSW 2000 &middot; <a href="tel:+61483955931">+61 483 955 931</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> &middot; <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
</div>
</footer>

<div class="mcta">
<a class="call" href="tel:+61483955931">Call Australian team</a>
<a class="book" href="#lead">Book free consult</a>
</div>

<script>
(function(){try{
var p=new URLSearchParams(location.search);
var m={"f-gclid":"gclid","f-utmc":"utm_campaign","f-utmt":"utm_term"};
for(var id in m){var v=p.get(m[id]);if(v)document.getElementById(id).value=v;}
}catch(e){}})(  );
</script>
</body>
</html>
`
