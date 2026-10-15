# Architecture

System architecture for the Fruition Services website: what runs where, how the code is
organised, where content and data live, how auth and caching work, and the contracts with other
systems. For hosting, deploy, rollback and the environment variable inventory see
[`cloud.md`](./cloud.md). For a first-day orientation see the [README](../README.md).

> **Accuracy contract.** Every claim here was verified against `production` on the date in the
> footer. If you change something this file describes, fix this file in the same PR. A stale
> architecture doc is the most expensive thing in this repo, because every new engineer and every
> agent starts here.

---

## 1. System overview

One **Next.js 16 (App Router)** application on **React 19**, built with **OpenNext** and deployed
as a **single Cloudflare Worker** (`fruition-landing`). It serves six surfaces:

| Surface | Path | Notes |
|---|---|---|
| Marketing site | most routes | ~106 pages, statically rendered with 60s ISR |
| Ad landing pages | `/au/*`, `/uk/*`, `/us/*` | 47 route handlers returning HTML strings; bypass the React layout |
| Implementation Calculator | `/ask-fruit`, launcher on every page | Public AI assistant, streams from OpenRouter |
| Staff portal | `/internal/*` | Supabase Auth + Google SSO, `@fruitionservices.io` only |
| Sanity Studio | `/studio` | Embedded Studio, gated by Sanity's own login |
| API + webhooks | `/api/*`, `/s/<code>` | Leads, booking, the Implementation Calculator, portal APIs, inbound webhooks, link shortener |

```
                         ┌─────────────────────────────────────────────────────────┐
 Visitors ──────────────▶│ Cloudflare Worker "fruition-landing" (Next.js via OpenNext)
 www.fruitionservices.io │                                                         │
 (+ legacy domains 301)  │  marketing pages ─ read (CDN) ─────────▶ Sanity bt6nb58h │◀── Marketa (Vercel)
                         │  /studio ───────── write ──────────────▶   "production"  │    publishes posts
                         │  /internal ─────── write (one token) ──▶                 │
                         │                                                         │
                         │  ISR + tag cache ──────────────────────▶ Workers KV      │
                         │  /internal, /api ──────────────────────▶ Supabase portal │◀── Marketa shares
                         │  /internal dashboard ── read ──────────▶ Supabase brain  │    portal_drafts
                         │  /api leads + booking ─────────────────▶ monday, Calendly, Resend, Slack
                         │  /ask-fruit, design docs, captions ────▶ OpenRouter      │
                         │  social composer ──────────────────────▶ Zernio          │
                         └─────────────────────────────────────────────────────────┘
 www.fruitionservices.io/og-card* ──▶ separate Worker "fruition-og-card" (workers/og-card)
```

Tagging (GA4, Google Ads conversions, Calendly conversion) lives in **GTM `GTM-PF6XWTL6`**, not in
this repo. The layout loads GTM, Microsoft Clarity, RB2B, the OpenAI ads pixel and (if configured)
Umami; Clarity, RB2B and the pixel are skipped when the visitor declines cookies
(`src/components/CookieNotice.tsx`).

---

## 2. Request path and middleware

`src/middleware.ts` runs on every request the Worker handles:

1. **Canonical host.** 301s `fruitionservices.io` and the legacy hosts `fruitionmonday.com`,
   `www.fruitionmonday.com`, `fruition-services.io`, `www.fruition-services.io` to
   `https://www.fruitionservices.io` (same path).
2. **Markdown twins for agents.** For `/`, `/pricing` and `/about-us`, a request whose `Accept`
   prefers `text/markdown` gets a 307 to `/index.md`, `/pricing.md` or `/about-us.md`
   (`public/`). It must be a redirect, not a rewrite: Cloudflare serves `public/` files before the
   Worker runs, so a rewrite only works under `next dev`.

It stays `middleware.ts`, deprecated in Next 16 in favour of `proxy.ts`, **on purpose**: `proxy.ts`
always compiles to the Node.js runtime, which `@opennextjs/cloudflare` rejects.

