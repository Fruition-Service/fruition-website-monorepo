# Blurred blog images — what happened, what was recoverable, what was not

## The bug

Wix server-renders `<img src>` with a lazy-load **placeholder**: a 49px or 147px
crop with a gaussian blur baked in (`…/v1/fill/w_147,h_83,…,blur_2/…`). The real
image sat behind the same media id, one URL rewrite away.

Two scrapers took that `src` at face value:

| script | what it did | result |
| --- | --- | --- |
| `scripts/migrate-blog-images.ts` | rewrote `w_`/`h_` **only inside a `fill` transform** — a silent no-op for the other transform shapes | the 90 placeholder body images, all named `<slug>-body-N` |
| `scripts/import-blog.ts` | uploaded `img.src` verbatim | the handful of `<slug>-img-N` images at 480–717px |

Covers mostly escaped because they come from `og:image`, which Wix already
serves at full size — which is why a post can have a crisp header and blurred
screenshots below it.

Those assets were then stretched across the 740px article column, so a 147px
image was upscaled 5×.

## The damage (audit, August 2026)

248 posts (234 published), 652 image references.

| | covers | body images | total |
| --- | --- | --- | --- |
| references | 247 | 405 | 652 |
| under 740px — **visibly blurry** | 12 | 99 | **111** |
| under 1480px — soft on a 2× display | 200 | 348 | 548 |

94 of the 99 bad body images are under 200px — straight Wix placeholders,
clustered in 15 published posts.

## What is recoverable: nearly all of it

The old Wix site is **still live** at `www.fruition-services.io` (hyphenated),
serving full-resolution media. A read-only pass against it
([run 32438795040](https://github.com/Fruition-Service/fruition-website-monorepo/actions/runs/32438795040))
resolves **166 replacements**, including **89 of the ~90 Wix placeholders**:

| outcome | images |
| --- | --- |
| a better source exists | **166** |
| already the best source available | 330 |
| no source found | 31 |
| fetch failed | 0 |

Of the 106 visibly blurry images, **91 are recoverable**. The 15 that remain are
ones whose Wix original is itself small; only 2 have no source at all.

Per-post it reads like `body #3 49px → 2908px available`.

> **Keep that domain alive** until the repair has run. It is the only surviving
> copy: the Wayback Machine holds 293 other posts but never captured these (they
> were live on Wix about five weeks), and Common Crawl's pre-migration crawls
> did not either. A one-off archival scrape while it is up would be cheap
> insurance.

### The archives, for the record

Both were searched properly before the mirror turned up, and neither has these
posts. Four earlier probes under-reported and every miss was self-inflicted: the
lookup asked only for the `www.` host (CDX keys captures by exact host); it took
only the newest capture; `--before` defaulted to `20260301`, which predates the
affected posts entirely; and the "is this a Wix page" guard used
`wixOriginalUrl()`, which passes non-Wix URLs through untouched, so captures of
the *new* site were accepted as sources. All four are fixed — but the archive
route is moot now that the origin is reachable.

## What was done instead

**1. Stop upscaling.** `articleImageProps()` in `src/sanity/image.ts` reads the
intrinsic size off the asset reference (no network call) and lays an image out
at its own width when it cannot fill the column — small, but sharp. It also
stops asking the CDN for more pixels than the asset holds, which removes the
same softness for the 548 images sitting between column width and 2×.
Column-width and wider images render exactly as before.

This does not put lost detail back. It stops a 147px thumbnail being blown up
5× and presented as a hero.

**2. Serve the quality the blog asks for.** Next 16 changed `images.qualities`
to default to `[75]` and to *silently coerce* anything else to the nearest
allowed value. All three article image call sites pass `quality={90}`, so since
the upgrade every blog image had been served at 75. `next.config.ts` now
declares `qualities: [75, 90]`. This is independent of the scrape damage — it
was making the good images soft too.

**3. The 166 recoveries** are one run away — see below.

**4. The rest need new screenshots.** The worklist is at the end of this file.

## Running the repair

Use the workflow — **Actions → Blog image repair → Run workflow**. `plan` is
read-only and needs no credentials; `apply` needs a `SANITY_WRITE_TOKEN` repo
secret (Settings → Secrets and variables → Actions) and fails fast without one.

> GitHub only offers **Run workflow** for workflows that exist on the default
> branch, so the button appears once this has merged to `production`. Before
> then, the same plan runs by pushing a commit with `[probe-images]` in its
> message to a `claude/**` branch.

Locally, if you have the token in `.env.local`:

```bash
# audit only, no writes, no credentials
npx tsx scripts/fix-blurry-blog-images.ts

# the real repair: scrape the still-live Wix origin
npx tsx scripts/fix-blurry-blog-images.ts --apply \
  --source-base https://www.fruition-services.io
```

Nothing is written unless the replacement downloads, decodes, and is
meaningfully wider than what is already there — a failed recovery leaves the
post exactly as it was. Alt text, captions and `_key`s never move; only
`asset._ref` does. Re-running is safe.

If the old Wix site ever turns out to be reachable somewhere, `--source-base
<url>` skips the archive and everything below becomes recoverable again. That is
the one thing that would change this outcome.

## Why it cannot happen again

- `src/lib/wixImage.ts` — one place that knows how to turn any Wix media URL
  into its original. Unit-tested against the real placeholder shapes.
- `scripts/html-to-portable-text.ts` prefers the widest `srcset` candidate and
  pipes every URL through it.
- Both ingest scripts refuse any image that decodes narrower than 400px
  (`src/lib/imageSize.ts`), whatever the URL claimed.

## Worklist — superseded

An earlier version of this file listed 94 images as needing new screenshots.
That is no longer true: the live Wix mirror supplies originals for 89 of them.
Run the repair (see above) rather than re-shooting anything. Regenerate the
current shortfall at any time with:

```groq
*[_type=="blogPost" && count(body[_type=="image" && asset->metadata.dimensions.width < 740]) > 0]{
  "slug": slug.current,
  "bad": body[_type=="image" && asset->metadata.dimensions.width < 740]{
    alt, "w": asset->metadata.dimensions.width, "file": asset->originalFilename
  }
}
```

## Related, not fixed here

272 image assets under 400px are referenced from non-blog documents (page
builder blocks, logo sets, site settings). Most are logos and icons that are
*meant* to be small. Auditing those needs the render size of each block, not a
single column width, so it is a separate job.
