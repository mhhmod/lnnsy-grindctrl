# Traceability Matrix

Maps every reference requirement to its implementing file(s) and documentation section. Every row must have at least one real file path.

---

## Reference §4 — Screens

| Requirement | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Login screen | §4.1 | `app/[locale]/(auth)/login/page.tsx` | `screens.md §2` |
| Login: centered card, max 380px, Brandmark, Work email + Password, Sign in button, "No workspace yet?" link | §4.1 | `app/[locale]/(auth)/login/page.tsx`, `app/[locale]/(auth)/layout.tsx` | `screens.md §2` |
| Onboarding: connect Shopify + Bosta | §4.2 | `app/[locale]/(auth)/onboarding/page.tsx` | `screens.md §3` |
| Onboarding: card inverts on connect, CONNECTED chip, Continue disabled until both connected | §4.2 | `components/onboarding/ConnectCard.tsx` | `components.md ConnectCard`, `screens.md §3` |
| Overview stat strip: 4 cells, Unexplained units inverted | §4.3 | `app/[locale]/(app)/overview/page.tsx`, `components/data/StatCard.tsx` | `screens.md §4`, `components.md StatCard` |
| Overview needs attention: worst variance rows (GAP chip) + Out rows (OUT chip), calm state | §4.3 | `app/[locale]/(app)/overview/page.tsx` | `screens.md §4` |
| Orders: filter row (All + 7 statuses), mono count, active inverted | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/ui/toggle-group.tsx` | `screens.md §5`, `components.md Toggle` |
| Orders: table with Order# (mono), Customer, Status, Total (mono right), Date | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx` | `screens.md §5` |
| Orders: problem rows (Cancelled/Failed/Returned) invert | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/data/StatusChip.tsx`, `lib/orders.ts` | `screens.md §5`, `components.md OrderStatusChip` |
| Inventory: search by name/SKU | §4.5 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Inventory: Product name + mono SKU, In stock (mono right), Status chip | §4.5 | `app/[locale]/(app)/inventory/page.tsx`, `components/data/StatusChip.tsx` | `screens.md §7`, `components.md StockStatusChip` |
| Inventory: Low/Out rows invert; Phase 2 columns disabled with SOON | §4.5 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Variance: legend text | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `messages/en.json` | `screens.md §8` |
| Variance: one row per SKU — product+SKU, measure track, 3 figures | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `components/data/Measure.tsx` | `screens.md §8`, `components.md Measure` |
| Variance: non-zero gap rows invert, sort to top | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `lib/variance.ts` | `screens.md §8`, `data-model.md §2` |
| Variance: shared scale across all rows | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `components/data/Measure.tsx` | `screens.md §8` |
| Returns: empty state only, dashed panel, directional copy | §4.7 | `app/[locale]/(app)/returns/page.tsx`, `components/data/EmptyState.tsx` | `screens.md §9`, `components.md EmptyState` |
| Order drawer: right-side Sheet, order# + customer header, 2×2 meta grid, Timeline, Items | §4.8 | `components/orders/OrderDrawer.tsx`, `components/orders/Timeline.tsx` | `screens.md §6`, `components.md OrderDrawer`, `components.md Timeline` |
| Settings: workspace 2×2 grid (name/plan/members/region), connections list | §4.9 | `app/[locale]/(app)/settings/page.tsx`, `components/brand/Glyph.tsx` | `screens.md §10` |

---

## Reference §5 — Components inventory

| Component | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Brandmark (solid square + wordmark) | §5 | `components/brand/Brandmark.tsx` | `components.md Brandmark` |
| Button (primary solid ink, ghost hairline) | §5 | `components/ui/button.tsx` | `components.md Button` |
| Chip (muted outline / solid inverted / mono) | §5 | `components/ui/badge.tsx`, `components/data/StatusChip.tsx` | `components.md Badge`, `components.md OrderStatusChip`, `components.md StockStatusChip` |
| Stat card (label + big mono number + footnote, feature variant) | §5 | `components/data/StatCard.tsx` | `components.md StatCard` |
| Filter pill (label + mono count, active = inverted) | §5 | `components/ui/toggle-group.tsx` | `components.md Toggle` |
| Table (uppercase faint headers, hairline dividers, clickable rows) | §5 | `components/ui/table.tsx`, `components/data/LedgerTable.tsx` | `components.md Table`, `components.md LedgerTable` |
| Measure (variance track + ticks + gap block on shared scale) | §5 | `components/data/Measure.tsx` | `components.md Measure` |
| Drawer (right-side panel + scrim) | §5 | `components/ui/sheet.tsx`, `components/orders/OrderDrawer.tsx` | `components.md Sheet`, `components.md OrderDrawer` |
| Empty state (dashed panel, glyph, title, directional copy) | §5 | `components/data/EmptyState.tsx` | `components.md EmptyState` |
| Tenant switcher (avatar + name + popover menu) | §5 | `components/shell/TenantSwitcher.tsx`, `components/ui/dropdown-menu.tsx` | `components.md TenantSwitcher` |
| Search (Input, shrinks on mobile) | §5 | `components/ui/input.tsx` | `components.md Input` |
| Timeline (vertical dotted spine, event list) | §5 | `components/orders/Timeline.tsx` | `components.md Timeline` |
| Connect card (inversion on connect, CONNECTED chip) | §5 | `components/onboarding/ConnectCard.tsx` | `components.md ConnectCard` |
| Glyphs S / B (square) | §5 | `components/brand/Glyph.tsx` | `components.md Glyph` |

---

## Reference §6 — States

| State | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Empty: no orders for a filter | §6 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/data/EmptyState.tsx` | `screens.md §5` |
| Empty: no search match (inventory) | §6 | `app/[locale]/(app)/inventory/page.tsx`, `components/data/EmptyState.tsx` | `screens.md §7` |
| Empty: Returns not connected | §6 | `app/[locale]/(app)/returns/page.tsx`, `components/data/EmptyState.tsx` | `screens.md §9` |
| Empty: Overview calm state | §6 | `app/[locale]/(app)/overview/page.tsx` | `screens.md §4` |
| Problem: Low/Out stock (inversion) | §6 | `app/[locale]/(app)/inventory/page.tsx`, `components/data/StatusChip.tsx`, `lib/stock.ts` | `screens.md §7`, `data-model.md §2` |
| Problem: Cancelled/Failed/Returned orders (inversion) | §6 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/data/StatusChip.tsx`, `lib/orders.ts` | `screens.md §5` |
| Problem: non-zero variance (inversion, sorted to top) | §6 | `app/[locale]/(app)/variance/page.tsx`, `lib/variance.ts` | `screens.md §8` |
| Problem: Overview attention rows (surface-inverted) | §6 | `app/[locale]/(app)/overview/page.tsx` | `screens.md §4` |
| Loading: orders table skeleton | §6 | `app/[locale]/(app)/orders/loading.tsx`, `components/data/TableSkeleton.tsx` | `components.md TableSkeleton`, `screens.md §5` |
| Loading: inventory table skeleton | §6 | `app/[locale]/(app)/inventory/loading.tsx`, `components/data/TableSkeleton.tsx` | `components.md TableSkeleton`, `screens.md §7` |
| Loading: variance custom skeleton | §6 | `app/[locale]/(app)/variance/loading.tsx` | `screens.md §8` |
| Focus: visible keyboard focus on all interactive elements | §6 | `app/globals.css` (`--ring: 0 0% 4%`), shadcn primitives via Radix | `design-system.md §1` |
| Disabled: Onboarding Continue until both connected | §6 | `app/[locale]/(auth)/onboarding/page.tsx` | `screens.md §3` |
| Disabled: Phase 2 Inventory columns (opacity-60, SOON tag, — values) | §6 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |

---

## Reference §2 — Design tokens

| Token | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Paper #FFFFFF (background) | §2 | `app/globals.css` `--background: 0 0% 100%`, `tailwind.config.ts` `background` | `design-system.md §1` |
| Ink #0A0A0A (text/inverted fills) | §2 | `app/globals.css` `--foreground: 0 0% 4%`, `tailwind.config.ts` `foreground` | `design-system.md §1` |
| Muted #6B6B6B (secondary text) | §2 | `app/globals.css` `--muted-foreground: 0 0% 42%`, `tailwind.config.ts` `muted.foreground` | `design-system.md §1` |
| Faint #9B9B9B (tertiary text) | §2 | `app/globals.css` `--faint: 0 0% 61%`, `tailwind.config.ts` `faint` | `design-system.md §1` |
| Hairline #E6E6E6 (borders) | §2 | `app/globals.css` `--border: 0 0% 90%`, `tailwind.config.ts` `border` | `design-system.md §1` |
| Wash #F6F6F5 (hover/subtle fills) | §2 | `app/globals.css` `--accent: 0 0% 96%`, `tailwind.config.ts` `accent` | `design-system.md §1` |
| Inversion utility `.surface-inverted` | §2 (rule 2) | `app/globals.css` `@layer utilities` | `design-system.md §3` |
| 2px border-radius | §2 | `app/globals.css` `--radius: 2px`, `tailwind.config.ts` `borderRadius` | `design-system.md §6` |
| Space Grotesk (display font) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.display` | `design-system.md §4` |
| Inter (body font) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.sans` | `design-system.md §4` |
| JetBrains Mono (figures) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.mono` | `design-system.md §4` |
| IBM Plex Sans Arabic (ar locale) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.arabic`, `app/[locale]/layout.tsx` | `design-system.md §4` |
| Tabular numbers | §2 | `app/globals.css` (`body` + `.nums`), `components/data/StatCard.tsx`, `components/data/LedgerTable.tsx` | `design-system.md §4` |

---

## Reference §7 — Responsive

| Requirement | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| ≤860px: sidebar → off-canvas Sheet | §7 | `app/[locale]/(app)/layout.tsx` (`hidden md:block`), `components/shell/MobileNav.tsx` | `screens.md` (all app screens), `components.md MobileNav` |
| Stat strip → 2 columns | §7 | `app/[locale]/(app)/overview/page.tsx` (`grid-cols-2 sm:grid-cols-4`) | `screens.md §4` |
| Variance row stacks (measure above figures) | §7 | `app/[locale]/(app)/variance/page.tsx` (`grid-cols-1 md:grid-cols-[1fr_2fr_auto]`) | `screens.md §8` |
| Tables scroll internally | §7 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `app/[locale]/(app)/inventory/page.tsx` (`overflow-x-auto`) | `screens.md §5`, `screens.md §7` |
| Content padding drops to 18px on mobile | §7 | All `(app)` pages (`p-[18px] md:p-7`) | `design-system.md §5` |

---

## Locale routing and i18n

| Requirement | Implementing file(s) | Doc section |
|---|---|---|
| `[locale]` routing, `<html lang dir>` | `app/[locale]/layout.tsx`, `i18n/routing.ts`, `proxy.ts` | `decisions.md D3`, `decisions.md D8` |
| EN + AR message catalogs | `messages/en.json`, `messages/ar.json` | `decisions.md D5` |
| Locale switcher | `components/shell/LocaleSwitcher.tsx` | `components.md LocaleSwitcher` |
| RTL logical properties | `components/shell/Sidebar.tsx` (border-e), `components/orders/Timeline.tsx` (border-s, ms-2), `components/data/Measure.tsx` (insetInlineStart) | `decisions.md D5`, `components.md` |
| Mobile nav RTL side | `components/shell/MobileNav.tsx` | `decisions.md D12`, `components.md MobileNav` |

---

## Data model and tenant isolation

| Requirement | Implementing file(s) | Doc section |
|---|---|---|
| Typed data model | `lib/types.ts` | `data-model.md §1` |
| Variance derivation | `lib/variance.ts` | `data-model.md §2` |
| Stock status derivation | `lib/stock.ts` | `data-model.md §2` |
| Overview stats derivation | `lib/overview.ts` | `data-model.md §2` |
| Order helpers | `lib/orders.ts` | `data-model.md §2` |
| Money and gap formatting | `lib/format.ts` | `data-model.md §2` |
| 2-tenant seed | `lib/seed/tenant-acme.ts`, `lib/seed/tenant-nile.ts`, `lib/seed/index.ts` | `data-model.md §3` |
| Tenant isolation (context) | `lib/tenant-context.tsx` | `data-model.md §4` |
| Supabase mapping | `docs/data-model.md §5` | `data-model.md §5` |
| DERIVED values must not be stored | `docs/data-model.md §5` | `data-model.md §5` |
