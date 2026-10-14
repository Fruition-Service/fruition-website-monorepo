# fruition-website-monorepo

The website and staff portal for **Fruition Services**, live at **https://www.fruitionservices.io**.

One Next.js 16 app, deployed as one Cloudflare Worker, that serves:

- **The marketing site**: about 106 pages (practices, platforms, industries, region pages, partner
  pages, pricing, blog) plus 47 Google Ads landing pages under `/au`, `/uk`, `/us`.
- **Ask Fruit**: a public AI assistant (`/ask-fruit` and a site-wide launcher).
- **The staff portal** at `/internal` (Google SSO, `@fruitionservices.io` only): blog editor,
  social composer, design docs, invoices, QR codes, team and onboarding.
- **Sanity Studio** at `/studio`.
- **API routes and webhooks** for lead capture, booking (Calendly), monday.com, RB2B and Zernio.

| Doc | Read it for |
|---|---|
| [docs/architecture.md](docs/architecture.md) | How the system fits together: routes, content, data, auth, caching, integrations, known issues |
| [docs/cloud.md](docs/cloud.md) | Hosting, deploy, rollback, Cloudflare bindings and the full environment variable inventory |
| [CLAUDE.md](CLAUDE.md) | Working rules and gotchas (read by AI agents via `AGENTS.md`, and worth reading as a human) |
| [DESIGN.md](DESIGN.md), [PRODUCT.md](PRODUCT.md) | Design system and brand rules every UI change must follow |
| `docs/*.md` (others) | Topic notes: booking, RB2B, social composer, Google Ads MCP, portal auth setup. `docs/archive/` is historical only |

> **This repository is public.** Never commit secret values, `.env*` or `.dev.vars` files. Docs
> name environment variables; values live in Cloudflare and in the team password manager.

## Quick start

Requirements: Node 22 (what CI uses) and npm. Network access to Sanity (the build reads live
content).

```bash
npm install                 # also copies the pdf.js worker into public/
cp .env.example .env.local  # names only; fill in what you need
npm run dev                 # http://localhost:3000
```

The four values already filled in `.env.example` (Sanity project, dataset, API version, site URL)
are enough for the public marketing pages. The portal, Ask Fruit, booking, lead forms and
social tools each need their own secrets; see the inventory in
[docs/cloud.md §5](docs/cloud.md#5-environment-variables). Cloudflare Worker secrets cannot be read
back once set, so get the values from the password manager, not from the dashboard.

## Everyday commands

```bash
npm test                    # vitest, ~470 tests, ~6s
npm run typecheck           # tsc against tsconfig.ci.json (CI gate)
npm run lint                # eslint (CI gate, must stay at 0 errors)
npm run build               # next build, ~2 min, reads live Sanity
npm run preview             # OpenNext build, then run the real Worker locally
```

**A change is done when `npm test && npm run typecheck && npm run lint` passes**, and, for any UI
change, the page works at 375, 768 and 1440 px wide.

## How changes reach production

```
feature branch ──PR──▶ production
   │                    │
   │ CI: typecheck,     │ push to production
   │ test, lint         ▼
   │                 deploy.yml: npm run deploy ──▶ Worker "fruition-landing" (live)
   ▼
deploy.yml: npm run upload ──▶ preview URL commented on the PR (production untouched)
```

- **`production` is the mainline branch. There is no `main`.** Branch from `production`, open a PR
  into it, squash-merge when CI is green. Feature branches drift behind quickly; rebase often.
- Merging to `production` deploys automatically within a few minutes.
- Rollback: revert the merge commit (CI redeploys), or in an emergency
  `npx wrangler rollback` to the previous Worker version. See
  [docs/cloud.md §3](docs/cloud.md#3-build-deploy-and-rollback).
- Not deployed by CI: the Open Graph card Worker in `workers/og-card/` (deploy by hand, see its
  README) and Supabase migrations (applied by hand in the SQL editor).

## Repository layout

```
src/
  app/              routes: marketing pages, /au /uk /us ad pages, /internal portal, /studio, /api
  components/       sections/ (marketing building blocks), home/, region/, ask-fruit/,
                    internal/ (portal), ui/ (shadcn/ui, portal only)
  data/             code-owned copy: practice pages, region pages, messaging channels, offices, nav
  features/content/ Sanity loaders
  lib/              server-side integration clients (monday, Calendly, Zernio, Supabase auth, ...)
  sanity/           schemas, GROQ queries, Studio config
  middleware.ts     canonical host 301s, markdown twins
  redirects.ts      892 generated Wix redirects (never hand-edit)
workers/og-card/    separate Worker that renders og:image cards (deployed by hand)
supabase/           SQL migrations for the portal Supabase project (applied by hand)
scripts/            one-off migrations, Sanity seeds, generators, Playwright QA scripts
docs/               architecture, hosting and topic notes; docs/archive is historical
.claude/            agent tooling: skills, hooks (design guard), /ship command
```

## Accounts and services

| Service | Used for | Where configured |
|---|---|---|
| GitHub `Fruition-Service/fruition-website-monorepo` | Code, CI, deploys | Actions secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; variables `NEXT_PUBLIC_SANITY_*` |
| Cloudflare (Fruition Services account) | Worker hosting, DNS for `fruitionservices.io` and `fruitionmonday.com`, KV cache | `wrangler.jsonc`, Worker secrets |
| Sanity project `bt6nb58h`, dataset `production` | All CMS content | Schemas in `src/sanity/schemas/` |
| Supabase "portal" project | Portal auth, drafts, social compositions, invoices, design docs, Ask Fruit logs, short links | `PORTAL_SUPABASE_*` |
| Supabase "brain" project (owned by Marketa) | Read-only: Marketa drafts, AEO and competitor data for the dashboard | `MARKETA_SUPABASE_*` |
| monday.com | Lead boards, RB2B board, team onboarding | `MONDAY_*` |
| Calendly (shared global account) | Booking widget and scheduling API | `CALENDLY_*` |
| OpenRouter | All LLM calls (Ask Fruit, design docs, social captions, lead classifier) | `OPENROUTER_API_KEY` |
| Zernio | Social scheduling | `ZERNIO_*` |
| Resend | Contact form email | `RESEND_API_KEY` |
| Google Tag Manager `GTM-PF6XWTL6` | GA4, Google Ads conversions, Calendly conversion | GTM, not this repo |
| Microsoft Clarity, RB2B, OpenAI ads pixel, Umami | Analytics and visitor identification | `src/app/layout.tsx` |

## Related repositories

| Repo | Relationship |
|---|---|
| `marketa-monorepo` (private, Vercel) | The AI blog and outbound pipeline. Publishes blog posts into the same Sanity dataset and shares the portal Supabase `portal_drafts` table. Read [docs/architecture.md §9](docs/architecture.md#9-marketa-contracts) before changing blog schemas or the portal blog editor |
| `senzo-website-monorepo` | Sister site (senzo.com.au) on the same stack, without CMS |
| `oglabs-website-monorepo` | Sister site (oglabs.io), being rebuilt on the same stack |
| `ile-regional-linker`, `supabase-keepalive` | Small Cloudflare Workers around the lead pipeline and Supabase free tier |
