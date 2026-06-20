# Redesign: Warm Editorial Ledger + de-shadcn — Implementation Plan

> Executes consecutively; each phase ends green (tests + build + lint) and commits. Branch: `redesign/warm-editorial-ledger`.

**Goal:** Retire shadcn/ui + Radix + lucide-react + class-variance-authority + clsx/tailwind-merge entirely, and rebuild the UI in a new **Warm Editorial Ledger** aesthetic with hand-rolled, accessible primitives. Keep: data layer (`lib/*`), i18n (next-intl), `next-themes`, tests, static-export + GitHub Pages deploy. The variance/reconciliation story stays the hero.

**Stack after:** Next.js 16 (App Router, static export) + TS, Tailwind v3 (OKLCH token layer), next-intl v4, next-themes. **No** component library, **no** Radix, **no** lucide/CVA/clsx/tailwind-merge.

**Design authorities:** impeccable (register = product; OKLCH; one meaningful accent; anti-slop; no em dashes), ui-ux-pro-max (data-dense discipline, tabular numerics, a11y), gpt-taste (premium display type, motion physics, no cheap meta-labels, no invisible text).

---

## Phase 0 — Locked design system (the new source of truth)

### Color — OKLCH token layer (replaces the HSL/shadcn vars)
All tokens become OKLCH triplets in `app/globals.css`, consumed via `oklch(var(--token))` in `tailwind.config.ts`. Warm neutrals (hue ~70, tiny chroma). ONE accent (ember/oxblood) used ONLY for meaning: variance gap, problem order statuses (Cancelled/Failed/Returned), low/out stock, the Unexplained-units stat.

**Light (`:root`):**
```
--paper:        0.985 0.004 80   /* warm off-white bg */
--ink:          0.205 0.012 60   /* warm near-black text */
--muted:        0.505 0.010 60   /* secondary text */
--faint:        0.660 0.008 65   /* tertiary/captions */
--hairline:     0.900 0.005 75   /* borders */
--wash:         0.965 0.005 78   /* hover/subtle fill */
--accent:       0.505 0.150 35   /* ember: gap/problem */
--accent-weak:  0.945 0.030 40   /* ember tint surface */
--on-accent:    0.985 0.004 80   /* text on ember */
--ring:         0.205 0.012 60   /* focus = ink */
```
**Dark (`.dark`):**
```
--paper:        0.180 0.008 60
--ink:          0.950 0.004 80
--muted:        0.700 0.010 70
--faint:        0.520 0.008 65
--hairline:     0.300 0.008 60
--wash:         0.235 0.008 60
--accent:       0.640 0.150 40   /* brighter ember on dark */
--accent-weak:  0.300 0.060 38
--on-accent:    0.180 0.008 60
--ring:         0.950 0.004 80
```
Rules: never pure #000/#fff (these aren't). Accent is the ONLY hue; everything else is warm-neutral. Problem/gap = accent; non-problem = ink-on-paper. Inversion is retired as the primary signal (accent replaces it), but a solid ink block may still be used for the active nav item.

### Typography (next/font)
- **Display / headings / nav:** Cabinet Grotesk — load via `next/font/local` from committed woff2 in `app/fonts/` (Fontshare, free). If the binary can't be obtained at build time, fall back to **Hanken Grotesk** (`next/font/google`). Variable name `--font-display`.
- **Body / labels:** Geist (`next/font/google`), `--font-sans`.
- **All figures / SKUs / money / counts:** Geist Mono (`next/font/google`), `--font-mono`, tabular numerics.
- **Arabic:** IBM Plex Sans Arabic (keep), `--font-arabic`.
- Scale (editorial, ≥1.25 ratio): caption 12 / body 14 / label 13 / section 15 / page-title 22-28 / hero numeral 34-44. Western digits in both locales.

### Layout & motion
- Editorial rhythm: generous, varied spacing (not uniform padding); asymmetric screen headers (title + lead line). Content max ~1120px. Hairline rules, 2px radius retained.
- Tables: dense but airy rows (~12px), tabular figures right-aligned (logical `text-end`), ember only on problem rows' key cell, not whole-row fills (quieter than the old inversion).
- Variance gauge: a horizontal track on a shared scale; the **gap segment** fills with the ember (solid for missing, hatched/40% for extra); two ticks (expected, at Bosta). Draw-in on mount (ease-out, respects reduced-motion).
- Motion: ease-out only (no bounce); 150-300ms; one or two elements per view; `prefers-reduced-motion` honored.