Static files (`public/`, `/_next/static/*`) are served by Workers Static Assets before the Worker
runs. `public/_headers` marks `/_next/static/*` immutable.

---

## 3. Routes

There are no route groups; everything is flat under `src/app/`.

### 3.1 Marketing pages
| Family | Routes | Copy comes from |
|---|---|---|
| Home | `/` | `src/components/home/data.ts` (code) + Sanity logos, testimonials, offices, latest posts |
| Core | `/about-us`, `/careers`, `/contact-us`, `/customer-testimonials`, `/faqs`, `/fruition-team`, `/certifications-and-awards`, `/data-privacy`, `/thank-you` | Mixed code + Sanity |
| AI practice | `/ai-consulting/*`, `/ai-capability-assessment` (the design anchor page), `/ai-readiness-blueprint`, `/ai-strategy-and-execution` | Code (`src/data/practicePages/*`) |
| Platforms | `/atlassian-consulting/*`, `/hubspot-consulting/*`, `/monday-*` (consulting solutions, CRM, training, implementation consultants, `monday-for-*` verticals), `/implementation-packages` | Code + Sanity singletons |
| Industries | `/industries/*` | Code + Sanity |
| Integrations | `/integrations/*` (WhatsApp, LINE, Viber, Twilio, Zapier) | `src/data/messagingChannels/*` |
| Regions | `/monday-partner-{australia,india,philippines,singapore,uk,us}` | `src/data/regionPages.ts` merged with Sanity `locationPage` |
| Partners | `/partnerships/[slug]` + 22 named partner pages | Sanity `partnershipPage` / `aiPartnerPage` |
| Pricing | `/pricing` (licence procurement page) | `src/data/practicePages/licensing.ts`, overridden field by field by Sanity `licensingPage` |
| Blog | `/consulting-blog`, `/consulting-blog/categories/[slug]`, `/post/[slug]`, `/author/[slug]` | Sanity `blogPost`, `teamMember` |
| Legal | `/legal/*`, `/terms-and-conditions` | Code + PDFs in `public/` |
| Sandbox | `/contactustest` | Every historical version of the booking card; writes are suppressed |

### 3.2 Ad landing pages (`src/app/{au,uk,us}/*`)
Each is a `route.ts` plus a `content.ts` holding an HTML string, served through
`landingPageResponse()` in `src/lib/landingPage.ts`. It injects GTM, the region's booking calendar,
form wiring to `/api/leads`, OG tags and the shared theme (`src/lib/landingPageTheme.ts`, which
mirrors `globals.css` by hand). They bypass `src/app/layout.tsx`, so site-wide layout changes do
not reach them. `src/lib/landingPageLayout.test.ts` must pass.

### 3.3 Utility routes
- `/s/[code]`: link shortener (Supabase `short_links`), 302, counts the click, `noindex`.
- `/robots.txt` (route handler, `force-static`): AI-crawler allow group, disallows `/internal/`,
  `/studio/`, `/s/`, `/api/ask-fruit/`. Cloudflare's managed robots.txt must stay **off** for the
  zone.
- `/sitemap.xml` (`src/app/sitemap.ts`): a hand-kept `STATIC_PATHS` list plus Sanity posts,
  authors, solution and partnership pages. **New pages must be added by hand.**
- Agent-facing files in `public/`: `llms.txt`, markdown twins, `.well-known/ard.json`,
  `.well-known/agent-skills/index.json`. Never claim a capability there that the site lacks.

