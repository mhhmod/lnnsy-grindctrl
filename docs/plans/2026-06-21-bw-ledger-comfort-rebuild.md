# B&W Ledger (Comfort) Rebuild — Implementation Plan

> Branch: `redesign/warm-editorial-ledger` (continues; the hand-rolled de-shadcn primitives are reused). Each batch ends green (tests + build + lint) and commits.

**Goal:** Rebuild fully to the new `ui-ux-reference.md` + `DESIGN.md`: strict **black-and-white ledger** (no color; state = inversion), Space Grotesk + Inter + JetBrains Mono, with the deep **comfort** layer (hover micro-interactions, instant cross-fade filters with honest counts, live multi-field search, smart default sorts, the variance plain-language tooltip, 120–180ms ease-out motion). Stay on the hand-rolled primitives (no shadcn/Radix/lucide/CVA/clsx). Keep data layer, i18n, next-themes, tests, deploy.

This **supersedes** the warm-editorial/ember direction (revert tokens + fonts + remove ember usages).

## Batch A — Foundation revert to B&W + primitive restyle + interaction primitives
1. `app/globals.css`: set the token values to the B&W palette (§2): `--paper #FFFFFF`, `--ink #0A0A0A`, `--muted #6B6B6B`, `--faint #9B9B9B`, `--hairline #E6E6E6`, `--wash #F6F6F5` (express as OKLCH or sRGB; **grayscale, no hue**). Remove the ember/`--ember*` accent (or alias to ink so stray refs are harmless, then purge refs in Batch B). Keep a grayscale `.dark` mirror. Restore `.surface-inverted` (ink bg / paper text) as the primary problem/active signal. Add motion + interaction utilities: `--t-fast: 140ms` ease-out var; `.row-nudge` (first-cell ~2px inline nudge on row hover); `.filter-pill` warm-up; `.xfade` (table-body cross-fade ~120ms); reduced-motion guards. Keep `.interactive`, `.nums`.
2. `lib/fonts.ts`: revert to **Space Grotesk** (`--font-display`), **Inter** (`--font-sans`), **JetBrains Mono** (`--font-mono`), IBM Plex Sans Arabic (`--font-arabic`). Remove Cabinet Grotesk local + Geist; delete `app/fonts/CabinetGrotesk-Variable.woff2`.
3. `tailwind.config.ts`: color keys map to the B&W tokens; drop ember keys; keep `darkMode:["class"]`, radius 2px, font slots.
4. Restyle `components/primitives/*` to B&W + the interaction spec:
   - `Button`: primary = solid ink, hover opacity ~85%, press `translateY(1px)`; ghost = hairline→ink on hover; focus ink ring; `cursor-pointer`.
   - `Chip`: muted (hairline outline, no hover anim) / solid (inverted) / mono.
   - `Table`: row hover → Wash (~140ms) + optional `data-clickable` first-cell nudge; uppercase faint headers; sortable header affordance (mono ▴/▾) as an optional prop; opened-row stays Wash via an `data-active` class.
   - Rename/refit `SegmentedFilter` → `FilterPills`: label + always-visible mono count; inactive hover warm-up; active = inverted; **zero count = faint + disabled**; keyboard roving retained.
   - New `Tooltip.tsx`: anchored, plain-language, fade ~150ms, dismiss on leave, reduced-motion safe, accessible (`role="tooltip"`, `aria-describedby`).
   - `Drawer`: scrim is click-to-close (native `<dialog>` light-dismiss / backdrop click), slide ~220ms; keep header ×.
   - `Menu`: fade+rise ~6px 150ms; Wash row hover; instant outside-close.
   - `Input`: ink focus border; search variant with inline × that clears instantly.
   - Update primitive tests as needed; keep suite green.
- Verify: `npm run build` + `npm test` + `npx tsc --noEmit` + `npm run lint` green. Commit: `feat(bw): B&W token + font revert, primitives restyled with comfort interactions`.

## Batch B — Screens to B&W + depth
Re-migrate (shell + overview already on primitives but warm) and migrate the rest; remove all `ember*` usage and any leftover `surface-accent`; restore inversion. Apply the depth per screen. Keep data/i18n/RTL.
- B1 Shell: Sidebar active = `.surface-inverted` (solid ink, fix the subtle-active bug); TopBar; TenantSwitcher (Menu fade+rise); MobileNav; ThemeToggle (keep). Commit.
- B2 Overview: stat strip with the **inverted** Unexplained-units feature card (not ember); needs-attention rows hover-nudge + inverted problem chips; calm empty line. Commit.
- B3 Orders: `FilterPills` (All + 7 statuses, honest counts, 0-dim, one active inverted, "All" reset) + **cross-fade** body on filter change; live search ("orders or customers", multi-field, match-bold, inline ×); default sort newest-first; result count "N of M"; combined empty state with inline way-out; row hover+nudge → Drawer (scrim click-close). Session-persist last filter. Commit.
- B4 Inventory: search ("products", name+SKU, match-bold); default sort lowest-stock-first; status chips Out/Low invert; Phase-2 columns greyed + "SOON" (disabled explains itself). Commit.
- B5 Variance (signature): shared-scale measure, solid ink gap block (extra = reduced opacity), non-zero invert + sort biggest-gap-first; **hover row → Tooltip** with the plain-language gap story (seed: expected 55 / at Bosta 52 / Gap −3 → "3 units short — courier marked 5 returned, only 2 reached Bosta."); block does not resize on hover. Commit.
- B6 Returns (dashed empty w/ direction), Settings (workspace grid + connections), Login + Onboarding (inverts on connect, disabled Continue explains itself). Commit.
- After each: build + test + tsc green; en/ar parity for any new keys (real Arabic).

## Batch C — Remove shadcn + styleguide
- Delete `components/ui/` + `components.json`; migrate any stragglers to primitives/`cx`. Replace/remove `lib/utils.ts` `cn`.
- Uninstall: `@radix-ui/*`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge` (verify via `npm ls` first). `next-themes` + `next-intl` stay.
- Rewrite `app/[locale]/styleguide/page.tsx` for the B&W primitives, every state, light+dark, LTR+RTL, incl. the variance Tooltip + FilterPills + hover demos.
- Grep guard: zero `radix|lucide|class-variance-authority|clsx|tailwind-merge|components/ui|ember|cn(`. Commit.

## Batch D — Docs + verify + deploy
- Update `docs/design-system.md` (B&W tokens + motion + interaction utilities), `docs/components.md` (Tooltip, FilterPills, restyled primitives), `docs/decisions.md` (ADR D19: revert to B&W ledger per new reference, supersedes warm-editorial; D20: comfort interaction layer), `docs/screens.md`, `docs/traceability.md`. The new `ui-ux-reference.md` + `DESIGN.md` are the design source of truth.
- Verify gates: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Live Playwright matrix: each screen light+dark × en+ar; confirm zero color, inversion for problem/active, row hover Wash+nudge, filter cross-fade + honest 0-dim, live search match-bold + clear, default sorts, variance tooltip story, drawer scrim-close, motion ≤220ms, no reflow on hover, RTL correct, ≥40px targets, no overflow at the 8 breakpoints. Clean artifacts.
- Merge → `main`; push (Pages workflow); confirm live.

## Self-review
- Reverts the aesthetic fully to B&W per the new reference; keeps de-shadcn.
- Adds the comfort depth (hover/filter/search/sort/tooltip/motion) that the new reference foregrounds.
- Risk: lots of restyle churn; mitigated by reusing primitives + per-batch green gates. The destructive shadcn removal (Batch C) runs only after screens work on primitives.
