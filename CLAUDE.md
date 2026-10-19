# Fruition website

Next.js 16 (App Router) + React 19, content from Sanity, deployed as a **single Cloudflare
Worker** (`fruition-landing`) via OpenNext. About 106 marketing pages, 47 Google Ads landing pages
(`/au`, `/uk`, `/us`), the public Implementation Calculator assistant (`/ask-fruit`), an auth-gated staff portal at `/internal`,
the embedded Sanity Studio at `/studio`, and API routes for leads, booking (Calendly), monday.com,
RB2B and Zernio.

- Orientation: [README.md](README.md)
- Full map: [docs/architecture.md](docs/architecture.md)
- Hosting, deploy, rollback, env vars: [docs/cloud.md](docs/cloud.md)

**This repository is public.** Never commit secret values, `.env*` (except `.env.example`) or
`.dev.vars`. Name env vars; do not paste them.

## Commands

```bash
npm run dev          # localhost:3000 (copy .env.example to .env.local first)
npm test             # vitest, ~470 tests, ~6s. Run this.
npm run typecheck    # tsc against tsconfig.ci.json (CI gate)
npm run lint         # eslint (CI gate, must stay at 0 errors)
npm run build        # next build (needs live Sanity access, see below)
npm run preview      # OpenNext build + local Workers runtime
```

**Verify with `npm test && npm run typecheck && npm run lint`** before saying a change is done.
All three are fast; `npm run build` takes about 2 min and is only needed for build-shape changes
(next.config, deps, route structure). Use `npm run preview`, not `next dev`, to debug anything that
depends on the Workers runtime.

## Gotchas that cost real time

- **`production` is the mainline branch. There is no `main`.** Branch from it, PR into it,
  squash-merge. Merging deploys to the live site automatically. Feature branches drift behind fast;
  rebase before you assume a conflict is real.
- **`npm run build` fetches live Sanity data.** `getaddrinfo ENOTFOUND *.apicdn.sanity.io` is a
  network failure, not your code. Retry before debugging.
- **Never call `headers()` or `cookies()` in `src/app/layout.tsx`.** A dynamic API in the root
  layout opts *every* route out of static rendering. It held the whole site at `no-store` with
  1.4 to 2.3s TTFB until 2026-08-21. Check the build's static/dynamic counts after layout changes;
  fetch request-specific data client-side (see `api/visitor-region`).
- **The Worker is near Cloudflare's 10 MiB limit.** Every new dependency and route handler counts.
  Prefer dynamic imports for heavy client libraries and check the size in the deploy output.
- **Keep `src/middleware.ts`; never migrate to `proxy.ts`.** `proxy.ts` compiles to the Node
  runtime, which the OpenNext Cloudflare adapter rejects.
- **Caching:** the root layout's `revalidate = 60` sets every page's TTL. `revalidatePath` only works
  because `NEXT_TAG_CACHE_KV` is bound; use `revalidateBlogPaths()` in `src/lib/revalidateSite.ts`
  and pass concrete URLs untyped. There is no Sanity webhook.
- **Never hand-edit `src/redirects.ts` (892 Wix redirects) or `src/tagRedirects.ts`.** New
  redirects go in `auditRedirects` in `next.config.ts`.
- **New pages must be added to `STATIC_PATHS` in `src/app/sitemap.ts` by hand.**
- **Unknown `/partnerships/<slug>` returns 200 with an empty shell, not a 404.** Link checkers
  cannot catch nav links pointing at pages that do not exist. Verify page files exist by hand.
- **Portal auth is per page, not middleware.** Every `/internal` page must call
  `requirePortalUser()` and every `/api/internal` route `getPortalApiUser()`.
- **FAQs have two Sanity sources** (`faqTabs` on the page vs central `faqItem`). Always use
  `resolveFaqTabs()`; FAQ JSON-LD comes only from `FaqAccordion`.
- **Ad landing pages (`src/app/{au,uk,us,sea}`) bypass the root layout.** Layout-level changes (tags,
  banners, nav) do not reach them; they use `src/lib/landingPage.ts`. Every one must have a `route.ts`
  calling `landingPageResponse` with a unique `adwords-lp-*` source and its region, next to a
  `content.ts` document. That is how the tests find them, in any folder.
