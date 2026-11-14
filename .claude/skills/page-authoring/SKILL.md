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

1. Create `src/app/<route>/page.tsx` with `metadata`.
2. Load content server-side; push interactivity into a `"use client"` child.
3. Reuse sections from `src/components/sections/`.
4. **Add the route to `src/app/sitemap.ts`.** It is not automatic.
5. **If the page's hero container is not `max-w-[1148px] px-4`, register its shell in
   `src/lib/pageShell.ts`.** The breadcrumb bar renders above `<main>` and cannot read the
   page's container, so it takes the width from that registry — an unregistered page gets the
   1148px default and its trail hangs away from the page copy.
6. If it replaces an existing URL, add a redirect to `auditRedirects` in `next.config.ts`.
7. Verify: `npm test && npm run typecheck && npm run lint`.

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