### 3.4 API routes (`src/app/api/`)
| Group | Routes | Purpose |
|---|---|---|
| Leads | `contact`, `leads` | Contact form (Resend email must succeed, then monday, Slack fallback); CRO and ad page forms (honeypot `website`) |
| Booking | `scheduling/availability`, `scheduling/lead`, `scheduling/book`, `scheduling/booked`, `visitor-region` | Live Calendly slots by region, record the lead on the ILE board, book, mark "Meeting Booked". `visitor-region` exists so the root layout never calls `headers()` |
| Implementation Calculator | `ask-fruit/chat`, `ask-fruit/evaluations` | SSE chat (10s heartbeat), evaluation log. Evaluations list/detail/update share one route to save Worker size |
| Webhooks | `webhooks/calendly`, `webhooks/monday`, `webhooks/rb2b` | Calendly `invitee.created` → ILE board (HMAC); monday Team Onboarding `create_item` → Sanity `teamMember`; RB2B visitor → monday RB2B board + Slack |
| Portal | `internal/*` | Blog, social composer, design docs, invoices, onboarding, team, author link. Session-gated with `getPortalApiUser()` |
| Admin | `internal/slack-admin` | Bearer `INTERNAL_API_KEY`; lists and deletes the bot's own Slack messages |

There is **no** inbound Slack route, no Sanity revalidation webhook, and none of the old Marketa
routes (`monday-blog`, `slack-blog`, `sanity-ingest`).

### 3.5 The staff portal (`/internal`)
| Area | Routes | What it does |
|---|---|---|
| Dashboard | `/internal` | GA4, Search Console, blog performance, Umami, AEO visibility and competitor data (from the Marketa brain), "Needs you" list |
| Blog | `/internal/blog`, `new`, `[draftId]/edit`, `post/[docId]/edit`, `monday/[pulseId]/edit` | TipTap editor over `portal_drafts`, publish to Sanity, Zernio social drafts per post |
| Social | `/internal/social`, `new`, `[id]` | Standalone Zernio composer (`social_compositions`), performance views |
| Implementation Calculator | `/internal/ask-fruit` | Review public conversations |
| Design docs | `/internal/design`, `new`, `[docId]` | LLM restyles PDF/DOCX/PPTX into branded HTML (`src/lib/design/*`, `design_docs`) |
| Design studio | `/internal/design/studio` | Redirects to an external studio at `DESIGN_STUDIO_URL` |
| Invoices | `/internal/invoices`, `new`, `[id]`, `import` | Invoices in `fruition_invoices`; Clockify **PDF** import parsed in the browser; PDFs via pdfmake |
| QR codes | `/internal/qr` | QR generator |
| Team, Onboarding | `/internal/team`, `/internal/onboarding` | Edit Sanity `teamMember`; create a monday People board item |
| Developer handover | `/internal/handover`, `/internal/handover/doc` | Onboarding guide for developers (architecture, hosting, DNS, integrations, Claude Code + MCP setup). A standalone HTML document in `handover/doc/content.ts`, framed in the portal shell |

Every page is `force-dynamic` and calls `requirePortalUser()`. **Portal UI uses shadcn/ui only**
(`src/components/ui/`, `base-nova` style on `@base-ui/react`), with its own neutral theme in
`globals.css`, isolated from the marketing palette.

---

## 4. Content model (Sanity)

- **Project `bt6nb58h`, dataset `production`.** Schemas in `src/sanity/schemas/` (registered in
  `index.ts`); Studio structure in `src/sanity/structure.ts`.
- **Read client** (`src/sanity/client.ts`): `useCdn: true`, and **every result passes through
  `rewriteBookingLinks()`**, which turns any Calendly URL stored in content into `/contact-us#book`
  (except `siteSettings.calendlyLink`). Content cannot reintroduce a raw Calendly link.
- **Write client** (`src/lib/sanityWriteClient.ts`): one shared `SANITY_WRITE_TOKEN`. Staff publish
  through the portal and never need a paid Sanity seat.
- **Queries**: `src/sanity/queries.ts` and `src/features/content/loaders.ts`. GROQ projections are
  not type-checked: a field missing from the projection is `undefined` at runtime.

### 4.1 Document types
`siteSettings` (nav, offices, sticky CTA, SEO defaults), `blogPost`, `blogCategory`, `teamMember`,
`caseStudy`, `faqItem`, `closingCta`, `proofStats`, `solutionPage`, `partnershipPage`,
`aiPartnerPage`, `locationPage`, `industryPage`, `servicePage`, `page`, `industryLogoSet`,
`regionLogoSet`, `voiceGuide` (read by Marketa), and singletons `homePage`,
`implementationPackagesPage`, `mondayTrainingPage`, `mondayImplementationConsultantsPage`,
`makePartnersPage`, `licensingPage`.

