# Standalone social composer — implementation plan

Goal: create social posts **from scratch** (not derived from a blog) in the portal —
pick platforms, see each platform's limits as you write, edit per-platform copy,
attach media, save/schedule/publish, then manage (edit, delete, republish, track)
everything from one place.

Written 2026-08-06. **Status: built 2026-08-06** — one thing is outstanding before
it works: the migration in §2.2 has to be run by hand in the Supabase SQL editor
(portal project `jnmdtrgtxdjfhbdkdvja`), because there's no CLI or psql on this
machine and the Supabase MCP is connected to a different account. Until it runs,
`/internal/social/new` renders and the channel/limits UI works, but Save, Publish
and Schedule return "Save failed" and the dashboard's Edit links stay absent.

Also landed alongside it: the **Google Business UK and US** profiles connected on
2026-08-06 are now in `PLATFORMS`, so both the blog pipeline and the composer fan
out to nine channels rather than seven.

---

## 1. What already exists

| Piece | File | Reuse |
|---|---|---|
| Zernio client (create/update/publish/unpublish/republish/delete, per-platform registry, caption LLM call, IG aspect fix) | `src/lib/social/zernio.ts` (739 lines) | **Heavily** — ~80% of the backend is already here |
| Panel state builder (accounts + drafts + blog facts → UI state) | `src/lib/social/panelState.ts` | Pattern to copy for compositions |
| Per-platform card UI (caption, counter vs limit, image picker, Reddit subreddit, publish/unpublish/regenerate) | `src/components/internal/SocialDraftsPanel.tsx` | **Extract and share** |
| Blog-scoped API (GET state / POST generate / PUT save / POST publish) | `src/app/api/internal/blog/social/**` | Pattern to copy |
| Cross-channel list with search + platform/status filters, unpublish, delete-record | `src/components/internal/SocialDashboard.tsx`, `src/app/api/internal/social/posts/route.ts` | Extend |
| Image upload → Sanity asset → CDN URL | `src/app/api/internal/blog/image/route.ts` | Generalise |
| Brand icons | `src/components/internal/SocialIcons.tsx` | As-is |

Current model (keep it): **one Zernio draft post per platform**, linked back to its
source through the Zernio post's `metadata` object. Platforms: X, Google Business
AU, Google Business SG, Instagram, LinkedIn, Pinterest, Reddit. YouTube deliberately
excluded.

> **2026-09-23:** YouTube is no longer excluded from the composer. Google Business
> UK and US were added in August, and YouTube joined on this date as a video-only
> channel: one video per post, a required 100-character title, and a 5,000-character
> description. It stays out of the *blog* fan-out (`BLOG_PLATFORMS`), because an
> article has no video to give it. YouTube **Community posts remain impossible** —
> Google's API does not expose them to any tool, Zernio included.

The gap is only the *entry point and the source*: everything assumes a blog
(`slug` is required on every route, captions are generated from blog title/body,
images come from the blog's cover + body, publish is blocked until the blog is
live in Sanity).

---

## 2. Architecture decisions

### 2.1 A "composition" is a group of Zernio posts

A standalone post = one **composition** fanned out to N Zernio posts (one per
selected platform), sharing:

```json
metadata: {
  "marketaKind": "standalone",
  "marketaCompositionId": "<uuid>",
  "marketaPlatform": "linkedin"
}
```

This mirrors the blog flow exactly, so publish/unpublish/republish/delete all work
unchanged.

### 2.2 Persist compositions in Supabase — DECIDED 2026-08-06

The blog flow deliberately has **no local table** — it finds posts by listing the
last 200 Zernio posts and filtering on metadata. That does not scale to
standalone posts:

- the 200-post scan becomes the bottleneck once ad-hoc posts outnumber blog posts;
- you can't save a half-written composition without pushing junk drafts to Zernio;
- there's no author attribution, no "who scheduled this", no edit history.

Proposed migration `supabase/migrations/2026XXXXXXXXXX_social_compositions.sql`:

```sql
create table if not exists public.social_compositions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,               -- internal name, not published
  brief         text,                        -- the idea/prompt used for AI generation
  link          text,                        -- optional URL appended per platform rules
  media_urls    jsonb not null default '[]'::jsonb,   -- shared image library for this composition
  platforms     jsonb not null default '{}'::jsonb,   -- key -> {zernioPostId, content, title, subreddit, mediaUrls, boardId}
  post_ids      text[] not null default '{}',         -- flat Zernio ids, for reverse lookup from the dashboard
  scheduled_for timestamptz,
  timezone      text,
  status        text not null default 'draft',        -- draft|scheduled|publishing|published|mixed|failed
  created_by    text,                                 -- portal user email
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on public.social_compositions using gin (post_ids);
```

