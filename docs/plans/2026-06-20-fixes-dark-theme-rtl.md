# Fixes + Dark Theme + Full RTL — Implementation Plan

> Executes consecutively. Each phase is self-contained, ends green (tests + build + lint), and commits. Branch: `feat/dark-theme-rtl-fixes`.

**Context:** Deployed Stock & Orders dashboard. Next.js 16 (App Router, **static export** → GitHub Pages under basePath), React 19, Tailwind v3, shadcn/ui, next-intl v4. Monochrome design where **state = inversion** (`.surface-inverted` swaps `--foreground`/`--background`). Source of truth: [`ui-ux-reference.md`](../../ui-ux-reference.md), [`docs/design-system.md`](../design-system.md).

**Goals:** (1) fix the drawer close-X (duplicate + RTL), (2) fix hover-on-inverted (white-on-white), (3) a complete monochrome **dark theme**, (4) **full AR/RTL** correctness. No color introduced. All 28 tests stay green; build + lint clean; deploy via existing Pages workflow.

---

## Phase 0 — Discovery (Allowed APIs / facts, verified in-repo)

**Confirmed in code (sources read):**
- `app/globals.css` — `:root` holds HSL-channel tokens (`--background 0 0% 100%`, `--foreground 0 0% 4%`, etc.); `@layer utilities` has `.surface-inverted { background: hsl(var(--foreground)); color: hsl(var(--background)); border-color: hsl(var(--foreground)); }` and `.nums`.
- `tailwind.config.ts` — `theme.extend.colors` map `hsl(var(--token))`; no `darkMode` key yet.
- `components/ui/sheet.tsx:68` — `SheetContent` renders a built-in `<SheetPrimitive.Close className="absolute right-4 top-4 …">` (physical `right-4`, not RTL-aware).
- `components/orders/OrderDrawer.tsx:44` — also renders a custom header `<SheetClose className="border p-1 hover:bg-accent shrink-0 ms-4">` with the lucide `X`. → **two** close buttons.
- Hover-on-inverted offenders: `app/[locale]/(app)/orders/OrdersInner.tsx:142-143` (`cursor-pointer hover:bg-accent` + `isProblemStatus && "surface-inverted hover:opacity-90"`). Inventory page has the analogous pattern. Also `components/shell/Sidebar.tsx:25` and `MobileNav.tsx:64` use `hover:bg-accent` **only on the inactive branch** (active = `surface-inverted` with no hover) → those are SAFE, leave them.
- `app/[locale]/layout.tsx` — server layout sets `<html lang dir>` and wraps children in `NextIntlClientProvider` + `TenantProvider`. Fonts via `lib/fonts.ts` (`fontVars`).
- `lib/fonts.ts` exists; `components/shell/LocaleSwitcher.tsx` is the visual pattern to match for the new ThemeToggle (bordered mono button).

**Allowed APIs (next-themes — the only new dependency):**
- Package: `next-themes` (works with App Router + static export; injects a pre-paint script, no SSR needed).
- `import { ThemeProvider } from "next-themes"` — props used: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. Must be a **client** component boundary.
- `import { useTheme } from "next-themes"` → `{ theme, resolvedTheme, setTheme }`. Use `resolvedTheme` ("light"|"dark") for the toggle's current state; call `setTheme("light"|"dark"|"system")`.
- Requires `suppressHydrationWarning` on `<html>` (next-themes mutates the class before hydration).
- Tailwind v3 dark variant: set `darkMode: ["class"]` in `tailwind.config.ts`; then `.dark` selector on `<html>` activates dark tokens. We drive everything through CSS variables, so dark = a `.dark { … }` block overriding the token values. **No `dark:` utilities needed** anywhere except optionally the toggle icon.

