# Cloud, hosting and deploy

How the Fruition website is hosted, built, deployed, rolled back and configured. Everything that
serves traffic runs on **Cloudflare**; content and data live in SaaS services (Sanity, Supabase,
monday.com and others). For how the code is organised see [`architecture.md`](./architecture.md).

> **This repository is public.** This file names secrets; it never contains their values. Values
> live in Cloudflare (write-only once set) and in the team password manager.

---

## 1. Platform at a glance

| Concern | Where | Notes |
|---|---|---|
| Compute | Cloudflare Worker **`fruition-landing`** | The whole Next.js app, built by OpenNext |
| Static assets | Workers Static Assets (`ASSETS`) | `.open-next/assets`, served before the Worker runs |
| ISR + tag cache | Workers KV (`NEXT_INC_CACHE_KV`, `NEXT_TAG_CACHE_KV`) | Regional cache in front of KV, `long-lived` mode |
| Images | Cloudflare Images (`IMAGES`) | |
| OG cards | Cloudflare Worker **`fruition-og-card`** | `workers/og-card/`, route `www.fruitionservices.io/og-card*` |
| DNS + TLS | Cloudflare zones `fruitionservices.io`, `fruitionmonday.com` | Fruition Services Cloudflare account |
| CI/CD | GitHub Actions | `ci.yml`, `deploy.yml` |
| CMS | Sanity `bt6nb58h` / `production` | Studio embedded at `/studio` |
| Database | Supabase (portal project; Marketa's brain project read-only) | Migrations applied by hand |

**Not Vercel.** The website has never needed Vercel since moving to Cloudflare (the old `.vercelignore`
was deleted in October 2026). (The separate Marketa service does run on Vercel.)

---

## 2. The Worker (`wrangler.jsonc`)

| Setting | Value | Why |
|---|---|---|
| `name` | `fruition-landing` | |
| `main` | `.open-next/worker.js` | Built by OpenNext |
| `routes` | `fruitionservices.io/*`, `www.fruitionservices.io/*`, `fruitionmonday.com/*`, `www.fruitionmonday.com/*` | Non-www and legacy hosts are 301'd to www by `src/middleware.ts` |
| `workers_dev`, `preview_urls` | `true` | Needed for per-PR preview URLs. Reasserted on every deploy |
| `keep_names` | `false` | esbuild's `keepNames` injects `__name()`, which breaks next-themes' inline script (`__name is not defined`) site-wide |
| `compatibility_date` | `2025-03-25` | |
| `compatibility_flags` | `nodejs_compat`, `global_fetch_strictly_public` | Node built-ins (crypto, Buffer) used by Sanity writes, Supabase and auth |
| `kv_namespaces` | `NEXT_INC_CACHE_KV`, `NEXT_TAG_CACHE_KV` | ISR page cache and tag cache. **Removing the tag cache makes `revalidatePath` a silent no-op** |
| `services` | `WORKER_SELF_REFERENCE` → `fruition-landing` | Used by OpenNext |
| `vars` | `NEXT_PUBLIC_OAIQ_PIXEL_ID` | OpenAI ads pixel id (public) |
| `images` | `IMAGES` | |

`open-next.config.ts`: `incrementalCache: withRegionalCache(kvIncrementalCache, { mode:
"long-lived" })`, `tagCache: kvNextTagCache`. D1 would be a better tag cache, but the deploy token
has no D1 permissions; R2 is not enabled on the account.

**Size limit.** Workers have a 10 MiB compressed limit and this one is close to it. A new heavy
dependency can fail the deploy; see [`architecture.md` §7.3](./architecture.md#73-worker-size-budget).

---

## 3. Build, deploy and rollback

### 3.1 Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Next dev server on Node. `predev` regenerates `public/ask-fruit-knowledge.json` |
| `npm run build` | `next build` (reads live Sanity) |
| `npm run preview` | OpenNext build, then the real Worker in the local Workers runtime. Use this to debug anything runtime-shaped |
| `npm run cf-build` | OpenNext build only |
| `npm run upload` | Build + upload a new Worker **version** without moving traffic (PR previews) |
| `npm run deploy` | Build + deploy to the live Worker (production) |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` (gitignored) |

### 3.2 CI/CD
| Workflow | Trigger | Does |
|---|---|---|
| `ci.yml` | PR and push to `production` | Typecheck, test, lint (Node 22), in parallel |
| `deploy.yml` → `preview` | Every PR | `npm run upload`, comments the `*.workers.dev` preview URL on the PR |
| `deploy.yml` → `deploy` | Push to `production` | `npm run deploy` |
| `vault-sync.yml` | Every push | Mirrors commit metadata to an external notes vault. Not part of the site |

`deploy.yml` needs GitHub **secrets** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and
repo **variables** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`NEXT_PUBLIC_SANITY_API_VERSION` (inlined at build time). **CI does not set runtime secrets**; they
must already exist on the Worker.

### 3.3 Normal release
1. PR into `production`; wait for CI and open the preview URL from the PR comment.
2. Squash-merge. `deploy.yml` deploys within a few minutes.
3. Smoke-test production: home, a region page, `/pricing`, a blog post, `/contact-us#book`, and
   `/internal` login if you touched the portal.

### 3.4 Rollback
- **Preferred:** revert the merge commit on `production` (PR or `git revert`); CI redeploys.
- **Emergency:** `npx wrangler rollback` restores the previous Worker version immediately
  (`npx wrangler deployments list` to see versions). Then revert in git so the next deploy does not
  reintroduce the change.
- ISR pages cached in KV may keep serving the bad render for up to 60s after a rollback.

### 3.5 Things CI does not deploy
- **`fruition-og-card` Worker**: `cd workers/og-card && npm install && npx wrangler deploy` with a
  login on the Fruition account. Bump `OG_CARD_VERSION` in `src/lib/metadata.ts` after a design
  change.
- **Supabase migrations**: paste into the portal project's SQL editor. Keep the file in
  `supabase/migrations/` as the record.
- **Sanity schema**: ships with the app (embedded Studio). The hosted Studio on sanity.io, if used,
  needs `npx sanity deploy`.
- **Runtime secrets**: `npx wrangler secret put NAME` or the Cloudflare dashboard.

---

## 4. Environments

| Environment | URL | Secrets from |
|---|---|---|
| Local, Node | `npm run dev` → http://localhost:3000 | `.env.local` (copy `.env.example`) |
| Local, Workers runtime | `npm run preview` | `.dev.vars` |
| PR preview | `https://<version>-fruition-landing.<subdomain>.workers.dev` (from the PR comment) | Same Worker secrets as production |
| Production | https://www.fruitionservices.io | Worker secrets |

**PR previews share production secrets and data.** A preview talks to the live Sanity dataset,
Supabase, monday boards and Calendly. Treat it as production when testing forms or the portal.

---

## 5. Environment variables

`.env.example` at the repo root lists every name. What each group does:

| Group | Variables | Used by |
|---|---|---|
| Sanity | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` (build-time), `SANITY_WRITE_TOKEN` | Reads everywhere; writes from the portal, onboarding webhook, social media uploads |
| Site | `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, short links (defaults to production) |
| Portal Supabase | `PORTAL_SUPABASE_URL`, `PORTAL_SUPABASE_ANON_KEY`, `PORTAL_SUPABASE_SERVICE_ROLE_KEY`, `PORTAL_ALLOWED_EMAIL_DOMAIN` | Auth and all portal data, Implementation Calculator logs, short links |
| Marketa | `MARKETA_SUPABASE_URL`, `MARKETA_SUPABASE_SERVICE_ROLE_KEY`, `MARKETA_URL` | Dashboard reads from the brain project; "content complete" webhook |
| OpenRouter | `OPENROUTER_API_KEY`, `ASK_FRUIT_MODEL`, `DESIGN_DOC_MODEL`, `LEAD_CLASSIFIER_MODEL`, `LEAD_CLASSIFIER_SPAM`, `MARKETA_SOCIAL_MODEL` | All LLM calls |
| Implementation Calculator limits | `ASK_FRUIT_ENABLED`, `ASK_FRUIT_IP_SALT`, `ASK_FRUIT_VISITOR_HOURLY_TURNS`, `ASK_FRUIT_VISITOR_DAILY_TURNS`, `ASK_FRUIT_IP_DAILY_TURNS`, `ASK_FRUIT_DAILY_BUDGET_USD` | Kill switch and abuse limits |
| monday.com | `MONDAY_API_TOKEN`, `MONDAY_READ_TOKEN`, `MONDAY_WEBHOOK_SECRET`, `MONDAY_LEADS_BOARD_ID`, `MONDAY_LEADS_GROUP_ID`, `MONDAY_LEADS_EMAIL_COLUMN`, `MONDAY_LEADS_NOTES_COLUMN`, `MONDAY_LEADS_COMPANY_COLUMN` | Leads, RB2B board, onboarding |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN`, `SLACK_LEADS_CHANNEL_ID`, `INTERNAL_API_KEY` | Lead fallback, RB2B alerts, `slack-admin` |
| Email | `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | Contact form |
| Calendly | `CALENDLY_API_TOKEN`, `CALENDLY_WEBHOOK_SECRET`, `SCHEDULER_TEST_MODE` (local only) | Booking widget, availability, webhook |
| RB2B | `RB2B_WEBHOOK_SECRET`, `REACHLY_API_KEY`, `BRANDFETCH_CLIENT_ID` | Visitor identification webhook and enrichment |
| Zernio | `ZERNIO_API_KEY`, `ZERNIO_DASHBOARD_URL`, `ZERNIO_{X,LINKEDIN,INSTAGRAM,PINTEREST,REDDIT,YOUTUBE}_ACCOUNT_ID`, `ZERNIO_GBP_ACCOUNT_ID`, `ZERNIO_GBP_{AU,UK,US}_ACCOUNT_ID`, `ZERNIO_PINTEREST_BOARD_ID`, `ZERNIO_REDDIT_SUBREDDIT`, `BLOG_AUTO_SOCIAL_DRAFTS` | Social composer and blog social drafts |
| Analytics | `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `GOOGLE_SA_KEY_B64`, `UMAMI_API_KEY`, `UMAMI_API_URL`, `UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Portal dashboard; client Umami script |
| Misc | `DESIGN_STUDIO_URL`, `NAV_V3_PREVIEW` | Portal design studio link; nav preview |

Notes:
- `NEXT_PUBLIC_*` values are inlined at **build** time. In CI only the three Sanity ones are passed,
  so `NEXT_PUBLIC_UMAMI_*` set as Worker secrets does not reach the browser bundle.
- Several secrets are **shared with Marketa** (Vercel): `SANITY_WRITE_TOKEN`, `PORTAL_SUPABASE_*`,
  `MARKETA_SUPABASE_*`, `ZERNIO_*`, `OPENROUTER_API_KEY`, the Slack bot token. Rotate in both places.

---

## 6. Domains and DNS

- `fruitionservices.io` zone: apex and `www` routed to `fruition-landing`; `www.fruitionservices.io/og-card*`
  routed to `fruition-og-card` (more specific route wins).
- `fruitionmonday.com` zone (legacy Wix domain): routed to the same Worker, which 301s to www.
- `fruition-services.io` hosts are also 301'd by middleware if they reach the Worker.
- Cloudflare's **managed robots.txt must stay off**; the app serves its own `/robots.txt`.
- After changing site-wide cache headers, purge the zone once in the Cloudflare dashboard.

---

## 7. Handover checklist (accounts and access)

A new owner needs, at minimum:

- [ ] GitHub: admin on `Fruition-Service/fruition-website-monorepo` (and `marketa-monorepo` if they
      will touch the blog pipeline).
- [ ] Cloudflare: member of the Fruition Services account with Workers, KV and DNS rights. Rotate
      `CLOUDFLARE_API_TOKEN` in GitHub secrets to a token they control.
- [ ] Sanity: admin on project `bt6nb58h`.
- [ ] Supabase: member of the portal project (and the Marketa brain project).
- [ ] Password manager entry with every value in `.env.example` (Worker secrets cannot be read back
      from Cloudflare).
- [ ] monday.com, Calendly (shared global account), OpenRouter, Zernio, Resend, RB2B, Google Cloud
      service account (GA4/GSC), Umami, GTM.
- [ ] A wrangler login on the Fruition account for the hand-deployed `fruition-og-card` Worker.
