> **Status 2026-10-14:** this was the provisioning checklist and is now done. Auth is live (Google SSO
> plus email magic link). The `authorized_users` allow-list described here was never wired up; the
> domain check is the only gate. Current behaviour: [architecture.md §6](architecture.md#6-authentication).

# Portal Auth Setup — Supabase + Google Workspace SSO

Provisioning checklist to enable **Google Workspace login** for the internal portal, locked to
**`@fruitionservices.io`**. Follow top to bottom. This replaces the current shared-password gate
(`src/lib/internalAuth.ts`); see [`architecture.md`](./architecture.md) §4.

Two layers enforce the domain lock (defence in depth):
1. **Google consent screen set to "Internal"** — only `@fruitionservices.io` Workspace users can even
   complete the OAuth flow.
2. **Server-side email check** — the app rejects any session whose email isn't `@fruitionservices.io`
   (and verifies Google's `hd` hosted-domain claim when present).

---

## Step 1 — Create the portal Supabase project

Dashboard route (recommended for a one-time setup):
1. https://supabase.com/dashboard → **New project** → name `fruition-portal`, pick a region close to
   your users, set a strong DB password.
2. After it provisions, grab from **Project Settings → API**:
   - Project URL → `PORTAL_SUPABASE_URL`
   - `anon` `public` key → `PORTAL_SUPABASE_ANON_KEY`
   - `service_role` key (secret) → `PORTAL_SUPABASE_SERVICE_ROLE_KEY`
3. Note the **project ref** (the `xxxx` in `https://xxxx.supabase.co`) — needed for the Google redirect URI.

> Keep this separate from the Marketa "brain" project (`MARKETA_SUPABASE_*`). Different concern, different
> project.

---

## Step 2 — Create the Google OAuth client (Google Cloud Console)

1. https://console.cloud.google.com → select (or create) a project **owned by the `fruitionservices.io`
   Workspace org** (this is what lets you use an Internal consent screen).
2. **APIs & Services → OAuth consent screen**:
   - User type: **Internal** ← this is the primary domain lock.
   - App name: "Fruition Internal Portal"; support email + developer email on the domain.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized redirect URI**: `https://<PORTAL_PROJECT_REF>.supabase.co/auth/v1/callback`
     (use the ref from Step 1).
   - Create → copy the **Client ID** and **Client secret**.

---

## Step 3 — Enable Google in Supabase Auth

1. Portal Supabase project → **Authentication → Providers → Google** → enable.
2. Paste the **Client ID** and **Client secret** from Step 2. Save.
3. **Authentication → URL Configuration**:
   - Site URL: `https://<your-production-domain>` (e.g. `https://fruitionservices.io`).
   - Additional redirect URLs: add `http://localhost:3000/**` for local dev and the portal callback path
     (e.g. `https://fruitionservices.io/internal/auth/callback`).

---

## Step 4 — Database tables (run in the portal project's SQL editor)

```sql
-- Author identity: link a Supabase auth user to their public Sanity teamMember.
create table if not exists public.authors (
  supabase_user_id      uuid primary key references auth.users (id) on delete cascade,
  email                 text not null,
  display_name          text not null,
  role                  text,
  sanity_team_member_id text,          -- Sanity teamMember _id (from onboarding)
  byline                text,          -- overrides display_name on posts if set
  created_at            timestamptz not null default now()
);

-- Optional explicit allow-list for revocation (belt-and-suspenders over the domain check).
create table if not exists public.authorized_users (
  email      text primary key,
  active     boolean not null default true,
  added_at   timestamptz not null default now()
);

-- Editorial drafts saved from the portal before publishing to Sanity.
-- (Separate from the Marketa blog_drafts table, which lives in the brain project.)
create table if not exists public.portal_drafts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid references auth.users (id) on delete set null,
  sanity_doc_id text,                  -- set once published (blog-portal-<slug>)
  title         text,
  body_markdown text,
  metadata      jsonb not null default '{}'::jsonb,  -- excerpt, industry, categoryIds, seo, cover ref
  updated_at    timestamptz not null default now()
);

alter table public.authors        enable row level security;
alter table public.portal_drafts  enable row level security;

-- Authors read/update only their own row.
create policy authors_self on public.authors
  for all using (auth.uid() = supabase_user_id) with check (auth.uid() = supabase_user_id);

-- Drafts are private to their author.
create policy drafts_owner on public.portal_drafts
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
```

Store as `supabase/migrations/<timestamp>_portal_auth.sql` in the repo so it's reproducible.

---

## Step 5 — Environment variables

Add to Cloudflare (production) via `wrangler secret put <NAME>` and to `.dev.vars` (local):

```
PORTAL_SUPABASE_URL=https://<ref>.supabase.co
PORTAL_SUPABASE_ANON_KEY=<anon key>
PORTAL_SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, never NEXT_PUBLIC
PORTAL_ALLOWED_EMAIL_DOMAIN=fruitionservices.io
```

---

## Step 6 — App wiring (follow-up code task)

1. Add `@supabase/ssr` + `@supabase/supabase-js`. Create a session helper (the `packages/auth` module in
   the plan, or `src/lib/portalAuth.ts` in the interim single-app layout) exposing:
   - `getSession()` for server components / route handlers (cookie-based, Workers-compatible).
   - `requirePortalUser()` — the replacement for `verifyToken`: loads the session, **rejects** if
     `email` doesn't end in `@${PORTAL_ALLOWED_EMAIL_DOMAIN}` (and checks `authorized_users.active` if you
     use the allow-list), else `redirect('/internal/login')`.
2. **Login page** — swap the password form for `supabase.auth.signInWithOAuth({ provider: 'google',
   options: { queryParams: { hd: 'fruitionservices.io', prompt: 'select_account' } } })`.
3. **Callback route** `/internal/auth/callback` — exchange the code for a session, then run the
   domain/`hd` check before setting cookies.
4. **Swap the gate**: replace the `verifyToken` calls in `src/app/internal/**` and
   `src/app/api/internal/**` (including the new `src/app/api/internal/blog/route.ts`) with
   `requirePortalUser()`. The blog write path underneath is unchanged.
5. **Byline**: on publish, default `author` to the logged-in user's `authors.byline || display_name`.

---

## Step 7 — Verify

- Sign in with a `@fruitionservices.io` Google account → lands in the portal.
- Sign in with a personal/other-domain Google account → **rejected** (Internal consent screen blocks it;
  if it somehow reaches the callback, the server-side email check rejects it).
- Publish a post from the portal → `blogPost` appears in Sanity via the single `SANITY_WRITE_TOKEN`, and
  the author was **not** added as a Sanity project member (no new seat).
- Revoke: set `authorized_users.active = false` (or remove the row) → that user can no longer pass
  `requirePortalUser()`.
