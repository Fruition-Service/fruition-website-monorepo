/* AdWords landing page document (source: monday item 2876510374 asset us-monday-for-marketing-ads.html).
   Self-contained by design: own styles/fonts, no site chrome, noindex. */
export const html = `<!DOCTYPE html>
<!--
  FRUITION &mdash; ORPHAN SEM LANDING PAGE (US Marketing Teams · Google Ads)
  Ad group: Marketing Teams &mdash; market US (account 8457299561)
  Suggested URL: /us/monday-for-marketing  (orphan: EXCLUDE from sitemap.xml, no internal links pointing to it)
  Robots: noindex,follow &mdash; paid traffic only. The organic page stays live; this replaces it ONLY as the ads final URL.
  FOR EDWARD: FORM-WEBHOOK -> lead webhook -> monday CRM (map gclid/utm fields); CALENDLY -> US/North America round-robin &mdash; North America team ONLY;
  RATINGS -> live profile URLs, real linked values only, no review counts.
  FOR VADIM: GTAG conversion on form success (primary) + tel: click (secondary); align ad copy to H1.
-->
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>monday.com for Marketing Teams US | Fruition</title>
<meta name="description" content="monday.com for marketing teams in the US. Campaigns, content calendars, creative requests and approvals in one system &mdash; by a Platinum Partner.">
<meta name="robots" content="noindex,follow">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--purple:#5B2D8F;--deep:#35195C;--mid:#7A3FB8;--ink:#1E1633;--soft:#4A4458;--light:#8B84A0;--tint:#F6F2FB;--line:#E8E0F0;--green:#2E9E5F}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Poppins',Arial,sans-serif;color:var(--ink);background:#fff;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.topbar{border-bottom:1px solid var(--line);background:#fff;position:sticky;top:0;z-index:50}
.topbar .wrap{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 24px}
.topbar img{height:28px;display:block}
.topbar .right{display:flex;align-items:center;gap:16px}
.topbar .phone{font-size:14px;font-weight:600;color:var(--deep);text-decoration:none}
.topbar .book{background:var(--purple);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:9px;white-space:nowrap}
.topbar .book:hover{background:var(--deep)}
.hero{background:linear-gradient(180deg,var(--tint) 0%,#fff 92%);padding:50px 0 44px}
.hero .wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:start}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:99px;padding:7px 16px;font-size:13px;font-weight:600;color:var(--deep);margin-bottom:18px}
h1{font-size:clamp(29px,4.2vw,42px);font-weight:800;line-height:1.14;letter-spacing:-.015em;color:var(--deep)}
h1 em{font-style:normal;color:var(--purple)}
.hero .sub{font-size:16.5px;color:var(--soft);margin:16px 0 22px;max-width:530px}
.ticks{list-style:none;margin:0 0 26px}
.ticks li{padding-left:30px;position:relative;margin:10px 0;font-size:15px;color:var(--ink);font-weight:500}
.ticks li::before{content:"✓";position:absolute;left:0;top:2px;width:20px;height:20px;background:var(--purple);color:#fff;border-radius:50%;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}
.badges{display:flex;gap:10px;flex-wrap:wrap}
.badge{background:#fff;border:1px solid var(--line);border-radius:10px;padding:9px 14px;font-size:12.5px;font-weight:600;color:var(--deep)}
.formcard{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 50px rgba(53,25,92,.12);padding:28px}
.formcard h2{font-size:20px;font-weight:700;color:var(--deep);margin-bottom:4px}
.formcard .fsub{font-size:13.5px;color:var(--light);margin-bottom:16px}
.formcard label{display:block;font-size:12.5px;font-weight:600;color:var(--soft);margin:12px 0 5px}
.formcard input,.formcard select{width:100%;font-family:'Poppins',Arial,sans-serif;font-size:14.5px;color:var(--ink);border:1.5px solid var(--line);border-radius:9px;padding:11px 13px;background:#fff}
.formcard input:focus,.formcard select:focus{outline:none;border-color:var(--purple)}
.btn{display:block;width:100%;background:var(--purple);color:#fff;font-family:'Poppins',Arial,sans-serif;font-size:16px;font-weight:700;border:0;border-radius:10px;padding:15px;margin-top:18px;cursor:pointer;text-align:center;text-decoration:none}
.btn:hover{background:var(--deep)}
.formcard .fine{font-size:11.5px;color:var(--light);margin-top:12px;text-align:center}
.clients{padding:30px 0;border-bottom:1px solid var(--line)}
.clients p{text-align:center;font-size:12.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--light);margin-bottom:16px}
.logo-row{display:flex;justify-content:center;align-items:center;gap:42px;flex-wrap:wrap;filter:grayscale(1);opacity:.75}
.logo-row img{height:34px;width:auto;max-width:130px;object-fit:contain}
.chip-row{display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap}
.chip{border:1px solid var(--line);border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;color:var(--soft)}
section{padding:54px 0}
.k{font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--purple);margin-bottom:10px}
h2.sec{font-size:clamp(23px,3vw,30px);font-weight:700;color:var(--deep);line-height:1.2;letter-spacing:-.01em;margin-bottom:12px}
.lede{font-size:15.5px;color:var(--soft);max-width:640px;margin-bottom:30px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px}
.card h3{font-size:16px;font-weight:700;color:var(--deep);margin-bottom:8px}
.card p{font-size:13.8px;color:var(--soft)}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.step{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px}
.step .n{width:34px;height:34px;border-radius:50%;background:var(--purple);color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.step h3{font-size:15.5px;font-weight:700;color:var(--deep);margin-bottom:6px}
.step p{font-size:13.5px;color:var(--soft)}
.stats{background:linear-gradient(120deg,var(--deep),var(--purple));color:#fff}
.stats .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;text-align:center}
.stats .v{font-size:34px;font-weight:800;letter-spacing:-.02em}
.stats .l{font-size:13px;color:rgba(255,255,255,.82);margin-top:6px}
.stats .note{font-size:11.5px;color:rgba(255,255,255,.55);text-align:center;margin-top:24px}
.quotes{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.quote{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px}
.quote p{font-size:14.5px;color:var(--ink);font-style:italic}
.quote .who{margin-top:14px;font-size:13px;color:var(--light)}
.quote .who b{color:var(--deep);font-style:normal}
.ratings{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:26px}
.rating{display:block;background:#fff;border:1px solid var(--line);border-radius:13px;padding:17px 19px;text-decoration:none;text-align:center}
.rating:hover{border-color:var(--purple);background:var(--tint)}
.rating .score{font-size:24px;font-weight:800;color:var(--deep)}
.rating .stars{color:#F5A623;font-size:14px;letter-spacing:2px;margin:3px 0}
.rating .src{font-size:12.5px;font-weight:600;color:var(--soft)}
.team{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.member{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px;text-align:center}
.member img{width:84px;height:84px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block}
.member .avatar{width:84px;height:84px;border-radius:50%;background:var(--tint);color:var(--purple);font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
.member h3{font-size:16px;font-weight:700;color:var(--deep)}
.member .role{font-size:12.5px;font-weight:600;color:var(--purple);margin:2px 0 8px}
.member p{font-size:13px;color:var(--soft)}
details{border:1px solid var(--line);border-radius:12px;margin-bottom:10px;background:#fff}
summary{cursor:pointer;list-style:none;font-size:15.5px;font-weight:600;color:var(--deep);padding:17px 20px;display:flex;justify-content:space-between;gap:14px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:20px;font-weight:600;color:var(--purple)}
details[open] summary::after{content:"–"}
details .a{padding:0 20px 17px;font-size:14.5px;color:var(--soft)}
.final{background:var(--tint)}
.final .inner{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
.final h2{font-size:clamp(23px,3vw,30px);font-weight:700;color:var(--deep);line-height:1.2;margin-bottom:12px}
.final p{font-size:15px;color:var(--soft);margin-bottom:20px}
.calendly-box{background:#fff;border:1.5px dashed var(--mid);border-radius:14px;min-height:300px;display:flex;align-items:center;justify-content:center;color:var(--light);font-size:13.5px;text-align:center;padding:20px}
footer{background:var(--ink);color:rgba(255,255,255,.7);padding:26px 0;font-size:12.5px}
footer .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}
footer img{height:24px}
footer a{color:#B98CE0;text-decoration:none}
.mcta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:60;background:#fff;border-top:1px solid var(--line);padding:10px 14px;gap:10px}
.mcta a{flex:1;text-align:center;font-size:14.5px;font-weight:700;border-radius:9px;padding:13px;text-decoration:none}
.mcta .call{border:1.5px solid var(--purple);color:var(--purple)}
.mcta .book{background:var(--purple);color:#fff}
@media(max-width:920px){
.hero .wrap,.final .inner{grid-template-columns:1fr}
.grid3,.team,.quotes{grid-template-columns:1fr}
.steps,.stats .grid4,.ratings{grid-template-columns:1fr 1fr}
.topbar .book{display:none}
.mcta{display:flex}
body{padding-bottom:64px}
}

</style>
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
<div class="eyebrow">🇺🇸 monday.com Platinum Partner · Marketing Teams · New York · Chicago · Austin · San Francisco</div>
<h1>monday.com for <em>Marketing Teams</em></h1>
<p class="sub">Campaigns, content calendars, creative requests and approvals in one system &mdash; so the work stops living in six tools and nobody's head.</p>
<ul class="ticks">
<li>Campaign plans connected to the tasks that deliver them</li>
<li>Creative request intake with briefs that are actually complete</li>
<li>Approval workflows that end the version-7-final chaos</li>
<li>Content calendar every stakeholder can see</li>
</ul>
<div class="badges">
<span class="badge">monday.com Platinum Partner</span>
<span class="badge">Advanced Delivery Partner</span>
<span class="badge">900+ implementations</span>
<span class="badge">New York office</span>
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
<option>New monday.com implementation</option>
<option>Campaign & content workflows</option>
<option>Creative requests & approvals</option>
<option>Marketing budget tracking</option>
<option>Rescue an existing setup</option>
</select>
<input type="hidden" name="gclid" id="f-gclid">
<input type="hidden" name="utm_campaign" id="f-utmc">
<input type="hidden" name="utm_term" id="f-utmt">
<button class="btn" type="submit">Book My Free Consultation →</button>
<!-- GTAG-CONVERSION: Vadim &mdash; fire conversion on success, then redirect to /us/thank-you -->
<p class="fine">No obligation. 100% confidential. We'll tell you if you don't need us.</p>
</form>
</div>
</section>

<div class="clients">
<div class="wrap">
<p>US organizations running on systems Fruition built</p>
<!-- CLIENT-LOGOS: Edward &mdash; swap chips for grayscale Sanity logos where permission is signed off -->
<div class="chip-row">
<span class="chip">Honor Credit Union</span>
<span class="chip">Craters &amp; Freighters</span>
<span class="chip">Housing Authority of San Antonio</span>
<span class="chip">Stout Risius Ross</span>
<span class="chip">Kitchen Tune-Up</span>
<span class="chip">Windfall Bio</span>
</div>
</div>
</div>

<section>
<div class="wrap">
<p class="k">What we deliver</p>
<h2 class="sec">Marketing operations without the tool sprawl</h2>
<p class="lede">Delivered by certified monday.com consultants working your hours &mdash; fixed fee agreed before any build starts.</p>
<div class="grid3">
<div class="card"><h3>Campaign management</h3><p>Plans, budgets, channels and tasks in one connected structure.</p></div>
<div class="card"><h3>Content calendar</h3><p>Every channel's pipeline visible, filterable and reliable.</p></div>
<div class="card"><h3>Creative requests</h3><p>Structured intake with briefs, priorities and SLAs &mdash; no more drive-by asks.</p></div>
<div class="card"><h3>Review &amp; approvals</h3><p>Versioned approvals with annotations, deadlines and auto-chase.</p></div>
<div class="card"><h3>Budget tracking</h3><p>Planned vs committed vs actual per campaign, live.</p></div>
<div class="card"><h3>Performance dashboards</h3><p>Campaign status and results for the CMO without the Friday scramble.</p></div>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">What to expect</p>
<h2 class="sec">How a monday.com implementation works</h2>
<p class="lede">A proven, fixed-fee framework &mdash; the same methodology behind 900+ delivered systems.</p>
<div class="steps">
<div class="step"><div class="n">1</div><h3>Discovery &amp; scoping</h3><p>We map your workflows and agree a fixed quote before any build starts.</p></div>
<div class="step"><div class="n">2</div><h3>Solution architecture</h3><p>Boards, automations and dashboards built around how you actually operate.</p></div>
<div class="step"><div class="n">3</div><h3>Data migration</h3><p>Historical records moved in with everything essential preserved.</p></div>
<div class="step"><div class="n">4</div><h3>Training &amp; adoption</h3><p>Champions trained, end users enabled, system owned by your team.</p></div>
</div>
</div>
</section>

<section class="stats">
<div class="wrap">
<div class="grid4">
<div><div class="v">900+</div><div class="l">implementations delivered across six offices</div></div>
<div><div class="v">2–4 wks</div><div class="l">typical kickoff to a live, working system</div></div>
<div><div class="v">260+</div><div class="l">hours saved per year by a typical client team</div></div>
<div><div class="v">20–30%</div><div class="l">of team time recovered from manual re-keying</div></div>
</div>
<p class="note">Figures are typical outcomes drawn from Fruition engagements and published monday.com research. Individual results vary with scope, team size and adoption.</p>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Client proof</p>
<h2 class="sec">What clients say about Fruition's monday.com consultants</h2>
<div class="quotes">
<div class="quote"><p>"Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally."</p><div class="who"><b>Emily Hill</b> · International Markets Manager, Tourism Northern Territory</div></div>
<div class="quote"><p>"We found monday to be more customizable and transparent for both internal and external stakeholders. It reduced double handling of issues."</p><div class="who"><b>Mairhead McKinley</b> · Delivery Manager, Givergy</div></div>
</div>
<!-- RATINGS: Edward &mdash; add live profile URLs. Real linked values only; no review counts. -->
<div class="ratings">
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">monday.com partner directory</div></a>
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">Google Reviews</div></a>
<a class="rating" href="#"><div class="score">5.0</div><div class="stars">★★★★★</div><div class="src">G2</div></a>
<a class="rating" href="#"><div class="score">4.0</div><div class="stars">★★★★☆</div><div class="src">Trustpilot</div></a>
</div>
</div>
</section>

<section style="background:var(--tint);padding-top:46px;padding-bottom:46px">
<div class="wrap">
<p class="k">Your consultants</p>
<h2 class="sec">Work directly with a certified monday.com partner consultant</h2>
<p class="lede">Engagements are scoped and delivered personally &mdash; no hand-offs to an offshore bench.</p>
<div class="team">
<div class="member"><div class="avatar">ZW</div><h3>Zach Weller</h3><div class="role">Director &mdash; North America</div><p>Leads US delivery from New York &mdash; hands-on through scoping, build and training.</p></div>
<div class="member"><img src="https://cdn.sanity.io/images/bt6nb58h/production/194c9ab129a70bab635384976fc43ecc0661b587-500x500.jpg?w=560&h=560&fit=crop" alt="Nikhil Tiwari" loading="lazy"><h3>Nikhil Tiwari</h3><div class="role">Sales &amp; Implementation Lead</div><p>Certified monday.com and Make consultant with an ML and GenAI background.</p></div>
<div class="member"><div class="avatar">VM</div><h3>Valeria Marin</h3><div class="role">Implementation Consultant</div><p>Optimizes business processes and ensures seamless project transitions for US clients.</p></div>

</div>
</div>
</section>

<section>
<div class="wrap">
<p class="k">Before you book</p>
<h2 class="sec">The questions buyers ask us first</h2>
<details open><summary>Why did Tourism NT choose this setup?</summary><div class="a">Process automation across campaign management, budget management and project approvals &mdash; the exact workflows this build delivers &mdash; saved significant staff time globally and improved cross-team collaboration.</div></details>
<details><summary>How much does it cost?</summary><div class="a">Quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licenses are billed separately &mdash; and we'll tell you which plan tier you actually need.</div></details>
<details><summary>How long does it take?</summary><div class="a">Most engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; wider rollouts with migration and finance integrations run longer. The schedule is agreed during scoping, not discovered halfway through.</div></details>
<details><summary>Does it integrate with our marketing stack?</summary><div class="a">Yes &mdash; forms, email platforms, social schedulers and QuickBooks, Salesforce, HubSpot, Microsoft 365, Teams and Slack connect via native integrations, Make or the API.</div></details>
</div>
</section>

<section class="final" id="book">
<div class="wrap">
<div class="inner">
<div>
<p class="k">Book a time</p>
<h2>Ready to get running in days, not months?</h2>
<p>Book a free consultation &mdash; a frank read on scope, fit and cost from a certified Platinum Partner. If monday.com isn't the right fit, we'll say so.</p>
<a class="btn" style="max-width:300px" href="#lead">Book My Free Consultation →</a>
<p style="margin-top:16px;font-size:13.5px;color:var(--light)">Prefer to talk? <a href="tel:+13023302496" style="color:var(--purple);font-weight:700;text-decoration:none">+1 302 330 2496</a> · ET–PT business hours</p>
</div>
<div class="calendly-box">
<!-- CALENDLY: Edward &mdash; US/North America round-robin &mdash; North America team ONLY -->
Calendly embed &mdash; US/North America round-robin &mdash; North America team ONLY
</div>
</div>
</div>
</section>

<footer>
<div class="wrap">
<img src="https://www.fruitionservices.io/images/logo-fruition-white.svg" alt="Fruition Services">
<div>Fruition Services · 205 W 37th St, New York, NY 10018 · <a href="tel:+13023302496">+1 302 330 2496</a></div>
<div><a href="https://www.fruitionservices.io/data-privacy">Privacy</a> · <a href="https://www.fruitionservices.io/terms-and-conditions">Terms</a></div>
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
}catch(e){}})();
</script>
</body>
</html>
`