**Anti-patterns to avoid:**
- Do NOT add `dark:` variants across components — the token layer handles theming. Only the CSS variable values change.
- Do NOT introduce any hue (keep `0 0% N%`); do NOT use literal `#000`/`#fff` (use near-black/near-white lightness).
- Do NOT keep two close buttons. Do NOT use `hover:bg-accent` on anything that can also be `surface-inverted`.
- Do NOT animate layout props in the theme transition (next-themes `disableTransitionOnChange` prevents flashes).

---

## Phase 1 — Design-system fixes (hover + close X)

### 1.1 Inversion-aware interactive hover utility
**File:** `app/globals.css` — add to `@layer utilities`:
```css
  /* Interactive surfaces: hover stays legible whether or not the row is inverted,
     in both light and dark themes (mix toward the opposite token). */
  .interactive { cursor: pointer; transition: background-color 0.12s ease-out; }
  .interactive:hover { background-color: hsl(var(--accent)); }
  .surface-inverted.interactive:hover,
  .surface-inverted .interactive:hover {
    background-color: color-mix(in oklch, hsl(var(--foreground)) 86%, hsl(var(--background)));
  }
  @media (prefers-reduced-motion: reduce) { .interactive { transition: none; } }
```
Why it works in both themes: on an inverted surface the background is `--foreground`; mixing 14% of `--background` shifts it subtly toward the opposite tone (lighter in light mode, darker in dark mode) while keeping the inverted text readable. Normal rows use the `--accent` wash.

### 1.2 Apply to clickable rows
- **`app/[locale]/(app)/orders/OrdersInner.tsx:142-143`** — replace the row `className` logic:
  - Remove `cursor-pointer hover:bg-accent` and the `hover:opacity-90`.
  - Use: base `"interactive"`; problem rows add `"surface-inverted"`. Result: `cn("interactive", isProblemStatus(order.status) && "surface-inverted")`.
- **Inventory page** (`app/[locale]/(app)/inventory/page.tsx`) — find the row `className` that combines a hover with conditional `surface-inverted` (Out/Low). Apply the same: `cn("interactive", isProblem && "surface-inverted")`. Read the file first to get the exact expression; replace only the hover/inversion part, keep other classes.
- **`components/data/LedgerTable.tsx`** — update the convention comment: clickable rows use `className="interactive"` (not `cursor-pointer hover:bg-accent`).

### 1.3 Fix the close-X (dedupe + RTL)
- **`components/ui/sheet.tsx`** — remove the built-in `<SheetPrimitive.Close className="absolute right-4 top-4 …">…</SheetPrimitive.Close>` block from `SheetContent` (the only Sheet consumer is OrderDrawer, which supplies its own header close). Keep all other Sheet exports intact. Verify nothing else imports a default close.
- **`components/orders/OrderDrawer.tsx:44`** — keep the single header `SheetClose`, but make its hover inversion-proof and ensure logical placement: the header already uses `flex … justify-between` + `ms-4`, which is RTL-correct. Change its className from `border p-1 hover:bg-accent shrink-0 ms-4` to `border p-1 interactive shrink-0 ms-4`. The X icon is `currentColor` (ink/foreground) so it stays visible in both themes.

### Verify Phase 1
- `npm run build` clean; `npm test` 28 green; `npm run lint` clean.
- grep guard: `grep -rn "hover:bg-accent" app components` returns ONLY the safe nav inactive-branch lines (Sidebar/MobileNav) + shadcn button/toggle primitives — NOT any row that can be `surface-inverted`.
- Commit: `fix(ui): inversion-aware hover + single RTL-safe drawer close`.

---

## Phase 2 — Dark theme

### 2.1 Install + wire next-themes
- `npm i next-themes`.
- **Create `components/theme/ThemeProvider.tsx`** (client wrapper):
```tsx
"use client";
import { ThemeProvider as NextThemes } from "next-themes";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
```
- **`app/[locale]/layout.tsx`** — add `suppressHydrationWarning` to the `<html>` tag; wrap the existing providers' children with `<ThemeProvider>` (outermost inside `<body>` is fine):
  - `<body …><ThemeProvider><NextIntlClientProvider …><TenantProvider>{children}</TenantProvider></NextIntlClientProvider></ThemeProvider></body>`

