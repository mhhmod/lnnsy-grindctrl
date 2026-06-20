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
**Components used:** `Brandmark`, `Button` (primary), `Input` (default, email + password).
**States:**
- Default: empty fields, active Sign in button.
- Focus: `Input` border turns Ink on focus (140ms).
- No workspace: "No workspace yet? Create one" link to `/{locale}/onboarding`.
**Reference:** §4.1.

---

## 3. Onboarding — connect accounts

**File:** `app/[locale]/(auth)/onboarding/page.tsx`
**Route:** `/{locale}/onboarding`
**Layout:** `app/[locale]/(auth)/layout.tsx` — centered, no sidebar. Max width 440px.
**Purpose:** Per-tenant credential connection flow. UI-only; no real OAuth.
**Data consumed:** None. i18n keys from `messages/*.json` `onboarding.*`.
**`lib/` derivations used:** None.
**Components used:** `Brandmark`, `ConnectCard` (×2, for Shopify "S" and Bosta "B"), `Button` (primary, disabled until both connected).
**States:**
- Default: both `ConnectCard` in white/disconnected state. "Continue to dashboard" button disabled (opacity-40).
- Shopify connected: Shopify card inverts to black; "CONNECTED" mono Chip replaces Connect Button.
- Bosta connected: Bosta card inverts to black.
- Both connected: Continue button becomes active (links to `/{locale}/overview`).
**Reference:** §4.2.

---

## 4. Overview

**File:** `app/[locale]/(app)/overview/page.tsx`
**Route:** `/{locale}/overview`
**Layout:** `app/[locale]/(app)/layout.tsx` — full app shell (Sidebar + TopBar).
**Purpose:** Landing screen. Shows an editorial header, 4 KPI stats, and a "Needs attention" table (worst variance rows + out-of-stock products).
**Data consumed:** `Tenant.orders`, `Tenant.products`, `Tenant.variance`. Today hardcoded to `"2026-06-20"`.
**`lib/` derivations used:**
- `computeOverviewStats()` from `lib/overview.ts` — derives all 4 stats.
- `computeVariance()` + `sortVariance()` from `lib/variance.ts` — non-zero gap rows.
- `stockStatus()` from `lib/stock.ts` — identifies out-of-stock products.
- `formatGap()` from `lib/format.ts` — formats gap numbers with sign.
**Components used:** `TopBar`, inline `StatItem` (not a shared component — defined in the page file), `Chip` (variant="solid" for GAP/OUT labels), `Table`/`THead`/`TBody`/`TR`/`TH`/`TD` from `components/primitives/Table`.
**Behaviors:**
- **Stat strip:** 4-cell `StatItem` grid (2×2 → 4×1). The "Unexplained units" cell carries `surface-inverted` (`feature={true}`). All other cells are paper/ink.
- **Attention table:** Variance rows show a `Chip variant="solid"` with the formatted gap. Out-of-stock rows show a `Chip variant="solid"` "OUT". All rows are `interactive data-clickable` and link to `/variance` or `/inventory` respectively.
- **Calm state:** No variance rows and no out-of-stock products → renders a muted plain-text message (`t("calm")`); no table.
**States:**
- Normal: stats populated, attention table shows variance + out-of-stock rows.
- Calm (Nile tenant): no attention items → calm message.
**Reference:** §4.3.

---

## 5. Orders