### Components inventory (old shadcn → new hand-rolled, in `components/primitives/`)
| Old (`components/ui/*`, Radix) | New (hand-rolled, no deps) |
|---|---|
| `button` (CVA) | `Button.tsx` — variant map object, native `<button>` |
| `badge` | `Chip.tsx` — muted / accent / mono variants |
| `input` | `Input.tsx` — styled native input, focus ring = ink |
| `table` | `Table.tsx` — styled native `<table>` parts |
| `skeleton` | `Skeleton.tsx` — div + shimmer (reduced-motion safe) |
| `toggle-group` (Radix) | `Segment.tsx` — `role="group"`, `aria-pressed`, arrow-key roving tabindex |
| `dropdown-menu` (Radix) | `Menu.tsx` — native **Popover API** (`popover` attr) + `aria-expanded`/`role="menu"`, Escape + click-outside via popover light-dismiss |
| `sheet` (Radix) | `Drawer.tsx` — native `<dialog>` (`showModal()`): free focus-trap, `::backdrop` scrim, Escape; slide from inline-end |
| lucide icons | `components/icons/*.tsx` — inline SVG (currentColor) |
| `cn` (clsx+tw-merge) | `lib/cx.ts` — tiny `cx(...parts)` join |

Accessibility targets (ui-ux-pro-max §1-2): contrast ≥4.5:1 (verify ember on paper/dark), visible focus rings, full keyboard nav, 44px targets, labels on icon-only controls, reduced-motion.

---

## Phase 1 — New foundation alongside the old (keep build green)

### 1.1 OKLCH tokens + fonts + cx
- `app/globals.css`: replace `:root`/`.dark` token blocks with the OKLCH sets above; keep `@tailwind` layers. Replace `.surface-inverted` with new utilities: `.surface-accent` (ember bg, on-accent text) and keep a `.surface-ink` (ink bg, paper text) for the active nav only. Add `.interactive` hover (wash in light/dark; no inversion conflict now). Add `.gauge-fill` helpers if needed.
- `tailwind.config.ts`: map colors to `oklch(var(--token))` (paper, ink, muted, faint, hairline, wash, accent, accent-weak, on-accent, ring). Keep `darkMode: ["class"]`, fonts (`display/sans/mono/arabic`), radius 2px.
- `lib/fonts.ts`: Cabinet Grotesk via `next/font/local` (add `app/fonts/CabinetGrotesk-*.woff2`; if unavailable, Hanken Grotesk via google), Geist + Geist_Mono via `next/font/google`, keep IBM Plex Sans Arabic. Export `fontVars`.
- `lib/cx.ts`: `export function cx(...parts: Array<string | false | null | undefined>) { return parts.filter(Boolean).join(" "); }`
- Verify: `npm run build` green (old components still import `cn` from `lib/utils` and Radix — untouched this step). Commit: `feat(redesign): OKLCH warm token layer, fonts, cx util`.

### 1.2 Hand-rolled primitives (in `components/primitives/`)
Build each with the new tokens + `cx`, fully accessible. One commit per small group; after each, `npm run build` + `npx tsc --noEmit` green.
- `Button.tsx`, `Chip.tsx`, `Input.tsx`, `Skeleton.tsx`, `Table.tsx` (+ parts), `SegmentedFilter.tsx`, `Menu.tsx` (Popover API), `Drawer.tsx` (native `<dialog>`), `components/icons/*` (inline SVG: chevron, close, search, sun, moon, glyphs S/B, plus any used).
- Add focused tests where logic exists (e.g., `SegmentedFilter` keyboard roving, `Menu` open/close state) — keep the suite green.
- Provide a temporary `components/primitives/_demo` usage in the styleguide later (Phase 3).
- Commit(s): `feat(redesign): hand-rolled accessible primitives (dialog drawer, popover menu, segmented filter, button, chip, input, table, icons)`.

---

## Phase 2 — Migrate screens to new primitives + aesthetic

For each surface, swap `@/components/ui/*` imports to `@/components/primitives/*`, apply the editorial layout + ember-for-meaning rules, and remove `surface-inverted` usage (replace with `surface-accent` only on problem key-cells / chips, not whole rows unless intentional). Keep all data wiring, i18n keys, RTL logical props, and behavior identical.

