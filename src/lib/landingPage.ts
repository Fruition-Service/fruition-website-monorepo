import type { LeadRegion } from "@/lib/leadNotify"
import { REGION_BOOKING } from "@/lib/regionBooking"

/**
 * Serving for the Google Ads landing pages under /au, /uk and /us.
 *
 * Those pages are self-contained HTML documents returned from route handlers,
 * so they never pass through `src/app/layout.tsx` and got none of its tags. Until
 * 2026-10-07 that meant no GTM at all on the very pages the ads pointed at: no
 * GA4 page views, no Google Ads tag, and no conversion of any kind. Most of them
 * also shipped with a lead form posting to `#` (submissions silently lost) and a
 * "Calendly embed goes here" placeholder box.
 *
 * `landingPageResponse` fixes all three at serve time, so the page documents
 * stay as authored:
 *
 * - injects the same GTM-PF6XWTL6 container the rest of the site loads;
 * - replaces the `.calendly-box` placeholder with the region's booking calendar
 *   (GTM's Calendly listener then records the booking conversion);
 * - wires any form still posting to `#` to /api/leads, and pushes the same
 *   `generate_lead` dataLayer event as `trackLead()` once the lead is accepted.
 *
 * Pages that already post to /api/leads keep their own handler; they push
 * `generate_lead` themselves.
 */

const GTM_ID = "GTM-PF6XWTL6"

const GTM_HEAD = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>`

const GTM_BODY = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

const CALENDLY_PLACEHOLDER = /<div class="calendly-box">[\s\S]*?<\/div>/

function calendlyEmbed(url: string): string {
  return `<style>.lp-calendly{min-width:300px;height:680px;border-radius:14px;overflow:hidden;background:#fff}</style>
<div class="calendly-inline-widget lp-calendly" data-url="${url}?hide_gdpr_banner=1"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>`
}

/**
 * Posts every `action="#"` form to /api/leads. Field names vary by page, so
 * everything other than the identity fields travels in `fields`, with phone under
 * "Phone" — the key the monday sink reads for its phone column.
 */
function leadFormScript(source: string): string {
  return `<script>
(function(){
  var SOURCE=${JSON.stringify(source)};
  var forms=document.querySelectorAll('form');
  forms.forEach(function(f){
    if((f.getAttribute('action')||'')!=='#')return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(f.reportValidity&&!f.reportValidity())return;
      var btn=f.querySelector('button[type=submit],button:not([type])');
      var original=btn?btn.textContent:'';
      var data={};
      new FormData(f).forEach(function(v,k){data[k]=String(v).trim();});
      var fields={};
      Object.keys(data).forEach(function(k){
        if(['name','email','company','website'].indexOf(k)>-1||!data[k])return;
        fields[k==='phone'?'Phone':k]=data[k];
      });
      var payload={
        name:data.name||(data.email||'').split('@')[0]||'AdWords lead',
        email:data.email||'',
        company:data.company||'',
        website:data.website||'',
        source:SOURCE,
        fields:fields
      };
      if(btn){btn.disabled=true;btn.textContent='Sending\\u2026';}
      fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json();})
        .then(function(j){
          if(!j.ok)throw new Error(j.error||'failed');
          try{(window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',form_source:SOURCE,page_path:location.pathname});}catch(_){}
          f.innerHTML='<div style="text-align:center;padding:18px 0"><div style="font-size:34px;line-height:1">\\u2713</div><h3 style="margin:10px 0 6px;font-size:19px">Request received</h3><p style="font-size:14px;opacity:.75;line-height:1.5">Thanks, a consultant will be in touch within one business day.</p></div>';
        })
        .catch(function(){
          if(btn){btn.disabled=false;btn.textContent=original;}
          alert('Sorry, something went wrong sending your request. Please email hello@fruitionservices.io instead.');
        });
    });
  });
})();
</script>`
}

/** Pure transform, exported for tests. */
export function withLandingPageTracking(
  html: string,
  { source, region }: { source: string; region: LeadRegion },
): string {
  let out = html
  out = out.replace(/<head([^>]*)>/i, (m) => `${m}\n${GTM_HEAD}`)
  out = out.replace(/<body([^>]*)>/i, (m) => `${m}\n${GTM_BODY}`)
  out = out.replace(CALENDLY_PLACEHOLDER, calendlyEmbed(REGION_BOOKING[region].calendlyUrl))
  if (!out.includes("/api/leads")) {
    out = out.replace(/<\/body>/i, `${leadFormScript(source)}\n</body>`)
  }
  return out
}

export function landingPageResponse(
  html: string,
  opts: { source: string; region: LeadRegion },
): Response {
  return new Response(withLandingPageTracking(html, opts), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Paid-traffic page: must stay out of organic search.
      "X-Robots-Tag": "noindex",
    },
  })
}