### 4.2 How pages are composed
**Pages are hand-authored React server components.** A route folder has a `page.tsx` (metadata +
data loading) and usually a `<Name>Content.tsx` client component. Shared building blocks live in
`src/components/sections/`. Sanity supplies data (logos, testimonials, FAQ tabs, posts, region
overrides); much of the copy lives in code (`src/data/*`, `src/components/home/data.ts`) with
Sanity overriding it where an editor field exists.

There is **no generic block renderer**. Block object types (`heroBlock`, `faqBlock`, ...) exist as
data shapes, and `homePage.contentBlocks` is read for specific blocks, but adding a block in Sanity
does not render anything.

### 4.3 Adding a marketing page
1. `src/app/<route>/page.tsx` exporting `metadata` (use `buildOgMetadata()` from
   `src/lib/metadata.ts`) and a server component.
2. Compose from `src/components/sections/`; follow `DESIGN.md`; check 375 / 768 / 1440.
3. Add the path to `STATIC_PATHS` in `src/app/sitemap.ts`.
4. If it replaces an old URL, add a redirect to `auditRedirects` in `next.config.ts`.
5. If it should appear in the nav, edit `siteSettings` navigation in Sanity.

### 4.4 Content traps
- **FAQs have two sources**: a page document's own `faqTabs` field and central `faqItem`
  documents. Always go through `resolveFaqTabs()` (`src/sanity/groupFaqs.ts`). FAQ JSON-LD is
  emitted by `FaqAccordion` from exactly the tabs it renders, never site-wide.
- **The implementation count ("900+")** appears in code strings, Sanity strings and the
  `proofStats` singleton. Change all three together.
- **Videos** added in Sanity emit no `VideoObject` schema until `scripts/sync-video-catalog.mjs`
  regenerates `src/lib/videoCatalog.generated.ts`.
- **Blog body images must be Sanity-hosted.** A remote `![](url)` publishes as a link; the publish
  paths sideload images into Sanity first.
- **NDA clients** must never appear in client lists or logo walls (`src/app/monday-consulting-solutions/catalog/data/clients.ts`), even when
  the list is regenerated from the CRM.

---

## 5. Data (Supabase)

Two Supabase projects, both reached server-side only.

**Portal project** (`PORTAL_SUPABASE_*`, owned by this repo, shared with Marketa):

| Table / RPC | Used by |
|---|---|
| `authors` | Portal user profile, linked to a Sanity `teamMember` |
| `portal_drafts` | Blog drafts. **Shared with Marketa**, see §9 |
| `social_compositions` | Standalone social composer |
| `design_docs` (+ templates) | Design docs |
| `fruition_invoices`, `fruition_consultant_profiles` | Invoices |
| `ask_fruit_evaluations`, `ask_fruit_turns`, RPC `ask_fruit_usage` | Implementation Calculator logs, rate and budget limits |
| `short_links`, RPC `register_short_link_click` | `/s/<code>` |

Access goes through the service-role client `getPortalAdmin()`; RLS is defence in depth only.
Migrations in `supabase/migrations/` are **applied by hand in the SQL editor**; there is no
Supabase CLI project. `short_links` has no migration in the repo (it was created by hand), and two
files share the `20260714000000` timestamp.

**Brain project** (`MARKETA_SUPABASE_*`, owned by `marketa-monorepo`): read-only from here via
PostgREST in `src/lib/marketaDrafts.ts` (`blog_drafts`) and `src/lib/marketaInsights.ts` (AEO and
competitor tables). It is a free-tier project kept awake by the `supabase-keepalive` Worker; if it
pauses, those reads return null and the dashboard panels go empty. Its migrations in
`supabase/migrations/2026061*` and `20260622*` belong to Marketa and are kept here for history.

---

## 6. Authentication

