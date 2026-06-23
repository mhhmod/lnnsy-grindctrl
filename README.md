# Stock & Orders Dashboard

A multi-tenant SaaS frontend where each business connects its Shopify (orders) and Bosta (real warehouse stock) accounts and the app surfaces stock levels, orders, and — the headline feature — the **variance** between what records expect and what Bosta actually holds.

Built in Next.js (App Router) + TypeScript, strict black/white ledger design system (state via inversion, never color), English + Arabic with RTL, and a seed data layer shaped exactly for future Supabase wiring.

---

## Run the project

```bash
npm install
npm run dev       # http://localhost:3000 → redirects to /en/overview
npm test          # Vitest unit tests
npm run build     # production build check
```

Default locale: English (`/en`). Switch to Arabic via the locale toggle in the top bar (flips to `/ar`).

---

## Project structure

```
app/
  [locale]/
    layout.tsx               Root: <html lang dir>, fonts, NextIntlClientProvider, TenantProvider
    globals.css              Tailwind layers + token CSS variables + .surface-inverted + .nums
    (auth)/
      layout.tsx             Centered auth shell (no sidebar)
      login/page.tsx         §4.1 Login
      onboarding/page.tsx    §4.2 Connect Shopify + Bosta
    (app)/
      layout.tsx             App shell: Sidebar (desktop) + main content area
      overview/page.tsx      §4.3 Overview (landing)
      orders/
        page.tsx             §4.4 Orders wrapper (Suspense)
        OrdersInner.tsx      Orders table + filters + URL param state
        loading.tsx          Orders skeleton loading UI
      finance/page.tsx       View-only Paymob/Bosta finance preview from orders
      inventory/
        page.tsx             §4.5 Inventory
        loading.tsx          Inventory skeleton loading UI
      variance/
        page.tsx             §4.6 Variance (signature screen)
        loading.tsx          Variance skeleton loading UI
      returns/page.tsx       §4.7 Returns (Phase 2 empty state)
      settings/page.tsx      §4.9 Settings
    styleguide/page.tsx      Living component/state gallery (LTR + RTL)
proxy.ts                     next-intl locale middleware (Next.js 16 — not middleware.ts)

components/
  ui/                        shadcn-generated primitives (button, badge, table, sheet, input,
                             dropdown-menu, toggle-group, skeleton, toggle)
  brand/
    Brandmark.tsx            Solid square + "Ledger" wordmark
    Glyph.tsx                S/B square glyphs for Shopify and Bosta
  data/
    StatCard.tsx             KPI card (normal / feature-inverted)
    Measure.tsx              Variance track + ticks + gap block
    StatusChip.tsx           OrderStatusChip + StockStatusChip
    LedgerTable.tsx          Re-export of Table primitives with ledger conventions
    EmptyState.tsx           Dashed panel with glyph, title, optional body
    TableSkeleton.tsx        Reusable skeleton for data tables
  shell/
    Sidebar.tsx              Full-height desktop nav
    TopBar.tsx               Page header (title + locale switcher + Export)
    MobileNav.tsx            Hamburger + off-canvas Sheet nav
    TenantSwitcher.tsx       Dropdown to switch active tenant
    LocaleSwitcher.tsx       EN ↔ AR toggle
  orders/
    OrderDrawer.tsx          Sheet drawer for order detail
    Timeline.tsx             Vertical event list with dotted spine
  onboarding/
    ConnectCard.tsx          Connection card (inverts when connected)

lib/
  types.ts                   All TypeScript types
  variance.ts                computeVariance / sortVariance
  stock.ts                   stockStatus (OK / Low / Out)
  overview.ts                computeOverviewStats
  finance.ts                 derive finance preview rows and summary from orders
  orders.ts                  isProblemStatus / filterByStatus
  format.ts                  formatMoney / formatGap (Western digits always)
  utils.ts                   cn() (clsx + tailwind-merge)
  fonts.ts                   next/font exports + fontVars
  tenant-context.tsx         TenantProvider + useTenant hook
  seed/
    index.ts                 getTenants / getTenant / TENANTS / DEFAULT_TENANT_ID
    tenant-acme.ts           Acme Goods (problem state seed)
    tenant-nile.ts           Nile Supply Co. (calm state seed)

i18n/
  routing.ts                 locales: ["en", "ar"], defaultLocale: "en"
  request.ts                 getRequestConfig (loads messages/*.json)

messages/
  en.json                    English message catalog
  ar.json                    Arabic message catalog

docs/
  spec.md                    Product spec (what + why, top level)
  design-system.md           Tokens, type, spacing, inversion rule, motion
  components.md              Per-component API, states, RTL notes, usage examples
  screens.md                 Per-screen purpose, data, components, states
  data-model.md              Types, derivations, tenant isolation, Supabase mapping
  decisions.md               ADRs D1–D12
  traceability.md            Reference requirement → file → doc matrix

ui-ux-reference.md           Visual source of truth (do not edit)
```

---

## Add a screen

1. Create `app/[locale]/(app)/<name>/page.tsx`. If it has async data, add `loading.tsx` with a `TableSkeleton` or custom skeleton.
2. Add the route to the `ITEMS` array in `components/shell/Sidebar.tsx` and `components/shell/MobileNav.tsx`.
3. Add i18n keys to `messages/en.json` and `messages/ar.json`.
4. Add a row to `docs/screens.md` (purpose · route · data · lib derivations · components · states · reference §).
5. Add entries to `docs/traceability.md` mapping the reference requirements to the new file.

---

## Add a component

1. For shadcn primitives: `npx shadcn add <name>`, then style via tokens (no one-off CSS).
2. For custom components: create `components/<category>/<Name>.tsx`. Use `cn()` for conditional classes. Use `surface-inverted` for problem/active state. Use logical CSS properties (`ms-`, `ps-`, `border-e`, etc.).
3. Add a row to `docs/components.md` (component · file · purpose · key props · shadcn-or-custom · states · RTL notes · reference §).
4. Add a usage example to `docs/components.md` if it is a custom component.
5. Add an entry to `docs/traceability.md`.
6. Add the component to the `/styleguide` page in both LTR and RTL blocks.

---

## Wire Supabase later

The data model is pre-shaped for Supabase. Read `docs/data-model.md §5` for the proposed table and column names.

The main wiring point is `lib/tenant-context.tsx`: replace the `getTenants()` seed call with a Supabase query scoped to the authenticated user's tenant memberships. Set up RLS on every table with a `tenant_id` column.

Key rules:
- Fields marked **DERIVED** in `data-model.md §5` must never be stored — compute them at query time or in the app layer.
- Stock status, variance gap, and overview stats are all derived.
- No auth backend exists yet (D11). Add Supabase Auth before any production deployment.

---

## Styleguide

Visit `/{locale}/styleguide` (e.g. `/en/styleguide`) to see every component in every state in both LTR and RTL. This is real running code — it cannot go stale.

---

## Standing doc rule

No component or screen ships without:
- A row in `docs/components.md` or `docs/screens.md`.
- An entry in `docs/traceability.md` linking the reference requirement to the file.

This rule ensures any new team member can onboard cold from the docs.
