---
name: Fruition Services
description: Engineering-grade consultancy marketing site — white surface, mono-labeled precision, one voltage-purple accent.
colors:
  voltage-purple: "#8015e8"
  lilac-glow: "#ba83f0"
  royal-depth: "#550e9b"
  midnight-violet: "#10003a"
  midnight-violet-deep: "#2b074d"
  terminal-black: "#15131c"
  paper-white: "#ffffff"
  cool-paper: "#ecf1fc"
  ink: "#242323"
  ink-soft: "#686b82"
  hairline: "#dedee5"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(2rem, 6vw, 4.875rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.375rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-lead:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  badge: "8px"
  chip: "12px"
  panel: "16px"
  card: "20px"
  card-lg: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  section: "96px"
  section-mobile: "56px"
components:
  button-primary:
    backgroundColor: "{colors.voltage-purple}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.royal-depth}"
    textColor: "{colors.paper-white}"
  button-secondary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-secondary-hover:
    textColor: "{colors.voltage-purple}"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "36px 32px"
  eyebrow:
    textColor: "{colors.voltage-purple}"
    typography: "{typography.label}"
---

# Design System: Fruition Services

## 1. Overview

**Creative North Star: "The Consultant's Terminal"**

Fruition sells engineering-grade workflow and AI implementation, and the design proves it the way an engineer would: a clean white worksheet, precise hairline rules, monospaced labels that read like annotations in a well-kept log, and one confident voltage-purple accent. The system is *precise but approachable* — big friendly Poppins headlines carry the human voice, while the JetBrains Mono metadata layer (eyebrows, stat tags, pricing rows, terminal panels) carries the proof-of-work. The overall impression: a consultancy whose website looks like it was built by the same people who will build your systems. Because it was.

The system explicitly rejects the **AI-hype aesthetic** (dark-mode neon, sparkle icons, glassmorphism, "magic" language) and the site's own **Wix-era legacy drift** (per-page fonts, competing button styles, hardcoded one-off layouts, desktop-only pages). Light theme only, site-wide, by design.

**The Three Screens Rule.** Every surface is designed for exactly three widths: mobile (<768px), tablet (`md:` ≥768px), desktop (`lg:` ≥1024px). No other breakpoints. Layout collapses to one column on mobile; section padding drops from 96px to 56px. A layout that only works at one of the three widths is unfinished.

**Key Characteristics:**
- White surface, cool-paper alternating sections, structure drawn with 1px hairlines rather than shadows
- One accent (voltage purple) used sparingly; mono labels mark every data moment
- Big, tight-tracked Poppins headlines with mid-sentence purple accent spans
- Pill buttons, 20px-radius cards, dashed-rule data tables, dark terminal panels as the signature flourish
- Fluid `clamp()` type — mobile automatically renders one step down, no breakpoint classes needed

## 2. Colors

A restrained palette: near-black ink on white paper, with a single voltage-purple voice and a violet-black reserved for immersive moments.

### Primary
- **Voltage Purple** (#8015e8): The only accent. CTAs, accent spans inside headlines, eyebrow labels, hover borders, link states, the marquee strip. It is the brand's voice — when it speaks, it should be the only color speaking.
- **Lilac Glow** (#ba83f0): Exclusively the right stop of the primary CTA gradient (`linear-gradient(to right, #8015e8, #ba83f0)`). Never used alone as text or surface.
- **Royal Depth** (#550e9b): Hover/pressed darkening of the accent; accent text on tinted surfaces when extra contrast is needed.

### Secondary
- **Midnight Violet** (#10003a) and **Midnight Violet Deep** (#2b074d): The dark immersive surfaces — footer, dark CTA banners, sticky CTA bar gradient. White text on these, always.
- **Terminal Black** (#15131c): The signature terminal/log panels only. Mono text in muted grays (#cfd0d6) with accent-colored tags.

### Neutral
- **Paper White** (#ffffff): Default page surface and card background.
- **Cool Paper** (#ecf1fc): Alternating section background; the subtle blue tint keeps white cards legible on top of it.
- **Ink** (#242323): All headings and body text.
- **Ink Soft** (#686b82): Leads, card body copy, captions, metadata values. Never below 14px on Cool Paper (contrast).
- **Hairline** (#dedee5): 1px borders, dividers, dashed table rules. The system's structural pencil line.

### Named Rules
**The One Accent Rule.** Voltage purple covers at most ~10% of any screen. If a section feels flat, the fix is type scale, spacing, or a mono label — not more purple.

**The Semantic Token Rule.** Components consume colors only through the semantic tokens in `globals.css` (`bg-surface`, `bg-surface-subtle`, `text-body`, `text-muted`, `border-ui`, `bg-brand`…). A raw hex value in a component file is a defect.

## 3. Typography

**Display Font:** Poppins (with system-ui fallback)
**Body Font:** Poppins
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** One warm geometric sans doing all the talking, one engineer's monospace doing all the annotating. Poppins at 700 with tight tracking is confident and human; JetBrains Mono at 12px uppercase is the precision layer. Montserrat is retired — any remaining use is legacy debt.

### Hierarchy
- **Display** (700, `clamp(2rem, 6vw, 4.875rem)`, 1.05, -0.035em): Hero H1 only. Mid-sentence emphasis via an accent-colored span, never a whole accent line.
- **Headline** (700, `clamp(1.75rem, 4vw, 3.5rem)`, 1.04, -0.03em): Section H2s.
- **Title** (600, `clamp(1.25rem, 2vw, 1.375rem)`, 1.25, -0.015em): Card and feature titles (H3/H4).
- **Body Lead** (400, `clamp(1.0625rem, 1.5vw, 1.1875rem)`, 1.5): Hero leads and section leads, always in Ink Soft, max 56–64ch.
- **Body** (400, 1rem, 1.55): Standard copy, max 65–75ch. Card body copy may drop to 15px/14px in Ink Soft.
- **Label** (JetBrains Mono, 600, 0.75rem, 0.14em tracking, UPPERCASE): Eyebrows, step tags, stat labels, table headers, pricing metadata.

### Named Rules
**The One-Step-Down Rule.** Mobile renders every role one visual step smaller than desktop. This is achieved by the `clamp()` values above — never by sprinkling `text-3xl md:text-5xl` per element. If a heading needs a size utility, the type scale is wrong; fix the scale.

**The Mono Voice Rule.** JetBrains Mono marks *metadata* — labels, tags, timestamps, prices, stats. It never sets body copy, headings, or CTAs. If it's a sentence, it's Poppins; if it's an annotation, it's mono.

## 4. Elevation

The system is flat-by-default: depth is drawn with 1px hairline borders and surface alternation (Paper White ↔ Cool Paper), not shadows. Shadows exist only as whisper-quiet ambience under cards and as a response to hover. Dark surfaces (terminal panels, sticky CTA) may carry one deeper ambient shadow to lift them off the page.

### Shadow Vocabulary
- **Whisper** (`0 4px 24px rgba(0,0,0,0.03)`): Resting ambience under panels that sit on Cool Paper.
- **Micro** (`0 1px 4px rgba(16,24,40,0.04)`): Chips, badges, small UI.
- **Card** (`0 1px 17px rgba(0,0,0,0.08)` / anchor variant `0 1px 17px rgba(0,0,0,0.04)`): Default card resting shadow.
- **Hover Lift** (`0 12px 30px rgba(0,0,0,0.06)` + `translateY(-3px)` + accent border): The one sanctioned hover response for cards.
- **CTA Glow** (`0 6px 20px rgba(128,21,232,0.25)`): Primary button only; deepens to 0.35 alpha on hover.

### Named Rules
**The Hairline-Not-Shadow Rule.** If you need to separate two things, reach for a 1px Hairline border or a surface change first. A shadow that reads as a visible gray smudge is too dark.

## 5. Components

### Buttons
- **Shape:** Full pill (9999px radius), 14px/600 Poppins label, 44px+ hit area, `padding: 14px 26px`.
- **Primary:** Voltage→Lilac gradient, white text, CTA Glow shadow. Hover: `translateY(-1px)` + deeper glow, gradient holds or deepens to Royal Depth. *(The legacy `#4674FB` blue hover swap on `.cta-btn` is deprecated — hover stays in the purple family.)*
- **Secondary:** Paper White fill, 1px Hairline border, Ink text. Hover: border and text shift to Voltage Purple.
- **On dark surfaces:** Primary = white pill with purple text; secondary = transparent with 1px white outline.
- Long labels wrap on mobile rather than overflowing; a shorter `mobileLabel` variant is preferred.

### Eyebrow (signature micro-component)
- Mono Label type in Voltage Purple, 18px below-margin, optionally prefixed with `★` or `//`. Every major section opens with one. This is the single highest-leverage "terminal" cue.

### Cards / Containers
- **Corner Style:** 20px (grid cards) or 24px (feature panels).
- **Background:** Paper White, 1px Hairline border, Card shadow at rest.
- **Hover:** Accent border + Hover Lift. Never scale, never glow.
- **Internal Padding:** 36px 32px desktop, 30px 26px compact, ~24px mobile.
- **Content pattern:** mono `cap-num`/tag → Title → Ink Soft body → optional hairline-separated mono meta row.

### Data rows (pricing, regions, comparison)
- Rows separated by 1px *dashed* Hairline rules; label left in 500 weight, value right in mono Ink Soft. This dashed-ledger pattern is a brand signature — prefer it over enclosed tables.

### Terminal / Log Panel (signature component)
- Terminal Black background, 1px #2a2733 border, 16px radius, 22px padding, mono 12px. Muted gray text with accent-colored tags (`[SCAN]`, `[DONE]` in green #7be08a, warnings #ffd03d). Used in heroes and proof sections to show *work being done*. Use at most one per page.

### Navigation
- White bar, Ink links (15px/500), Voltage Purple active state, pill "Book a Time" primary CTA right-aligned. Mobile: hamburger to full-screen sheet, 44px+ targets.

### Inputs / Fields
- Paper White fill, 1px Hairline border, 12px radius, Ink text. Focus: Voltage Purple border + soft `rgba(128,21,232,0.08)` ring. Error: message in plain language below the field.

### Page layout (Oct 2026 theme, after senzo.com.au)
- **One container:** `.site-container` (1248px, 16px gutter, 24px from `md:`) for heroes, every section, nav and footer. No page opens its own wider or narrower outer container; a narrower measure goes inside it, left-aligned. There is no visible breadcrumb trail (removed 28 Oct 2026); BreadcrumbList JSON-LD still renders site-wide.
- **One rhythm:** `.section-y` gives every shared section 56 / 80 / 96px top and bottom.
- **Heroes:** `.hero-band` (white, hairline bottom rule). On desktop the copy sits left with stacked CTAs and the visual sits right; banner media (3:1 and wider) runs full width under the copy instead. Phones stay one column.
- **Section heads** are left-aligned (eyebrow, H2, lead), not centred.

## 6. Do's and Don'ts

### Do:
- **Do** consume every color, radius, and shadow through the semantic tokens in `globals.css` — `bg-surface`, `bg-surface-subtle`, `text-body`, `text-muted`, `border-ui`, `rounded-card`, `shadow-card`.
- **Do** use exactly three widths — base, `md:` (768px), `lg:` (1024px) — and design mobile-first from a single column.
- **Do** open sections with a mono eyebrow and draw structure with 1px hairlines and surface alternation.
- **Do** put type sizes in the `clamp()` roles above; mobile sizing comes from the scale, not from per-element overrides.
- **Do** keep all copy and Sanity content intact during redesign work — presentation changes only.
- **Do** give every animation a `prefers-reduced-motion` alternative and keep body contrast ≥4.5:1.

### Don't:
- **Don't** ship the **AI-hype aesthetic**: no dark-mode neon, no sparkle icons, no glassmorphism, no "magic" language. AI is presented as engineering.
- **Don't** regress into **Wix-era legacy drift**: no per-page fonts, no Montserrat, no new button variants, no hardcoded one-off section layouts.
- **Don't** write layout or typography as inline `style={{...}}` — inline pixel values are the root cause of the site's broken mobile pages.
- **Don't** define CSS outside `@layer` — unlayered rules override Tailwind utilities and have already caused visible bugs (the double sticky-CTA button).
- **Don't** use JetBrains Mono for sentences, or purple for more than ~10% of a screen.
- **Don't** use the legacy `#4674FB` blue hover, `#579bfc` hovers, or any color not in the palette above.
- **Don't** exceed a 6rem display size or track tighter than -0.04em — big is confident, shouting is not.