**Portal** (`src/lib/portalAuth.ts`): Supabase Auth with Google SSO plus email magic link.
- `/internal/auth/start` starts Google OAuth server-side (PKCE, `hd` hint), `/internal/auth/callback`
  exchanges the code and **enforces the domain server-side** (`isAllowedEmail()`, domain from
  `PORTAL_ALLOWED_EMAIL_DOMAIN`), signing out anyone else. Supabase cannot filter Google sign-ins
  by domain on its own.
- `/internal/auth/email` + `/internal/auth/confirm`: magic link, same domain check.
- Pages call `requirePortalUser()` (redirects to `/internal/login`); API routes call
  `getPortalApiUser()` (401). There is no middleware gate, so **every new portal page and API
  route must call one of them**.
- `ensureAuthorProfile()` upserts the user into `authors` on sign-in.

**Other gates**
- `/studio`: Sanity's own login (not the portal).
- Webhooks: Calendly HMAC; monday and RB2B shared secret in `?key=`; `slack-admin` Bearer key.
- Implementation Calculator: httpOnly visitor cookie, same-origin check, hashed IP and Supabase-backed per-visitor,
  per-IP and daily dollar budgets.

---

## 7. Rendering and caching

### 7.1 Static by default
Marketing routes are prerendered and served from the ISR cache. **A dynamic API (`headers()`,
`cookies()`) anywhere in `src/app/layout.tsx` opts every route out of static rendering.** Until
2026-08-21 a FAQ JSON-LD component did exactly that: 163 of 165 routes went dynamic, every
response was `no-store`, TTFB was 1.4 to 2.3s, and 124 generic FAQs were stamped onto 257 pages.
Anything request-specific in the layout must be fetched client-side (see `api/visitor-region`).

### 7.2 Revalidation
- The root layout sets `export const revalidate = 60`. The lowest `revalidate` in a route wins, so
  **every marketing page is ISR with `s-maxage=60`**, including `/post/[slug]` and `/author/[slug]`
  that declare 3600.
- OpenNext's incremental cache and tag cache are **Workers KV** (`NEXT_INC_CACHE_KV`,
  `NEXT_TAG_CACHE_KV`, see `open-next.config.ts`). KV was chosen over D1 because the deploy token
  has no D1 rights; KV propagation adds up to about 60s.
- On-demand: publishing from the portal calls `revalidateBlogPaths()` in
  `src/lib/revalidateSite.ts` (post, previous slug, blog index, category pattern, sitemap, home,
  author). `revalidatePath` only works because `NEXT_TAG_CACHE_KV` is bound; without it the call
  silently does nothing. Pass concrete URLs untyped; the `"page"` type is for route patterns.
- **There is no Sanity webhook.** Edits made directly in Studio, and Marketa publishes, appear
  within the 60s ISR window on the next request. Nothing calls `revalidateTag`.

### 7.3 Worker size budget
The Worker is close to Cloudflare's **10 MiB compressed limit** (about 115 KiB of headroom when
last measured). Every route handler and heavy dependency counts. Existing mitigations:
`optimizePackageImports`, dynamic imports for mammoth and charts, Implementation Calculator knowledge served as a
static asset (`public/ask-fruit-knowledge.json`, generated by `predev`/`prebuild`), combined API
routes, and the og-card renderer split into its own Worker. Check the size in the deploy output
when adding dependencies.

### 7.4 Open Graph images
Pages without their own image get a card from the separate `fruition-og-card` Worker
(`workers/og-card/`, route `www.fruitionservices.io/og-card*`), built by `ogCardUrl()` /
`buildOgMetadata()` in `src/lib/metadata.ts`. Cards are immutable per URL: bump `OG_CARD_VERSION`
after a design change. The Worker is deployed by hand.

---

## 8. Integrations

