# HubSpot to Fruition blog sync

Thana writes blog posts in HubSpot (portal **442278519** "OG Labs", AP1 region, blog
"Fruition Services blog", id `367476848118`). The same posts also appear on oglabs.io, which reads
HubSpot directly. This sync mirrors them into Fruition:

| In HubSpot | Fruition portal (`/internal/blog`, Supabase `portal_drafts`) | fruitionservices.io (Sanity `blogPost`) |
|---|---|---|
| Draft created or edited | Draft created or updated | Nothing (not live) |
| Scheduled | Draft created or updated | Goes live once HubSpot publishes it |
| Published, or a live post edited | Draft updated, status published | `/post/<slug>` created or updated |
| Unpublished (back to draft) | Draft updated, status drafted | Post removed |
| Deleted (archived) | Draft deleted | Post removed |

**Website only.** Publishing never creates social posts. The sync does not call Zernio, Marketa or the
social composer (a test in `src/lib/hubspotBlog/htmlToMarkdown.test.ts` fails if it ever imports
them), and `BLOG_AUTO_SOCIAL_DRAFTS` stays off. Social for these posts is written by hand in the
portal, if at all.

## How it runs

- `wrangler.jsonc` `triggers.crons` fires every 5 minutes. `workers/site-entry.ts` `scheduled` posts
  to `/api/cron/hubspot-blog-sync` in-process with the `x-sync-secret` header.
- `src/lib/hubspotBlog/plan.ts` decides (pure, tested in `plan.test.ts`); `sync.ts` carries it out.
- A post is linked by `portal_drafts.metadata.hubspot_post_id`. Its Sanity id is
  `metadata.sanity_doc_id` if the portal recorded one, else `blog-hubspot-<postId>`.
- Change detection is HubSpot's `updated` timestamp plus state (`metadata.hubspot_fingerprint`), so a
  quiet tick writes nothing.
- HubSpot HTML becomes the portal's markdown subset (`htmlToMarkdown.ts`, no parser dependency).
  Body images and the featured image are re-hosted in Sanity. "OG Labs" is rewritten to "Fruition"
  and oglabs.io links to fruitionservices.io (`toFruitionBrand`).

## Rules worth knowing

- **HubSpot wins** for posts it owns. Editing or deleting a HubSpot post in the Fruition portal is
  undone on the next change in HubSpot, and a live HubSpot post deleted on the Fruition side comes
  back within 5 minutes. Make changes in HubSpot.
- A HubSpot **draft** that a teammate publishes from the portal stays up; only a post HubSpot itself
  took offline is withdrawn.
- If HubSpot returns no posts at all (outage, bad token), nothing is deleted.
- A slug already owned by another Fruition post is refused and reported in `errors`; rename it in
  HubSpot.

## Operating it

```bash
# What would change (writes nothing)
curl -X POST -H "x-sync-secret: $HUBSPOT_SYNC_SECRET" \
  "https://www.fruitionservices.io/api/cron/hubspot-blog-sync?dryRun=1"
# Rewrite every post now
curl -X POST -H "x-sync-secret: $HUBSPOT_SYNC_SECRET" \
  "https://www.fruitionservices.io/api/cron/hubspot-blog-sync?force=1"
```

Secrets `HUBSPOT_BLOG_TOKEN` and `HUBSPOT_SYNC_SECRET` live in GitHub Actions secrets and are pushed to
the Worker on every production deploy. Off switch: set `HUBSPOT_BLOG_SYNC_DISABLED=1` on the Worker.
Logs: `npx wrangler tail fruition-landing` and look for `[hubspot-blog-sync]`.

## Ported OG Labs posts

The six posts that were only ever written in Framer for oglabs.io were copied once into Sanity as
`blog-oglabs-<slug>` by `scripts/port-oglabs-legacy-posts.ts` (rebranded to Fruition). The OG Labs
launch announcement was left out. They are ordinary Fruition posts now and the sync does not touch them.
