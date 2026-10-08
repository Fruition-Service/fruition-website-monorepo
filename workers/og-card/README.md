# fruition-og-card

Renders the 1200×630 social preview card (og:image / twitter:image) for every
fruitionservices.io page that has no image of its own. Blog posts keep their cover
image and the homepage keeps the partner-badge artwork.

- **URL:** `https://www.fruitionservices.io/og-card?title=…&eyebrow=…&v=…`
- **Who builds the URL:** `ogCardUrl()` in `src/lib/metadata.ts`, called by
  `buildOgMetadata()` (all Next pages) and `withLandingPageTracking()` (the /au, /uk,
  /us ad landing pages).
- **Routing:** this Worker owns the route `www.fruitionservices.io/og-card*`. It is
  more specific than the site's `www.fruitionservices.io/*`, so Cloudflare sends it
  here and everything else to `fruition-landing`.
- **Why a separate Worker:** satori + resvg wasm add ~0.8 MiB gzipped, and the site
  Worker is already close to Cloudflare's 10 MiB limit.
- **Caching:** each card is immutable for its query string (edge cache + `immutable`).
  After a design change, bump `OG_CARD_VERSION` in `src/lib/metadata.ts` so every
  page points at fresh URLs.

## Deploy

Not deployed by the site's CI. Deploy by hand on the Fruition Services account:

```bash
cd workers/og-card && npm install && XDG_CONFIG_HOME=~/.wrangler-fruition npx wrangler deploy
```

Local preview: `npx wrangler dev`, then open
`http://localhost:8787/og-card?title=Hello&eyebrow=Partnerships`.