Server-side clients live in `src/lib/`. Env var names are in [`cloud.md` §5](./cloud.md#5-environment-variables).

| Integration | Code | Flow |
|---|---|---|
| **Lead capture** | `leadNotify.ts`, `leadClassify.ts` | Forms → Resend email (contact form) → LLM classifier (fails open) → monday **Fruition CRM / ILE** board for leads, **Website Enquiries** board for non-leads → Slack fallback if monday fails |
| **Booking** | `calendlyClient.ts`, `consultantAvailability.ts`, `consultants.ts`, `regionBooking.ts`, `components/sections/BookingSection.tsx` | Region from `cf-ipcountry`; consultant picker over the **shared global Calendly account** (never personal links); booking marks the ILE item "Meeting Booked". Booking CTAs scroll to the page's own `#book` section (`InPageBookingLinks`, capture-phase listener) |
| **RB2B** | `api/webhooks/rb2b`, `rb2b*.ts` | Identified visitor → Reachly/Brandfetch enrichment → monday RB2B board + Slack. Outbound email to those leads is Marketa's job |
| **monday team onboarding** | `api/webhooks/monday`, `api/internal/onboarding` | People board item → Sanity `teamMember`. Webhook subscriptions are created by `scripts/subscribe-monday-webhook.mjs` |
| **Zernio (social)** | `lib/social/zernio.ts` and siblings | One draft per platform (X, LinkedIn, Instagram, Pinterest, Reddit, YouTube, Google Business Profile UK/US/AU); media hosted on Sanity; short links per channel (Pinterest exempt). Automatic drafts per blog are **off** (`BLOG_AUTO_SOCIAL_DRAFTS`) |
| **LLMs** | `lib/askFruit/*`, `lib/design/*`, social captions, lead classifier | All via OpenRouter; models set by env with code defaults |
| **Analytics (portal)** | `googleAnalytics.ts`, `googleServiceAuth.ts`, `insights/umami.ts` | GA4 Data API and Search Console via a service account (GSC property is URL-prefix `https://www.fruitionservices.io/`), Umami API |

**Testing against live systems:** monday boards, Calendly, Resend and Slack are production. Never
submit junk to live forms. If a test must write to monday, clear any `people` column and delete the
item immediately.

---

## 9. Marketa contracts

`marketa-monorepo` (private, Vercel) generates blog posts, renders blog videos, scans AI citations
and runs RB2B outbound email. It talks to this site through shared data, not through API calls, so
these contracts are easy to break silently:

1. **Sanity `blogPost` schema.** Marketa writes `title`, `slug`, `body` (Portable Text with `block`,
   `image` with `alt`, `table`/`tableRow`, `videoEmbed`), `publishedAt`, `author`, `excerpt`,
   `industry`, `seoKeyword`, `seoTitle`, `seoDescription`, `mondayItemId`, `coverImage`. Renaming or
   removing any of these breaks its publishes. The `voiceGuide` document type is read by Marketa too.
2. **Document ids.** A post's Sanity id is `metadata.sanity_doc_id` if set, else
   `blog-portal-<slug>` (Marketa's monday path uses `blog-monday-<pulseId>`). Shared by
   `src/lib/blogDraftLink.ts`, `src/app/api/internal/blog/route.ts` and Marketa. Upserts refuse a slug
   owned by another document.
3. **`portal_drafts.metadata` is a shared JSON blob** that both apps read-modify-write. Marketa
   stores Slack thread ids, monday ids, review stages, cover image and `video_*` fields there. The
   portal editor must carry unknown keys through unchanged.
4. **"Mark content complete"** (`api/internal/blog/content-complete`) must write
   `review_stage: "content_complete"` before it calls Marketa (`MARKETA_URL`).
5. **URLs.** Posts live at `/post/<slug>`. Marketa polls that URL for a 200 before posting social,
   reads `/sitemap.xml` to decide which internal links survive in a draft, and deep-links to
   `/internal/blog/<uuid>/edit` and `/internal/blog/monday/<pulseId>/edit`.
6. **Zernio.** Both repos have their own copy of the Zernio client and find a blog's posts by
   `metadata.marketa*` keys. Keep platform keys and account env names in step.
7. **Shared credentials.** `SANITY_WRITE_TOKEN`, `PORTAL_SUPABASE_*`, `MARKETA_SUPABASE_*`,
   `ZERNIO_*`, `OPENROUTER_API_KEY` and the Slack bot token are set in both deployments. Rotating
   one means updating Cloudflare and Vercel.

Marketa code that used to live here (`src/lib/marketa/`, its webhooks and Google Docs) was removed
in July 2026. The leftovers (`make/`, `n8n/`, `scripts/marketa-harness/`, `scripts/brain-backfill.ts`
and the `marketa:*` / `brain:backfill` npm scripts) were deleted in October 2026. Nothing in this repo
generates or seeds Marketa content any more; that all lives in `marketa-monorepo`.

---

## 10. Testing, CI and agent tooling

- **`npm test`**: vitest (jsdom), 32 test files and about 470 tests, mostly in `src/lib/`.
- **`npm run typecheck`**: `tsc --noEmit -p tsconfig.ci.json` (`src/` only).
- **`npm run lint`**: ESLint, 0 errors required, warnings allowed.
- **CI** (`.github/workflows/ci.yml`): the three checks on every PR and push to `production`.
- **Deploy** (`.github/workflows/deploy.yml`): preview upload per PR, production deploy on push.
  Details in [`cloud.md`](./cloud.md).
- **Visual QA**: `scripts/qa-*.mjs` (Playwright screenshots and pixel diffs into the gitignored
  `qa/`). Not run in CI; there are no end-to-end tests.
- **`.claude/`**: project skills (`design-system`, `page-authoring`, `sanity-content`,
  `cloudflare-deploy`, `integrations`), a PostToolUse hook (`hooks/design-guard.mjs`) that blocks raw
  hex, layout inline styles and off-system breakpoints in `src/`, two review subagents, and the
  `/ship` command (branch → PR → CI → squash-merge).
- `vault-sync.yml` mirrors commit metadata to an external notes vault; it does not build anything.

---

## 11. Repository layout

```
src/
  app/                  routes (see §3); globals.css holds all design tokens
  components/
    sections/           shared marketing sections
    home/ region/ ask-fruit/   feature-specific components
    internal/           portal components
    ui/                 shadcn/ui primitives (portal only)
  data/                 code-owned copy and config (practice, region, messaging pages, offices, nav)
  features/content/     Sanity loaders
  lib/                  integration clients, portal auth, metadata, landing page theme, tests
  sanity/               schemas, queries, Studio config and structure
  middleware.ts         canonical host + markdown twins
  redirects.ts          892 generated Wix redirects (never hand-edit)
  tagRedirects.ts       241 generated tag redirects (never hand-edit)
workers/og-card/        separate OG card Worker (hand-deployed)
supabase/migrations/    portal + legacy brain SQL (applied by hand)
scripts/                generators, Sanity migrations and seeds, QA scripts (mostly one-off)
public/                 static assets, PDFs, videos, llms.txt, markdown twins
docs/                   this file, cloud.md, topic notes; docs/archive is historical
.claude/                agent skills, hooks, /ship
```

---

## 12. Known issues and tech debt

| Issue | Where | Notes |
|---|---|---|
| Unknown `/partnerships/<slug>` returns 200 with an empty shell | `src/app/partnerships/[slug]/page.tsx` | No `notFound()`. Check nav links by hand |
| No Sanity revalidation webhook | n/a | Studio edits rely on the 60s ISR window |
| `short_links` table has no migration | `supabase/` | Recreate from the live schema before any rebuild |
| `authorized_users` table is never read | `supabase/migrations/20260702*` | Domain check is the only gate |
| Stale remote `staging` branch | `origin/staging` | Hundreds of commits behind `production` and no longer triggers CI. Delete it once nobody needs it |
| Client-side Umami may be absent in production | `layout.tsx` + `deploy.yml` | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is not passed at build time by CI |
| Portal Supabase migrations exist in both this repo and Marketa | `supabase/migrations/` | Pick one owner before the next schema change |
| Worker near the 10 MiB limit | §7.3 | Budget every new dependency |

---

*Verified against `production` (00b12fe) on 2026-10-14. Previous full verification: 2026-08-21.*
