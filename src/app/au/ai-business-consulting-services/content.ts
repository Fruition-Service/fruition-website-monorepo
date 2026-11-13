/* AdWords landing page document (source: monday item asset au-ai-business-consulting-services.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONSULTING_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Consulting Services Australia | AI Strategy Consultants | Fruition</title>
<meta name="description" content="Enterprise-grade AI consulting services and strategy for Australian businesses. AI management consulting, AI business process automation, and custom LLM deployment. Book a free consultation.">
<meta name="keywords" content="ai consultants, ai strategy consultants, ai consulting services, ai management consulting, ai for business, ai business process automation">
<meta name="robots" content="noindex, follow">
<meta name="geo.region" content="AU"><meta name="geo.placename" content="Australia">
<meta property="og:title" content="AI Consulting Services Australia | Fruition: AI Strategy Consultants">
<meta property="og:description" content="Supercharge operations, eliminate manual bottlenecks, and scale with Australia's premier AI strategy consultants. Custom LLMs, intelligent workflows, agentic automation.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.fruitionservices.io/au/ai-business-consulting-services">
${LP_FONTS}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Fruition Services: AI Consulting Services Australia","description":"AI strategy consultants delivering AI management consulting, business process automation, custom LLM deployment and agentic systems for Australian businesses.","url":"https://www.fruitionservices.io/au/ai-business-consulting-services","provider":{"@type":"Organization","name":"Fruition Services Pty Ltd","identifier":"ABN 12 667 454 006","address":{"@type":"PostalAddress","streetAddress":"12/64 York Street","addressLocality":"Sydney","addressRegion":"NSW","postalCode":"2000","addressCountry":"AU"}},"areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Country","name":"New Zealand"}],"serviceType":"AI consulting and business process automation"}
</script>
<style>${LP_CONSULTING_CSS}</style>
</head>
<body>

<!-- Topbar: non-clickable logo + sticky CTA (desktop top-right) -->
<div class="topbar"><div class="topbar-in">
<div class="logo"><img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services"></div>
<a href="#book" class="sticky-cta">Book Free Consultation</a>
</div></div>
<!-- Mobile sticky bottom CTA -->
<div class="mob-cta"><a href="#book">Book Free Consultation</a></div>

<!-- 1. HERO -->
<header class="hero"><div class="wrap">
<div class="hero-grid">
<div>
<div class="badges">
<span class="badge badge-dark"><span class="badge-dot"></span> Sydney-Headquartered AI Consultants</span>
</div>
<h1>Enterprise-Grade AI Consulting Services &amp; Strategy for <em>Australian Businesses</em></h1>
<p class="sub">Supercharge your operations, eliminate manual bottlenecks, and unlock rapid scaling. Partner with premier AI strategy consultants in Australia to architect custom large language models (LLMs), intelligent workflow systems, and advanced agentic automations.</p>
<ul class="ticks">
<li>AI strategy and execution roadmaps</li>
<li>Process automation with custom APIs and Make.com</li>
<li>LLM integrations and agentic workflows</li>
<li>Team training so the new tools get used</li>
</ul>
<div class="hero-tags">
<span>Sydney headquartered</span>
<span>Anthropic and OpenAI partner</span>
<span>900+ implementations</span>
<span>Fixed-fee quotes</span>
</div>
</div>
<div class="form-card hero-card">
<h2>Book a 20-minute AI readiness call</h2>
<p class="fsub">An Australian consultant replies within one business day.</p>
<form action="#" method="post" id="lead">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;overflow:hidden">
<div class="ff"><label for="h-name">Full Name</label><input type="text" id="h-name" name="name" required placeholder="Your name"></div>
<div class="ff"><label for="h-email">Business Email</label><input type="email" id="h-email" name="email" required placeholder="you@company.com.au"></div>
<div class="ff"><label for="h-phone">Phone Number</label><input type="tel" id="h-phone" name="phone" required placeholder="+61 ..."></div>
<div class="ff"><label for="h-goals">Briefly describe your project or workflow goals</label><textarea id="h-goals" name="goals" placeholder="e.g. We want to automate quote generation and connect our CRM to Xero…"></textarea></div>
<button type="submit" class="form-btn">Book My Free Consultation</button>
<div class="form-trust">30 minutes · Australia &amp; New Zealand team · No obligation</div>
</form>
</div>
</div>
</div></header>

<!-- 2. CREDIBILITY & TRUST STRIP -->
<div class="trust"><div class="wrap">
<div class="trust-txt">Helping leading Australian and global enterprises build smarter, automated systems</div>
<div class="trust-logos">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format" alt="Specsavers" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format" alt="CSIRO" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/8b93b38eaf62687bcb0983c7bbaf7bfdb4e6c9e3-425x119.png?w=260&fit=max&auto=format" alt="HVAC Australia" loading="lazy">
</div>
</div></div>

<!-- 3. CORE CAPABILITIES -->
<section><div class="wrap">
<div class="eyebrow">What we build</div>
<h2>Tailored AI for Business <em>Transformation &amp; Architecture</em></h2>
<p class="lede">Precisely matched to how Australian enterprises adopt AI, strategy, automation, and engineering under one roof.</p>
<div class="caps">
<div class="cap">
<h3>AI Management Consulting &amp; Strategy</h3>
<p>Go from concept to deployment safely. Our seasoned ai management consulting squad analyses your structural data assets, drafts execution roadmaps, and designs custom tech stacks that protect your data privacy.</p>
</div>
<div class="cap">
<h3>AI Business Process Automation</h3>
<p>Eradicate repetitive administrative tasks. We connect your native apps and databases to generative AI nodes using custom APIs and Make.com configurations, allowing intelligent agents to process emails, manage files, and execute decisions instantly.</p>
</div>
<div class="cap">
<h3>Elite AI Consultants &amp; Engineers</h3>
<p>Stop looking for off-the-shelf answers. Work directly with certified ai consultants to deploy intelligent virtual assistants, automated data analysis structures, and custom fine-tuned models tailored to your industry.</p>
</div>
<div class="cap">
<h3>AI Governance &amp; ISO/IEC 42001</h3>
<p>Approval rules, data access controls, output checks and logging, designed to the ISO/IEC 42001 standard so you can certify later without rebuilding.</p>
</div>
<div class="cap">
<h3>Claude &amp; ChatGPT Integrations</h3>
<p>Internal knowledge search, document processing and support automation on Claude or ChatGPT, with documents retrieved at query time rather than stored in the AI platform.</p>
</div>
<div class="cap">
<h3>monday.com AI</h3>
<p>monday AI Blocks, Sidekick and agents configured against your real processes, with custom Claude or OpenAI integration for heavier work.</p>
</div>
</div>
</div></section>

<!-- 4. WHY FRUITION -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The Fruition edge</div>
<h2>The Fruition Edge: <em>Enterprise Strategy, Local Delivery</em></h2>
<div class="why">
<div class="why-card">
<div class="why-num">01</div>
<h3>Sydney-Headquartered, Nationally Focused</h3>
<p>Our primary architects, solutions engineers, and support squads are situated locally in Australia to give you real-time collaboration and security compliance.</p>
</div>
<div class="why-card">
<div class="why-num">02</div>
<h3>Proven Scale &amp; Technical Prowess</h3>
<p>We don't just advise; we build. As an established digital transformation firm with an active global engineering footprint, we turn high-level strategy into working code.</p>
</div>
<div class="why-card">
<div class="why-num">03</div>
<h3>Tool-Agnostic Philosophy</h3>
<p>We match the exact large language model (LLM) or automation tool to your precise technical environment, ensuring a flawless setup every single time.</p>
</div>
</div>
</div></section>

<!-- 5. TEAM -->
<section><div class="wrap">
<div class="eyebrow">Your Australian AI team</div>
<h2>Work Directly With Leading <em>Australian AI Strategy Consultants</em></h2>
<p class="lede">The people who scope your automation roadmap are the people who engineer it.</p>
<div class="team">
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/811213d278aabf0686ff32841b559dec63cce794-1584x1246.jpg?rect=169,0,1246,1246&amp;w=560&amp;h=560&amp;fit=crop" alt="Josh Jebathilak" loading="lazy"><h3>Josh Jebathilak</h3><div class="role">Director, APAC</div><p>Leads AI strategy and delivery across the region. Personally oversaw intelligent system builds and process automations for hundreds of organisations.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/800645656b19c9368a1fcc57c73d2f7956e9e826-593x593.jpg?w=560&amp;h=560&amp;fit=crop" alt="Nikki Glucksman" loading="lazy"><h3>Nikki Glucksman</h3><div class="role">Principal Consultant</div><p>UX-driven product strategist translating business requirements into streamlined workflows.</p></div>
<div class="member"><div class="avatar" aria-hidden="true">AI</div><h3>AI Integration Specialists</h3><div class="role">Engineering Squad</div><p>Certified engineers deploying LLM integrations, agentic workflows, and automated data pipelines across enterprise environments Australia-wide.</p></div>
</div>
</div></section>

<!-- 6. METHODOLOGY -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The blueprint framework</div>
<h2>From Strategy <em>to Execution</em></h2>
<div class="steps">
<div class="step"><div class="step-n">1</div><h3>Complimentary Process Mapping</h3><p>We evaluate your workflows to find high-impact automation targets.</p></div>
<div class="step"><div class="step-n">2</div><h3>Detailed Recommendation</h3><p>A precise technical scope of work, selected models, and fixed quoting.</p></div>
<div class="step"><div class="step-n">3</div><h3>Architectural Execution</h3><p>Our engineers securely build, test, and integrate your new intelligent automated systems.</p></div>
<div class="step"><div class="step-n">4</div><h3>Adoption &amp; Team Training</h3><p>Comprehensive upskilling to guarantee your workforce easily adopts and thrives using the newly built tools.</p></div>
</div>
</div></section>

<!-- 6b. FAQ -->
<section><div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask <em>us first</em></h2>
<details><summary>Where should an AI project start?</summary><div class="a">With a complimentary process-mapping session. We look at how work moves through your business today and pick the automation targets with the highest return, then send a detailed recommendation with the technical scope, the selected models and a fixed quote.</div></details>
<details><summary>Which AI models and tools do you use?</summary><div class="a">We are tool agnostic and a partner of both Anthropic and OpenAI. We match the model or automation tool, such as Claude, ChatGPT or Make.com, to your data, security and cost profile, and we will tell you if a smaller model does the job.</div></details>
<details><summary>Is our data used to train AI models?</summary><div class="a">Not by default: business API access to Claude and OpenAI models is not used for model training. We also design integrations so your documents are retrieved at query time rather than stored in the AI platform, and review the data flow with you during scoping.</div></details>
<details><summary>How long does an AI build take?</summary><div class="a">Most integrations are live in two to six weeks depending on complexity. A focused internal tool sits at the smaller end; a workflow spanning several systems and data sources runs longer. The timeline and the fixed quote are agreed before the build starts.</div></details>
<details><summary>Do you train our team?</summary><div class="a">Yes. Adoption and team training is the last step of every engagement, on the specific tools your people will use rather than generic AI awareness sessions.</div></details>
</div></section>

<!-- 7. CLOSING FORM -->
<section class="close-band" id="book"><div class="wrap">
<div class="eyebrow" style="color:var(--p3)">Get started</div>
<h2>Ready to Automate and <em>Scale Your Business Operations?</em></h2>
<p class="lede">Stop letting manual work slow down your growth. Let's build a smarter organisation together. Book a complimentary process session with a certified AI consultant in Australia today.</p>
<div class="calendly-box"></div>
</div></section>

<!-- Minimal footer: no links -->
<div class="foot">© 2026 Fruition Services Pty Ltd · ABN 12 667 454 006 · 12/64 York Street, Sydney NSW 2000 · Australia &amp; New Zealand</div>


<script>
(function () {
  var SOURCE = "adwords-lp-au-ai-business-consulting-services";
  document.querySelectorAll("form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = f.querySelector("button[type=submit]");
      var original = btn ? btn.textContent : "";
      var data = {};
      new FormData(f).forEach(function (v, k) { data[k] = v; });
      var payload = {
        name: (data.name || "").trim() || (data.email || "").split("@")[0] || "AdWords lead",
        email: data.email || "",
        source: SOURCE,
        website: data.website || "",
        fields: { phone: data.phone || "", goals: data.goals || "" }
      };
      if (btn) { btn.disabled = true; btn.textContent = "Sending\\u2026"; }
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.ok) throw new Error(j.error || "failed");
        try { (window.dataLayer = window.dataLayer || []).push({ event: "generate_lead", form_source: SOURCE, page_path: location.pathname }); } catch (_) {}
        try { if (window.clarity) { clarity("event", "enquiry_submitted"); clarity("set", "form_source", SOURCE); } } catch (_) {}
        try { if (window.fruitionOpenAiLead) window.fruitionOpenAiLead(); } catch (_) {}
        f.innerHTML = '<div style="text-align:center;padding:18px 0"><div style="font-size:34px;line-height:1">\\u2713</div><h3 style="margin:10px 0 6px;font-size:19px">Request received</h3><p style="font-size:14px;opacity:.75;line-height:1.5">Thanks \\u2014 our Australian team will be in touch within one business day.</p></div>';
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        alert("Sorry \\u2014 something went wrong sending your request. Please email hello@fruitionservices.io instead.");
      });
    });
  });
})();
</script>
</body>
</html>
`
