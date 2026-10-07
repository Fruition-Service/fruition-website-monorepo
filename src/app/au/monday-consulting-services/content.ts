/* AdWords landing page document (source: monday item asset au-monday-consulting-services.html).
   Self-contained by design: no site chrome, noindex. Styles come from the shared
   site theme in landingPageTheme.ts. */
import { LP_FONTS, LP_CONSULTING_CSS } from "@/lib/landingPageTheme"

export const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com Consulting Services Australia | Certified Platinum Partner — Fruition</title>
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
<span class="badge badge-adv">Advanced Delivery Partner</span>
</div>
<h1>Expert monday.com Consulting Services &amp; Implementation <em>Across Australia</em></h1>
<p class="sub">Streamline your workflows, maximise efficiency, and build a system your team loves. Book a session with a monday.com Certified Partner today for custom setups, seamless integrations, and end-to-end automation.</p>
<div class="cta-row">
<a href="#book" class="b1">Book a Free Consultation →</a>
<span class="cta-note">30 minutes · No obligation · Australian team</span>
</div>
</div>
<div class="dash" aria-hidden="true">
<div class="dash-head"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="ttl">Sales Pipeline — Q3</span></div>
<div class="dash-body">
<div class="dash-row h"><span>Deal</span><span>Status</span><span>Owner</span><span>Progress</span></div>
<div class="dash-row"><span class="dash-name">Acme Rollout</span><span class="pill pg">Won</span><span>N. M.</span><span class="bar"><i style="width:100%"></i></span></div>
<div class="dash-row"><span class="dash-name">Harbour Group CRM</span><span class="pill pa">Proposal</span><span>B. M.</span><span class="bar"><i style="width:64%"></i></span></div>
<div class="dash-row"><span class="dash-name">Northside Services</span><span class="pill pp">Discovery</span><span>J. J.</span><span class="bar"><i style="width:32%"></i></span></div>
<div class="dash-row"><span class="dash-name">Coastal Build Co</span><span class="pill pa">Proposal</span><span>N. M.</span><span class="bar"><i style="width:58%"></i></span></div>
<div class="dash-row"><span class="dash-name">Fieldline Logistics</span><span class="pill pg">Won</span><span>B. M.</span><span class="bar"><i style="width:100%"></i></span></div>
</div>
</div>
</div>
</div></header>

<!-- 2. TRUST STRIP -->
<div class="trust"><div class="wrap">
<div class="trust-txt">Trusted by leading Australian and global organisations</div>
<div class="trust-logos">
<span class="tlogo">Specsavers</span>
<span class="tlogo">CSIRO</span>
<span class="tlogo">HVAC Australia</span>
</div>
</div></div>

<!-- 3. CORE CAPABILITIES -->
<section><div class="wrap">
<div class="eyebrow">What we deliver</div>
<h2>Tailored monday Implementation Consultant Solutions for Every Workflow</h2>
<p class="lede">Certified, keyword-deep expertise across the full monday.com product suite — built around how your teams actually work.</p>
<div class="caps">
<div class="cap">
<h3>monday CRM Consultants</h3>
<p>Build custom, AI-powered sales pipelines, end-to-end CRM architectures, and agentic workflows tailored precisely to your commercial goals.</p>
</div>
<div class="cap">
<h3>Workflow Automation &amp; Integrations</h3>
<p>Connect your entire tech stack — Xero, QuickBooks, Salesforce, or HubSpot — using Make.com or custom API developments to reduce manual tasks.</p>
</div>
<div class="cap">
<h3>monday Service &amp; Work Management</h3>
<p>Set up IT helpdesks, operational dashboards, customer portals, or employee self-service solutions engineered by a certified monday com consultant in Australia.</p>
</div>
</div>
</div></section>

