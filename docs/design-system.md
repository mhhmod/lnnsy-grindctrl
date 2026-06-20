# Design System

Source of truth for tokens, type, spacing, inversion rule, and motion. Visual live view: `/styleguide` route.

---

## 1. Color Tokens

HEX values from `ui-ux-reference.md §2` are the design source of truth. shadcn/ui primitives consume `hsl(var(--x))` syntax, so each token is expressed as HSL channels in `app/globals.css :root`. The two representations agree visually; the HEX is what to use in design tools and in this doc.

| Token | HEX (source of truth) | HSL channels in `:root` | CSS variable | Tailwind class | Use |
|---|---|---|---|---|---|
| Paper | `#FFFFFF` | `0 0% 100%` | `--background` | `bg-background` | Page background |
| Ink | `#0A0A0A` | `0 0% 4%` | `--foreground` | `text-foreground`, `bg-foreground` | Text, inverted-state fills |
| Muted text | `#6B6B6B` | `0 0% 42%` | `--muted-foreground` | `text-muted-foreground` | Secondary text, labels |
| Faint | `#9B9B9B` | `0 0% 61%` | `--faint` | `text-faint` | Tertiary text, captions, timestamps |
| Hairline | `#E6E6E6` | `0 0% 90%` | `--border` | `border-border`, `border` (global default) | Borders, dividers, table rules |
| Wash | `#F6F6F5` | `0 0% 96%` | `--muted` / `--accent` | `bg-muted`, `bg-accent`, `hover:bg-accent` | Hover fills, subtle surfaces |

Note: `--muted` (wash surface) and `--accent` both map to `0 0% 96%`. The distinction is semantic: `muted` is a surface, `accent` is interactive hover. `--secondary` also maps to `0 0% 96%`.

`--input` and `--ring` map to Hairline and Ink respectively (`--ring: 0 0% 4%` = focus ring in Ink).

### Where each token lives

- **`app/globals.css :root`** — the single source of all `--*` CSS variables. The comment on each line names the HEX token.
- **`tailwind.config.ts` `theme.extend.colors`** — maps every Tailwind color name to `hsl(var(--x))`. No raw HEX in Tailwind config.

---

## 2. No color rule

There is no red, green, or amber in the theme. `--destructive` maps to Ink (`0 0% 4%`), making destructive the same as primary. The theme literally has nothing to reach for except grays.

---

## 3. Inversion rule

**State is shown by inversion, never by color.**

Normal (default): Ink text on Paper background.
Problem / active / feature: Paper text on Ink background — a solid black block.

The utility that implements this is defined in `app/globals.css @layer utilities`:

```css
.surface-inverted {
  background-color: hsl(var(--foreground));
  color: hsl(var(--background));
  border-color: hsl(var(--foreground));
}
.surface-inverted *::selection {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

Apply `surface-inverted` to any element that must signal: problem row, active filter pill, active nav item, feature stat card, variance row with a gap, connected card on onboarding.

---

## 4. Typography

### Fonts

All fonts are loaded via `next/font/google` in `lib/fonts.ts` and exposed as CSS custom properties:

| Font | Variable | Weight(s) | Tailwind class | Use |
|---|---|---|---|---|
| Space Grotesk | `--font-display` | 500, 600, 700 | `font-display` | Page titles, section headers, nav labels, brand wordmark |
| Inter | `--font-sans` | 400, 500, 600 | `font-sans` | Body copy, form labels, table text |
| JetBrains Mono | `--font-mono` | 400, 500, 700 | `font-mono` | All figures: SKU, quantities, prices, gaps, counts, timestamps |
| IBM Plex Sans Arabic | `--font-arabic` | 400, 500, 600, 700 | `font-arabic` | Body/headings under `ar` locale |

The root layout (`app/[locale]/layout.tsx`) applies all four font-variable classes to `<html>` via `fontVars` from `lib/fonts.ts`, then applies `font-arabic` or `font-sans` on `<body>` based on locale.

### Type scale

| Role | Size | Class examples |
|---|---|---|
| Page title (h1 in TopBar) | 18px | `text-[18px] font-display font-semibold` |
| Auth page title | 22px | `text-[22px] font-display font-semibold` |
| Section subheader | 13–14px | `text-[13px] font-display uppercase tracking-wide` |
| Body / table cell | 13–14px | `text-[13px] font-sans` |
| Big stat number | 30px | `text-[30px] font-mono nums` |
| Chip / eyebrow label | 11px uppercase | `text-[11px] font-sans uppercase tracking-wide` |
| Caption / timestamp | 11–12px | `text-[11px] font-mono text-faint` |

### Tabular numbers

The `nums` utility (defined in `app/globals.css @layer utilities`) enables tabular numerals:

```css
.nums { font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums; }
```

`body` also sets `font-feature-settings: "tnum" 1` globally, so all text defaults to tabular figures. Apply `nums` explicitly on any cell that must be monospace-aligned (stat values, totals, gap columns).

### Western digits rule

All numbers render in Western digits (`0–9`) regardless of locale. `format.ts` enforces `"en-US"` for `Intl.NumberFormat`. Arabic locale gets Arabic script text but Western numerals — a deliberate ledger reconciliation rule.

---

## 5. Spacing and layout

| Dimension | Value | Where used |
|---|---|---|
| Sidebar width | 236px | `components/shell/Sidebar.tsx` — `w-[236px]` |
| Content padding (desktop) | 28px | `p-7` (`7 × 4px = 28px`) |
| Content padding (mobile) | 18px | `p-[18px]` |
| Content max-width | 1080px | Styleguide page: `max-w-[1080px]`. App screens use full-width flow. |
| Table row padding | ~11px vertical | `py-3` on table cells |
| Border-radius | 2px | `--radius: 2px`; mapped to `rounded-lg`, `rounded-md`, `rounded-sm` all via `var(--radius)` in `tailwind.config.ts` |
| Sidebar breakpoint (hidden) | md (768px) | `hidden md:block` on the sidebar container |

### Responsive behavior

At widths below the `md` breakpoint (768px):
- Sidebar is hidden; `MobileNav` hamburger appears in the TopBar.
- Stat strip collapses from 4 columns to 2 columns (`grid-cols-2 sm:grid-cols-4`).
- Variance rows stack vertically (`grid-cols-1 md:grid-cols-[1fr_2fr_auto]`).
- Tables scroll internally (`overflow-x-auto` wrappers).
- Content padding drops from 28px to 18px.

---

## 6. Border-radius

All radius is 2px. `tailwind.config.ts` maps `lg`, `md`, and `sm` borderRadius variants to `var(--radius)` (2px). Never use `rounded` classes that exceed this. The design intent is precise and ledger-like, not rounded or friendly.

---

## 7. Motion

Motion is minimal by design.

- The order detail `Sheet` (drawer) slides in from the right.
- Section changes are instant or a quick CSS fade.
- The `prefers-reduced-motion` media query must be respected. No explicit override of the Radix default (which already respects it). Do not add duration/transition utilities that bypass reduced-motion.

---

## 8. Live reference

The `/styleguide` route (`app/[locale]/styleguide/page.tsx`) renders every component in both LTR and RTL. It is real running code — it cannot go stale. Use it to verify any token or component change visually.
