# Screens

One section per screen. Standing rule: no screen ships without a row here and an entry in `traceability.md`.

---

## 1. Root redirect

**File:** `app/[locale]/page.tsx`
**Route:** `/{locale}` (e.g. `/en`, `/ar`)
**Purpose:** Immediately redirects to `/{locale}/overview` so the locale root is never a dead end.
**Data consumed:** None.
**Components used:** None (server-side `redirect()`).
**States:** redirect only.
**Reference:** §5 Architecture.

---

## 2. Login

**File:** `app/[locale]/(auth)/login/page.tsx`
**Route:** `/{locale}/login`
**Layout:** `app/[locale]/(auth)/layout.tsx` — centered full-screen, no sidebar.
**Purpose:** Entry point for existing users. Collects work email and password. "Sign in" button links directly to `/{locale}/overview` — no real auth backend (see D11).
**Data consumed:** None. i18n keys from `messages/*.json` `login.*`.
**`lib/` derivations used:** None.
**Components used:** `Brandmark`, `Button` (primary, `asChild`), `Input` (email, password).
**States:**
- Default: empty fields, active Sign in button.
- Focus: border turns Ink on focused `Input`.
- No workspace: "No workspace yet? Create one" link to `/{locale}/onboarding`.
**Reference:** §4.1.

---

## 3. Onboarding — connect accounts

**File:** `app/[locale]/(auth)/onboarding/page.tsx`
**Route:** `/{locale}/onboarding`
**Layout:** `app/[locale]/(auth)/layout.tsx` — centered, no sidebar. Max width 440px.
**Purpose:** Per-tenant credential connection flow. Demonstrates that each workspace has its own Shopify and Bosta accounts. UI-only; no real OAuth.
**Data consumed:** None. i18n keys from `messages/*.json` `onboarding.*`.
**`lib/` derivations used:** None.
**Components used:** `Brandmark`, `ConnectCard` (×2, for Shopify "S" and Bosta "B"), `Button` (primary, disabled until both connected).
**States:**
- Default: both `ConnectCard` components in white/disconnected state. "Continue to dashboard" button disabled at 40% opacity.
- Shopify connected: Shopify card inverts to black; "CONNECTED" mono chip replaces "Connect" button.
- Bosta connected: Bosta card inverts to black.
- Both connected: Continue button becomes active (`asChild` link to `/{locale}/overview`).
**Reference:** §4.2.

---

## 4. Overview

**File:** `app/[locale]/(app)/overview/page.tsx`
**Route:** `/{locale}/overview`
**Layout:** `app/[locale]/(app)/layout.tsx` — full app shell (Sidebar + TopBar).
**Purpose:** Landing screen. Shows 4 KPI stats and a "Needs attention" table (worst variance rows + out-of-stock products).
**Data consumed:** `Tenant.orders`, `Tenant.products`, `Tenant.variance`. Today hardcoded to `"2026-06-20"` (will come from server clock when Supabase is wired).
**`lib/` derivations used:**
- `computeOverviewStats()` from `lib/overview.ts` — derives all 4 stats.
- `computeVariance()` + `sortVariance()` from `lib/variance.ts` — produces sorted non-zero gap rows.
- `stockStatus()` from `lib/stock.ts` — identifies out-of-stock products.
- `formatGap()` from `lib/format.ts` — formats gap numbers with sign.
**Components used:** `TopBar`, `StatCard` (×4, the last with `feature`), `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` from `LedgerTable`.
**States:**
- Normal: stats populated, attention table shows variance + out-of-stock rows.
- Calm (Nile tenant): no non-zero gaps, no out-of-stock products → renders calm message `"Nothing needs attention right now."` instead of the table.
- Variance rows: each renders `surface-inverted` with an inline chip linking to `/{locale}/variance`.
- Out-of-stock rows: each renders `surface-inverted` with an inline chip linking to `/{locale}/inventory`.
- Feature stat card: Unexplained units card is always `feature=true` (inverted black) — the product's reason to exist.
**Reference:** §4.3.

---

## 5. Orders

