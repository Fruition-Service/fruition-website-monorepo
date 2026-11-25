# Claude Partner Network tier

Fruition is a **Certified Services Partner** in Anthropic's Claude Partner Network (Nov 2026)
and expects **Select** soon. The site was built showing Select, so the tier is now a switch.
Both tiers' badge artwork stays in the repo and in Sanity, so switching needs no new files.

## Where the tier shows

| Surface | Source | Switched by |
|---|---|---|
| Hero badges (`/partnerships/anthropic-claude-partner`, AI pages) | `src/data/partnerBadges.ts` | `CLAUDE_PARTNER_TIER` |
| Home "Also certified" row, contact page accreditations | `PlatformsCertified.tsx`, `ContactChannelsSection.tsx` | `CLAUDE_PARTNER_TIER` |
| Default share card | `src/app/opengraph-image.jpg` | `artwork.mjs` |
| Version C page badge rows (every page linked to `partner-claude`), `/ai-use-cases` and home badge alt, `/partnerships` tile tag | Sanity `partner-claude` + `vcPage` docs | `sanity.ts` |

`src/data/claudePartnerTier.test.ts` fails CI if either tier's artwork is missing or a hard-coded
claim for the other tier appears anywhere under `src/`.

## Moving to Select

Do these in order, as one change:

1. In `src/data/claudePartnerTier.ts`, set `CLAUDE_PARTNER_TIER = "select"`.
2. Restore the Select share card:
   ```bash
   node scripts/claude-partner-tier/artwork.mjs select
   ```
3. Run `npm test`, open a PR, merge (merging deploys).
4. Once the deploy is live, switch Sanity (needs `SANITY_WRITE_TOKEN` in `.env.local`):
   ```bash
   npx tsx scripts/claude-partner-tier/sanity.ts --tier select
   npx tsx scripts/claude-partner-tier/sanity.ts --tier select --apply
   ```
   Sanity edits go live in about two minutes without a deploy.

If Anthropic issues new Select artwork (rather than the badge already in
`public/images/partner-badges/claude-select.webp`), regenerate it at the same sizes first
(416x132 hero webp, 253x80 home png) and update the original Select asset id in `sanity.ts`.

## Moving to Certified (what was done in Nov 2026)

```bash
node scripts/claude-partner-tier/artwork.mjs certified <path to claude-certified-services-partner badge>
npx tsx scripts/claude-partner-tier/sanity.ts --tier certified --apply
```
