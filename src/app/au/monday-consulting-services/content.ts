/* AdWords landing page document (source: monday item asset au-monday-consulting-services.html).
   Self-contained by design: own styles/fonts, no site chrome, noindex. */
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Fruition Services, monday.com Consulting Services Australia","description":"monday.com Platinum Partner delivering consulting, implementation, CRM builds, integrations and training across Australia and New Zealand.","url":"https://www.fruitionservices.io/au/monday-consulting-services","provider":{"@type":"Organization","name":"Fruition Services Pty Ltd","identifier":"ABN 12 667 454 006","address":{"@type":"PostalAddress","streetAddress":"12/64 York Street","addressLocality":"Sydney","addressRegion":"NSW","postalCode":"2000","addressCountry":"AU"}},"areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Country","name":"New Zealand"}],"serviceType":"monday.com consulting and implementation"}
</script>
<style>
:root{--p9:#2D1450;--p7:#5B2A86;--p5:#7C3FB0;--p3:#B68FD9;--p1:#EFE5F7;--p05:#F7F2FB;
--ink:#15121F;--soft:#4A4458;--light:#6B6479;--lighter:#9990A5;--cream:#FAF8FC;
--line:#E8E0F0;--green:#2E9E5F;--gold:#E8B33D}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter Tight',sans-serif;background:#fff;color:var(--ink);line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:0 28px}

/* Minimal top bar: logo only, non-clickable, + sticky CTA */
.topbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.topbar-in{display:flex;align-items:center;justify-content:space-between;padding:13px 28px;max-width:1120px;margin:0 auto}
.logo{font-family:'Fraunces',serif;font-weight:600;font-size:22px;color:var(--p7)}
.logo span{color:var(--ink)}
.sticky-cta{background:var(--p7);color:#fff;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 4px 14px rgba(91,42,134,.3)}
.sticky-cta:hover{background:var(--p9)}

/* Hero */
.hero{padding:54px 0 46px;background:linear-gradient(180deg,#fff 0%,var(--p05) 100%)}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
.badges{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
.badge{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:100px;font-size:12.5px;font-weight:600}
.badge-platinum{background:var(--p9);color:#fff}
.badge-adv{background:var(--p1);color:var(--p7)}
.badge-dot{width:7px;height:7px;border-radius:50%;background:var(--gold)}
h1{font-family:'Fraunces',serif;font-weight:500;font-size:44px;line-height:1.08;letter-spacing:-.02em;margin-bottom:16px}
h1 em{font-style:italic;color:var(--p7)}
.sub{font-size:17px;color:var(--soft);line-height:1.6;margin-bottom:26px;max-width:520px}
.cta-row{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.b1{background:var(--p7);color:#fff;padding:16px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 6px 20px rgba(91,42,134,.28)}
.b1:hover{background:var(--p9)}
.cta-note{font-size:12.5px;color:var(--light)}

/* Dashboard mock (pure CSS = fast load) */
.dash{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 60px rgba(45,20,80,.12);overflow:hidden}
.dash-head{background:var(--p9);padding:12px 16px;display:flex;gap:6px;align-items:center}
.dash-head .dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25)}
.dash-head .ttl{color:#fff;font-size:12px;font-weight:600;margin-left:8px;letter-spacing:.03em}
.dash-body{padding:16px}
.dash-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;padding:9px 10px;border-radius:7px;font-size:11.5px;align-items:center}
.dash-row.h{background:var(--p05);font-weight:700;color:var(--soft);font-size:10.5px;text-transform:uppercase;letter-spacing:.05em}
.dash-row:not(.h){border-bottom:1px solid #F4F0F9}
.pill{padding:4px 8px;border-radius:5px;color:#fff;font-weight:600;text-align:center;font-size:10.5px}
.pg{background:var(--green)}.pa{background:var(--gold)}.pp{background:var(--p5)}
.bar{height:7px;border-radius:4px;background:var(--p1);overflow:hidden}
.bar i{display:block;height:100%;background:var(--p7)}
.dash-name{font-weight:600;color:var(--ink)}

/* Trust strip */
.trust{padding:26px 0;border-bottom:1px solid var(--line)}
.trust-txt{text-align:center;font-size:13px;color:var(--light);margin-bottom:14px}
.trust-logos{display:flex;justify-content:center;gap:44px;flex-wrap:wrap;align-items:center}
.tlogo{font-family:'Fraunces',serif;font-weight:600;font-size:19px;color:#A9A2B5;letter-spacing:.01em}

/* Sections */
section{padding:62px 0}
.eyebrow{font-size:12px;color:var(--p7);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;text-align:center}
h2{font-family:'Fraunces',serif;font-weight:500;font-size:32px;letter-spacing:-.015em;line-height:1.15;margin-bottom:14px;text-align:center}
.lede{font-size:15.5px;color:var(--soft);max-width:640px;margin:0 auto 38px;text-align:center;line-height:1.6}
.alt{background:var(--p05)}

/* Capabilities */
.caps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cap{background:#fff;border:1px solid var(--line);border-radius:13px;padding:28px 24px;border-top:4px solid var(--p7)}
.cap h3{font-family:'Fraunces',serif;font-size:19px;font-weight:600;margin-bottom:9px;line-height:1.25}
.cap p{font-size:14px;color:var(--soft);line-height:1.6}

/* Why */
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.why-card{background:#fff;border:1px solid var(--line);border-radius:13px;padding:26px 24px}
.why-num{font-size:26px;font-weight:700;color:var(--p7);font-family:'Fraunces',serif;margin-bottom:8px}
.why-card h3{font-size:16.5px;font-weight:700;margin-bottom:8px}
.why-card p{font-size:13.5px;color:var(--soft);line-height:1.6}
.stats{display:flex;justify-content:center;gap:44px;flex-wrap:wrap;margin-top:36px}
.stat{text-align:center}
.stat b{display:block;font-family:'Fraunces',serif;font-size:34px;color:var(--p7);font-weight:600}
.stat span{font-size:12.5px;color:var(--light)}

/* Team */
.team{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tm{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:hidden}
.tm-img{aspect-ratio:4/3;background:linear-gradient(135deg,var(--p7),var(--p9));display:flex;align-items:flex-end;padding:14px;color:#fff;font-family:'Fraunces',serif;font-weight:600;font-size:15px}
.tm-body{padding:18px 20px}
.tm-role{font-size:11.5px;color:var(--p7);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.tm-body p{font-size:13.5px;color:var(--soft);line-height:1.55}

/* Methodology */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;counter-reset:step}
.step{background:#fff;border:1px solid var(--line);border-radius:13px;padding:24px 20px;position:relative}
.step-n{width:30px;height:30px;border-radius:50%;background:var(--p7);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-bottom:12px}
.step h3{font-size:15.5px;font-weight:700;margin-bottom:7px}
.step p{font-size:13px;color:var(--soft);line-height:1.55}

/* Form */
.close-band{background:linear-gradient(135deg,var(--p7),var(--p9));color:#fff}
.close-band h2,.close-band .lede{color:#fff}
.close-band .lede{color:rgba(255,255,255,.85)}
.form-card{background:#fff;border-radius:16px;padding:34px;max-width:560px;margin:0 auto;box-shadow:0 24px 60px rgba(0,0,0,.25)}
.ff{margin-bottom:14px}
.ff label{display:block;font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:6px}
.ff input,.ff textarea{width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:9px;font-family:inherit;font-size:14.5px;color:var(--ink)}
.ff input:focus,.ff textarea:focus{outline:none;border-color:var(--p7)}
.ff textarea{min-height:88px;resize:vertical}
.form-btn{width:100%;background:var(--p7);color:#fff;border:none;padding:16px;border-radius:10px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer}
.form-btn:hover{background:var(--p9)}
.form-trust{text-align:center;font-size:12px;color:var(--light);margin-top:12px}

/* Footer minimal — no links */
.foot{padding:28px 0;text-align:center;font-size:12px;color:var(--lighter);border-top:1px solid var(--line)}

@media(max-width:900px){
h1{font-size:32px}h2{font-size:25px}
.hero-grid,.caps,.why,.team,.steps{grid-template-columns:1fr}
.hero{padding:34px 0}
.dash{display:none}
section{padding:44px 0}
.sticky-cta{padding:10px 14px;font-size:13px}
.stats{gap:26px}
}
</style>
</head>
<body>

<!-- Topbar: logo only (non-clickable) + sticky CTA -->
<div class="topbar"><div class="topbar-in">
<div class="logo">Fruition<span>.</span></div>
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