**Zernio stays the source of truth for status and live URLs** — the table stores
identity and intent only; the composer merges live Zernio state on read (same as
`buildPanelState` does today). No status is trusted from the local row.

*Rejected alternative:* metadata-only, exactly like blogs — no migration, but loses
pre-Zernio drafts, author attribution and fast listing.

### 2.3 Platform constraints become declarative

`PlatformSpec` currently carries `limit`, `needsMedia`, `supportsMedia`. Extend it
so the "what each platform allows" UI and the pre-publish validator read from one
source of truth:

```ts
interface PlatformSpec {
  // ...existing
  titleLimit?: number          // pinterest 100, reddit 300
  titleRequired?: boolean      // reddit
  maxMedia: number             // instagram 10 (carousel), 1 elsewhere
  mediaMaxBytes?: number       // GBP 5 MB
  aspect?: { min: number; max: number }   // instagram 0.8 – 1.91
  linkInBody: boolean          // false for instagram + pinterest
  countsRawChars: boolean      // X: 280 raw INCLUDING the URL
  notes: string[]              // shown verbatim in the limits panel
}
```

Known constraints to encode (already proven in production):

| Platform | Body | Title | Media | Gotchas |
|---|---|---|---|---|
| X | 280 **raw incl. URL** | — | optional | Zernio counts raw chars, not t.co-weighted |
| Google Business AU/SG | 1500 | — | optional, ≤5 MB | two separate accounts, one caption |
| Instagram | 2200 | — | **required** | aspect must be 0.8–1.91; no clickable link in body; **cannot be deleted via API** |
| LinkedIn | 3000 | — | optional | — |
| Pinterest | 500 desc | 100 | **required** | needs `boardId` + destination `link` |
| Reddit | ~10000 | 300 | text-only by choice | `subreddit` (blank = account default); ban risk on promo |

### 2.4 Caption generation needs a non-blog mode

`generateSocialCaptions()` is hard-wired to "promote one blog post". Add a
discriminated source so both call sites share the clamping/JSON logic:

```ts
type CaptionSource =
  | { kind: "blog"; title: string; excerpt?: string; body?: string; blogUrl?: string; ... }
  | { kind: "idea"; brief: string; link?: string; tone?: string; cta?: string }
```

Same voice rules, same per-platform clamps, same one-call-for-all-platforms shape.

### 2.5 Media

New `POST /api/internal/social/image` (same body as the blog image route, different
asset filename prefix) → Sanity asset → CDN URL.

Uploading to **Sanity specifically matters**: `instagramSafeImageUrl()` only crops
`cdn.sanity.io` URLs, so any other host silently fails IG publishing.

### 2.6 Mirror rule

`src/lib/social/zernio.ts` is **byte-identical** to
`marketa-monorepo/src/lib/marketa/zernio.ts` (verified). Every change to it must be
mirrored, per `AGENTS.md`.

---

## 3. Files

**New**

```
src/app/internal/social/new/page.tsx                  composer (create)
src/app/internal/social/[id]/page.tsx                 composer (edit existing composition)
src/components/internal/social/SocialComposer.tsx     the composer client component
src/components/internal/social/PlatformCard.tsx       shared card (extracted from SocialDraftsPanel)
src/components/internal/social/PlatformPicker.tsx     chips + per-platform limits panel
src/components/internal/social/MediaUploader.tsx      drag-drop + composition image library
src/lib/social/composition.ts                         state builder (mirrors panelState.ts)
src/app/api/internal/social/compose/route.ts          GET / POST / PUT / DELETE composition
src/app/api/internal/social/compose/publish/route.ts  publish now or schedule
src/app/api/internal/social/generate/route.ts         AI captions from a brief
src/app/api/internal/social/image/route.ts            media upload
supabase/migrations/2026XXXXXXXXXX_social_compositions.sql
```

**Modified**

```
src/lib/social/zernio.ts (+ marketa mirror)   constraints, "idea" caption mode, scheduling, standalone metadata
src/components/internal/SocialDraftsPanel.tsx use the extracted PlatformCard
src/components/internal/SocialDashboard.tsx   "New post" button, Edit link for standalone rows, composition grouping
src/components/app-sidebar.tsx                "New social post" under the Social group
src/components/internal/PortalShell.tsx       TITLES + active union
```

