/* AdWords landing page document (source: Josh, Slack #fruition-digital 2026-10-19,
   sea-monday-partner-singapore-malaysia-ads.html). Final URL for the Singapore and
   Malaysia campaigns; the organic /monday-partner-singapore page stays indexed.
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION — ORPHAN SEM LANDING PAGE (🇸🇬🇲🇾 monday.com Partner · Singapore & Malaysia · Google Ads)
  Ad groups: monday.com partner/consultant · monday CRM / CRM system · project management software · monday.com pricing — markets SG + MY
  Suggested URL: /sea/monday-partner-singapore-malaysia  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow — paid traffic only. The organic SEO page /monday-partner-singapore stays live and indexed; this is ONLY the ads final URL.
  SEO/AEO elements (title, meta, keyword-led H1/H2s, JSON-LD Service + FAQPage) are included so the page earns a strong Ads Quality Score / landing-page experience,
  and can be switched to index,follow if you decide to rank it instead of the organic page (then add a canonical to itself and remove the organic page from targeting).
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields + country); CALENDLY -> South-East Asia round-robin (GMT+8 team ONLY);
  RATINGS -> live profile URLs, real linked values only, no review counts; PHONE -> swap AU number for a +65 / +60 number when available.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1 ("monday.com Platinum Partner · Singapore & Malaysia").
-->
<html lang="en-SG">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com Partner Singapore &amp; Malaysia | Fruition</title>
<meta name="description" content="monday.com Platinum Partner for Singapore &amp; Malaysia. Implementation, monday CRM and automation, PDPA-ready, fixed-price from US$2,500. GMT+8 consultants.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<script type="application/ld+json">
{"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://www.fruitionservices.io/#org", "name": "Fruition Services", "url": "https://www.fruitionservices.io", "logo": "https://www.fruitionservices.io/images/logo-fruition-black.svg"}, {"@type": "Service", "name": "monday.com partner services in Singapore and Malaysia", "serviceType": ["monday.com partner Singapore", "monday.com partner Malaysia", "monday.com consultant", "monday.com implementation", "monday CRM", "CRM system Malaysia", "CRM Singapore", "project management software Malaysia"], "provider": {"@id": "https://www.fruitionservices.io/#org"}, "areaServed": [{"@type": "Country", "name": "Singapore"}, {"@type": "Country", "name": "Malaysia"}], "offers": {"@type": "AggregateOffer", "lowPrice": 2500, "priceCurrency": "USD", "offerCount": 3}}, {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "How much does a monday.com implementation cost in Singapore or Malaysia?", "acceptedAnswer": {"@type": "Answer", "text": "Fruition's fixed-price packages start from US$2,500 one-time for Training & Optimisation (1 team, up to 25 users), from US$5,000 one-time for a Lock-Step build (up to 50 users) and from US$2,500 per month for a Deployed Engineer. Your exact fee is agreed in writing before any build starts. monday.com licences are billed separately, and we'll tell you which plan you actually need."}}, {"@type": "Question", "name": "How long does it take?", "acceptedAnswer": {"@type": "Answer", "text": "Most Singapore and Malaysia engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; regional rollouts with CRM migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through."}}, {"@type": "Question", "name": "Can you set up monday.com as our CRM system?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. We build monday CRM for sales teams in Singapore and Malaysia, covering pipelines, lead routing, quotes and reporting, and migrate your history from Salesforce, HubSpot, Pipedrive or spreadsheets with relationships preserved."}}, {"@type": "Question", "name": "Is it PDPA compliant?", "acceptedAnswer": {"@type": "Answer", "text": "We design every build around Singapore's PDPA 2012 and Malaysia's PDPA 2010: restricted boards for personal data, role-based permissions, consent capture in forms and activity logs. We also confirm the data hosting region available on your monday.com plan."}}, {"@type": "Question", "name": "Do you work in our time zone?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Our South-East Asia team works in GMT+8, Singapore and Malaysia business hours, with workshops in Singapore and online delivery across Kuala Lumpur, Penang and Johor Bahru."}}]}]}
</script>
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
<div class="eyebrow">🇸🇬 🇲🇾 monday.com Platinum Partner · Singapore · Kuala Lumpur · Penang · Johor Bahru</div>
<h1>monday.com Platinum Partner for <em>Singapore &amp; Malaysia</em></h1>
<p class="sub">monday.com implementation, CRM setup and workflow automation for Singapore and Malaysian businesses — fixed-price, PDPA-ready and delivered by consultants working your hours (GMT+8).</p>
<ul class="ticks">
<li>Work Management, monday CRM, monday Service and monday dev</li>
<li>CRM migration from Salesforce, HubSpot, Pipedrive or spreadsheets</li>
<li>Fixed-price packages from US$2,500 — agreed before any build</li>
<li>PDPA (SG 2012 · MY 2010) built into permissions and forms</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">2026 Rising Star awards</span>
<span class="badge">GMT+8 team</span>
</div>
</div>
<form class="formcard" id="lead" method="POST" action="#"><!-- FORM-WEBHOOK: Edward -->
<h2>Get your fixed-fee quote</h2>
<p class="fsub">A South-East Asia consultant replies within one business day.</p>
<label for="f-name">Full name</label>
<input id="f-name" name="name" type="text" autocomplete="name" required>
<label for="f-email">Work email</label>
<input id="f-email" name="email" type="email" autocomplete="email" required>
<label for="f-phone">Phone</label>
<input id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="+65 / +60">
<label for="f-company">Company</label>
<input id="f-company" name="company" type="text" autocomplete="organization" required>
<label for="f-country">Country</label>
<select id="f-country" name="country">
<option>Singapore</option>
<option>Malaysia</option>
<option>Other South-East Asia</option>
</select>
<label for="f-need">What do you need?</label>
<select id="f-need" name="need">
<option>New monday.com implementation</option>
<option>CRM system (monday CRM)</option>
<option>Project management setup</option>
<option>Migrate from Salesforce / HubSpot / Pipedrive</option>
<option>Fix or optimise an existing monday.com</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<input type="hidden" name="region" value="South-East Asia">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim — fire conversion on success, then redirect to /sea/thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>Organisations running on systems Fruition built</p>
<!-- CLIENT-LOGOS: the regionLogoSet shown on /monday-partner-singapore (Sanity), until SG/MY client permissions are signed off -->
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/3e025b7f42b4f1c4ee3cc16cff5b2cf75e16742a-200x121.png?w=260&fit=max&auto=format" alt="At-Sunrice GlobalChef Academy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9827daa09cde6f5c9127b3d554d8829930ca186b-900x365.png?w=260&fit=max&auto=format" alt="Pacific Community">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9d0e2d2b8231b2fc504ee69644d12b59ec35387e-700x272.png?w=260&fit=max&auto=format" alt="Ogilvy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/7cd3b8aef0d102de405f11ffcaab7b65385fc14d-288x78.png?w=260&fit=max&auto=format" alt="Scania">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format" alt="Specsavers">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/034c0b291272f680c860dc42ac88d17776d2f356-900x248.png?w=260&fit=max&auto=format" alt="Telstra">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format" alt="CSIRO">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/f233b17f09a5ab430f63071a825d46b2a075c5ab-1427x500.png?w=260&fit=max&auto=format" alt="Givergy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/fa5e7a98c079be559d85cb901db20ecafa84bd40-390x160.png?w=260&fit=max&auto=format" alt="Joloda Hydraroll">
</div>
</div>
</div>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">monday.com consulting for Singapore &amp; Malaysian teams</h2>
<p class="lede">Delivered by certified monday.com consultants working GMT+8 hours — fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>monday.com implementation</h3><p>Boards, dashboards, forms, permissions and automations built around your agreed process — one team or several countries.</p></div>
<div class="card"><h3>CRM system setup</h3><p>monday CRM for Singapore and Malaysia sales teams: pipelines, lead routing, quotes and sales reporting.</p></div>
<div class="card"><h3>CRM migration</h3><p>Contacts, companies, deals, activities and files moved from Salesforce, HubSpot, Pipedrive or spreadsheets with relationships intact.</p></div>
<div class="card"><h3>Project management</h3><p>Replace Excel and email with projects, timelines, resourcing and client-ready reporting your managers trust.</p></div>
<div class="card"><h3>Integrations</h3><p>Xero, Microsoft 365, Outlook, Gmail, Slack, WhatsApp-to-board forms, Jira, HubSpot and Salesforce connected to monday.com.</p></div>
<div class="card"><h3>Team enablement</h3><p>Training on your own boards for users, champions and admins, plus 30-day post-go-live support.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Fixed-price packages</p>
<h2 class="sec">monday.com implementation pricing for Singapore &amp; Malaysia</h2>
<p class="lede">Choose by team size and what you need done. Your exact fee is confirmed in writing before we start.</p>
<div class="pkgs">
<div class="pkg"><span class="dur">Reset and train</span><h3>Training &amp; Optimisation</h3><span class="size">1 team · up to 25 users</span><div class="price">From US$2,500 <small>one-time</small></div><ul><li>Up to 5 boards reviewed and cleaned up</li><li>Up to 10 automations optimised</li><li>2 training sessions</li></ul><a class="btn" href="#lead">Get started</a></div>
<div class="pkg feat"><span class="dur">We build and deploy together</span><h3>Lock-Step</h3><span class="size">1–2 teams · up to 50 users</span><div class="price">From US$5,000 <small>one-time</small></div><ul><li>1–2 workflows mapped and built</li><li>Up to 8 boards + 2 dashboards</li><li>Up to 15 automations + 1 integration</li></ul><a class="btn" href="#lead">Get quote</a></div>
<div class="pkg"><span class="dur">Ongoing, embedded</span><h3>Deployed Engineer</h3><span class="size">Multiple teams · up to 250 users</span><div class="price">From US$2,500 <small>per month</small></div><ul><li>1 named forward deployed engineer</li><li>Change requests in 2 business days</li><li>Monthly roadmap review</li></ul><a class="btn" href="#lead">Get your options</a></div>
</div>
<p class="pnote">Prices in USD; Singapore and Malaysia rates confirmed in your quote. monday.com licences are billed separately by monday.com.</p>
</div>
</section>

<section>
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a monday.com implementation works</h2>
<p class="lede">A proven, fixed-fee framework — the same methodology behind 900+ delivered systems.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Discovery &amp; scoping</h3><p>We map your workflows and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Solution architecture</h3><p>Boards, automations and dashboards built around how your Singapore and Malaysia teams actually operate.</p></div>
<div class="step"><div class="n">3</div><h3>Data migration</h3><p>Records moved in from spreadsheets or your old CRM, with PDPA-ready permissions from day one.</p></div>
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
<div class="quote"><p>"Fruition have been instrumental in moving us to a single source of truth system for managing sales and projects."</p><div class="who"><b>Ron Amaram</b> · General Manager, Risk 2 Solutions</div></div>
<div class="quote"><p>"Having experienced working with Josh directly at monday.com, I would have no hesitation recommending Josh in any consulting engagement."</p><div class="who"><b>Brad Cannon</b> · Senior Account Executive, monday.com</div></div>
</div>
<!-- RATINGS: Edward — add live profile URLs. Real linked values only; no review counts. -->
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
<p class="lede">Engagements are scoped and delivered personally, in GMT+8 business hours — no hand-offs.</p>
<div class="team">
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/194c9ab129a70bab635384976fc43ecc0661b587-500x500.jpg?w=560&h=560&fit=crop" alt="Nikhil Tiwari" loading="lazy"><h3>Nikhil Tiwari</h3><div class="role">Sales &amp; Implementation Lead</div><p>Certified monday.com and Make consultant with an ML and GenAI background, working with South-East Asian clients.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/56b7495c43a5904dc35ac1955f21b6b6461ee780-1000x1000.jpg?w=560&h=560&fit=crop" alt="Suzzane Castro" loading="lazy"><h3>Suzzane Castro</h3><div class="role">Delivery Consultant</div><p>Business automation specialist connecting monday.com with finance, document and messaging tools.</p><!-- TEAM: headshot added; title as supplied, still to confirm --></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/811213d278aabf0686ff32841b559dec63cce794-1584x1246.jpg?rect=169,0,1246,1246&w=560&h=560&fit=crop" alt="Josh Jebathilak" loading="lazy"><h3>Josh Jebathilak</h3><div class="role">Founder &amp; Managing Director</div><p>Former monday.com sales leader who founded Fruition. Oversees every regional rollout.</p></div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions Singapore &amp; Malaysian buyers ask us first</h2>
<details open><summary>How much does a monday.com implementation cost in Singapore or Malaysia?</summary><div class="a">Fruition&#x27;s fixed-price packages start from US$2,500 one-time for Training &amp; Optimisation (1 team, up to 25 users), from US$5,000 one-time for a Lock-Step build (up to 50 users) and from US$2,500 per month for a Deployed Engineer. Your exact fee is agreed in writing before any build starts. monday.com licences are billed separately, and we&#x27;ll tell you which plan you actually need.</div></details><details><summary>How long does it take?</summary><div class="a">Most Singapore and Malaysia engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; regional rollouts with CRM migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details><details><summary>Can you set up monday.com as our CRM system?</summary><div class="a">Yes. We build monday CRM for sales teams in Singapore and Malaysia, covering pipelines, lead routing, quotes and reporting, and migrate your history from Salesforce, HubSpot, Pipedrive or spreadsheets with relationships preserved.</div></details><details><summary>Is it PDPA compliant?</summary><div class="a">We design every build around Singapore&#x27;s PDPA 2012 and Malaysia&#x27;s PDPA 2010: restricted boards for personal data, role-based permissions, consent capture in forms and activity logs. We also confirm the data hosting region available on your monday.com plan.</div></details><details><summary>Do you work in our time zone?</summary><div class="a">Yes. Our South-East Asia team works in GMT+8, Singapore and Malaysia business hours, with workshops in Singapore and online delivery across Kuala Lumpur, Penang and Johor Bahru.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation — a frank read on scope, fit and cost from a monday.com Platinum Partner. If monday.com isn't the right fit, we'll say so.</p>
<a class="btn" style="max-width:300px" href="#lead">Book My Free Consultation →</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+61483955931" style="color:var(--purple);font-weight:700;text-decoration:none">+61 483 955 931</a> · Singapore &amp; Malaysia business hours (GMT+8)</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward — South-East Asia round-robin — GMT+8 team ONLY -->
Calendly embed — South-East Asia round-robin — GMT+8 team ONLY
</div>
</div>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services · Serving Singapore &amp; Malaysia · <a href="tel:+61483955931">+61 483 955 931</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> · <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
</div>
</footer>

<div class="mcta">
<a class="call" href="tel:+61483955931">Call SEA team</a>
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
