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
