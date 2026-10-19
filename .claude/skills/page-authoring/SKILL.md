---
name: page-authoring
description: How to add, edit or retire a marketing page in this Next.js App Router site — file layout, metadata, sitemap, redirects, and the soft-404 trap. Use when creating a new route, changing page structure, or removing/consolidating pages.
---

# Page authoring

~115 marketing routes live under `src/app/`. **Pages are hand-authored React server
components.** There is no generic block renderer — see `docs/architecture.md` §6.

## Anatomy of a page

```
src/app/<route>/
  page.tsx              # metadata export + server component; loads data
  <Name>Content.tsx     # "use client" body when it needs interactivity
```

- `page.tsx` exports `metadata` (or `generateMetadata`) and a default **server** component.
- Data loading happens in the server component via `src/features/content/loaders.ts` or
  `src/sanity/queries.ts`. Never fetch Sanity from a client component.
- Compose the body from `src/components/sections/`. Check what exists before writing a new
  section — most patterns (hero, stats, logo wall, FAQ, testimonials, CTA, booking) already exist.
- Styling follows `/design-system`. No exceptions.

## Adding a page — checklist

1. Create `src/app/<route>/page.tsx` with `metadata` built by `buildOgMetadata({ title,
   description, path })` from `src/lib/metadata.ts`. That gives the page its own Open Graph /
   Twitter card; without it a shared link previews as the homepage. Favicons come from the root
   layout. `src/lib/pageMetadata.test.ts` fails the build otherwise.
2. Load content server-side; push interactivity into a `"use client"` child.
3. Reuse sections from `src/components/sections/`.
4. **Add the route to `src/app/sitemap.ts`.** It is not automatic.
5. If it replaces an existing URL, add a redirect to `auditRedirects` in `next.config.ts`.
6. Verify: `npm test && npm run typecheck && npm run lint`.

## Adding a Google Ads landing page

Ad pages are route handlers, not `page.tsx`, and skip the root layout (no favicon, GTM or social
tags for free).

1. `src/app/<region>/<slug>/content.ts` exports `html`, the page document. Keep the supplied copy;
   swap its `<style>` for `${LP_FONTS}` + `<style>${LP_CONVERSION_CSS}</style>`.
2. `src/app/<region>/<slug>/route.ts` returns `landingPageResponse(html, { source:
   "adwords-lp-<region>-<slug>", region })`. That adds GTM, favicon/touch icons, the Open Graph +
   Twitter card, the regional Calendly, the lead-form wiring and `X-Robots-Tag: noindex`.
3. The document itself must carry `<html lang>`, `<title>`, `<meta name="description">`,
   `<meta name="robots" content="noindex,follow">` and exactly one `<h1>`.
4. Do **not** add it to the sitemap or link to it from the site.
5. `src/lib/adLandingPageHead.test.ts` and `landingPageLayout.test.ts` pick it up from the route
   automatically and fail on anything missing.

## Retiring or consolidating a page

1. Delete the route directory.
2. Add a **301 to the replacement** in `auditRedirects` in `next.config.ts` — never leave a URL
   that had traffic returning 404.
3. Remove it from `src/app/sitemap.ts`.
4. Grep for internal links to the old path and repoint them.

## Traps

- **Soft 404s.** An unknown `/partnerships/<slug>` returns **200 with an empty shell**, not a
  404. URL checkers cannot detect nav links pointing at pages that do not exist — verify the
  page file exists on disk by hand.
- **Never hand-edit `src/redirects.ts`.** It holds 892 generated Wix redirects. New redirects go
  in `auditRedirects` in `next.config.ts`, which is applied *before* the generated set so it wins.
- **`npm run build` fetches live Sanity data.** `ENOTFOUND *.apicdn.sanity.io` is a network
  failure, not your code.
- **FAQ content has two sources** — see `/sanity-content`. Getting this wrong silently discards
  editors' work.