---

## 4. The composer UI

Single page, top-to-bottom, matching the portal's existing card language
(`DESIGN.md` tokens, three breakpoints):

1. **Name + brief** — internal title, optional link, optional brief for AI.
2. **Platform picker** — brand-icon chips. Selecting one reveals its limits inline
   (char cap, media required?, title required?, notes). A collapsible
   "What each platform allows" table shows all seven side by side.
3. **Master caption** — one textarea + **Generate with AI** (brief → all selected
   platforms in one LLM call). Per-platform copy starts as the master text clamped
   to each limit.
4. **Per-platform cards** (the extracted `PlatformCard`) — live counter vs limit,
   over-limit in red, image picker from the composition's uploads, Pinterest
   title/board, Reddit title + subreddit, "customised" badge once the copy diverges
   from master, per-platform Regenerate.
5. **Media strip** — drag-drop upload, applies to all or per-card.
6. **Action bar** — `Save draft` · `Schedule…` (datetime + timezone) · `Publish now`.
   A validation summary lists every blocker (over limit, IG missing image, Reddit
   missing title, disconnected account) and disables publish until clear.

**Do the `PlatformCard` extraction first.** Without it there will be two
independently drifting copies of the trickiest UI in the portal.

---

## 5. Management & tracking

Extend `/internal/social`:

- **New post** button → `/internal/social/new`.
- Standalone rows get an **Edit** link → `/internal/social/[id]` (blog-sourced rows
  keep their existing **Blog** link).
- Group the per-platform rows of one composition under a single expandable row, so
  "one post to 5 channels" reads as one thing.
- Existing per-row **Unpublish** (live removal, IG excluded) and **Delete record**
  (refuses live posts) work unchanged.
- **Duplicate** — clone a composition as a new draft. Cheap, high value for
  recurring posts.
- Tracking v1 = Zernio truth: status per platform, live post URL, created/published
  timestamps, error text on failure. Engagement metrics (impressions/likes) depend
  on a Zernio analytics endpoint — **unverified**, see §7.

---

## 6. Build order — DECIDED 2026-08-06: one build, not phased

Single PR covering compose + manage + schedule + track. Ordered so the risky
unknowns get answered before anything is built on top of them:

1. **Verify the unknowns in §7** against the live API (scheduling, analytics,
   Pinterest boards) — a throwaway script, before any UI. Scheduling and analytics
   determine how much of steps 8–9 is real.
2. Migration + `social_compositions` accessors.
3. `PlatformSpec` constraints registry in `zernio.ts`, "idea" caption mode,
   scheduling support — then mirror to `marketa-monorepo`.
4. Extract `PlatformCard` / edit-state out of `SocialDraftsPanel`, leaving the blog
   panel working identically (visual regression check on both blog editors).
5. Compose API: GET/POST/PUT/DELETE + publish/schedule + image upload + generate.
6. `SocialComposer` + `/internal/social/new`.
7. `/internal/social/[id]` edit, delete, duplicate.
8. Dashboard: New-post button, composition grouping, Edit links, scheduled view.
9. Tracking: status refresh + whatever analytics step 1 proves exists.
10. Sidebar/nav/titles, then end-to-end test per §8 rules.

Rough size: ~4–5 days of build. Step 1 may shrink steps 8–9.

---

## 7. Unknowns — RESOLVED 2026-08-06 against the live API

Probed with drafts + a far-future scheduled post, all deleted afterwards.

1. **Scheduling — WORKS.** `POST /posts` with `scheduledFor` (ISO) + `timezone`
   (IANA) returns `status: "scheduled"`; both fields round-trip on GET.
   `PUT /posts/{id}` with a new `scheduledFor` reschedules; `PUT {isDraft:true}`
   pulls a scheduled post back to draft. Full schedule/reschedule/cancel is available.
2. **Analytics — EXISTS, with real engagement data.** `GET /analytics?limit=N`
   returns `overview` (totalPosts, publishedPosts, scheduledPosts, lastSync,
   dataStaleness) plus `posts[]`, each carrying:
   `{impressions, reach, likes, comments, shares, saves, clicks, views, follows,
   engagementRate, igReelsAvgWatchTime, videoDurationSeconds, lastUpdated}` at both
   post level and per-platform level, with `platformPostUrl` and `syncStatus`.
   - **Join key: `analytics.latePostId` === our Zernio post `_id`.** The analytics
     `_id` is a *different* id — joining on it returns nothing.
   - Verified live on our own posts across linkedin / instagram / reddit / pinterest.
   - **`limit` caps out below 200**: `?limit=100` → 63 rows, `?limit=200` → **0 rows**.
     Never send 200.
   - The feed also includes posts published *outside* Zernio (45 LinkedIn company-page
     posts). So `/internal/social`'s current "posts made directly on the platforms
     don't appear here" caveat is wrong for the analytics view — this is a genuine
     cross-channel performance dashboard, not just our own posts.
