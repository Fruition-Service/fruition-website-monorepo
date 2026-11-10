# Internal links

Finds natural keyword matches in blog post body copy (Sanity `blogPost.body`) and links them to
internal pages: money pages, service pages and selected blog posts. Re-runnable and idempotent: a
second run over its own output adds nothing.

- Matching rules: `src/lib/internalLinks.ts` (tested in `src/lib/internalLinks.test.ts`)
- Targets and keywords: `targets.json` (this folder)
- CLI: `index.ts` (this folder)

Inserted links are ordinary `link` annotations with a relative href, the same shape editors create in
Studio. They render with the existing in-prose link style and open in the same tab.

## Add a target

Copy one object in `targets.json` and edit it:

```json
{ "path": "/monday-crm-consulting", "keywords": ["monday CRM consulting", "monday CRM"], "note": "money page" }
```

- `path` must start with `/` and must be a real page (check `src/app/sitemap.ts` and the route folders).
- `keywords`: most specific first. Use phrases of 2+ words. Matching is case-insensitive and whole word.
- Optional `aliases`: old URLs that redirect to the page, so posts already linking there are left alone.
- Single generic words (services, team, monday, ai, ...) are ignored unless you add `"allowGeneric": true`.

## Run it

```bash
npm run internal-links:dry                          # report only, nothing written (same as --dry-run)
npm run internal-links:dry -- --only my-post-slug   # one post (repeat or comma separate)
npm run internal-links:dry -- --limit 20            # newest 20 posts
npm run internal-links:dry -- --report /tmp/links.md # report somewhere else
```

The report (`report.md` by default) lists totals, links per target, targets with no matches, documents
at the cap and every planned link with a short snippet. Read it before applying.

`npm run internal-links` with no flag is the same as `npm run internal-links:dry`.

## Safety caps

- At most 5 inserted links per post (`maxLinksPerDoc`, clamped to 3..5). Existing links to configured
  targets count toward the cap.
- At most one link per target page and one per anchor text in a post.
- Longest phrase wins; links never overlap.
- Never in headings, blockquotes, tables, images, existing links or short call-to-action list items.
- Never links a post to itself or to a page it already links to.
- `skipFirstParagraph: true` leaves the opening paragraph alone.
- Only the `body` field of the published document is patched. If a post has an open draft in Studio,
  publishing that draft later overwrites the new links; rerun the tool afterwards.

## Apply to production

Run a dry run first and check the report. Then, with a Sanity token that has write access (from the
password manager, never committed), start small:

```bash
SANITY_WRITE_TOKEN=<token from the password manager> npm run internal-links:apply -- --limit 10
```

Check those posts on the live site (the page cache refreshes within about 60 seconds), then run again
without `--limit`. Without `SANITY_WRITE_TOKEN`, `--apply` exits with an error and changes nothing.

## URL-like text is never linked

A keyword match inside URL-like text is skipped (`inside-url` in the report): a token with `://`, one
starting with `www.`, an email address, or a keyword glued to more URL characters
(`monday.com/pricing`, `Fruition-Earns-monday.com-Platinum`). A plain `monday.com` in prose, including
one before a full stop or comma, still links. The tool only adds new `link` annotations and never edits
an existing href. This guards against the February 2026 BusinessWire link that ended up as
`.../Fruition-Earns-https://www.fruitionservices.io/partnerships/monday-consulting-partner.com-Platinum-...`
(monday 2904193295).

## Scan for malformed hrefs (read-only)

```bash
npm run scan:malformed-hrefs                       # markdown table to stdout
npm run scan:malformed-hrefs -- --json             # JSON
npm run scan:malformed-hrefs -- --out /tmp/x.md    # also write to a file
```

Walks every document of every type (not only `blogPost`) and checks link `markDefs` plus any string
field named `href`, `url`, `link` or ending in `Url`/`Href`/`Link`. Each hit shows the doc `_id`,
`_type`, the Sanity path to the value (usable in a `patch().set()`) and the href.

- `embedded-scheme`: `http://` or `https://` appears twice, or not at the start
  (`/monday-partner-ukhttps://...`, Google Docs `google.com/url?q=https://...` wrappers). Fix these.
- `domain-in-path`: our own domain, or another `host.tld/path`, inside this URL's path or query. Often
  legitimate (`semrush.com/website/chatgpt.com/overview/`), so check by hand.

It never writes. With `SANITY_WRITE_TOKEN` or `SANITY_API_READ_TOKEN` set it also scans drafts;
without one it sees published documents only. Rules: `src/lib/malformedHrefs.ts`.
