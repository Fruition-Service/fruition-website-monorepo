# Handover — blurred blog images

**You found the fix.** `www.fruition-services.io` is the old Wix site, still
live and still serving full-resolution media. A full read-only pass against it
resolves **166 replacements**, including **89 of the ~90 Wix placeholders** that
looked unrecoverable an hour ago.

Nothing needs re-shooting. This is now one command plus a spot-check.

| | now | after you run this |
| --- | --- | --- |
| visibly blurry (<740px) | 106 | **15** |
| Wix placeholders (<200px) | 89 | **0** |
| no source anywhere | — | 2 |

The 15 that remain are images whose Wix original is *itself* small (e.g. a
717px screenshot). Only 2 have no source at all. None are the 49–147px smears.

Evidence: run
[32438795040](https://github.com/Fruition-Service/fruition-website-monorepo/actions/runs/32438795040).
Per-post it reads like `body #3 49px → 2908px available`.

---

## 0. Setup

**Rotate the Sanity token first.** A write token was pasted into the chat
transcript in plaintext — treat it as compromised. Revoke it at
<https://www.sanity.io/manage> → project `bt6nb58h` → API → Tokens, and issue a
fresh one with **Editor** rights.

```bash
git fetch origin
git checkout claude/blurred-images-older-blogs-k0zhgk
npm ci
```

Put the **new** token in `.env.local` (git-ignored):

```
SANITY_WRITE_TOKEN=sk...
```

Nothing else — project id and dataset are hardcoded in `scripts/sanity-client.ts`.

---

## 1. One post first

```bash
npx tsx scripts/fix-blurry-blog-images.ts --apply \
  --source-base https://www.fruition-services.io \
  --only monday-crm-service-2026-roadmap
```

That post has twelve 147px placeholders, all of which resolve to 1200px. Check
<https://www.fruitionservices.io/post/monday-crm-service-2026-roadmap> — the
screenshots should be sharp and full width. Sanity serves the new asset
immediately, but the page is cached, so purge Cloudflare's cache or redeploy if
you still see the old ones.

## 2. Then the rest

```bash
npx tsx scripts/fix-blurry-blog-images.ts --apply \
  --source-base https://www.fruition-services.io \
  --report applied.json
```

Expect ~15–25 minutes: it fetches and decodes every replacement before writing.
`applied.json` records exactly what moved.

### What it touches

Sanity holds **14 draft blogPosts**, one of which
(`mondaycom-agile-sprint-management`) has blurry body images. The script reads
with the raw perspective, so it patches drafts as well as published documents.
That is deliberate: fix only the published copy and publishing that draft later
would put the blur straight back.

Only `asset._ref` is set. No other field on a draft is touched.

## 3. Verify

```bash
npx tsx scripts/fix-blurry-blog-images.ts     # audit only, no token needed
```

`visibly blurry (<740px)` should read **15**, down from 106. Or straight from
Sanity — baseline was `coversBelowSlot: 12`, `bodyBelowSlot: 99`:

```groq
{
  "coversBelowSlot": count(*[_type=="blogPost" && coverImage.asset->metadata.dimensions.width < 740]),
  "bodyBelowSlot": count(*[_type=="blogPost"].body[_type=="image" && asset->metadata.dimensions.width < 740])
}
```

---

## 4. Merge PR #147

Independent of the data repair, and green. It fixes three separate causes of
soft images:

1. **Under-sized images were stretched across the column** — a 147px scrape
   blown up to 740px is a 5× upscale. They now lay out at their true size. After
   step 2 almost nothing hits this path, but it stops the next bad ingest from
   looking like this one.
2. **`quality={90}` was silently served as 75** on *every* blog image since the
   Next 16 upgrade — `images.qualities` now declares `[75, 90]`. This affects
   all 652 images, not just the broken ones, and is the one fix that improves
   pages that were never part of this bug.
3. **The scrapers** now refuse any image that decodes narrower than 400px, so
   this class of damage cannot recur.

Nothing to undo before merging: the probe's hardcoded `SOURCE_BASE` has been
reverted, and the mirror is now the default of the workflow's `source_base`
input instead — so a manual **Run workflow** already points at the right origin.

---

## 5. Afterwards

- **Keep `fruition-services.io` alive** until this is done and verified. It is
  the only surviving copy of those originals — the Wayback Machine never
  captured these posts, and neither did Common Crawl's pre-migration crawls. If
  that domain lapses, the 89 screenshots are gone for real.
- Worth considering: a one-off archival scrape of the whole Wix site while it is
  still up, so this cannot bite again.
- The 2 images with no source at all are listed in `applied.json` as
  `unresolved`; they only need attention if you care about the last two.

---

## 6. Safety and rollback

- Writes **only** when the replacement downloads, decodes, and is meaningfully
  wider than what is there. A failed fetch leaves the post untouched.
- Only `asset._ref` moves — alt text, captions and `_key`s stay put, so nothing
  reorders and no copy changes.
- Idempotent: repaired images stop matching the filter, so re-running is safe.
- Old assets are not deleted; a bad swap is reversible from the document's
  revision history in `/studio`.
- `--apply` refuses to start without `SANITY_WRITE_TOKEN`, so a dry run cannot
  half-write.

---

## Reference

| | |
| --- | --- |
| Repair script | `scripts/fix-blurry-blog-images.ts` (`--help` for all flags) |
| Findings and audit | `docs/blog-image-repair.md` |
| CI workflow | `.github/workflows/blog-image-repair.yml` |
| Branch / PR | `claude/blurred-images-older-blogs-k0zhgk` / #147 |

Prefer CI to a laptop? Add `SANITY_WRITE_TOKEN` under Settings → Secrets and
variables → Actions, merge the PR so the workflow reaches the default branch,
then Actions → **Blog image repair** → Run workflow → `apply`. Same script, same
flags, with an audit trail.
