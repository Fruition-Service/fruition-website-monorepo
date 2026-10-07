/* AdWords landing page document (source: monday item asset au-ai-business-consulting-services.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONSULTING_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Consulting Services Australia | AI Strategy Consultants — Fruition</title>
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
<span class="badge badge-lite">Tool-Agnostic · Enterprise-Grade</span>
</div>
<h1>Enterprise-Grade AI Consulting Services &amp; Strategy for <em>Australian Businesses</em></h1>
<p class="sub">Supercharge your operations, eliminate manual bottlenecks, and unlock rapid scaling. Partner with premier AI strategy consultants in Australia to architect custom large language models (LLMs), intelligent workflow systems, and advanced agentic automations.</p>
<div class="hero-form">
<form action="#" method="post">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;overflow:hidden">
<div class="hf-row">
<input type="email" name="email" required placeholder="Business Email" aria-label="Business Email">
<input type="tel" name="phone" required placeholder="Phone Number" aria-label="Phone Number">
</div>
<button type="submit" class="hf-btn">Book My Free Consultation</button>
<div class="hf-note">30 minutes · Australia &amp; New Zealand team · No obligation</div>
</form>
</div>
</div>
<div class="pipe" aria-hidden="true">
<div class="pipe-title"><span class="pulse"></span>Agentic Automation Pipeline — Live</div>
<div class="node-row">
<div class="node">Inbound Email<small>Customer enquiry received</small></div>
<span class="arrow">→</span>
<div class="node hot">LLM Classifier<small>Intent + priority detected</small></div>
</div>
<div class="node-row">
<div class="node hot">AI Agent<small>Drafts response · checks CRM</small></div>
<span class="arrow">→</span>
<div class="node">Approval Gate<small>Human review · 8 sec</small></div>
</div>
<div class="node-row">
<div class="node">CRM Updated<small>Deal stage + activity logged</small></div>
<span class="arrow">→</span>
<div class="node">Reply Sent<small>4 min end-to-end</small></div>
</div>
<div class="node-row" style="margin-bottom:0">
<div class="node" style="text-align:center"><small style="margin:0">Manual handling time eliminated</small>92%</div>
<div class="node" style="text-align:center"><small style="margin:0">Processes automated this quarter</small>38</div>
</div>
</div>
</div>
</div></header>

<!-- 2. CREDIBILITY & TRUST STRIP -->
<div class="trust"><div class="wrap">
<div class="trust-txt">Helping leading Australian and global enterprises build smarter, automated systems</div>
<div class="trust-logos">
<span class="tlogo">Specsavers</span>
<span class="tlogo">CSIRO</span>
<span class="tlogo">HVAC Australia</span>
</div>
</div></div>

<!-- 3. CORE CAPABILITIES -->
<section><div class="wrap">
<div class="eyebrow">What we build</div>
<h2>Tailored AI for Business Transformation &amp; Architecture</h2>
<p class="lede">Precisely matched to how Australian enterprises adopt AI — strategy, automation, and engineering under one roof.</p>
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
</div>
</div></section>

<!-- 4. WHY FRUITION -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The Fruition edge</div>
<h2>The Fruition Edge: Enterprise Strategy, Local Delivery</h2>
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
<h2>Work Directly With Leading Australian AI Strategy Consultants</h2>
<p class="lede">The people who scope your automation roadmap are the people who engineer it.</p>
<div class="team">
<div class="tm">
<div class="tm-img">Josh Jebathilak</div>
<div class="tm-body">
<div class="tm-role">Director, APAC</div>
<p>Leads AI strategy and delivery across the region. Personally oversaw intelligent system builds and process automations for hundreds of organisations.</p>
</div>
</div>
<div class="tm">
<div class="tm-img">Natalia Mishenina</div>
<div class="tm-body">
<div class="tm-role">Technical Project Manager</div>
<p>Expert in SaaS implementation and process mapping — guiding AI solution design from discovery and data audit through to secure system handover.</p>
</div>
</div>
<div class="tm">
<div class="tm-img">AI Integration Specialists</div>
<div class="tm-body">
<div class="tm-role">Engineering Squad</div>
<p>Certified engineers deploying LLM integrations, agentic workflows, and automated data pipelines across enterprise environments Australia-wide.</p>
</div>
</div>
</div>
</div></section>

<!-- 6. METHODOLOGY -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The blueprint framework</div>
<h2>From Strategy to Execution</h2>
<div class="steps">
<div class="step"><div class="step-n">1</div><h3>Complimentary Process Mapping</h3><p>We evaluate your workflows to find high-impact automation targets.</p></div>
<div class="step"><div class="step-n">2</div><h3>Detailed Recommendation</h3><p>A precise technical scope of work, selected models, and fixed quoting.</p></div>
<div class="step"><div class="step-n">3</div><h3>Architectural Execution</h3><p>Our engineers securely build, test, and integrate your new intelligent automated systems.</p></div>
<div class="step"><div class="step-n">4</div><h3>Adoption &amp; Team Training</h3><p>Comprehensive upskilling to guarantee your workforce easily adopts and thrives using the newly built tools.</p></div>
</div>
</div></section>

<!-- 7. CLOSING FORM -->
<section class="close-band" id="book"><div class="wrap">
<div class="eyebrow" style="color:var(--p3)">Get started</div>
<h2>Ready to Automate and Scale Your Business Operations?</h2>
<p class="lede">Stop letting manual work slow down your growth. Let's build a smarter organisation together. Book a complimentary process session with a certified AI consultant in Australia today.</p>
<div class="form-card">
<form action="#" method="post">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;overflow:hidden">
<div class="ff"><label for="name">Full Name</label><input type="text" id="name" name="name" required placeholder="Your name"></div>
<div class="ff"><label for="email2">Business Email</label><input type="email" id="email2" name="email" required placeholder="you@company.com.au"></div>
<div class="ff"><label for="phone2">Phone Number</label><input type="tel" id="phone2" name="phone" required placeholder="+61 ..."></div>
<div class="ff"><label for="goals">Briefly describe your business process or automation goals</label><textarea id="goals" name="goals" placeholder="e.g. We want to automate quote generation and connect our CRM to Xero…"></textarea></div>
<button type="submit" class="form-btn">Secure My Free Consultation</button>
<div class="form-trust">🔒 Secure &amp; 100% Confidential Data Evaluation.</div>
</form>
</div>
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
