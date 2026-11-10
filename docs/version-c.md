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
- Headings: wrap the accented words in asterisks, `Retailers that run *operations on monday.com.*`.

Every string renders as Sanity copy and every image comes from the Sanity CDN, so the whole page
is click-to-edit on editing.fruitionservices.io.

## Adding or migrating a page

1. Styles: `node scripts/vc/build-css.mjs <mock-ups review dir>` regenerates `src/styles/vc/`.
   A page without a mock-up of its own can import `src/styles/vc/default.css`.
2. Content: `npx tsx scripts/vc/migrate.ts --mockups <review dir> --slugs <slug,...>` (dry run,
   writes a JSON report), then add `--apply`. It uploads images, creates/replaces the documents,
   copies SEO title/description from the live page, takes links the mock-up left as `#` from the
   live page, and matches FAQ questions to the central store. Add new slugs to `PAGES` in the script.
3. Route: replace `page.tsx` with the three-line Version C route (see `src/app/monday-for-retail`).
4. Check: `node scripts/vc/compare.mjs --page <slug>:<path>` screenshots the page next to its
   mock-up at 1440 and 390 and reports section heights, overflow, broken images and console errors.

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