**File:** `app/[locale]/(app)/orders/page.tsx` (shell) + `app/[locale]/(app)/orders/OrdersInner.tsx` (client logic)
**Route:** `/{locale}/orders`
**URL params:** `?status=<OrderStatus>` (filter), `?order=<id>` (open drawer).
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/orders/loading.tsx` — TopBar placeholder + filter strip placeholder + `TableSkeleton rows={8} cols={5}`.
**Purpose:** Full orders list with status filtering and per-order detail drawer. State is in URL params so it is shareable and refresh-safe.
**Data consumed:** `Tenant.orders`. i18n keys from `messages/*.json` `orders.*`.
**`lib/` derivations used:**
- `filterByStatus()` from `lib/orders.ts` — filters orders by selected status.
- `isProblemStatus()` from `lib/orders.ts` — determines if a row inverts.
- `formatMoney()` from `lib/format.ts` — formats totals as `EGP <number>`.
- `ORDER_STATUSES` from `lib/types.ts` — drives the filter pill list.
**Components used:** `TopBar`, `ToggleGroup`/`ToggleGroupItem` (filter pills, active = `surface-inverted`), `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` from `LedgerTable`, `OrderStatusChip`, `EmptyState`, `OrderDrawer`.
**States:**
- All orders (default): full table.
- Filtered: only orders matching active status. Active filter pill is `surface-inverted`.
- Empty filter result: `EmptyState` with title `"No {status} orders."`.
- Problem row: orders with Cancelled/Failed/Returned status render `surface-inverted` on the table row.
- Drawer open: `?order=<id>` param opens `OrderDrawer` with that order's detail.
- Loading: `loading.tsx` skeleton (via Next.js `<Suspense>` wrapper in `page.tsx`).
**Reference:** §4.4, §4.8.

---

## 6. Order detail drawer

**File:** `components/orders/OrderDrawer.tsx`
**Route:** `/{locale}/orders?order=<id>` (not a separate page — Sheet overlay)
**Purpose:** Right-side detail panel for a single selected order. Shows meta grid, timeline, and items.
**Data consumed:** `Order` object passed as prop.
**`lib/` derivations used:** `formatMoney()` from `lib/format.ts`.
**Components used:** `Sheet`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetClose`, `Timeline`, `OrderStatusChip`.
**States:**
- Open: `order !== null`, Sheet visible.
- Closed: `order === null`, Sheet not rendered.
- Close action: removes `?order` param from URL via `onOpenChange`.
**Reference:** §4.8.

---

## 7. Inventory

**File:** `app/[locale]/(app)/inventory/page.tsx`
**Route:** `/{locale}/inventory`
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/inventory/loading.tsx` — TopBar placeholder + search input placeholder + `TableSkeleton rows={8} cols={6}`.
**Purpose:** Product stock list with name/SKU search. Phase 2 columns (Best seller, Slow moving, Stock age) visible but disabled with SOON tags.
**Data consumed:** `Tenant.products`. i18n keys from `messages/*.json` `inventory.*`.
**`lib/` derivations used:**
- `stockStatus()` from `lib/stock.ts` — derives OK/Low/Out per product.
**Components used:** `TopBar`, `Input` (search), `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` from `LedgerTable`, `StockStatusChip`, `EmptyState`.
**States:**
- Default: all products listed. Low and Out rows render `surface-inverted`.
- Search match: products filtered by name or SKU (case-insensitive substring).
- No match: `EmptyState` with title and body.
- Disabled columns (Phase 2): Best seller, Slow moving, Stock age columns appear with `opacity-60` and SOON tag in header; cells render `—`. Values are not faked.
- Loading: `loading.tsx` skeleton.
**Reference:** §4.5.

---

## 8. Variance (signature screen)

**File:** `app/[locale]/(app)/variance/page.tsx`
**Route:** `/{locale}/variance`
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/variance/loading.tsx` — custom skeleton matching the 3-column measure layout.
**Purpose:** The headline feature. Shows per-SKU variance between expected stock and what Bosta actually holds, as a visible shared-scale measure bar plus numeric figures.
**Data consumed:** `Tenant.variance` (array of `VarianceInput`). i18n keys from `messages/*.json` `variance.*`.
**`lib/` derivations used:**
- `computeVariance()` from `lib/variance.ts` — adds `gap` field to each row.
- `sortVariance()` from `lib/variance.ts` — non-zero gaps first (largest magnitude), then zero-gap rows.
- `formatGap()` from `lib/format.ts` — formats gap with `+`/`−` sign.
**Components used:** `TopBar`, `Measure`.
**Layout:** 3-column grid on desktop (`grid-cols-[1fr_2fr_auto]`), stacks to single column on mobile.
**Shared scale:** `scaleMax = Math.max(...rows.flatMap(r => [r.expected, r.atBosta]), 1)`. All rows share the same scale so bars are visually comparable.
**States:**
- Non-zero gap row: `surface-inverted` (white on black). `Measure` receives `inverted={true}` so the track and ticks use `bg-background` colors.
- Zero-gap row: normal (ink on white). `Measure` receives `inverted={false}`.
- Positive gap (extra units): gap block renders at 30% opacity (`!g.solid && "opacity-30"` in Measure).
- Negative gap (missing units): gap block renders fully solid.
- Loading: custom `VarianceLoading` skeleton (matches the 3-part row structure).
- Seed signature: Cotton Tee (CTN-TEE-02), expected=55, atBosta=52, gap=−3 — sorted to top, inverted.
**Reference:** §4.6, §9.

---

## 9. Returns (Phase 2 — empty state only)

**File:** `app/[locale]/(app)/returns/page.tsx`
**Route:** `/{locale}/returns`
**Layout:** App shell.
**Purpose:** Phase 2 surface, currently empty. Dashed-border panel tells users what will appear when Bosta sync is live.
**Data consumed:** None. i18n keys from `messages/*.json` `returns.*`.
**`lib/` derivations used:** None.
**Components used:** `TopBar`, `EmptyState`.
**States:**
- Single state: empty state with dashed border, glyph, title "Returns aren't connected yet", and directional body copy.
**Reference:** §4.7.

---

## 10. Settings

**File:** `app/[locale]/(app)/settings/page.tsx`
**Route:** `/{locale}/settings`
**Layout:** App shell.
**Purpose:** Workspace metadata display and connection status for Shopify and Bosta. Scope to active tenant.
**Data consumed:** `Tenant.name`, `Tenant.plan`, `Tenant.members`, `Tenant.region`, `Tenant.currency`, `Tenant.shopify`, `Tenant.bosta`. i18n keys from `messages/*.json` `settings.*`.
**`lib/` derivations used:** None.
**Components used:** `TopBar`, `Glyph` (S for Shopify, B for Bosta), local `InfoCell` (not a shared component — defined inline in the page for 4-cell workspace grid).
**States:**
- Connected: both Shopify and Bosta show a muted "Connected" outline chip.
- The settings page is read-only in the current build; editing and disconnect are Phase 2.
**Reference:** §4.9.

---

## 11. Styleguide

**File:** `app/[locale]/styleguide/page.tsx`
**Route:** `/{locale}/styleguide`
**Layout:** None (no app shell). Direct `<main>` with max-width 1080px and 28px padding.
**Purpose:** Living visual reference. Renders every component in every state in both LTR and RTL blocks side by side. Cannot go stale — it is real running code.
**Data consumed:** Static props; no tenant or seed data.
**`lib/` derivations used:** `ORDER_STATUSES` from `lib/types.ts`.
**Components used:** `Measure`, `StatCard`, `OrderStatusChip`, `StockStatusChip`, `Button`, `Brandmark`, `Glyph`, `Timeline`, `EmptyState`.
**States shown:** normal buttons, disabled button; all 7 order status chips; all 3 stock status chips (Out/Low/OK); normal and feature StatCard; Measure tracks (negative gap, positive gap, zero gap); Brandmark, Glyphs; Timeline with problem event; EmptyState.
**RTL coverage:** Both `dir="ltr"` and `dir="rtl"` blocks rendered on the same page.
**Reference:** §6 (D6 Evidence), §13.