### 2.2 Tailwind dark mode
- **`tailwind.config.ts`** — add `darkMode: ["class"],` at the top of the config object (sibling of `content`).

### 2.3 Dark tokens (monochrome, near-black/near-white, hue 0)
- **`app/globals.css`** — add a `.dark` block inside `@layer base`, after `:root`:
```css
  .dark {
    --background: 0 0% 7%;          /* near-black paper */
    --foreground: 0 0% 96%;         /* near-white ink */
    --muted: 0 0% 14%;              /* dark wash surface */
    --muted-foreground: 0 0% 64%;
    --faint: 0 0% 45%;
    --border: 0 0% 22%;             /* hairline on dark */
    --input: 0 0% 22%;
    --ring: 0 0% 96%;               /* focus = light */
    --accent: 0 0% 16%;            /* hover wash (dark) */
    --accent-foreground: 0 0% 96%;
    --card: 0 0% 9%;
    --card-foreground: 0 0% 96%;
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 96%;
    --primary: 0 0% 96%;           /* solid control = light in dark mode */
    --primary-foreground: 0 0% 7%;
    --secondary: 0 0% 16%;
    --secondary-foreground: 0 0% 96%;
    --destructive: 0 0% 96%;
    --destructive-foreground: 0 0% 7%;
  }
```
The `.surface-inverted` utility is unchanged: in dark mode it now renders a **light block with dark text** (problem state still pops by inversion). The `.interactive` hover formula already adapts.

### 2.4 ThemeToggle control (matches LocaleSwitcher)
- **Create `components/shell/ThemeToggle.tsx`** (client): a bordered mono button, same sizing/border as `LocaleSwitcher`. Uses `useTheme()`; renders a lucide `Sun`/`Moon` (icon in `currentColor`, no color) reflecting `resolvedTheme`; on click toggles light↔dark via `setTheme`. Guard against hydration mismatch: render a neutral placeholder until mounted (`useEffect` mounted flag), per next-themes guidance. Include `aria-label` ("Toggle theme" / Arabic key). Keep it icon-only to stay ledger-minimal.
- **`components/shell/TopBar.tsx`** — place `<ThemeToggle />` next to `<LocaleSwitcher />`.
- **`components/shell/MobileNav.tsx`** — add `<ThemeToggle />` in the mobile sheet (near the locale control / tenant switcher) so mobile users can switch too.
- Add i18n keys `common.theme` (en: "Theme" / ar: "السمة") used for the aria-label; keep en/ar parity.

### 2.5 Styleguide shows both themes
- **`app/[locale]/styleguide/page.tsx`** — wrap (or duplicate) the component gallery so it renders once on a light surface and once on a `.dark` surface, e.g. a `<div className="dark bg-background text-foreground">…</div>` block beneath the light one, so both theme renderings are visible side by side as evidence. Keep the existing LTR+RTL blocks.

### Verify Phase 2
- `npm run build` clean; `npm test` 28 green; `npm run lint` clean.
- Manual: toggle persists across reloads (localStorage), respects OS when `system`, no flash on load (next-themes script).
- Commit: `feat(theme): complete monochrome dark theme (next-themes, flipped tokens, toggle)`.

---

## Phase 3 — Full AR / RTL sweep