3. **Pagination** — `/posts` accepts `page` (works) but **ignores `offset`**. Response
   carries a `pagination` object. At current volume (63 records) `limit=500` returns
   everything, so the 200-scan isn't urgent, but paginate on `page`.
4. **Multi-image**: two `mediaItems` round-trip and store correctly. Shipped
   single-image first; carousel publishing landed later, once a four-slide post
   went out as one picture on Instagram. A channel now holds `mediaUrls` in
   carousel order and every image is sent, capped at the channel's `maxMedia`.
5. **Pinterest boards** — `GET /accounts/{id}/pinterest-boards` works but returns
   exactly one board today ("CRM", `1009369403924050337`). Dropdown still built, it
   just has one option.

## 7b. What shipped

| Area | Files |
|---|---|
| Platform constraints (limits, titles, media, aspect, notes) + GBP UK/US + scheduling + analytics + `createDraftPost` | `src/lib/social/zernio.ts` (mirrored to marketa-monorepo) |
| Publishability rules, shared by browser and server | `src/lib/social/validate.ts` |
| Composition storage + state merge with live Zernio | `src/lib/social/composition.ts` |
| Compose / publish / schedule / generate / image / analytics APIs | `src/app/api/internal/social/{compose,compose/publish,generate,image,analytics}/route.ts` |
| Composer UI + shared per-channel editor | `src/components/internal/social/{SocialComposer,PlatformEditor}.tsx` |
| Pages | `src/app/internal/social/{new,[id]}/page.tsx` |
| Dashboard: Posts + Performance tabs, compositions as first-class rows (channels folded in, drafts visible before they reach Zernio), live status rollup, duplicate, delete | `src/components/internal/SocialDashboard.tsx`, `src/lib/social/status.ts` |
| Blog Social tab now uses the shared editor (so limits can't drift) | `src/components/internal/SocialDraftsPanel.tsx`, `src/lib/social/panelState.ts` |

Verified in the browser (throwaway unauthenticated route, since portal auth is a
real magic-link login): channel toggles, shared caption flowing per channel,
live character counts, over-limit blocking, required-image blocking, disabled
send button. Two defects were found and fixed that way — rapid channel toggles
dropping the first channel (stale-closure state update), and the shared caption
being silently truncated to each channel's limit instead of showing as over.

The dashboard was verified the same way against stubbed APIs, which caught a
composition showing a stale `draft` badge while one of its channels had actually
failed — the badge now derives from live channel statuses (`status.ts`).

**End-to-end verified 2026-08-06** against the live Supabase table and the live
Zernio API, via a throwaway route since the real ones sit behind portal auth:
create composition → save per-platform copy → validation (over-limit, missing
Reddit title, missing Instagram image, and a clean caption) → lazily create
Zernio drafts → reverse lookup post id → composition → merged composer state →
schedule (both channels went to `scheduled`, rollup followed) → cancel (both
back to `draft`) → delete. All objects cleaned up; a Zernio sweep afterwards
found zero leftovers and the table is empty. Text-only channels only —
**nothing has been published to any live account.**

Auth verified separately: every `/api/internal/social/*` route 401s
unauthenticated, and the pages fall through to the login redirect exactly as
`/internal/blog` does.

One deployment finding: `ZERNIO_API_KEY` was missing from this repo's
`.env.local` (it only existed in `marketa-monorepo` and on the Worker), so the
composer couldn't work in local dev. Copied across — gitignored, same key.

## 8. Risks

- **Testing publishes to real, live accounts.** Test on X or a throwaway subreddit
  and unpublish immediately. **Instagram posts cannot be deleted via the API** — do
  not test-publish to IG.
- **Reddit ban risk** on promotional posts; keep the subreddit field explicit and
  default to nothing rather than a broad sub.
- **Dual source of truth** if the local table ever stores status — it must not.
- **200-post scan** in `listZernioPosts` — the composition table sidesteps it for
  standalone posts, but `/internal/social` still scans; paginate it in Phase 2.
- **Mirror drift** — `zernio.ts` must be copied to `marketa-monorepo` on every change.
