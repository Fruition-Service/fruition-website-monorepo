# Fruition document theme

The house style for documents and decks produced by the portal's Design function
(`/internal/design`). It is a **derived** theme: the brand values come from the Fruition Design
System (itself extracted from this repo's `src/app/globals.css`), re-expressed for print rather
than for the web.

Packaged in open-design's design-system shape (`manifest.json` + `DESIGN.md` + tokens) so a kit
authored elsewhere can be dropped in later. The tokens live in `tokens.ts` rather than a `.css`
file because the Cloudflare Worker that renders these documents has no filesystem.

## How this theme is applied

The model **never writes CSS**. It emits semantic HTML against the `fr-*` class vocabulary, and
`withTheme()` injects the stylesheet at render and download time.

This matters more than it looks. Previously the styling was described to the model in English
with hex codes, so it re-authored a stylesheet on every generation: every document differed
slightly, and pagination had to be repaired afterwards by a defensive override sheet. Owning the
CSS here means documents are identical, print bugs are fixed once, and fixes reach
already-saved documents — nothing is persisted, so there is nothing to migrate.

Documents generated before templates existed are marked `legacy`. They carry their own
model-authored CSS and receive only the original print fixes; layering this stylesheet over CSS
we did not write would restyle them unpredictably.

## Visual theme

Confident purple on white, with deep-indigo darks used sparingly for moments that should feel
weighty — the cover card, a chapter divider, a diagram card. Generous measure, generous leading,
no ornament. A document should read as calm and finished; the brand shows up in one or two
places per page, not everywhere.

## Color roles

| Role | Token |
|---|---|
| Brand / accent, section numbers, table headers | `--purple-primary` `#8015e8` |
| Accent on dark surfaces | `--purple-light` `#ba83f0` |
| Tinted fills — table headers, callouts, form fields | `--purple-tint` `#f7f5ff` |
| Dark surfaces — chapter dividers | `--dark-bg` `#10003a` |
| Body text | `--text-dark` `#242323` |
| Headings | `--foreground` `#171717` |
| Muted — captions, field labels, footers | `--text-secondary` `#686b82` |
| Hairlines | `--color-border` `#dedee5`, `--border-soft` `#ece7fb` |

Two values exist only in documents and are named as such rather than inlined:
`--doc-cover-gradient` (the cover card) and `--doc-figure-bg` (`#150a33`, the diagram card).
Both are darker and more saturated than the web gradient because they must hold white text at
print contrast.

Everything coloured carries `print-color-adjust: exact`. Without it browsers drop the fills and
the document prints as grey text on white.

## Typography

Poppins throughout, loaded from Google Fonts. Headings are **semibold (600)**, matching the design
system — the old prose prompt drifted to 700, which read heavy at document sizes. Body is 16px at
`--leading-body` 1.55.

Document scale: title 46, section `<h2>` 28, `<h3>` 22, body 16, caption 14, eyebrow/label 11–13.
Decks scale up: slide title 40 (54 on the title slide), body 20, stat value 48.

Eyebrows are uppercase, bold, letter-spaced 0.1–0.14em. They are the workhorse label of this
system — used above titles, on cards and inside sections.

## Spacing

4px base (`--space-1` … `--space-20`). Documents use a 820px measure with 48px gutters; slides are
297mm × 167mm with 22–24mm padding. Sections open on `--space-12` (48px); paragraphs sit on 14px.

## Components

`fr-cover`, `fr-toc`, `fr-section`, `fr-sublabel`, `fr-table`, `fr-callout`, `fr-figure`
(`fr-figure-flow` / `fr-node` / `fr-arrow`), `fr-signoff` (`fr-signer` and its fields),
`fr-footer`; and for decks `fr-slide` (`--title` / `--section` variants), `fr-slide-title`,
`fr-slide-body`, `fr-cols`, `fr-stats` / `fr-stat`, `fr-slide-foot`.

Radii: 28px cover, 24px cards, 20px signer cards, 12px chips and fields — larger than the web
kit's 24px card because print viewing distance flattens curvature.

**Section numbers are CSS counters**, not text. `fr-section > h2::before` increments and prints
`N.` in purple. The model writes the title only. `fr-doc--unnumbered` turns this off for the
rebrand template, which must preserve a source's own numbering. Slide numbers work the same way.

## Motion

None. These documents are printed or exported to PDF; the design system's transitions and
hover-lift do not apply.

## Accessibility & print

- Body text is `#242323` on white — comfortably past AA. Muted text is reserved for labels and
  footers, never for content.
- Links stay visibly purple on screen; in print they inherit the text colour except inside
  `fr-figure`, where the underline is the only signal that an interactive diagram exists.
- `break-inside: avoid` is applied **only** to units guaranteed shorter than a page: `tr`, `li`,
  `figure`, the cover card, callouts, figure cards and signer cards. Applying it to a section or a
  whole table causes a page-sized blank gap and then slices the element anyway — the single most
  common pagination bug in this system.
- Tables flow across pages: `table { break-inside: auto }`, `tr { break-inside: avoid }`, and
  `thead { display: table-header-group }` so headers repeat.
- No fixed heights near page height, no `100vh`, no absolute positioning for layout. The running
  footer is the sole `position: fixed` element.

## Voice

"we" (Fruition) and "you" (the client). Proof-led. Sentence case. **monday.com and monday are
always lowercase.** No emoji. Content is never rewritten during a restyle — the source's wording
is preserved verbatim, including its own casing for titles.
