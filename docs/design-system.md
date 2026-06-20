# Design System

Source of truth for tokens, type, spacing, inversion rule, and motion. Visual live view: `/styleguide` route.

> **Migration note (2026-06-21):** The warm-editorial/ember open-redesign direction has been superseded. The theme is now the strict **B&W comfort ledger** described here. shadcn/Radix/lucide/CVA/clsx/tailwind-merge are **removed**. All primitives are hand-rolled in `components/primitives/`. See ADRs D19–D21 in `decisions.md`.

---

## 1. Color Tokens

All tokens are **sRGB grayscale — zero hue**. No colour is introduced anywhere in the theme, including dark mode.

### Light (`:root`)

| Token name | CSS variable | HEX value | Tailwind class | Use |
|---|---|---|---|---|
| Paper | `--paper` | `#FFFFFF` | `bg-paper` | Page background, default surface |
| Ink | `--ink` | `#0A0A0A` | `text-ink`, `bg-ink` | Primary text, inverted-state fills |
| Muted | `--muted` | `#6B6B6B` | `text-muted` | Secondary text, labels |
| Faint | `--faint` | `#9B9B9B` | `text-faint` | Tertiary text, captions, disabled |
| Hairline | `--hairline` | `#E6E6E6` | `border-hairline`, `divide-hairline` | Borders, dividers, table rules |
| Wash | `--wash` | `#F6F6F5` | `bg-wash` | Hover fills, subtle surfaces |

Aliases (for primitive internals — same hex values):

| Alias | Maps to | Use |
|---|---|---|
| `--muted-warm` | `#6B6B6B` | Same as `--muted` |
| `--faint-warm` | `#9B9B9B` | Same as `--faint` |
| `--ring-warm` | `#0A0A0A` | Focus ring = ink |

Motion: `--t-fast: 140ms` (standard fast transition). `--radius: 2px` (border-radius for all primitives).

### Dark (`.dark` — grayscale-only mirror)

`next-themes` applies `.dark` to `<html>`. No hue is introduced. Near-black replaces Paper; near-white replaces Ink.

| CSS variable | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `#111111` | Surface background |
| `--ink` | `#0A0A0A` | `#F2F2F2` | Text + inverted fills |
| `--muted` | `#6B6B6B` | `#9B9B9B` | Secondary text |
| `--faint` | `#9B9B9B` | `#6B6B6B` | Tertiary text |
| `--hairline` | `#E6E6E6` | `#2A2A2A` | Borders / dividers |
| `--wash` | `#F6F6F5` | `#1A1A1A` | Hover fills |
| `--muted-warm` | `#6B6B6B` | `#9B9B9B` | Muted alias |
| `--faint-warm` | `#9B9B9B` | `#6B6B6B` | Faint alias |
| `--ring-warm` | `#0A0A0A` | `#F2F2F2` | Focus ring |

No `dark:` utility sprawl: all dark-mode behaviour is driven by the token layer, not per-component overrides.

---

## 2. No-colour rule

There is no red, green, amber, or any accent hue in the theme. Problem states are communicated by **inversion** (ink block), not colour. This is deliberate and non-negotiable.

---

## 3. Inversion rule

**State is shown by inversion, never colour.**

- Normal (default): Ink text on Paper background.
- Problem / active / feature: Paper text on Ink background — a solid black block.

The utility that implements this is in `app/globals.css @layer utilities`:

```css
.surface-inverted {
  background-color: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}
.surface-inverted *::selection {
  background-color: var(--paper);
  color: var(--ink);
}
```

The alias `.surface-ink` maps to the same `bg-ink / text-paper` pair (without border).

Apply `.surface-inverted` to: problem rows, active filter pills, active nav items, feature stat card, variance-gap rows, connected card on onboarding.

---

## 3a. Interactive hover utility

`.interactive` (in `app/globals.css @layer utilities`) handles clickable surfaces:

```css
.interactive {
  cursor: pointer;
  transition: background-color var(--t-fast) ease-out;
}
.interactive:hover { background-color: var(--wash); }
.surface-inverted.interactive:hover,
.surface-inverted .interactive:hover {
  background-color: color-mix(in srgb, var(--ink) 86%, var(--paper));
}
```

Rules:
- **Normal rows**: hover applies `--wash` — the standard wash in either theme.
- **Inverted rows**: hover applies a `color-mix` that lightens/darkens the inverted surface, keeping text legible.
- **Reduced-motion**: `transition: none` when `prefers-reduced-motion: reduce`.

Use `className="interactive"` on any clickable surface instead of `cursor-pointer hover:bg-wash`.

---

## 3b. Table row interaction utilities

Defined in `app/globals.css`:

| Selector | Effect |
|---|---|
| `tr[data-clickable]` | Enables Wash hover + first-cell 2px inline nudge |
| `tr[data-clickable]:hover td:first-child` | `translateX(2px)` (or `-2px` in RTL) |
| `tr[data-active]` | Keeps Wash background while its drawer is open |
| `.xfade` + `.xfade-in` / `.xfade-out` | 120ms opacity cross-fade on table body (filter/search change) |

