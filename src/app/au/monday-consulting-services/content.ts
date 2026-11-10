/* AdWords landing page document (source: monday item asset au-monday-consulting-services.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONSULTING_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com Consulting Services Australia | Certified Platinum Partner | Fruition</title>
<meta name="description" content="Expert monday.com consulting services and implementation across Australia. monday CRM consultants, workflow automation and certified Platinum Partner delivery. Book a free consultation.">
<meta name="keywords" content="monday consulting services, monday CRM consultants, monday implementation consultant, monday.com consulting services, monday.com certified partner, monday com consultant Australia">
<meta name="robots" content="noindex, follow">
<meta name="geo.region" content="AU"><meta name="geo.placename" content="Australia">
<meta property="og:title" content="monday.com Consulting Services Australia | Fruition: Certified Platinum Partner">
<meta property="og:description" content="Streamline your workflows with Australia's monday.com Platinum Partner. Custom setups, integrations, end-to-end automation. Book a free consultation.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.fruitionservices.io/au/monday-consulting-services">
${LP_FONTS}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Fruition Services, monday.com Consulting Services Australia","description":"monday.com Platinum Partner delivering consulting, implementation, CRM builds, integrations and training across Australia and New Zealand.","url":"https://www.fruitionservices.io/au/monday-consulting-services","provider":{"@type":"Organization","name":"Fruition Services Pty Ltd","identifier":"ABN 12 667 454 006","address":{"@type":"PostalAddress","streetAddress":"12/64 York Street","addressLocality":"Sydney","addressRegion":"NSW","postalCode":"2000","addressCountry":"AU"}},"areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Country","name":"New Zealand"}],"serviceType":"monday.com consulting and implementation"}
</script>
<style>${LP_CONSULTING_CSS}</style>
</head>
<body>

<!-- Topbar: logo only (non-clickable) + sticky CTA -->
<div class="topbar"><div class="topbar-in">
<div class="logo"><img src="https://www.fruitionservices.io/images/logo-fruition-black.svg" alt="Fruition Services"></div>
<a href="#book" class="sticky-cta">Book Free Consultation</a>
</div></div>

<!-- 1. HERO -->
<header class="hero"><div class="wrap">
<div class="hero-grid">
<div>
<div class="badges">
<span class="badge badge-platinum"><span class="badge-dot"></span> monday.com Platinum Partner</span>
</div>
<h1>Expert monday.com Consulting Services &amp; Implementation <em>Across Australia</em></h1>
<p class="sub">Streamline your workflows, maximise efficiency, and build a system your team loves. Book a session with a monday.com Certified Partner today for custom setups, seamless integrations, and end-to-end automation.</p>
<ul class="ticks">
<li>Custom monday CRM, service and work management builds</li>
<li>Xero, QuickBooks, Salesforce and HubSpot integrations</li>
<li>Data migration from spreadsheets and third-party tools</li>
<li>Champion training for company-wide adoption</li>
</ul>
<div class="hero-tags">
<span>monday.com Platinum Partner</span>
<span>Advanced Delivery Partner</span>
<span>900+ implementations</span>
<span>NSW Gov ICT Scheme, Advanced supplier</span>
</div>
</div>
<div class="form-card hero-card">
<h2>Get your free workflow blueprint</h2>
<p class="fsub">An Australian consultant replies within one business day.</p>
<form action="#" method="post" id="lead">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;overflow:hidden">
<div class="ff"><label for="h-name">Full Name</label><input type="text" id="h-name" name="name" required placeholder="Your name"></div>
<div class="ff"><label for="h-email">Business Email</label><input type="email" id="h-email" name="email" required placeholder="you@company.com.au"></div>
<div class="ff"><label for="h-phone">Phone Number</label><input type="tel" id="h-phone" name="phone" required placeholder="+61 ..."></div>
<div class="ff"><label for="h-goals">Briefly describe your project or workflow goals</label><textarea id="h-goals" name="goals" placeholder="e.g. We need a CRM and job-tracking system connected to Xero…"></textarea></div>
<button type="submit" class="form-btn">Book My Free Consultation</button>
<div class="form-trust">No obligation. 100% confidential.</div>
</form>
</div>
</div>
</div></header>

<!-- 2. TRUST STRIP -->
<div class="trust"><div class="wrap">
<div class="trust-txt">Trusted by leading Australian and global organisations</div>
<div class="trust-logos">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format" alt="Specsavers" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format" alt="CSIRO" loading="lazy">
<img src="https://cdn.sanity.io/images/bt6nb58h/production/8b93b38eaf62687bcb0983c7bbaf7bfdb4e6c9e3-425x119.png?w=260&fit=max&auto=format" alt="HVAC Australia" loading="lazy">
</div>
</div></div>

<!-- 3. CORE CAPABILITIES -->
<section><div class="wrap">
<div class="eyebrow">What we deliver</div>
<h2>Tailored monday Implementation Consultant Solutions <em>for Every Workflow</em></h2>
<p class="lede">Certified, keyword-deep expertise across the full monday.com product suite, built around how your teams actually work.</p>
<div class="caps">
<div class="cap">
<h3>monday CRM Consultants</h3>
<p>Build custom, AI-powered sales pipelines, end-to-end CRM architectures, and agentic workflows tailored precisely to your commercial goals.</p>
</div>
<div class="cap">
<h3>Workflow Automation &amp; Integrations</h3>
<p>Connect your entire tech stack, Xero, QuickBooks, Salesforce, or HubSpot, using Make.com or custom API developments to reduce manual tasks.</p>
</div>
<div class="cap">
<h3>monday Service &amp; Work Management</h3>
<p>Set up IT helpdesks, operational dashboards, customer portals, or employee self-service solutions engineered by a certified monday com consultant in Australia.</p>
</div>
<div class="cap">
<h3>Data Migration</h3>
<p>Move historical records from spreadsheets, Salesforce, HubSpot or other tools into monday.com with relationships intact and record counts checked before cutover.</p>
</div>
<div class="cap">
<h3>monday AI &amp; Agents</h3>
<p>Configure monday AI Blocks, Sidekick and agents against your real processes, with Claude or OpenAI integrations for heavier document and workflow tasks.</p>
</div>
<div class="cap">
<h3>Training &amp; Adoption</h3>
<p>Champion and end-user training on your own boards, not generic templates, so the whole company actually uses what was built.</p>
</div>
</div>
</div></section>

<!-- 4. WHY FRUITION -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The insider advantage</div>
<h2>Why Partner with Our Dedicated <em>monday.com Consulting Services?</em></h2>
<div class="why">
<div class="why-card">
<div class="why-num">01</div>
<h3>Ex-monday.com Insider Knowledge</h3>
<p>Founded and directed by former monday.com staff members with technical best-practice insights across more than 600 global client optimisations.</p>
</div>
<div class="why-card">
<div class="why-num">02</div>
<h3>Proven Scale &amp; Success</h3>
<p>An Advanced Delivery Partner with a flawless 5.0 CSAT rating and over 900 successful implementations worldwide.</p>
</div>
<div class="why-card">
<div class="why-num">03</div>
<h3>Local Australian Experts</h3>
<p>Our primary delivery squad, solutions engineers, and change managers are headquartered right here in Australia to provide real-time, local support.</p>
</div>
</div>
<div class="stats">
<div class="stat"><b>900+</b><span>Implementations worldwide</span></div>
<div class="stat"><b>5.0</b><span>CSAT rating</span></div>
<div class="stat"><b>600+</b><span>Client optimisations</span></div>
<div class="stat"><b>Platinum</b><span>Partner tier</span></div>
</div>
</div></section>

<!-- 5. TEAM -->
<section><div class="wrap">
<div class="eyebrow">Your Australian team</div>
<h2>Work Directly with a Certified <em>monday.com Partner Consultant</em></h2>
<p class="lede">No handoffs, no offshore bench. The people below scope and deliver your build.</p>
<div class="team">
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/811213d278aabf0686ff32841b559dec63cce794-1584x1246.jpg?rect=169,0,1246,1246&amp;w=560&amp;h=560&amp;fit=crop" alt="Josh Jebathilak" loading="lazy"><h3>Josh Jebathilak</h3><div class="role">Director, APAC</div><p>Spent 4 years working directly within monday.com prior to launching Fruition. Personally oversaw system builds for hundreds of organisations.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/800645656b19c9368a1fcc57c73d2f7956e9e826-593x593.jpg?w=560&amp;h=560&amp;fit=crop" alt="Nikki Glucksman" loading="lazy"><h3>Nikki Glucksman</h3><div class="role">Principal Consultant</div><p>UX-driven product strategist translating business requirements into streamlined workflows.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/54c16cd7f1656cedb43a3c4e2d718c56e12f2bec-800x800.jpg?w=560&amp;h=560&amp;fit=crop" alt="Branson McMahon" loading="lazy"><h3>Branson McMahon</h3><div class="role">Solution Engineer</div><p>Specialises in translating complex operational requirements into functional capabilities using the full scope of the Work OS platform.</p></div>
</div>
</div></section>

<!-- 6. METHODOLOGY -->
<section class="alt"><div class="wrap">
<div class="eyebrow">What to expect</div>
<h2>A Proven, <em>ROI-Driven Framework</em></h2>
<div class="steps">
<div class="step"><div class="step-n">1</div><h3>Discovery &amp; Scoping</h3><p>Mapping out your operational gaps and technical requirements.</p></div>
<div class="step"><div class="step-n">2</div><h3>Solution Architecture</h3><p>Designing boards, creating automations, and configuring native features.</p></div>
<div class="step"><div class="step-n">3</div><h3>Data Migration</h3><p>Safely transitioning historical data from third-party systems or spreadsheets into your new workspace.</p></div>
<div class="step"><div class="step-n">4</div><h3>Change Management &amp; Onboarding</h3><p>Practical end-user champion training sessions to ensure high adoption across your entire company.</p></div>
</div>
</div></section>

<!-- 6b. FAQ -->
<section><div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask <em>us first</em></h2>
<details><summary>Is Fruition an official monday.com partner?</summary><div class="a">Yes. Fruition is a certified monday.com Platinum Partner and Advanced Delivery Partner, headquartered at 64 York Street, Sydney. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes.</div></details>
<details><summary>How much do monday.com consulting services cost?</summary><div class="a">Quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licences are billed separately, and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does an implementation take?</summary><div class="a">Most engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; wider rollouts with data migration and integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details>
<details><summary>Can you connect monday.com to Xero, HubSpot or Salesforce?</summary><div class="a">Yes. We connect monday.com to tools such as Xero, QuickBooks, Salesforce and HubSpot through native integrations, Make.com or custom API work, so records move between systems without manual re-keying. The integrations you need are mapped during scoping.</div></details>
<details><summary>Who will we actually work with?</summary><div class="a">The Australian consultant who scopes your project delivers it. Discovery, build, data migration and champion training are run by the same certified team, with no hand-off to an offshore bench.</div></details>
</div></section>

<!-- 7. CLOSING + FORM -->
<section class="close-band" id="book"><div class="wrap">
<div class="eyebrow" style="color:var(--p3)">Get started</div>
<h2>Ready to Transform <em>the Way Your Team Works?</em></h2>
<p class="lede">Stop wrestling with messy spreadsheets and disconnected platforms. Get a customised workflow blueprint engineered by the leading monday com consultant in Australia.</p>
<div class="calendly-box"></div>
</div></section>

<!-- Minimal footer: no links -->
<div class="foot">© 2026 Fruition Services Pty Ltd · ABN 12 667 454 006 · 12/64 York Street, Sydney NSW 2000 · Australia &amp; New Zealand</div>


<script>
(function () {
  var SOURCE = "adwords-lp-au-monday-consulting-services";
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
