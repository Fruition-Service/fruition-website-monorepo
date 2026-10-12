/* AdWords landing page document (source: monday item 2878470108 asset
   "AI Consulting Landing Page - AI implementation and governance consultants.html").
   Self-contained by design: no site chrome, noindex. Copy is kept from the supplied
   reference; the presentation is rebuilt on the shared site theme in
   landingPageTheme.ts (the supplied stylesheet is discarded). */
import { LP_FONTS, LP_CONVERSION_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI implementation and governance consultants | Fruition</title>
<meta name="description" content="AI implementation and governance consultants who build the foundations first. Claude, ChatGPT and Gemini deployed with an ISO/IEC 42001 governance framework. Book a 20-minute AI readiness call.">
<meta name="keywords" content="ai implementation consultant, ai governance consultant, ai governance advisory, ISO/IEC 42001, AI management system, anthropic partner, openai partner, AI architecture and agents">
<meta name="robots" content="noindex,follow">
<meta name="geo.region" content="AU"><meta name="geo.placename" content="Australia">
<meta property="og:title" content="AI implementation and governance consultants | Fruition">
<meta property="og:description" content="Claude, ChatGPT and Gemini only work when your processes, data and systems are ready for them. Fruition takes you through the five steps, with an ISO/IEC 42001 governance framework.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.fruitionservices.io/au/ai-implementation-governance-consultants">
${LP_FONTS}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Fruition Services: AI Implementation and Governance Consultants","description":"AI implementation and governance consultants delivering AI strategy, ISO/IEC 42001 governance advisory, AI architecture and agent deployment for Australian businesses.","url":"https://www.fruitionservices.io/au/ai-implementation-governance-consultants","provider":{"@type":"Organization","name":"Fruition Services Pty Ltd","identifier":"ABN 12 667 454 006","address":{"@type":"PostalAddress","streetAddress":"12/64 York Street","addressLocality":"Sydney","addressRegion":"NSW","postalCode":"2000","addressCountry":"AU"}},"areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Country","name":"New Zealand"}],"serviceType":"AI implementation and governance consulting"}
</script>
<style>${LP_CONVERSION_CSS}</style>
</head>
<body>

<div class="topbar">
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services">
<div class="right">
<a class="book" href="#lead">Book a readiness call</a>
</div>
</div>
</div>

<section class="hero">
<div class="wrap">
<div>
<div class="eyebrow">Anthropic partner · OpenAI partner · monday.com Platinum partner</div>
<h1>AI implementation and governance consultants who <em>build the foundations first</em></h1>
<p class="sub">Claude, ChatGPT and Gemini only work when your processes, data and systems are ready for them. Fruition takes you through the five steps, from digitised process to agents that act, with an ISO/IEC 42001 governance framework so your board, auditors and customers can trust what the AI does.</p>
<ul class="ticks">
<li>AU · UK · US · SG teams in four markets</li>
<li>Anthropic-certified Claude architects on staff</li>
<li>NSW Government Approved ICT Services Scheme supplier</li>
</ul>
<div class="badges">
<span class="badge">Anthropic partner</span>
<span class="badge">OpenAI partner</span>
<span class="badge">monday.com Platinum partner</span>
<span class="badge">2026 Australian AI Awards finalist</span>
</div>
</div>

<form class="formcard" id="lead" method="POST" action="#">
<h2>Book a 20-minute AI readiness call</h2>
<p class="fsub">A 20-minute call. We tell you what step five looks like for your business and what it takes to get there.</p>
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
<option>AI strategy and implementation</option>
<option>AI governance advisory</option>
<option>AI architecture and agents</option>
<option>AI readiness assessment</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book a 20-minute AI readiness call</button>
<p class="fine">No deck, no pitch.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>Australian teams building AI on foundations Fruition delivered</p>
<div class="logo-row">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/cb5de1aa82b86f22541c7028689450bcde7b5aa2-444x168.png?w=260&fit=max&auto=format" alt="Tourism NT" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format" alt="CSIRO" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format" alt="Specsavers" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/034c0b291272f680c860dc42ac88d17776d2f356-900x248.png?w=260&fit=max&auto=format" alt="Telstra" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/a14a489bf6daf919159631dffd558601b81b9e9f-2224x500.png?w=260&fit=max&auto=format" alt="Clean Power" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/8b93b38eaf62687bcb0983c7bbaf7bfdb4e6c9e3-425x119.png?w=260&fit=max&auto=format" alt="HVAC Australia" loading="lazy">
</div>
</div>
</div>

<section id="journey">
<div class="wrap">
<p class="k">Context and data maturity</p>
<h2 class="sec">AI matures with use, one step at a time</h2>
<p class="lede">Most businesses are at steps one to three. Agents live at step five. You cannot skip the gap, but you can cross it quickly with the right partner. Click the step that sounds like you.</p>
<div class="grid3">
<div class="card">
<h3>Digitise the process</h3>
<p>Work moves out of inboxes onto shared boards</p>
<br>
<p><strong>Get the work out of email before you add AI to it</strong></p>
<p>If requests, approvals and handovers live in inboxes, an AI model has nothing reliable to read. We move the process onto a shared platform with owners and stages, so every later step has a foundation.</p>
<br>
<p>Typical engagement: 4 to 8 weeks on monday.com or Atlassian, with your team trained to run it.</p>
<br>
<p><a href="#lead"><strong>Book a call about digitising the process</strong></a></p>
</div>
<div class="card">
<h3>Structure the data</h3>
<p>Owners, statuses and fields everyone trusts</p>
<br>
<p><strong>Make the data trustworthy enough to act on</strong></p>
<p>Standard fields, statuses and ownership rules, so the same question gets the same answer whoever asks. This is the step most AI pilots skip, and the reason they stall.</p>
<br>
<p>Typical engagement: 3 to 6 weeks of data model and workflow design, plus a governance baseline.</p>
<br>
<p><a href="#lead"><strong>Book a call about structuring the data</strong></a></p>
</div>
<div class="card">
<h3>Connect the systems</h3>
<p>ERP, CRM and finance flow into one view</p>
<br>
<p><strong>One view across ERP, CRM and finance</strong></p>
<p>Integrations that let the model see a customer, an order and an invoice as one story. We build and document the connectors, with access controls that an auditor can read.</p>
<br>
<p>Typical engagement: 6 to 10 weeks, often alongside a CRM or work management rollout.</p>
<br>
<p><a href="#lead"><strong>Book a call about connecting the systems</strong></a></p>
</div>
<div class="card">
<h3>Expose the context</h3>
<p>Secure connectors give models the right data, and only that</p>
<br>
<p><strong>Give Claude, ChatGPT or Gemini the right context, and only that</strong></p>
<p>This is AI architecture. We decide what the model may read, through which connector, under which policy, and we put the ISO/IEC 42001 controls around it so the answer to "what can the AI see?" is always written down.</p>
<br>
<p>Typical engagement: 4 to 8 weeks: architecture, connectors, AI policy and an approval workflow.</p>
<br>
<p><a href="#lead"><strong>Book a call about AI architecture and governance</strong></a></p>
</div>
<div class="card">
<h3>Let agents act</h3>
<p>Assist, then Approval, then Auto, earned on track record</p>
<br>
<p><strong>Agents that earn autonomy, not demos that ask for it</strong></p>
<p>We start agents in Assist mode, move them to Approval once their suggestions hold up, and only then to Auto for the tasks where the track record justifies it. Every action is logged and reversible.</p>
<br>
<p>Typical engagement: Agent design and build in 6 to 12 weeks, then a managed service to review the track record.</p>
<br>
<p><a href="#lead"><strong>Book a call about deploying agents</strong></a></p>
</div>
</div>
</div>
</section>

<section class="alt" id="services">
<div class="wrap">
<p class="k">What we do</p>
<h2 class="sec">Strategy, governance and execution from one team</h2>
<p class="lede">Three services that run in sequence or together, depending on your step.</p>
<div class="grid3">
<div class="card">
<h3>AI strategy and implementation</h3>
<p>An AI implementation consultant who has deployed Claude, ChatGPT Enterprise and Gemini inside real operations. We pick the use cases that pay back, connect the model to your CRM, ERP and work management, and train your people to use it.</p>
<br>
<ul class="ticks">
<li>AI readiness assessment and use-case prioritisation</li>
<li>Claude, OpenAI and Gemini deployment with secure connectors</li>
<li>Team training and adoption programmes</li>
</ul>
</div>
<div class="card">
<h3>AI governance advisory</h3>
<p>An AI governance consultant who builds the policies, controls and audit trail your board needs. We design an AI management system aligned to ISO/IEC 42001, so AI use is approved, logged and reviewable from day one.</p>
<br>
<ul class="ticks">
<li>ISO/IEC 42001 AIMS design and gap assessment</li>
<li>AI policy, risk register and approval workflows</li>
<li>Assist, Approval, Auto: a permission model for agents</li>
</ul>
</div>
<div class="card">
<h3>AI architecture and agents</h3>
<p>Enterprise AI architecture that exposes the right context to the model, and only that. Then agents that work inside your systems, earning autonomy on their track record rather than on a demo.</p>
<br>
<ul class="ticks">
<li>Secure connectors to ERP, CRM, finance and work management</li>
<li>Agent design, build and monitoring</li>
<li>Platform choice: Anthropic, OpenAI or Google, by fit, not by fashion</li>
</ul>
</div>
</div>
</div>
</section>

<section id="industries">
<div class="wrap">
<p class="k">Industries</p>
<h2 class="sec">Where governance is not optional</h2>
<p class="lede">We work where AI decisions get audited. The governance work comes first because that is what gets a project approved.</p>
<div class="steps">
<div class="step"><h3>Government</h3><p>AI for councils and agencies that meets procurement and privacy rules. Fruition is an approved supplier on the NSW Government ICT Services Scheme.</p></div>
<div class="step"><h3>Manufacturing</h3><p>Production planning, quality and supplier workflows where the model reads from the ERP and never guesses.</p></div>
<div class="step"><h3>Retail</h3><p>Quoting, fulfilment and customer service agents connected to live product and order data.</p></div>
<div class="step"><h3>Healthcare</h3><p>AI governance for clinical and administrative use, with approval workflows and audit trails built in from the start.</p></div>
</div>
</div>
</section>

<section class="alt" id="proof">
<div class="wrap">
<p class="k">Proof</p>
<h2 class="sec">Partnerships, certifications and results</h2>
<p class="lede">We are certified by the platforms we implement, and the results below come from steps one to three, the foundations every AI project stands on.</p>
<ul class="ticks">
<li><strong>AI</strong> · Anthropic partner · OpenAI partner</li>
<li><strong>Work management</strong> · monday.com Platinum partner · Atlassian Platinum partner (Senzo)</li>
<li><strong>CRM</strong> · HubSpot partner (Orange Growth Labs) · monday CRM specialists</li>
<li><strong>Recognition</strong> · 2026 Australian AI Awards finalist · 2026 Rising Star, monday.com and Atlassian</li>
</ul>
<div class="grid3">
<div class="card">
<h3>260 hrs</h3>
<p>saved per year, about $50,000, after projects, assets and budgets moved from spreadsheets to one system with real-time dashboards.</p>
<br>
<p><strong>Heritage foundation, UK</strong></p>
</div>
<div class="card">
<h3>208 hrs</h3>
<p>of admin removed per year, about $40,000, by replacing an email inbox with an automated request portal.</p>
<br>
<p><strong>Transport modelling, Co-Lab</strong></p>
</div>
<div class="card">
<h3>First tenders</h3>
<p>won from government after a connected sales and operations engine replaced cut-and-paste quoting. The founder stepped out of daily operations.</p>
<br>
<p><strong>Office Furniture Company, Brisbane</strong></p>
</div>
</div>
</div>
</section>

<section id="call">
<div class="wrap">
<p class="k">The readiness call</p>
<h2 class="sec">Twenty minutes, three answers</h2>
<p class="lede">You leave the call knowing which step you are on, the one use case worth starting with, and what governance you need before an agent touches live data. If we are not the right fit, we say so.</p>
<div class="grid3">
<div class="card">
<h3>Where you are</h3>
<p>Five questions about process, data, systems and who can approve what.</p>
</div>
<div class="card">
<h3>What to start with</h3>
<p>The one use case with a measurable payback inside 90 days.</p>
</div>
<div class="card">
<h3>What governance you need</h3>
<p>The minimum controls to get sign-off, and what ISO/IEC 42001 adds later.</p>
</div>
</div>
</div>
</section>

<section class="alt" id="faq">
<div class="wrap">
<p class="k">Questions we get asked</p>
<h2 class="sec">Before you book</h2>
<details open><summary>What does an AI governance consultant actually do?</summary><div class="a">We write the rules for how your business uses AI, and build the controls that enforce them: who can approve a use case, what data a model may read, how outputs are checked, and how it is all logged. The output is an AI management system you can show a board, a regulator or a customer.</div></details>
<details><summary>What is ISO/IEC 42001 and do we need it?</summary><div class="a">ISO/IEC 42001 is the international standard for an AI management system (AIMS). You do not need certification to start, but designing your governance to the standard from day one means you can certify later without rebuilding. Government and healthcare clients increasingly ask for it in tenders.</div></details>
<details><summary>What does being an Anthropic partner and OpenAI partner mean for us?</summary><div class="a">We have certified architects on the platforms, direct access to the vendors, and we implement rather than resell. We recommend Claude, ChatGPT or Gemini based on your data, security and cost profile, and we will tell you if a smaller model does the job.</div></details>
<details><summary>We already have monday.com or a CRM. Does that help?</summary><div class="a">A lot. If your process and data are already structured, you are at step two or three, and AI architecture can start within weeks. If you are not sure, that is what the readiness call is for.</div></details>
<details><summary>How is a readiness call different from a sales call?</summary><div class="a">You get three written answers afterwards: which step you are on, the first use case worth doing, and the minimum governance you need to get it approved. If the honest answer is that you should fix your process first, we say that.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Find out which step you are on</h2>
<p>A 20-minute call with a Fruition consultant in your time zone. Australia, Singapore, the UK or the US. No pitch deck. You get three written answers after the call.</p>
<a class="btn" href="#lead">Book a 20-minute AI readiness call</a>
</div>
<div class="calendly-box">
Calendly embed: Australia, Singapore, UK and US consultation round-robin goes here
</div>
</div>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services. 12/64 York Street, Sydney NSW 2000. ABN 12 667 454 006.</div>
<div>Anthropic partner. OpenAI partner. monday.com Platinum partner.</div>
</div>
</footer>

<div class="mcta">
<a class="book" href="#lead">Book a readiness call</a>
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
