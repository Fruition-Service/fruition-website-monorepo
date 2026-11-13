/**
 * "Implementation packages" section for the Google Ads monday.com partner pages
 * (/au, /uk, /us monday-partner). Same three tiers, team sizes and starting prices
 * as the live /implementation-packages page ("sized to your team"), drawn with the
 * shared theme's .pkgs/.pkg cards (the Variant A card, same as /implementation-packages). Buttons scroll to the page's own #lead form, so
 * the section adds no links to or from the rest of the site and the pages stay orphaned.
 */
export function implementationPackagesSection(note: string): string {
  return `<section id="packages">
<div class="wrap">
<p class="k">Fixed-fee packages</p>
<h2 class="sec">Implementation packages</h2>
<p class="lede">Sized to your team. Choose by team size and what you need done; your exact fee is confirmed in writing before we start.</p>
<div class="pkgs">
<div class="pkg"><span class="dur">Reset and train</span><h3>Training &amp; Optimisation</h3><span class="size">1 team · up to 25 users</span><div class="pricebox"><span class="from">From</span><div class="price">US$2,500<span class="un">one-time</span></div></div><p class="bf"><b>Best for:</b> teams already on monday.com whose boards, automations or adoption need fixing.</p><ul><li>Up to 5 boards reviewed and cleaned up</li><li>Up to 10 automations optimised</li><li>2 training sessions</li></ul><a class="btn" href="#lead">Get started<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
<div class="pkg feat"><span class="dur">We build and deploy together</span><h3>Lock-Step</h3><span class="size">1-2 teams · up to 50 users</span><div class="pricebox"><span class="from">From</span><div class="price">US$5,000<span class="un">one-time</span></div></div><p class="bf"><b>Best for:</b> new rollouts and rebuilds of the workflows your business runs on.</p><ul><li>1-2 workflows mapped and built</li><li>Up to 8 boards + 2 dashboards</li><li>Up to 15 automations + 1 integration</li></ul><a class="btn" href="#lead">Get quote<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
<div class="pkg"><span class="dur">Ongoing, embedded</span><h3>Deployed Engineer</h3><span class="size">Multiple teams · up to 250 users</span><div class="pricebox"><span class="from">From</span><div class="price">US$2,500<span class="un">per month</span></div></div><p class="bf"><b>Best for:</b> organisations whose processes keep changing and want monday.com expertise on the team.</p><ul><li>1 named forward deployed engineer</li><li>Change requests in 2 business days</li><li>Monthly roadmap review</li></ul><a class="btn" href="#lead">Get your options<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
</div>
<p class="pnote">${note}</p>
</div>
</section>
`
}
