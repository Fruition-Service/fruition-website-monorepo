---
name: design-system
description: Fruition design system rules — semantic tokens, the three-breakpoint grid, type scale, component vocabulary, and the anti-patterns that break mobile. Use for ANY change to marketing UI, styling, layout, colour, spacing or typography under src/.
---

# Design system

Authoritative sources, in this order: `DESIGN.md` (tokens, scale, components), `PRODUCT.md`
(strategy, brand personality, anti-references), `src/app/globals.css` (the tokens themselves).
Read `DESIGN.md` before a substantial visual change — this skill is the working summary.

`ai-capability-assessment` is the **design anchor page**. When unsure how something should look,
match it.

## Non-negotiables

A PostToolUse hook (`.claude/hooks/design-guard.mjs`) blocks these on any line you touch:

1. **No raw hex.** Every colour, radius and shadow comes through a semantic token:
   `bg-surface`, `bg-surface-subtle`, `text-body`, `text-muted`, `border-ui`, `rounded-card`,
   `shadow-card`. The site has pre-existing hardcoded hex; the hook ignores those lines and
   blocks new ones. Do not "fix" legacy hex opportunistically — that is a separate PR.
2. **Three breakpoints only:** base, `md:` (768px), `lg:` (1024px). No `sm:`, `xl:`, `2xl:`.
   Design mobile-first from a single column. Mobile type is one size down from desktop.
3. **No inline `style={{}}` for layout or typography.** Inline pixel values are the documented
   root cause of the site's broken mobile pages. Use Tailwind utilities.
4. **Poppins and Inter only.** Inter is the label voice for eyebrows and labels, never sentences. It is
   still reached through `font-mono` (Tailwind) and `--mono` (Version C); real code uses `font-code`.
5. **Never define CSS outside `@layer`** — unlayered rules beat Tailwind utilities and have
   already shipped visible bugs (the double sticky-CTA button).
6. **Never rewrite page copy or Sanity content during visual work.** Presentation only.

## Vocabulary

- Open a section with a **mono eyebrow**; draw structure with 1px hairlines and surface
  alternation, not boxes-in-boxes.
- Type sizes come from the `clamp()` roles in DESIGN.md §3 — not per-element overrides.
- Max display size 6rem; never track tighter than `-0.04em`.
- Purple is an accent: roughly ≤10% of any screen.

## Don't

- **No AI-hype aesthetic** — no neon, sparkles, glassmorphism, or "magic" language. AI is
  presented as engineering.
- **No Wix-era drift** — no per-page fonts, no Montserrat, no new button variants, no one-off
  hardcoded section layouts.
- **No legacy blues** — `#4674FB` and `#579bfc` are retired.

## Accessibility

Body contrast ≥4.5:1. Every animation needs a `prefers-reduced-motion` alternative.

## The portal is different

`/internal` uses **shadcn/ui only**, with its own self-contained neutral theme inside
`globals.css`. Never hand-roll a button, dialog, table or form control there, and do not apply
the marketing palette to it.
