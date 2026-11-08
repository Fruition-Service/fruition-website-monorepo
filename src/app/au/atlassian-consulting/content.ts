/* AdWords landing page document (source: monday item 2902401378 asset au-atlassian-consulting-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (AU Atlassian &middot; Google Ads)
  Ad group: Atlassian &mdash; market AU (account 8457299561)
  Suggested URL: /au/atlassian-consulting  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> AU/NZ round-robin &mdash; Australia &amp; New Zealand team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Atlassian Consultants Australia | Jira &amp; Confluence Implementation | Fruition</title>
<meta name="description" content="Certified Atlassian consultants in Australia. Jira, Confluence and JSM implementations, data migrations and training &mdash; fixed fee, delivered in 2&ndash;4 weeks.">
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
<div class="eyebrow">&#x1F3E2; Atlassian Partner &middot; Jira &middot; Confluence &middot; Trello &middot; JSM &middot; Sydney &middot; Melbourne &middot; Brisbane &middot; Perth &middot; Adelaide</div>
<h1>Atlassian consultants &mdash; <em>Jira, Confluence &amp; JSM implementation</em></h1>
<p class="sub">Certified Atlassian consultants delivering Jira Software, Jira Service Management, Confluence and Trello implementations &mdash; from initial setup through to enterprise-scale migrations and training.</p>
<ul class="ticks">
<li>Jira and Confluence set up around your team&rsquo;s actual workflow</li>
<li>Full data migration from Basecamp, Asana, Trello or spreadsheets</li>
<li>JSM ticketing and Confluence knowledge base configured and live</li>
<li>Training and 30-day post-go-live support included</li>
</ul>
<div class="badges">
<span class="badge">Atlassian Partner</span>
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
<option>Jira Software implementation</option>
<option>Jira Service Management (JSM)</option>
<option>Confluence knowledge base</option>
<option>Trello setup</option>
<option>Migration from another tool</option>
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
<h2 class="sec">A proper Atlassian implementation, not a default template</h2>
<p class="lede">Delivered by certified Atlassian consultants &mdash; fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>Jira Software setup</h3><p>Boards, workflows, automations and permissions built around how your team actually works.</p></div>
<div class="card"><h3>Jira Service Management</h3><p>ITSM ticketing, SLAs, approval flows and customer portals configured for your service teams.</p></div>
<div class="card"><h3>Confluence knowledge base</h3><p>Space structure, templates, macros and permissions set up so your team actually uses it.</p></div>
<div class="card"><h3>Data migration</h3><p>Projects, issues, comments and attachments migrated from Basecamp, Asana, Trello or spreadsheets.</p></div>
<div class="card"><h3>Integrations</h3><p>Slack, Microsoft 365, GitHub, Bitbucket, Salesforce and your internal tools connected to Atlassian.</p></div>
<div class="card"><h3>Training &amp; adoption</h3><p>Champions trained, end users enabled &mdash; your team owns the system before the engagement closes.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How an Atlassian implementation works</h2>
<p class="lede">A proven, fixed-fee methodology &mdash; the same approach behind 900+ delivered systems.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Discovery &amp; scoping</h3><p>We map your existing workflows, tools and data &mdash; and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Solution design</h3><p>Boards, workflows, automations and permissions designed around how your team actually operates.</p></div>
<div class="step"><div class="n">3</div><h3>Migration &amp; build</h3><p>Data moved in, integrations connected, the whole system tested end-to-end.</p></div>
<div class="step"><div class="n">4</div><h3>Training &amp; handover</h3><p>Champions trained, end users enabled, system owned by your team.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">900+</div><div class="l">implementations delivered across six offices</div></div>
<div><div class="v">2&ndash;4 wks</div><div class="l">typical kickoff to a live, working Atlassian system</div></div>
<div><div class="v">30%</div><div class="l"><!-- FOR EDWARD: confirm Atlassian productivity stat --> typical reduction in project admin time reported by clients</div></div>
<div><div class="v">Full history</div><div class="l">projects, issues and attachments migrated with relationships preserved</div></div>
</div>
<p class="note">Figures are typical outcomes drawn from Fruition engagements and published research. Individual results vary with scope, team size and adoption.</p>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about Fruition's Atlassian consultants</h2>
<div class="quotes">
<div class="quote"><p>&ldquo;Fruition set up our Jira and Confluence exactly the way we work &mdash; not the way the documentation says you should.&rdquo;</p><div class="who"><b>Head of Delivery</b> &middot; Financial services client</div></div>
<div class="quote"><p>&ldquo;Migration from our old Basecamp was seamless. Everything came across, all history preserved.&rdquo;</p><div class="who"><b>Operations Director</b> &middot; Professional services firm</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs -->
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with certified Atlassian consultants</h2>
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
<details open><summary>How long does an Atlassian implementation take?</summary><div class="a">Most Jira or Confluence implementations go live in two to four weeks from kickoff. A single-team Jira board can be running inside a week; a full JSM deployment with Confluence and integrations runs longer. The timeline is scoped and agreed before any build starts.</div></details>
<details><summary>Do you migrate data from our existing tools?</summary><div class="a">Yes. We migrate projects, issues, attachments, comments and history from Basecamp, Asana, Trello, spreadsheets and other tools. Record counts are validated with you before cutover.</div></details>
<details><summary>Which Atlassian products do you support?</summary><div class="a">Jira Software, Jira Service Management, Confluence, Trello and the Atlassian Cloud platform. We also connect them to Slack, Microsoft 365, GitHub, Bitbucket and Salesforce.</div></details>
<details><summary>Will we lose our existing projects during migration?</summary><div class="a">No. We run the migration and validate record counts before any cutover. Existing projects, issues and history remain accessible until you are satisfied everything is across correctly.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation &mdash; a frank read on scope, fit and cost from certified Atlassian consultants. If Atlassian isn&rsquo;t the right fit, we&rsquo;ll say so.</p>
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