### 3.1 Find physical-direction usages
- grep across `app/` + `components/` for: `\bright-`, `\bleft-`, ` pl-`, ` pr-`, ` ml-`, ` mr-`, `text-left`, `text-right`, `rounded-l`, `rounded-r`, `border-l`, `border-r`, `\bstart-`/`\bend-` (to confirm logical already), and `space-x-` (which is direction-neutral in modern Tailwind but verify). Build a list.
- Replace each physical with its logical equivalent: `right-`→`end-`/`inset-inline-end`, `left-`→`start-`, `pl-`→`ps-`, `pr-`→`pe-`, `ml-`→`ms-`, `mr-`→`me-`, `text-left`→`text-start`, `text-right`→`text-end`. Only where it affects visual direction (skip cases that are intentionally physical, e.g. an icon that must not flip — none expected here).
- shadcn `sheet.tsx` built-in close was removed in Phase 1, so its `right-4` is gone. Re-check `dropdown-menu.tsx`, `sheet.tsx` (slide sides), `toggle-group.tsx` for physical classes; Radix is `dir`-aware via the `dir` on `<html>` (already set), so alignment props (`align="start"`) are logical — keep.

### 3.2 Verify dynamic RTL pieces
- `Measure` uses `insetInlineStart` (already logical) — confirm.
- `OrderDrawer` side mapping (`ar`→left) — confirm still correct after Phase 1.
- `LocaleSwitcher` path swap regex unaffected by basePath — confirm.
- Numbers stay Western digits in both locales (formatMoney `en-US`) — confirm unchanged.

### 3.3 Read-only RTL audit
- Run the `agent-rtl-checker` subagent over the changed files + the screens; address any flagged alignment/spacing/truncation/icon-direction issues. Re-grep after fixes.

### Verify Phase 3
- `npm run build` clean; `npm test` 28 green; lint clean.
- grep guard: no stray `text-left|text-right|\bpl-|\bpr-|\bml-|\bmr-` introduced; physical `left-/right-` only where intentional.
- Commit: `fix(rtl): logical properties sweep for full Arabic support`.

---

## Phase 4 — Verification matrix + deploy

### 4.1 Automated gates
- `npm test` → 28 green. `npm run lint` → clean. `npx tsc --noEmit` → clean. `npm run build` (static export) → succeeds, route count unchanged.
- i18n parity test still green (theme aria key added to both catalogs).

### 4.2 Live visual matrix (Playwright, dev server)
Capture and eyeball the **4 combinations** on the signature + a problem screen:
- `/en/variance` light, `/en/variance` dark, `/ar/variance` dark, `/en/orders` dark (open drawer to confirm single close + readable header), `/en/inventory` dark + hover a Low/Out row to confirm the hover bug is gone (text stays readable), `/ar/inventory` light hover check.
- Confirm: zero color in dark mode; inverted "problem" blocks render light-on-dark; hover never produces same-color-on-same-color; single drawer close positioned at the inline-end corner in both locales; theme toggle works and persists.
- Clean up screenshot artifacts; do not commit them.

### 4.3 Docs
- Update `docs/design-system.md`: add the dark token table + the `.interactive` hover rule + note the close-X dedupe. Add ADR(s) in `docs/decisions.md`: D13 dark theme (next-themes, class strategy, monochrome flip, default=system, scene rationale), D14 inversion-aware hover utility. Update `docs/components.md` with `ThemeToggle` + `ThemeProvider` rows and the corrected LedgerTable hover convention.

### 4.4 Ship
- Merge `feat/dark-theme-rtl-fixes` → `main`; push (triggers the Pages workflow). Confirm the run is green and the live URL reflects the changes (toggle present, dark works, RTL correct).
- Commit (docs): `docs: dark theme + hover + rtl decisions, components, design-system`.

---

## Self-review
- **Coverage:** X-icon (1.3), hover-on-inverted (1.1/1.2), dark theme (Phase 2), full RTL (Phase 3) — all four requests mapped.
- **No-color invariant:** dark tokens are all `0 0% N%`; inversion utility unchanged; bans respected.
- **Risk:** next-themes hydration flash → mitigated by `suppressHydrationWarning` + mounted-guard in ThemeToggle + `disableTransitionOnChange`. Static export compatible (client-only theme).
- **Reuse:** ThemeToggle mirrors LocaleSwitcher; theming via existing token layer (no `dark:` sprawl).
