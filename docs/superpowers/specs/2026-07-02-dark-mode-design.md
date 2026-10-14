> **Superseded:** dark mode was disabled site-wide (light theme only, see PRODUCT.md). Kept for history.

# Site-wide Dark Mode — Design Spec

**Date:** 2026-07-02
**Status:** Approved (design), pending spec review
**Scope:** Fruition landing site (`fruition-landing`), all pages/components

## Problem

The site has no intentional dark mode. It also declares no `color-scheme`, so
mobile Chrome/Android **auto-dark-theme** force-inverts the page (black bg, white
text) on phones — producing an unintentional, inconsistent look that desktop
browsers don't show. We want a deliberate, brand-owned dark theme that renders
identically across devices.

## Decisions (locked with stakeholder)

- **Trigger:** OS only — `@media (prefers-color-scheme: dark)`. No toggle, no JS
  state, no persistence, no SSR flash. Tailwind v4's `dark:` variant already maps
  to this media query by default (no custom variant is configured).
- **Palette:** "Neutral ink" — near-black neutral surfaces, brand purple as accent.
- **Rollout:** All at once — every page and component converted before shipping,
  in a single feature branch. No half-dark intermediate state in production.
- **Imagery:** Frame light-background media (screenshots, client/carousel logos,
  testimonial logos, CMS images) in a subtle light card in dark mode so they read
  as intentional cards, not glaring rectangles.

## Approach

**Semantic token layer + component sweep** (chosen over inline `dark:` retrofit and
global CSS overrides).

Colors today are hardcoded across ~183 `.tsx` files: `bg-white` ×225 occurrences,
arbitrary `[#hex]` ×232, `text-gray/black/slate` ×190. We introduce semantic CSS
variables that flip in the dark media query, expose them as Tailwind theme tokens,
and migrate components off hardcoded colors onto the tokens. This gives a single
source of truth so the whole palette can be tuned in one place.

Rejected alternatives:
- **Inline `dark:` retrofit** — scatters dark values across every file,
  unmaintainable, easy to miss spots. (Acceptable only for the one-off Navbar,
  already done; it will be re-based onto tokens during the sweep.)
- **Global CSS `!important` overrides** — arbitrary-hex utility classes bake literal
  values that can't be cleanly overridden. Fragile.

## Design

### A. Token system (`src/app/globals.css`)

Add semantic variables to `:root` (light values) and override them inside
`@media (prefers-color-scheme: dark)`. Expose via the existing `@theme inline`
block so utilities like `bg-surface`, `text-body`, `border-ui` exist.

| Token (utility) | Light | Dark |
|---|---|---|
| `--surface` (`bg-surface`) — page bg | `#ffffff` | `#0f1115` |
| `--surface-raised` (`bg-surface-raised`) — cards/dropdowns | `#ffffff` | `#1a1d24` |
| `--surface-subtle` (`bg-surface-subtle`) — soft sections (was `#ecf1fc`) | `#ecf1fc` | `#161922` |
| `--text` (`text-body`) — body text | `#242323` | `#f2f3f5` |
| `--text-muted` (`text-muted`) — secondary (was `#686b82`) | `#686b82` | `rgba(255,255,255,.62)` |
| `--border` (`border-ui`) | `#dedee5` | `rgba(255,255,255,.12)` |
| brand `#8015e8`, brand-light `#ba83f0` | unchanged | unchanged (accent both modes) |

Notes:
- Some of these tokens already exist in `@theme` (`--color-surface-subtle`,
  `--color-text-muted`, `--color-border-ui`); wire the dark overrides through the
  underlying primitives so existing token consumers get dark for free.
- Body base: set `background: var(--surface)` and `color: var(--text)` on
  `body`/root so any unconverted stray still sits on the right base.

### B. Component migration sweep (all `.tsx`)

Map the frequent hardcoded classes to tokens, file by file:
- `bg-white` → `bg-surface` (page-level) or `bg-surface-raised` (cards/elevated).
  Reviewer decides per usage; default `bg-surface` unless the element is a raised
  card/dropdown/modal.
- `text-[#242323]`, `text-black`, `text-gray-800/900`, `text-slate-900` → `text-body`
- muted greys (`text-[#686b82]`, `text-gray-400/500/600`) → `text-muted`
- `border-gray-100/200`, `border-[#dedee5]` → `border-ui`
- `bg-[#ecf1fc]` and light section backgrounds → `bg-surface-subtle`
- One-off brand hexes (purples, oranges, blues) → reviewed case-by-case; keep if
  they read acceptably on both surfaces, else add a token.

The Navbar (already given inline `dark:` classes) is rebased onto tokens for
consistency.

### C. Section themes (Sanity `theme` prop)

Reusable section components accept `theme="light" | "dark"`.
- `light` sections → map to `--surface` / `--surface-subtle`, so they darken with
  the page.
- `dark` sections → keep the deep-purple brand band (`#10003a` / `#2b074d`) as an
  intentional accent; it still contrasts against the neutral-ink page.

### D. Imagery — `FramedMedia` wrapper

A small wrapper component: in dark mode it renders a subtle light, rounded,
bordered card behind the media so light-background assets look intentional; in
light mode it's a pass-through (no visual change). Apply to:
- Content screenshots
- Client logo cloud / carousel logos
- Testimonial logos
- CMS-driven `<Image>` content where the background is unknown

Decorative SVG illustrations and transparent-background assets are reviewed
individually (many won't need framing). The top-left site logo is already handled
(black/white swap) and stays as-is.

### E. Edge cases

- **CTAs / gradients** — unchanged; the purple gradient pill pops on dark.
- **Shadows** — box-shadows read weak on dark. In dark mode, soften/replace
  card shadows with a subtle border or faint glow (token-driven).
- **Form inputs** — dark surface + `border-ui`, `text-body`, muted placeholder.
- **`color-scheme` meta** — add `<meta name="color-scheme" content="light dark">`
  (or root `color-scheme: light dark`) so browsers stop auto-inverting on mobile
  and native form controls/scrollbars match. This fixes the phone behavior.

### F. QA

- Playwright screenshots of **all 61 pages** in both light and dark.
- Review each for: contrast, invisible text, glaring images, broken section bands,
  form legibility.
- Fix, re-shoot, then a single feature-branch merge.

## Out of scope

- Manual dark/light toggle (may revisit later; architecture doesn't preclude it —
  switching the trigger from media query to a `.dark` class is a localized change).
- Redesigning any layout or content; this is a theming pass only.

## Success criteria

- With OS set to dark, every page renders in the neutral-ink dark theme with
  legible text, framed imagery, and intact brand accents — consistent on desktop
  and mobile.
- With OS light, the site is visually unchanged from today.
- No hardcoded `bg-white` / body text hex remains in the common path; palette is
  tunable from `globals.css` tokens.