- 2.1 App shell: `Sidebar`, `TopBar` (Brandmark, ThemeToggle, LocaleSwitcher), `TenantSwitcher` (→ `Menu`), `MobileNav` (→ `Menu`/`Drawer`). Editorial header treatment. Commit.
- 2.2 Overview: stat strip (Unexplained units = ember feature stat, not inverted), needs-attention list (ember key cells). Commit.
- 2.3 Orders + `OrderDrawer` (→ `Drawer` dialog) + `SegmentedFilter` for status filters (active = ink/accent). Problem statuses = ember chip. Commit.
- 2.4 Inventory: search `Input`, `Table`, stock status chips (Out/Low = ember). Phase-2 columns stay disabled/"SOON". Commit.
- 2.5 Variance (signature): the new ember gauge with shared scale + draw-in; figures in Geist Mono; problem rows quiet with ember gap. Commit.
- 2.6 Returns (empty state), Settings (workspace grid + connections), Login + Onboarding (apply gpt-taste editorial polish here: confident type, generous space, no cheap labels, perfectly legible buttons). Commits.
- After each: `npm run build` + `npm test` + `npx tsc --noEmit` green.

---

## Phase 3 — Remove shadcn/Radix/lucide/CVA/clsx + styleguide

- 3.1 Delete `components/ui/` entirely and `components.json`. Grep to confirm no remaining `@/components/ui/` or `lib/utils` `cn` imports; migrate any stragglers to `cx`/primitives. Delete `lib/utils.ts` if only `cn` lived there (or replace its body with re-export of `cx`).
- 3.2 Uninstall deps: `npm uninstall @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-slot lucide-react class-variance-authority clsx tailwind-merge` (verify exact installed Radix packages first via `npm ls`). Confirm `package.json` has none of them; `next-themes` + `next-intl` remain.
- 3.3 Rewrite `app/[locale]/styleguide/page.tsx` to showcase the NEW primitives in every state, light + dark, LTR + RTL.
- 3.4 Verify: `npm run build` (no missing-module errors), `npm test`, `npm run lint`, `npx tsc --noEmit` all green. Grep guard: zero `radix`, `lucide`, `class-variance-authority`, `clsx`, `tailwind-merge`, `components/ui`, `cn(` references. Commit: `chore(redesign): remove shadcn, Radix, lucide, CVA, clsx/tailwind-merge`.

---

## Phase 4 — Docs / reference rewrite (evidence stays first-class)

- Rewrite `ui-ux-reference.md` to describe the Warm Editorial Ledger system (supersede the B&W ledger; keep variance as the signature; note the accent-for-meaning rule).
- Update `docs/design-system.md` (OKLCH tokens light+dark, type stack, accent rule, motion), `docs/components.md` (new primitives, hand-rolled a11y notes, no-deps), `docs/screens.md` (any layout changes), `docs/decisions.md` (ADRs: D15 open redesign + direction rationale, D16 de-shadcn/hand-rolled primitives via native dialog + Popover API, D17 OKLCH warm token layer + ember accent, D18 type stack), `docs/traceability.md` (new component paths). Commit: `docs: warm editorial ledger design system + de-shadcn decisions`.

---

## Phase 5 — Verify matrix + deploy

- 5.1 Gates: `npm test` (all green), `npm run lint`, `npx tsc --noEmit`, `npm run build` (static export, route count unchanged).
- 5.2 Live Playwright matrix (dev server): Overview, Orders (+ open the `<dialog>` drawer; confirm focus trap, Escape, `::backdrop` scrim, single close), Inventory (hover problem rows), Variance (ember gauge + draw-in), tenant `Menu` (Popover open/keyboard/Escape), Login/Onboarding — each in light + dark and en + ar. Confirm: accent only where meaningful, contrast AA, focus rings visible, RTL correct, Western digits, no horizontal overflow at 320/360/390/430/768/1024/1280/1440. Clean up artifacts.
- 5.3 Merge `redesign/warm-editorial-ledger` → `main`; push (triggers Pages workflow); confirm run green and the live URL reflects the redesign.

---

## Self-review
- Removal complete: Phase 3 deletes shadcn files + uninstalls Radix/lucide/CVA/clsx/tailwind-merge; grep guards prove it.
- A11y owned: native `<dialog>` (focus trap/scrim/Escape) + Popover API (light-dismiss) minimize hand-written a11y risk; explicit keyboard handling for `SegmentedFilter`/`Menu`; contrast verified for the ember in both themes.
- Identity: variance stays the hero; color appears only where it means something (impeccable Restrained strategy); no em dashes; no cheap meta-labels; no invisible buttons.
- Risk: Cabinet Grotesk binary loading (fallback Hanken Grotesk noted); Popover API/`<dialog>` browser support is current-evergreen (acceptable for this SaaS).