All transitions are suppressed under `prefers-reduced-motion: reduce`.

---

## 4. Typography

All fonts are loaded via `next/font/google` in `lib/fonts.ts` and exposed as CSS custom properties.

| Font | CSS variable | Weights | Tailwind class | Use |
|---|---|---|---|---|
| Space Grotesk | `--font-display` | 500, 600, 700 | `font-display` | Page titles, section headers, nav labels, brand wordmark |
| Inter | `--font-sans` | 400, 500, 600 | `font-sans` | Body copy, form labels, table text |
| JetBrains Mono | `--font-mono` | 400, 500, 700 | `font-mono` | All figures: SKU, quantities, prices, gaps, counts, timestamps |
| IBM Plex Sans Arabic | `--font-arabic` | 400, 500, 600, 700 | `font-arabic` | Body/headings under `ar` locale |

> **Note on Inter:** The stitch skill's Inter-ban / accent rule is deliberately overridden here. The product reference (`ui-ux-reference.md`) explicitly mandates Inter for body text alongside Space Grotesk for display. This is an intentional product decision, not an oversight. See ADR D21.

The root layout (`app/[locale]/layout.tsx`) applies all four font-variable classes to `<html>`, then applies `font-arabic` or `font-sans` on `<body>` based on locale.

### Type scale

| Role | Size | Example classes |
|---|---|---|
| Page title (h1 in TopBar) | 18px | `text-[18px] font-display font-semibold` |
| Editorial h2 (overview) | 26px | `text-[26px] font-display font-semibold` |
| Auth page title | 22px | `text-[22px] font-display font-semibold` |
| Section subheader (uppercase) | 13px | `text-[13px] font-display uppercase tracking-widest text-faint` |
| Body / table cell | 13–14px | `text-[13px] font-sans` |
| Big stat number | 34px | `text-[34px] font-mono nums` |
| Chip / eyebrow label | 11px uppercase | `text-[11px] font-sans uppercase tracking-wide` |
| Caption / timestamp | 11px | `text-[11px] font-mono text-faint` |

### Tabular numbers

`body` sets `font-feature-settings: "tnum" 1` globally. The `.nums` utility reinforces this explicitly:

```css
.nums { font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums; }
```

### Western digits rule

All numbers render in Western digits (`0–9`) regardless of locale. `lib/format.ts` enforces `"en-US"` for `Intl.NumberFormat`. Arabic locale gets Arabic-script text but Western numerals — a deliberate ledger reconciliation rule.

---

## 5. Spacing and layout

| Dimension | Value | Where used |
|---|---|---|
| Sidebar width | 236px | `components/shell/Sidebar.tsx` |
| Content padding (desktop) | 28px | `p-7` |
| Content padding (mobile) | 18px | `p-[18px]` |
| Table cell padding | ~10px vertical | `py-2.5 px-3` (`TD`) / `py-2 px-3` (`TH`) |
| Border-radius | 2px | `--radius: 2px`; `rounded-sm` everywhere |
| Sidebar breakpoint (hidden) | md (768px) | `hidden md:block` on sidebar container |

### Responsive behaviour

At widths below `md` (768px):
- Sidebar hidden; `MobileNav` hamburger appears in TopBar.
- Stat strip collapses from 4 → 2 columns (`grid-cols-2 sm:grid-cols-4`).
- Variance rows stack vertically (`grid-cols-1 md:grid-cols-[1fr_2fr_auto]`).
- Tables scroll internally (`overflow-x-auto` wrapper is built into the `Table` primitive).
- Content padding drops from 28px to 18px.

---

## 6. Border-radius

All radius is 2px. `tailwind.config.ts` maps `rounded-sm` to `var(--radius)`. Never exceed this. The design intent is precise and ledger-like.

---

## 7. Motion

Motion is minimal by design.

| Token / class | Value | Where used |
|---|---|---|
| `--t-fast` | `140ms` | All transition-duration values in primitives |
| `.interactive` | `140ms ease-out` | Hover background transitions |
| `tr[data-clickable] td:first-child` | `140ms ease-out` | First-cell inline nudge |
| `.xfade` | `120ms ease-out` | Table body opacity cross-fade on filter/search change |
| `drawer-panel` slide | `220ms ease-out` | Native `<dialog>` drawer slide-in from inline-end |
| Skeleton shimmer | `1.4s ease-in-out infinite` | `@keyframes skeleton-shimmer` |
| Tooltip fade | `150ms ease-out` | Tooltip opacity |
| Menu open | `150ms ease-out` | Menu popover fade + 6px rise |

**Reduced-motion:** all transforms and animations are suppressed when `prefers-reduced-motion: reduce`. The skeleton falls back to a static wash fill; the drawer appears instantly; transitions are removed from `.interactive`, `tr[data-clickable] td:first-child`, and `.xfade`.

---

## 8. Live reference

The `/styleguide` route (`app/[locale]/styleguide/page.tsx`) renders every component in both LTR and RTL. It is real running code — it cannot go stale. Use it to verify any token or component change visually.
