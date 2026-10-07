/* AdWords landing page document (source: monday item asset au-ai-business-consulting-services.html).
   Self-contained by design: own styles/fonts, no site chrome, noindex. */
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Fruition Services: AI Consulting Services Australia","description":"AI strategy consultants delivering AI management consulting, business process automation, custom LLM deployment and agentic systems for Australian businesses.","url":"https://www.fruitionservices.io/au/ai-business-consulting-services","provider":{"@type":"Organization","name":"Fruition Services Pty Ltd","identifier":"ABN 12 667 454 006","address":{"@type":"PostalAddress","streetAddress":"12/64 York Street","addressLocality":"Sydney","addressRegion":"NSW","postalCode":"2000","addressCountry":"AU"}},"areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Country","name":"New Zealand"}],"serviceType":"AI consulting and business process automation"}
</script>
<style>
:root{--p9:#2D1450;--p7:#5B2A86;--p5:#7C3FB0;--p3:#B68FD9;--p1:#EFE5F7;--p05:#F7F2FB;
--ink:#15121F;--soft:#4A4458;--light:#6B6479;--lighter:#9990A5;--cream:#FAF8FC;
--line:#E8E0F0;--green:#2E9E5F;--gold:#E8B33D}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter Tight',sans-serif;background:#fff;color:var(--ink);line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:0 28px}

/* Topbar: logo only + sticky CTA (top-right desktop) */
.topbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.topbar-in{display:flex;align-items:center;justify-content:space-between;padding:13px 28px;max-width:1120px;margin:0 auto}
.logo{font-family:'Fraunces',serif;font-weight:600;font-size:22px;color:var(--p7)}
.logo span{color:var(--ink)}
.sticky-cta{background:var(--p7);color:#fff;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 4px 14px rgba(91,42,134,.3)}
.sticky-cta:hover{background:var(--p9)}
/* Mobile: sticky bottom bar per spec */
.mob-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;padding:12px 16px;background:rgba(255,255,255,.97);border-top:1px solid var(--line)}
.mob-cta a{display:block;text-align:center;background:var(--p7);color:#fff;padding:14px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none}

/* Hero */
.hero{padding:52px 0 48px;background:linear-gradient(180deg,#fff 0%,var(--p05) 100%)}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
.badges{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
.badge{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:100px;font-size:12.5px;font-weight:600}
.badge-dark{background:var(--p9);color:#fff}
.badge-lite{background:var(--p1);color:var(--p7)}
.badge-dot{width:7px;height:7px;border-radius:50%;background:var(--gold)}
h1{font-family:'Fraunces',serif;font-weight:500;font-size:42px;line-height:1.08;letter-spacing:-.02em;margin-bottom:16px}
h1 em{font-style:italic;color:var(--p7)}
.sub{font-size:16.5px;color:var(--soft);line-height:1.6;margin-bottom:24px;max-width:540px}
/* Hero inline form */
.hero-form{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:0 10px 30px rgba(45,20,80,.08);max-width:480px}
.hf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.hero-form input{width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:9px;font-family:inherit;font-size:14px;color:var(--ink)}
.hero-form input:focus{outline:none;border-color:var(--p7)}
.hf-btn{width:100%;background:var(--p7);color:#fff;border:none;padding:15px;border-radius:10px;font-family:inherit;font-weight:700;font-size:15.5px;cursor:pointer}
.hf-btn:hover{background:var(--p9)}
.hf-note{font-size:11.5px;color:var(--light);text-align:center;margin-top:9px}

/* AI pipeline graphic — pure CSS */
.pipe{background:var(--p9);border-radius:16px;padding:28px;box-shadow:0 24px 60px rgba(45,20,80,.25);position:relative;overflow:hidden}
.pipe::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 10%,rgba(124,63,176,.4),transparent 55%)}
.pipe-title{color:var(--p3);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:18px;position:relative}
.node-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;position:relative}
.node{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:11px 14px;color:#fff;font-size:12.5px;font-weight:600;flex:1}
.node small{display:block;color:rgba(255,255,255,.55);font-weight:400;font-size:10.5px;margin-top:2px}
.node.hot{background:rgba(232,179,61,.14);border-color:rgba(232,179,61,.45)}
.arrow{color:var(--p3);font-size:15px;flex-shrink:0}
.pulse{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);margin-right:6px;box-shadow:0 0 8px var(--green)}

/* Trust strip */
.trust{padding:26px 0;border-bottom:1px solid var(--line)}
.trust-txt{text-align:center;font-size:13px;color:var(--light);margin-bottom:14px}
.trust-logos{display:flex;justify-content:center;gap:44px;flex-wrap:wrap;align-items:center}
.tlogo{font-family:'Fraunces',serif;font-weight:600;font-size:19px;color:#A9A2B5}

section{padding:62px 0}
.eyebrow{font-size:12px;color:var(--p7);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;text-align:center}
h2{font-family:'Fraunces',serif;font-weight:500;font-size:32px;letter-spacing:-.015em;line-height:1.15;margin-bottom:14px;text-align:center}
.lede{font-size:15.5px;color:var(--soft);max-width:640px;margin:0 auto 38px;text-align:center;line-height:1.6}
.alt{background:var(--p05)}

.caps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cap{background:#fff;border:1px solid var(--line);border-radius:13px;padding:28px 24px;border-top:4px solid var(--p7)}
.cap h3{font-family:'Fraunces',serif;font-size:18.5px;font-weight:600;margin-bottom:9px;line-height:1.25}
.cap p{font-size:14px;color:var(--soft);line-height:1.6}

.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.why-card{background:#fff;border:1px solid var(--line);border-radius:13px;padding:26px 24px}
.why-num{font-size:26px;font-weight:700;color:var(--p7);font-family:'Fraunces',serif;margin-bottom:8px}
.why-card h3{font-size:16.5px;font-weight:700;margin-bottom:8px}
.why-card p{font-size:13.5px;color:var(--soft);line-height:1.6}

.team{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tm{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:hidden}
.tm-img{aspect-ratio:4/3;background:linear-gradient(135deg,var(--p7),var(--p9));display:flex;align-items:flex-end;padding:14px;color:#fff;font-family:'Fraunces',serif;font-weight:600;font-size:15px}
.tm-body{padding:18px 20px}
.tm-role{font-size:11.5px;color:var(--p7);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.tm-body p{font-size:13.5px;color:var(--soft);line-height:1.55}

.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.step{background:#fff;border:1px solid var(--line);border-radius:13px;padding:24px 20px}
.step-n{width:30px;height:30px;border-radius:50%;background:var(--p7);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-bottom:12px}
.step h3{font-size:15px;font-weight:700;margin-bottom:7px}
.step p{font-size:13px;color:var(--soft);line-height:1.55}

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

.foot{padding:28px 0 90px;text-align:center;font-size:12px;color:var(--lighter);border-top:1px solid var(--line)}

@media(max-width:900px){
h1{font-size:31px}h2{font-size:25px}
.hero-grid,.caps,.why,.team,.steps{grid-template-columns:1fr}
.hero{padding:32px 0}
.pipe{display:none}
section{padding:44px 0}
.topbar .sticky-cta{display:none}
.mob-cta{display:block}
.hf-row{grid-template-columns:1fr}
}
@media(min-width:901px){.foot{padding-bottom:28px}}
</style>
</head>
<body>

<!-- Topbar: non-clickable logo + sticky CTA (desktop top-right) -->
<div class="topbar"><div class="topbar-in">
<div class="logo">Fruition<span>.</span></div>
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