- **Every page ships a complete `<head>`, enforced in CI.** Site pages: export `metadata` /
  `generateMetadata` built with `buildOgMetadata` (or `openGraph`), so shared links get their own
  card (`pageMetadata.test.ts`). Ad pages: `<html lang>`, title, meta description, `noindex`,
  exactly one `<h1>`. Favicon, Open Graph/Twitter card and GTM are added at serve time
  (`adLandingPageHead.test.ts`). Never hand-roll these tags, and never weaken those tests to get a
  page through.
- **Live systems:** forms, PR previews and local dev all hit the real monday boards, Calendly,
  Resend and Slack. Never submit junk. If a test must write to monday, clear any `people` column
  and delete the item immediately.
- **Marketa (`marketa-monorepo`) writes into this site's Sanity dataset and shares the portal
  Supabase `portal_drafts` table.** Do not rename `blogPost` fields, change the
  `blog-portal-<slug>` doc id rule, move `/post/<slug>`, or drop unknown keys from
  `portal_drafts.metadata`. Contracts: [docs/architecture.md §9](docs/architecture.md#9-marketa-contracts).
  No Marketa code lives in this repo any more; do not reintroduce it here.

## Non-negotiables

Any UI work follows [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md). The short version, enforced
by a hook on every edit under `src/`:

- Semantic tokens from `src/app/globals.css` only: no raw hex, no inline `style` for layout or type.
- Exactly three breakpoints: base, `md:` (768px), `lg:` (1024px).
- Poppins and JetBrains Mono only.
- Never rewrite page copy or Sanity content during visual work.
- **Supplied HTML is a reference, never code to ship.** HTML files, build packs, mockups or agency
  drops attached to a task give you the copy and the section structure only. Keep the copy
  verbatim, discard their CSS, inline styles, fonts, colours and breakpoints, and rebuild in this
  design system. This holds even when a brief says "serve verbatim" or "follow PR #N" (PR #296
  shipped 30 ad pages with agency CSS; PR #299 had to redo them). Google Ads landing pages under
  `src/app/{au,uk,us}/` use the shared theme in `src/lib/landingPageTheme.ts` and must pass
  `src/lib/landingPageLayout.test.ts`.
- **A UI change is not done until it works at 375, 768 and 1440 wide**: one column on mobile, no
  horizontal overflow (`scrollWidth <= innerWidth`), 44px tap targets. Check all three, not just
  desktop.

The internal portal (`/internal`) uses **shadcn/ui components only**, never hand-rolled equivalents.

## Where to look

| Task | Skill |
|---|---|
| Any UI or styling change | `/design-system` |
| Adding or editing a marketing page | `/page-authoring` |
| Sanity schemas, GROQ, cache revalidation | `/sanity-content` |
| Deploying, Workers runtime, KV bindings | `/cloudflare-deploy` |
| monday.com, Slack, RB2B, Supabase, Calendly | `/integrations` |
| Commit, PR, CI, squash-merge in one step | `/ship` |

## Google Ads (MCP server)

Fruition's Google Ads account **845-729-9561** (customer ID `8457299561`, AUD) is reachable
from Claude Code through the user-scope MCP server **`google-ads-fruition`** (tools
`search_search`, `metadata_get_resource_metadata`, `customers_list_accessible_customers`,
plus the write tools `mutate_mutate`, `mutate_set_status`, `mutate_set_campaign_daily_budget`).
It lives on Edward's machine, not in this repo. Setup, credentials and rebuild steps:
[docs/google-ads-mcp.md](docs/google-ads-mcp.md).

- **Use `google-ads-fruition`, not `google-ads`.** The plain `google-ads` server is the Kelin
  Studio one and cannot see Fruition's account.
- **Writes are dry runs by default** (`validate_only=true`). Show Edward exactly what will
  change, get a yes for that specific change, then repeat the call with `validate_only=false`.
  Live spend is roughly A$350/day across the AU, UK and US Search campaigns.
- Look up IDs with `search_search` first and check fields with
  `metadata_get_resource_metadata`. Never guess resource names.
- Experiment (trial) campaigns reject status, budget and date changes. Change the base
  campaign or end the experiment instead.
- Site conversion tags live in GTM container **GTM-PF6XWTL6**, not in this repo. The Google
  Ads conversion ID is `AW-1003400430`.
