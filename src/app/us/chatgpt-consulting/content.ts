/* AdWords landing page document (source: monday item 2902401378 asset us-chatgpt-consulting-ads.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (US ChatGPT &middot; Google Ads)
  Ad group: ChatGPT &mdash; market US (account 8457299561)
  Suggested URL: /us/chatgpt-consulting  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> US/Americas round-robin &mdash; North America team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ChatGPT Consultants US | AI Automation for Business | Fruition</title>
<meta name="description" content="ChatGPT and OpenAI API consultants in the US. Internal tools, support automation and AI workflow implementation, practical AI, fixed fee.">
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
<div class="eyebrow">&#x1F916; AI Implementation Partner &middot; ChatGPT &middot; OpenAI API &middot; Automation &middot; New York &middot; Chicago &middot; Austin &middot; San Francisco</div>
<h1>ChatGPT consultants: <em>AI automation for your business</em></h1>
<p class="sub">Fruition implements ChatGPT and the OpenAI API for internal tools, customer support automation and content workflows, practical AI that fits into how your team already works.</p>
<ul class="ticks">
<li>ChatGPT integrated into your existing tools and workflows</li>
<li>OpenAI API implementations built to your specific requirements</li>
<li>Internal chatbots, support automation and content tools</li>
<li>Staff training and documentation included</li>
</ul>
<div class="badges">
<span class="badge">AI Implementation Partner</span>
<span class="badge">900+ systems delivered</span>
<span class="badge">Fixed-fee delivery</span>
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
<option>Internal ChatGPT tool</option>
<option>Customer support automation</option>
<option>OpenAI API integration</option>
<option>AI content workflows</option>
<option>Staff training and rollout</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation &rarr;</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /us/thank-you -->
<p class="fine">No obligation. 100% confidential. We&rsquo;ll tell you if you don&rsquo;t need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>US teams running on systems Fruition built</p>
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
<h2 class="sec">Practical AI your team <em>will actually use</em></h2>
<p class="lede">Delivered by experienced AI implementation consultants, fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>ChatGPT integration</h3><p>ChatGPT connected to your existing tools, documents and data sources for practical, day-to-day use.</p></div>
<div class="card"><h3>OpenAI API implementation</h3><p>Custom tools built on the OpenAI API, from internal knowledge bases to customer-facing automation.</p></div>
<div class="card"><h3>Customer support automation</h3><p>AI-powered support flows that handle tier-1 queries and escalate the rest, reducing response times and team load.</p></div>
<div class="card"><h3>Content workflow tools</h3><p>AI-assisted drafting, summarisation and review tools built into your existing content process.</p></div>
<div class="card"><h3>Internal chatbots</h3><p>Knowledge bots trained on your documentation, policies and FAQs, instant answers for your team.</p></div>
<div class="card"><h3>Training &amp; adoption</h3><p>Your team trained on the specific tools they will use. Documentation and 30-day post-launch support included.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a ChatGPT <em>implementation works</em></h2>
<p class="lede">A structured, fixed-fee methodology, from use-case scoping to deployed tool.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Use-case scoping</h3><p>We identify the highest-value AI use cases for your team and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Design &amp; architecture</h3><p>The integration, data sources and security model designed before a line of code is written.</p></div>
<div class="step"><div class="n">3</div><h3>Build &amp; test</h3><p>The tool built, integrated and tested with real data before handover.</p></div>
<div class="step"><div class="n">4</div><h3>Training &amp; rollout</h3><p>Team trained on the tool they will use. Post-launch support included.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">900+</div><div class="l">systems delivered across six offices</div></div>
<div><div class="v">2-6 wks</div><div class="l"><!-- FOR EDWARD: confirm typical ChatGPT timeline --> typical build-to-launch timeline</div></div>
<div><div class="v">Practical AI</div><div class="l">use cases scoped from your actual workflow, not off-the-shelf demos</div></div>
<div><div class="v">Fixed fee</div><div class="l">agreed before any build starts, no hourly billing surprises</div></div>
</div>
<p class="note">Figures are typical outcomes drawn from Fruition engagements and published research. Individual results vary with scope, team size and adoption.</p>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about <em>Fruition's ChatGPT consultants</em></h2>
<div class="quotes">
<div class="quote"><p>&ldquo;Our internal knowledge bot now answers the questions that used to go straight to the support team. It has changed how we operate.&rdquo;</p><div class="who"><b>Head of Operations</b> &middot; Professional services firm</div></div>
<div class="quote"><p>&ldquo;Fruition understood what we actually needed from AI, not what was trendy. The implementation was practical and fast.&rdquo;</p><div class="who"><b>Chief Technology Officer</b> &middot; Technology company</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs -->
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with experienced <em>AI implementation consultants</em></h2>
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
<details open><summary>What can ChatGPT actually do for our business?</summary><div class="a">The highest-value use cases are internal knowledge and document search, customer support automation (tier-1 query handling), content drafting and review, and data summarisation. The right fit depends on your team and processes, we scope this in discovery before any build starts.</div></details>
<details><summary>How secure is our data?</summary><div class="a">We design the integration so your data stays in your environment. For most implementations, your documents are retrieved at query time and are not stored in the AI platform. We review the data flow with you in scoping.</div></details>
<details><summary>How long does implementation take?</summary><div class="a">Most ChatGPT integrations are live in two to six weeks depending on complexity. A single internal tool is typically the smaller end; a multi-tool integration with document pipelines runs longer. The timeline is agreed in scoping.</div></details>
<details><summary>Do you train our staff?</summary><div class="a">Yes. Training is included in every engagement, your team is trained on the specific tools they will use, not generic AI awareness sessions. Documentation and 30-day post-launch support are also included.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation, a frank read on what AI can and can&rsquo;t do for your team, from consultants who implement it every week. No hype, no jargon.</p>
<a class="btn" href="#lead">Book My Free Consultation &rarr;</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+13023302496" style="color:var(--purple);font-weight:700;text-decoration:none">+1 302 330 2496</a> &middot; ET/CT/PT business hours</p>
<p style="margin-top:14px;font-size:14px;color:var(--light)">Or explore our New York office: <a href="/contact-us" style="color:var(--purple);font-weight:600;text-decoration:none">Contact Us &#8594;</a></p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; US/Americas round-robin &mdash; North America team ONLY -->
Calendly embed &mdash; US/Americas round-robin &mdash; North America team ONLY
</div>
</div>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services &middot; 205 W 37th St, New York, NY 10018 &middot; <a href="tel:+13023302496">+1 302 330 2496</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> &middot; <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
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
}catch(e){}})(  );
</script>
</body>
</html>
`