<!-- 4. WHY FRUITION -->
<section class="alt"><div class="wrap">
<div class="eyebrow">The insider advantage</div>
<h2>Why Partner with Our Dedicated monday.com Consulting Services?</h2>
<div class="why">
<div class="why-card">
<div class="why-num">01</div>
<h3>Ex-monday.com Insider Knowledge</h3>
<p>Founded and directed by former monday.com staff members with technical best-practice insights across more than 600 global client optimisations.</p>
</div>
<div class="why-card">
<div class="why-num">02</div>
<h3>Proven Scale &amp; Success</h3>
<p>An Advanced Delivery Partner with a flawless 5.0 CSAT rating and over 700 successful implementations worldwide.</p>
</div>
<div class="why-card">
<div class="why-num">03</div>
<h3>Local Australian Experts</h3>
<p>Our primary delivery squad, solutions engineers, and change managers are headquartered right here in Australia to provide real-time, local support.</p>
</div>
</div>
<div class="stats">
<div class="stat"><b>700+</b><span>Implementations worldwide</span></div>
<div class="stat"><b>5.0</b><span>CSAT rating</span></div>
<div class="stat"><b>600+</b><span>Client optimisations</span></div>
<div class="stat"><b>Platinum</b><span>Partner tier</span></div>
</div>
</div></section>

<!-- 5. TEAM -->
<section><div class="wrap">
<div class="eyebrow">Your Australian team</div>
<h2>Work Directly with a Certified monday.com Partner Consultant</h2>
<p class="lede">No handoffs, no offshore bench. The people below scope and deliver your build.</p>
<div class="team">
<div class="tm">
<div class="tm-img">Josh Jebathilak</div>
<div class="tm-body">
<div class="tm-role">Director, APAC</div>
<p>Spent 4 years working directly within monday.com prior to launching Fruition. Personally oversaw system builds for hundreds of organisations.</p>
</div>
</div>
<div class="tm">
<div class="tm-img">Natalia Mishenina</div>
<div class="tm-body">
<div class="tm-role">Solution Engineer</div>
<p>Expert in SaaS implementation, process mapping, and guiding technical solution design from initial discovery through to system handover.</p>
</div>
</div>
<div class="tm">
<div class="tm-img">Branson McMahon</div>
<div class="tm-body">
<div class="tm-role">Solution Engineer</div>
<p>Specialises in translating complex operational requirements into functional capabilities using the full scope of the Work OS platform.</p>
</div>
</div>
</div>
</div></section>

<!-- 6. METHODOLOGY -->
<section class="alt"><div class="wrap">
<div class="eyebrow">What to expect</div>
<h2>A Proven, ROI-Driven Framework</h2>
<div class="steps">
<div class="step"><div class="step-n">1</div><h3>Discovery &amp; Scoping</h3><p>Mapping out your operational gaps and technical requirements.</p></div>
<div class="step"><div class="step-n">2</div><h3>Solution Architecture</h3><p>Designing boards, creating automations, and configuring native features.</p></div>
<div class="step"><div class="step-n">3</div><h3>Data Migration</h3><p>Safely transitioning historical data from third-party systems or spreadsheets into your new workspace.</p></div>
<div class="step"><div class="step-n">4</div><h3>Change Management &amp; Onboarding</h3><p>Practical end-user champion training sessions to ensure high adoption across your entire company.</p></div>
</div>
</div></section>

<!-- 7. CLOSING + FORM -->
<section class="close-band" id="book"><div class="wrap">
<div class="eyebrow" style="color:var(--p3)">Get started</div>
<h2>Ready to Transform the Way Your Team Works?</h2>
<p class="lede">Stop wrestling with messy spreadsheets and disconnected platforms. Get a customised workflow blueprint engineered by the leading monday com consultant in Australia.</p>
<div class="form-card">
<form action="#" method="post">
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;overflow:hidden">
<div class="ff"><label for="name">Full Name</label><input type="text" id="name" name="name" required placeholder="Your name"></div>
<div class="ff"><label for="email">Business Email</label><input type="email" id="email" name="email" required placeholder="you@company.com.au"></div>
<div class="ff"><label for="phone">Phone Number</label><input type="tel" id="phone" name="phone" required placeholder="+61 ..."></div>
<div class="ff"><label for="goals">Briefly describe your project or workflow goals</label><textarea id="goals" name="goals" placeholder="e.g. We need a CRM and job-tracking system connected to Xero…"></textarea></div>
<button type="submit" class="form-btn">Book My Free Consultation</button>
<div class="form-trust">No obligation. 100% confidential.</div>
</form>
</div>
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
