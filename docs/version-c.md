# Version C pages

The approved November 2026 redesign. A Version C page is a `vcPage` Sanity document rendered by
`src/components/vc/VcPage.tsx`; the route file only names the path and imports the page stylesheet.

## Content model (Studio: "Website pages (Version C)")

- `vcPage`: `path` (must equal the route), SEO title/description, optional social image, and an
  ordered list of sections: hero, client logos, numbered steps, case studies, audit banner, cards
  (2/3/4 columns, why-us, outcomes, use cases), product screenshots, client quotes, led by
  practitioners, booking, FAQ, closing band.
- Shared documents, edited once for every page: `vcCase` (named client case study), `vcQuote`
  (client quote), `vcShared` (the "Led by practitioners" block and booking defaults).
- FAQ tabs reference the central `faqItem` store. Questions added with these pages have ids
  `faqItem-vc-*` and stay off the /faqs hub (`getFaqItems`).
- **The first FAQ tab is about the page, and only the page.** Generic questions (pricing, "Why choose
  Fruition over a Big-4 firm?", "Can Fruition deliver this remotely?") and questions about another
  product or service (AI agent cost on a Claude page, "Does monday com have a CRM?" on the Atlassian
  page) go in the other tabs, the selector bubbles. Name the first tab after the page topic, not "FAQ",
  and do not repeat a question across tabs. Applied to 42 pages on 13 Nov 2026 by
  `scripts/vc/page-specific-faqs-2026-11.ts` (dry run by default, `--restore <backup>` to undo).
- Headings: wrap the accented words in asterisks, `Retailers that run *operations on monday.com.*`.

Every string renders as Sanity copy and every image comes from the Sanity CDN, so the whole page
is click-to-edit on editing.fruitionservices.io.

## Adding or migrating a page

1. Styles: `node scripts/vc/build-css.mjs <mock-ups review dir>` regenerates `src/styles/vc/`.
   A page without a mock-up of its own can import `src/styles/vc/default.css`, or reuse an approved
   page's stylesheet and pass that page's slug (the six industry pages added on 12 Nov 2026 reuse
   the healthcare layout; content and assets in `scripts/vc/add-industries-2026-11.ts`).
2. Content: `npx tsx scripts/vc/migrate.ts --mockups <review dir> --slugs <slug,...>` (dry run,
   writes a JSON report), then add `--apply`. It uploads images, creates/replaces the documents,
   copies SEO title/description from the live page, takes links the mock-up left as `#` from the
   live page, and matches FAQ questions to the central store. Add new slugs to `PAGES` in the script.
3. Route: replace `page.tsx` with the three-line Version C route (see `src/app/monday-for-retail`).
4. Check: `node scripts/vc/compare.mjs --page <slug>:<path>` screenshots the page next to its
   mock-up at 1440 and 390 and reports section heights, overflow, broken images and console errors.

### Pages without a mock-up of their own

| Page | Group | Layout reused | Content script | Added |
|---|---|---|---|---|
| `/licence-procurement` | core | `/implementation-packages` (`pricing.css`, slug `pricing`) | `scripts/vc/add-licence-procurement.ts` (`--apply`) | 13 Nov 2026. Missed by the 11 Nov rollout; copy is the live page's (the retired `licensingPage` singleton merged over `src/data/practicePages/licensing.ts`). That singleton and its fallback no longer drive the route: edit the `vcPage-licence-procurement` document. |
| 8 partner pages: `/partnerships/{aws,google-cloud,microsoft-azure,microsoft-copilot,supabase,clay,elevenlabs,hootsuite-delivery}-partner` | partner | `/partnerships/anthropic-claude-partner` (slug `anthropic-claude-partner`) | `scripts/vc/migrate.ts` (slugs in `PAGES`), from the approved review-v3 mock-ups | 14 Nov 2026, Edward. Rules from his review: no partner badge on record (Azure, Copilot, Supabase, Clay) means no status section; a cases section only for a real client build on that platform (none of the eight has one, so none has cases). The "Who leads it" heading is the shared one; each page keeps its own paragraphs. Prices are the live AUD figures (the snapshots had been currency-converted to SGD and were mapped back). |
| `/integrations/twilio`, `/integrations/zapier` | partner | `/integrations` (slug `integrations`) | same | 14 Nov 2026. Regional section dropped; two real client builds each (Twilio: RPM Instant Equity, ADG Construction; Zapier: Givergy, Kinetic Solutions). |
| `/ai-consulting/{customer-service,marketing-automation,operations-back-office,sales-outbound}` | ai | `/ai-consulting/agent-development` (slug `agent-development`) | same | 14 Nov 2026. Same section order as agent development; booking copy is each old page's own. Two real AI client builds each (marketing adds Office Furniture Company, sales adds Fair Health Care). |
| `/industries` (hub) | core | `/ai-use-cases` (slug `ai-use-cases`) | `scripts/vc/migrate.ts` | 14 Nov 2026. 18 industry tiles (`vcItem.cardLink` + `cardTile`, which keeps the card in the grid with its "Featured" label) and the four team links; hero fact pills (`vcHero.pills`, styles in `scripts/vc/extras.css`). The route still emits the hub's CollectionPage JSON-LD from `src/data/hubs/industries.ts`. |
| `/integrations/{whatsapp,line,viber}` | partner | `/integrations` (slug `integrations`) | same | 14 Nov 2026. Replaces `MessagingChannelTemplate`; every section of the old copy carried over as cards (the intro callout is a heading-only `vcCards`). Nikki's rules still hold: no hero partner badges, no client logo wall. No cases: no real WhatsApp, LINE or Viber client build exists. The dated facts (Meta pricing from 1 Oct 2026, LINE repricing) need a quarterly check. |

### Code-rendered pages in the Version C look

Three surfaces are code, not `vcPage` documents, because they carry behaviour a static page would lose.
They use the Version C classes and stylesheets directly; their copy stays where it was.

| Route | Component | Stylesheet | Added |
|---|---|---|---|
| `/post/<slug>` | `src/components/BlogPostTemplate.tsx` | `pages/blog-post.css`: the `/consulting-blog` file plus `scripts/vc/extras-blog-post.css`, rebuilt alone with `node scripts/vc/build-css.mjs --derived-only` (`DERIVED_PAGES`) | 14 Nov 2026, review-v3 `blog-sap` / `blog-claude-github` mock-ups. Hero with a meta column, sticky "On this page" (the body's H2s), one 680px reading column, the post's FAQ block in the accordion (`src/lib/blogFaq.ts` moves an "FAQs" H2 with H3 questions; any other shape stays inline), author card, related posts (same category first), and the `/consulting-blog` closing band from Sanity. Body, headings and the Marketa contract (docs/architecture.md §9) are unchanged. |

### Use cases on industry pages (`vcUseCases`)

The twelve `/ai-use-cases/<industry>` pages were retired on 13 Nov 2026 (1 search click and ~160 impressions in
90 days; the `/ai-use-cases` hub stays). Each industry's builds now sit in a `vcUseCases` section, anchor
`ai-use-cases`, on its landing page: construction, education, nonprofits, financial services, government,
healthcare, transport & logistics, manufacturing, professional services, real estate, retail, technology & SaaS.
It replaced the hand-built "Use case catalogue" `vcCards` in the same slot (same `_key` and heading), so it is part
of the industry group's template, not page-specific. The cards are the page's featured builds from
`public/data/ai-use-cases` (`LANDING_PAGE_USE_CASES` in `src/features/ai-use-cases/featured.ts` maps page path to
catalogue industry; a new industry page needs an entry there and in `INDUSTRY_PAGES` in `types.ts`). "See the
build" opens the build in the hub dialog with the industry preselected (`/ai-use-cases?industry=<key>#uc-...`), and
the "See all" button opens the hub on that industry. The old URLs 301 to `<page>#ai-use-cases` (cross-industry to the
hub) from `src/features/ai-use-cases/retired.ts`, spread into `auditRedirects`. Content script:
`scripts/vc/retire-ai-use-case-pages-2026-11.ts` (dry run by default, `--apply`, `--restore <backup>`). The solar,
energy, hospitality and media pages keep their own hand-picked cards; only their links were repointed.

### Tool cards (`vcCards` layout `tools`)

Logo, name and line, and the whole card is the link (`href`). Each card takes a `logo` with `logoShape`
`wm-img` (wordmark) or `sq` (square mark), or a Partner (`partner` + `partnerImage`, resolved into `logo`).
Used by "By tool." on `/integrations` since 13 Nov 2026 (`scripts/vc/integrations-by-tool-2026-11.ts`, which
also removed the "Tools we integrate daily." marquee). Styles live in `scripts/vc/extras-integrations.css`;
a second page using the layout needs them moved to `extras.css`.

## Page-specific sections

Pages in one `group` (partner, industry, msol, ...) share a section template: the same section types
in the same order, which is what lets a template change roll out to the whole group. Some pages carry
extra sections that exist on that page only. **Before re-templating, reordering or regenerating a group,
run the checker and keep every page-specific section.**

A page-specific section is marked in three places:

1. **Sanity:** `pageSpecific: true` and a `pageSpecificNote` (where the copy came from, when). Studio shows
   it as "Page-specific section (outside the shared template)" on the section.
2. **Its `_key`** starts with `pagespecific-`, so it stands out in any JSON dump or GROQ result.
3. **The registry** `src/data/vcPageSpecificSections.ts` lists path, key, type, heading, reason, date and
   source. `vcPageSpecificSections.test.ts` checks the entries.

In the page HTML a page-specific section carries `data-page-specific` on its `<section>` (every section
component passes the flag to `Sec`), so Playwright and agents reading the DOM can tell them apart:
`document.querySelectorAll('[data-page-specific]')`. Page-only styles go in `scripts/vc/extras-<slug>.css`
(appended by `build-css.mjs`), never in the generated `src/styles/vc/` files. A section type built for one
page says so in its Studio title, e.g. `vcDeepDive`, "Service deep dive (page-specific)".

```bash
npx tsx scripts/vc/check-page-specific.ts   # read-only: registry vs live Sanity, exits 1 on drift
```

To add one: give the section a `pagespecific-<page>-<topic>` key, set `pageSpecific` and the note, add the
registry entry in the same PR, then run the checker. To remove one: delete it from the page and the registry.

| Page | Page-specific sections | Added |
|---|---|---|
| `/atlassian-consulting` | "Atlassian Certified Partner" cards (`vcCards`, `#partner`): #1 in ROVO, Service Management, Cloud Migration, after "Our Atlassian services" and before the deep dives. Its four FAQs sit in the first FAQ tab (`faqItem-vc-atlassian-partner-*`) | 13 Nov 2026, Edward: the old /partnerships/certified-atlassian-partner page folded in by `scripts/vc/atlassian-partner-fold-2026-11.ts`. That URL 301s to `#partner`; its 277% ROI claim and the 20% / 358% / 3 to 4 hrs stats were not carried over (unsourced) |
| `/hubspot-consulting` | Migration to HubSpot, Portal audit and rescue, RevOps and integrations (cards); Implementation process (6 steps) | 12 Nov 2026, ported from oglabs.io/services/hubspot |
| `/hubspot-consulting` | HubSpot solution finder (`vcSolutionFinder`, `#solution-finder`) directly under the hero: pick an industry, browse 26 builds, open one for its detail; "Get it scoped" scrolls to `#book` | 13 Nov 2026, the oglabs.io home page finder (HubSpot builds only) by `scripts/vc/hubspot-solution-finder.ts`; data snapshot in `scripts/vc/data/oglabs-hubspot-builds.json` |
| `/hubspot-consulting` | "Delivered locally across six regions." office cards (`vcOffices`, `#locations`) before the booking band | 13 Nov 2026, Vadim (monday 2900266080), by `scripts/vc/hubspot-vadim-2900266080.ts`. The office card styles are repeated in `scripts/vc/extras-hubspot-consulting.css` because the template keeps them in the contact-us block |
| `/contact-us` | "A certified partner ecosystem." marquee (`vcToolkit`), a copy of the /about-us section, where the contact channels section was. The email, phone, LinkedIn, social and compliance rows moved into the hero beside the form (hero fields `contactRows`, `socials`, `security`) | 13 Nov 2026, Edward, by `scripts/vc/contact-hero-partner-ecosystem-2026-11.ts`. Marquee styles in `scripts/vc/extras-contact-us.css`, kept in step with `extras-about-us.css` (taller logo box, square badges inset) |
| `/partnerships/certified-clickup-partner` | Beyond setup, HubSpot ↔ ClickUp (cards) | 12 Nov 2026, ported from oglabs.io/services/clickup |
| `/atlassian-consulting` | Four service deep dives (`vcDeepDive`): Jira `#jira`, Confluence `#confluence`, Jira Service Management `#jsm`, Jira to monday.com migration `#migration`, after "Our Atlassian services" | 12 Nov 2026: copy of the leaf pages merged in PR #415, dropped by the Version C rollout, restored at Vadim's (SEO) request by `scripts/vc/atlassian-deep-dives.ts`. The old leaf URLs 301 to these anchors. |

The OG Labs port (`scripts/sanity-migrate/port-oglabs-hubspot-clickup.ts`) also edited inside template
sections on those two pages: the HubSpot implementation card names all six Hubs, the ClickUp services
card bodies were rewritten (titles kept), ClickUp "How we deliver" went from 3 to 6 steps, both Results
leads now say the case studies span our platform work, and monday-only FAQs were swapped for HubSpot and
ClickUp questions (`faqItem-vc-hubspot-*`, `faqItem-vc-clickup-*`). On 13 Nov the HubSpot FAQ became four tabs (Implementation, Migration, Integration, Breeze AI) and the four "Our HubSpot services" cards got ids (`vcItem.anchor`: `implementation`, `breeze-ai`, `integration`, `migration`) for the old leaf-page redirects and the nav links. The pre-change documents are
committed in `scripts/sanity-backups/oglabs-port-*.json`; `--restore <that file>` puts them back.

## Per-page leaders and booking desks

"Who leads it" (`vcPractitioners`) shows the shared person from `vcShared` on every page unless the
section sets `leader` (a team member: photo, name and role from their own record) plus its own
`leaderFacts` and `leaderPills`. The booking band (`vcBooking`) detects the visitor's region unless
`desk` names a fixed consultant from `src/lib/bookingDesks.ts`; then every booking on that page goes to
that person's own Calendly event type and the card hides its region switch.

| Page | Leader | Booking desk | Added |
|---|---|---|---|
| `/hubspot-consulting` | Thana Witchawut | `thana` | 13 Nov 2026 |
| `/partnerships/certified-clickup-partner` | Thana Witchawut | `thana` | 13 Nov 2026 |
| `/partnerships/aircall-partner` | Suzzane Castro | region | 13 Nov 2026 |
| `/partnerships/n8n-integration-partner` | Yash Khowal | region | 13 Nov 2026 |
| `/partnerships/openclaw-partner` | Edward Zhang | region | 13 Nov 2026 |

Set by `scripts/sanity-migrate/partner-page-leaders.ts` (backup in `scripts/sanity-backups/partner-leaders-*.json`,
`--restore` puts it back). `scripts/vc/migrate.ts --apply` refuses to replace a page that has either,
unless `--drop-page-leaders`.

## Site chrome: announcement bar, header and footer

Every site page (not the ad landing pages, `/internal` or `/studio`) renders the Version C chrome from
Sanity `siteSettings`; nothing about it is in code copy.

| Part | Component | Sanity fields |
|---|---|---|
| Announcement bar | `components/home/AwardBanner.tsx` | shared copy slots `award-text`, `award-link`; `announcementHref` |
| Header (tabs, dropdowns, call popover, CTA, mobile sheet) | `components/Navbar.tsx`, `RegionalCallPopover.tsx` | `navigation` (tab, `sections[]`, `items[]` with `logo` image, `tier`, `description`; `footerNote`, `footerLinks`, `feature`), `offices`, `navbarCtaLabel`, `calendlyLink` |
| Footer | `components/Footer.tsx`, `FooterBookingCta.tsx` | `footerColumns`, `footerTagline`, `footerBadges` (chips, empty in the approved design), `socialLinks` (`icon` image, `row` 1 or 2), `footerLegalLinks`, `footerCopyrightText`, `footerCtaLabel`, `contactEmail`, `phone` |

Styles are one hand-written file, `src/styles/vc/chrome.css`, imported by the root layout: everything in
`@layer components`, every selector under `.vcn-ann`, `.vcn` or `.vcf`, colours from the `--vc-*` tokens,
fonts from the next/font variables, three widths (767 / 1023). Behaviour kept from the old header:
the CTA is a same-tab link that `InPageBookingLinks` turns into a scroll to `#book`; Escape, outside click,
focus leaving a panel and navigation close dropdowns; ArrowDown or Enter on a tab moves focus into its panel;
all dropdown links are in the server HTML; the header is `position: sticky` (the layout renders the bar and
header as siblings, not in a wrapper div, so it can stick).

### Seeding and rollback

`src/data/nav-vc.ts` and `src/data/footer-vc.ts` are the approved menu and footer; the icons are the SVG
files in `scripts/nav-icons/` (brand marks in their own colours, line icons in the accent colour).

```bash
npx tsx scripts/seed-nav-vc.ts                 # dry run: menu tree, icon check
npx tsx scripts/seed-nav-vc.ts --check-urls    # every href must be a 200 on the live site
npx tsx scripts/seed-nav-vc.ts --apply         # back up, upload icons, write the fields
npx tsx scripts/seed-nav-vc.ts --preview-file /tmp/nav-vc.json   # then NAV_VC_PREVIEW_FILE=/tmp/nav-vc.json npm run dev
```

`--apply` writes `navigation`, `footerTagline`, `footerBadges`, `footerColumns`, `footerCopyrightText`,
`socialLinks` and `announcementHref`, after saving their current values to
`scripts/nav-backups/nav-vc-backup-<timestamp>.json`. The values from before the 11 Nov 2026 rollout are
committed as `scripts/nav-backups/nav-vc-backup-2026-11-10T23-01-48-518Z.json`. Rollback: revert the code
PR, then `npx tsx scripts/seed-nav-vc.ts --restore scripts/nav-backups/nav-vc-backup-2026-11-10T23-01-48-518Z.json`
(fields that did not exist before are unset; the old Services tab comes back with the old code, because it
lived in `src/data/nav-services.ts`). The schema additions (`announcementHref`, `navSection.grow`, `navLink.logo`,
`feature.plain`, `socialLink.row`) are additive and can stay.