**File:** `app/[locale]/(app)/orders/page.tsx` (shell) + `app/[locale]/(app)/orders/OrdersInner.tsx` (client logic)
**Route:** `/{locale}/orders`
**URL params:** `?order=<id>` (open drawer).
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/orders/loading.tsx` — TopBar placeholder + filter strip placeholder + `TableSkeleton rows={8} cols={5}`.
**Purpose:** Full orders list with status filtering, live search, and per-order detail drawer. Filter state is session-persisted; drawer state is in URL params.
**Data consumed:** `Tenant.orders`. i18n keys from `messages/*.json` `orders.*`.
**`lib/` derivations used:**
- `filterByStatus()` from `lib/orders.ts`.
- `isProblemStatus()` from `lib/orders.ts`.
- `formatMoney()` from `lib/format.ts`.
- `ORDER_STATUSES` from `lib/types.ts`.
**Components used:** `TopBar`, `FilterPills` from `components/primitives/SegmentedFilter`, `Input` (variant="search"), `Table`/`THead`/`TBody`/`TR`/`TH`/`TD` from `components/primitives/Table`, `OrderStatusChip`, `OrderDrawer`.
**Behaviors:**
- **Honest-count filters:** Each `FilterPills` option shows a mono count computed from the full unfiltered list, not the current visible set. Counts of 0 dim the pill and disable it (not focusable in the roving tab order).
- **Session-persisted filter:** Active filter is written to `sessionStorage` key `"orders.filter"` on change and restored on mount. Shared links preserve the URL-param drawer but not the filter.
- **Live multi-field search:** `Input variant="search"` filters by order number and customer name simultaneously (case-insensitive substring). The × clear button appears when `value !== ""`.
- **Match-bold highlight:** Matched substrings in the Order # and Customer columns are wrapped in `<strong className="font-semibold text-ink">` via the `highlight()` function.
- **Smart default sort:** Visible rows are sorted newest-first by ISO date (descending `date.localeCompare`).
- **Cross-fade on filter/search change:** `<TBody key={fadeKey}>` where `fadeKey = "${activeFilter}|${query}"` triggers a React remount → the `.xfade.xfade-in` class on `TBody` produces a 120ms opacity cross-fade. Under `prefers-reduced-motion` the transition is suppressed.
- **Result count:** A mono `"Showing X of Y"` line appears above the table (or empty state).
**States:**
- All orders (default): full table, newest-first.
- Filtered: orders matching active status. Active filter pill is inverted.
- Search active: orders matching the query across number + customer; matched text is bolded.
- Combined filter + search: both applied simultaneously.
- Empty (filter or search or both): plain-text empty message with "Clear search" and/or "Show all" links.
- Problem row: Cancelled/Failed/Returned rows render `surface-inverted`.
- Drawer open: `?order=<id>` opens `OrderDrawer`.
- Active row: `data-active="true"` on the open-drawer row → stays in Wash.
- Loading: `loading.tsx` skeleton.
**Reference:** §4.4, §4.8.

---

## 6. Order detail drawer

**File:** `components/orders/OrderDrawer.tsx`
**Route:** `/{locale}/orders?order=<id>` (overlay, not a separate page)
**Purpose:** Right-side detail panel for a single selected order. Shows meta grid, timeline, and items.
**Data consumed:** `Order` object passed as prop.
**`lib/` derivations used:** `formatMoney()` from `lib/format.ts`.
**Components used:** `Drawer` from `components/primitives/Drawer`, `Timeline`, `OrderStatusChip`.
**Behaviors:**
- `Drawer` uses a native `<dialog>` with `showModal()`. Focus trap, Escape-to-close, and backdrop click-to-close are all handled by the browser + the component's event listeners.
- The panel slides in from the inline-end edge (right in LTR, left in RTL). Slide animation is defined in `app/globals.css` with RTL variant.
- The drawer header renders `"{order.number} — {order.customer}"` as the `<dialog>` `aria-label` and displays a close (×) button at `ms-auto`.
**States:**
- Open: `order !== null`, `<dialog>` is `.showModal()`.
- Closed: `order === null`, `<dialog>` is `display:none`.
- Close action: `onOpenChange(false)` removes `?order` from URL.
**Reference:** §4.8.

---

## 7. Inventory

**File:** `app/[locale]/(app)/inventory/page.tsx`
**Route:** `/{locale}/inventory`
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/inventory/loading.tsx` — TopBar placeholder + search input placeholder + `TableSkeleton rows={8} cols={6}`.
**Purpose:** Product stock list with name/SKU search. Phase 2 columns visible but disabled with SOON tags.
**Data consumed:** `Tenant.products`. i18n keys from `messages/*.json` `inventory.*`.
**`lib/` derivations used:** `stockStatus()` from `lib/stock.ts`.
**Components used:** `TopBar`, `Input` (variant="search"), `Table`/`THead`/`TBody`/`TR`/`TH`/`TD` from `components/primitives/Table`, `StockStatusChip`.
**Behaviors:**
- **Live search:** Filters by product name or SKU (case-insensitive substring). Input is `variant="search"` with a × clear button.
- **Smart default sort:** Low/Out rows sorted to top (by `stockStatus` priority), then alphabetical by name.
- **Phase 2 columns (SOON):** Best seller, Slow moving, Stock age columns appear with `opacity-60` and a "SOON" tag in the header. Cells render `—`. No fake values.
**States:**
- Default: all products listed. Low and Out rows render `surface-inverted`.
- Search match: products filtered by name or SKU; no match-bold on inventory (not implemented).
- No match: inline empty state (title + body).
- Loading: `loading.tsx` skeleton.
**Reference:** §4.5.

---

## 8. Variance (signature screen)

**File:** `app/[locale]/(app)/variance/page.tsx`
**Route:** `/{locale}/variance`
**Layout:** App shell.
**Loading UI:** `app/[locale]/(app)/variance/loading.tsx` — custom skeleton matching the 3-column measure layout.
**Purpose:** The headline feature. Shows per-SKU variance between expected stock and what Bosta holds, as a shared-scale measure bar plus numeric figures. The gap value carries a plain-language tooltip explaining the discrepancy.
**Data consumed:** `Tenant.variance` (array of `VarianceInput`). i18n keys from `messages/*.json` `variance.*`.
**`lib/` derivations used:**
- `computeVariance()` from `lib/variance.ts` — adds `gap` field.
- `sortVariance()` from `lib/variance.ts` — non-zero gaps first (largest magnitude), then zero-gap rows.
- `formatGap()` from `lib/format.ts` — formats gap with `+`/`−` sign.
**Components used:** `TopBar`, `Measure`, `TooltipWrap` from `components/primitives/Tooltip`.
**Behaviors:**
- **Shared scale:** `scaleMax = Math.max(...rows.flatMap(r => [r.expected, r.atBosta]), 1)`. All rows share the same denominator so bars are visually comparable.
- **Variance plain-language tooltip:** The gap figure cell wraps the `formatGap()` output in `TooltipWrap` with a plain-language explanation of the discrepancy (e.g. "3 units short — courier marked 5 returned, only 2 reached Bosta."). Shows on hover and keyboard focus; `role="tooltip"` + `aria-describedby` wiring.
- **Positive vs negative gap:** Gap block at 30% opacity when `!solid` (extra units), fully solid when missing units.
**Layout:** 3-column grid on desktop (`grid-cols-[1fr_2fr_auto]`), stacks to 1 column on mobile.
**States:**
- Non-zero gap row: `surface-inverted`. `Measure` receives `inverted={true}`.
- Zero-gap row: normal ink/paper. `Measure` receives `inverted={false}`.
- Positive gap (extra units): gap block 30% opacity.
- Negative gap (missing units): gap block fully solid.
- Loading: custom `VarianceLoading` skeleton.
- Seed signature: Cotton Tee (CTN-TEE-02), expected=55, atBosta=52, gap=−3 — sorted to top, inverted.
**Reference:** §4.6, §9.

---

## 9. Returns (Phase 2 — empty state only)

**File:** `app/[locale]/(app)/returns/page.tsx`
**Route:** `/{locale}/returns`
**Layout:** App shell.
**Purpose:** Phase 2 surface, currently empty.
**Data consumed:** None. i18n keys from `messages/*.json` `returns.*`.
**`lib/` derivations used:** None.
**Components used:** `TopBar`, `EmptyState`.
**States:**
- Single state: dashed-border panel, ink square glyph, title "Returns aren't connected yet", directional body copy.
**Reference:** §4.7.

---

## 10. Settings

**File:** `app/[locale]/(app)/settings/page.tsx`
**Route:** `/{locale}/settings`
**Layout:** App shell.
**Purpose:** Workspace metadata display and connection status for Shopify and Bosta.
**Data consumed:** `Tenant.name`, `Tenant.plan`, `Tenant.members`, `Tenant.region`, `Tenant.currency`, `Tenant.shopify`, `Tenant.bosta`. i18n keys from `messages/*.json` `settings.*`.
**`lib/` derivations used:** None.
**Components used:** `TopBar`, `Glyph` (S for Shopify, B for Bosta), local `InfoCell` (defined inline in the page — not a shared component).
**States:**
- Connected: both Shopify and Bosta show a muted "Connected" outline Chip.
- Read-only in the current build; editing and disconnect are Phase 2.
**Reference:** §4.9.

---

## 11. Styleguide

**File:** `app/[locale]/styleguide/page.tsx`
**Route:** `/{locale}/styleguide`
**Layout:** None (no app shell). Direct `<main>` with max-width 1080px and 28px padding.
**Purpose:** Living visual reference. Renders every component in every state in both LTR and RTL blocks side by side. Cannot go stale — it is real running code.
**Data consumed:** Static props; no tenant or seed data.
**`lib/` derivations used:** `ORDER_STATUSES` from `lib/types.ts`.
**Components used:** All primitives and custom components: `Button`, `Chip`, `Input`, `FilterPills`, `Tooltip`/`TooltipWrap`, `Drawer`, `Menu`, `Skeleton`, icons, `Measure`, `StatCard` (inline `StatItem`), `OrderStatusChip`, `StockStatusChip`, `Brandmark`, `Glyph`, `Timeline`, `EmptyState`, `TableSkeleton`.
**States shown:** all Button variants/sizes/disabled; all Chip variants; Input default/search/disabled; FilterPills with count-0 pill; Tooltip hover; Drawer open; Menu open; Skeleton; all OrderStatusChip states (7); all StockStatusChip states (3); normal and feature StatItem; Measure tracks (negative/positive/zero gap); Brandmark; Glyphs; Timeline with problem event; EmptyState.
**RTL coverage:** Both `dir="ltr"` and `dir="rtl"` blocks on the same page.
**Reference:** §6 (D6 Evidence), D21.
