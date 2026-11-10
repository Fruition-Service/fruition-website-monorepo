/* AdWords landing page document (source: monday item 2902401378 asset uk-lovable-consulting-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (UK Lovable &middot; Google Ads)
  Ad group: Lovable &mdash; market UK (account 8457299561)
  Suggested URL: /uk/lovable-consulting  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> UK/EMEA round-robin &mdash; UK team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lovable Consultants UK | Ship Your Web App in Days | Fruition</title>
<meta name="description" content="Lovable development consultants in the UK. Production-ready web apps from spec to shipped, with real developers handling architecture, integrations and edge cases. Fixed fee.">
<meta name="robots" content="noindex,follow">
${LP_FONTS}
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>
<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services">
<div class="right">
<a class="phone" href="tel:+447822019548">+44 7822 019548</a>
<a class="book" href="#lead">Book a Free Consultation</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">Lovable Development Partner</div>
<h1>Lovable consultants: <em>ship your web app in days, not months</em></h1>
<p class="sub">Fruition builds production-ready web apps with Lovable, from spec to shipped fast, with real developers handling the architecture, integrations and edge cases that AI alone misses.</p>
<ul class="ticks">
<li>Production-ready Lovable apps, not prototypes that break in production</li>
<li>Design-to-code: your spec turned into a working app</li>
<li>Backend integrations, auth and data handled properly</li>
<li>Deployed, tested and yours to maintain or hand back</li>
</ul>
<div class="badges">
<span class="badge">Lovable Development Partner</span>
<span class="badge">Full-stack delivery</span>
<span class="badge">Fixed-fee delivery</span>
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
<option>New web app from spec</option>
<option>Lovable prototype to production</option>
<option>App iterations and new features</option>
<option>Backend integrations</option>
<option>Deployment and hosting setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation &rarr;</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /uk/thank-you -->
<p class="fine">No obligation. 100% confidential. We&rsquo;ll tell you if you don&rsquo;t need us.</p>
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

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">A working app, <em>not an expensive prototype</em></h2>
<p class="lede">Delivered by developers who know where Lovable excels and where it needs professional help, fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>Lovable app development</h3><p>From your spec to a production-ready app, layouts, logic, state management and edge cases all handled.</p></div>
<div class="card"><h3>Design-to-code</h3><p>Your design file or sketch turned into a working Lovable app that looks and behaves exactly as intended.</p></div>
<div class="card"><h3>Backend &amp; integrations</h3><p>Supabase, APIs, auth, webhooks and third-party services connected properly, not bodged together.</p></div>
<div class="card"><h3>Prototype to production</h3><p>An existing Lovable prototype hardened for real users: performance, error handling, security and reliability.</p></div>
<div class="card"><h3>App iterations &amp; features</h3><p>Ongoing feature development on an existing Lovable app, we work with what is already built.</p></div>
<div class="card"><h3>Deployment &amp; handover</h3><p>Your app deployed to production, documented and handed over so your team can manage it going forward.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a Lovable app <em>build works</em></h2>
<p class="lede">A structured, fixed-fee methodology, from spec to production app.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Spec &amp; scoping</h3><p>We review your requirements, identify the right architecture and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Design &amp; build</h3><p>The app built in Lovable with proper architecture, state management and integration design.</p></div>
<div class="step"><div class="n">3</div><h3>Integrations &amp; testing</h3><p>Backend services connected, edge cases handled, the full app tested before launch.</p></div>
<div class="step"><div class="n">4</div><h3>Deploy &amp; handover</h3><p>App deployed, documented and handed over. Post-launch support included.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">Days</div><div class="l">not months, typical time from spec to a production-ready Lovable app</div></div>
<div><div class="v">900+</div><div class="l">systems delivered across six offices</div></div>
<div><div class="v">Full-stack</div><div class="l">frontend, backend, auth and integrations all handled</div></div>
<div><div class="v">Fixed fee</div><div class="l">agreed before any build starts, no hourly billing surprises</div></div>
</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about <em>Fruition's Lovable consultants</em></h2>
<div class="quotes">
<div class="quote"><p>&ldquo;We went from idea to a working app in under two weeks. Fruition handled everything we didn&rsquo;t know how to do with Lovable.&rdquo;</p><div class="who"><b>Founder</b> &middot; Early-stage startup</div></div>
<div class="quote"><p>&ldquo;Our Lovable prototype was solid but breaking in production. Fruition fixed the architecture and got it to a place we could actually ship.&rdquo;</p><div class="who"><b>Head of Product</b> &middot; Scale-up</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs -->
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with experienced <em>Lovable development consultants</em></h2>
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
<details open><summary>What can you build with Lovable?</summary><div class="a">Internal tools, customer-facing portals, dashboards, workflows, marketplaces and most web applications with standard CRUD functionality, auth and integrations. For highly complex real-time systems or native mobile apps, Lovable may not be the right fit, we&rsquo;ll tell you in scoping.</div></details>
<details><summary>How fast can you ship?</summary><div class="a">Most focused apps, a tool, portal or dashboard, are live in one to three weeks from spec. Apps with complex integrations, auth or data models run longer. The timeline is agreed in scoping before any build starts.</div></details>
<details><summary>Do you handle ongoing changes after launch?</summary><div class="a">Yes. We offer ongoing feature development, bug fixes and iteration on an existing Lovable app. Many clients start with a fixed-fee build and move to a retained arrangement for ongoing work.</div></details>
<details><summary>Do we own the code?</summary><div class="a">Yes. The app is yours, the Lovable project, the codebase and all integrations. We hand over documentation and access at the end of every engagement.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation, a frank read on what can realistically be built with Lovable, how fast, and at what cost. No hype about AI speed; just a working app.</p>
<a class="btn" href="#lead">Book My Free Consultation &rarr;</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+447822019548" style="color:var(--purple);font-weight:700;text-decoration:none">+44 7822 019548</a> &middot; GMT/BST business hours</p>
<p style="margin-top:14px;font-size:14px;color:var(--light)">Or explore our London office: <a href="/contact-us" style="color:var(--purple);font-weight:600;text-decoration:none">Contact Us &#8594;</a></p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; UK/EMEA round-robin &mdash; UK team ONLY -->
Calendly embed &mdash; UK/EMEA round-robin &mdash; UK team ONLY
</div>
</div>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services &middot; 423 Linen Hall, 162-168 Regent Street, London W1B 5TE &middot; <a href="tel:+447822019548">+44 7822 019548</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> &middot; <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
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
}catch(e){}})(  );
</script>
</body>
</html>
`
