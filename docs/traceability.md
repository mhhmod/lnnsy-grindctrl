# Traceability Matrix

Maps every reference requirement to its implementing file(s) and documentation section. Every row must have at least one real file path.

> **Migration note (2026-06-21):** Component paths updated from `components/ui/` (removed shadcn) to `components/primitives/`. See ADR D21.

---

## Reference §4 — Screens

| Requirement | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Login screen | §4.1 | `app/[locale]/(auth)/login/page.tsx` | `screens.md §2` |
| Login: centered card, max 380px, Brandmark, Work email + Password, Sign in button, "No workspace yet?" link | §4.1 | `app/[locale]/(auth)/login/page.tsx`, `app/[locale]/(auth)/layout.tsx` | `screens.md §2` |
| Onboarding: connect Shopify + Bosta | §4.2 | `app/[locale]/(auth)/onboarding/page.tsx` | `screens.md §3` |
| Onboarding: card inverts on connect, CONNECTED chip, Continue disabled until both connected | §4.2 | `components/onboarding/ConnectCard.tsx` | `components.md ConnectCard`, `screens.md §3` |
| Overview: editorial header (h2 + lead) | §4.3 | `app/[locale]/(app)/overview/page.tsx` | `screens.md §4` |
| Overview stat strip: 4 cells, Unexplained units inverted | §4.3 | `app/[locale]/(app)/overview/page.tsx` (inline `StatItem`) | `screens.md §4`, `components.md StatCard` |
| Overview needs attention: worst variance rows (GAP chip) + Out rows (OUT chip), calm state | §4.3 | `app/[locale]/(app)/overview/page.tsx`, `components/primitives/Chip.tsx` | `screens.md §4` |
| Orders: honest-count FilterPills (All + 7 statuses), count-0 disabled | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/primitives/SegmentedFilter.tsx` | `screens.md §5`, `components.md FilterPills` |
| Orders: session-persisted filter (`sessionStorage "orders.filter"`) | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx` | `screens.md §5` |
| Orders: live multi-field search (order# + customer) with match-bold highlight | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx` | `screens.md §5` |
| Orders: cross-fade on filter/search change (`xfade` + `TBody key={fadeKey}`) | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `app/globals.css` | `screens.md §5`, `design-system.md §3b` |
| Orders: table with Order# (mono), Customer, Status, Total (mono right), Date — newest-first sort | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx` | `screens.md §5` |
| Orders: problem rows (Cancelled/Failed/Returned) invert | §4.4 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/data/StatusChip.tsx`, `lib/orders.ts` | `screens.md §5`, `components.md OrderStatusChip` |
| Finance: view-only Paymob/Bosta payout preview derived from orders | Extension | `app/[locale]/(app)/finance/page.tsx`, `lib/finance.ts` | `screens.md §5a`, `data-model.md §2` |
| Finance: summary strip and order payout ledger | Extension | `app/[locale]/(app)/finance/page.tsx` | `screens.md §5a` |
| Inventory: search by name/SKU | §4.5 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Inventory: Product name + mono SKU, In stock (mono right), Status chip | §4.5 | `app/[locale]/(app)/inventory/page.tsx`, `components/data/StatusChip.tsx` | `screens.md §7`, `components.md StockStatusChip` |
| Inventory: Low/Out rows invert; Phase 2 columns disabled with SOON | §4.5 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Variance: shared scale across all rows | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `components/data/Measure.tsx` | `screens.md §8` |
| Variance: one row per SKU — product+SKU, measure track, 3 figures | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `components/data/Measure.tsx` | `screens.md §8`, `components.md Measure` |
| Variance: non-zero gap rows invert, sort to top | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `lib/variance.ts` | `screens.md §8`, `data-model.md §2` |
| Variance: plain-language tooltip on gap figure | §4.6 | `app/[locale]/(app)/variance/page.tsx`, `components/primitives/Tooltip.tsx` | `screens.md §8`, `components.md Tooltip` |
| Returns: empty state only, dashed panel, directional copy | §4.7 | `app/[locale]/(app)/returns/page.tsx`, `components/data/EmptyState.tsx` | `screens.md §9`, `components.md EmptyState` |
| Order drawer: native `<dialog>`, order# + customer title, 2×2 meta grid, Timeline, Items | §4.8 | `components/orders/OrderDrawer.tsx`, `components/primitives/Drawer.tsx`, `components/orders/Timeline.tsx` | `screens.md §6`, `components.md OrderDrawer`, `components.md Drawer`, `components.md Timeline` |
| Settings: workspace 2×2 grid (name/plan/members/region), connections list | §4.9 | `app/[locale]/(app)/settings/page.tsx`, `components/brand/Glyph.tsx` | `screens.md §10` |

---

## Reference §5 — Components inventory

| Component | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Brandmark (solid square + wordmark) | §5 | `components/brand/Brandmark.tsx` | `components.md Brandmark` |
| Button (primary solid ink, ghost hairline) | §5 | `components/primitives/Button.tsx` | `components.md Button` |
| Chip (muted outline / solid inverted / mono) | §5 | `components/primitives/Chip.tsx`, `components/data/StatusChip.tsx` | `components.md Chip`, `components.md OrderStatusChip`, `components.md StockStatusChip` |
| Stat card (label + big mono number + footnote, feature variant) | §5 | `app/[locale]/(app)/overview/page.tsx` (inline `StatItem`) | `components.md StatCard` |
| Filter pill (label + mono count, active = inverted, count-0 disabled) | §5 | `components/primitives/SegmentedFilter.tsx` | `components.md FilterPills` |
| Table (uppercase faint headers, hairline dividers, data-clickable rows, sortable TH) | §5 | `components/primitives/Table.tsx` | `components.md Table` |
| Measure (variance track + ticks + gap block on shared scale) | §5 | `components/data/Measure.tsx` | `components.md Measure` |
| Tooltip / TooltipWrap (plain-language, role="tooltip", aria-describedby) | §5 | `components/primitives/Tooltip.tsx` | `components.md Tooltip` |
| Drawer (native `<dialog>` panel + scrim + RTL slide) | §5 | `components/primitives/Drawer.tsx`, `components/orders/OrderDrawer.tsx` | `components.md Drawer`, `components.md OrderDrawer` |
| Menu (Popover API, light-dismiss, arrow-key nav) | §5 | `components/primitives/Menu.tsx` | `components.md Menu` |
| Skeleton (shimmer / static wash under reduced-motion) | §5 | `components/primitives/Skeleton.tsx`, `components/data/TableSkeleton.tsx` | `components.md Skeleton` |
| Icons (inline SVG, no external library) | §5 | `components/icons/index.tsx` | `components.md Icons` |
| Empty state (dashed panel, glyph, title, directional copy) | §5 | `components/data/EmptyState.tsx` | `components.md EmptyState` |
| Tenant switcher (avatar + name + Menu popover) | §5 | `components/shell/TenantSwitcher.tsx`, `components/primitives/Menu.tsx` | `components.md TenantSwitcher` |
| Search (Input variant="search", icon prefix, × clear) | §5 | `components/primitives/Input.tsx` | `components.md Input` |
| Timeline (vertical dotted spine, event list, logical properties) | §5 | `components/orders/Timeline.tsx` | `components.md Timeline` |
| Connect card (inversion on connect, CONNECTED chip) | §5 | `components/onboarding/ConnectCard.tsx` | `components.md ConnectCard` |
| Glyphs S / B (square) | §5 | `components/brand/Glyph.tsx` | `components.md Glyph` |

---

## Reference §6 — States

| State | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Empty: no orders for filter or search | §6 | `app/[locale]/(app)/orders/OrdersInner.tsx` | `screens.md §5` |
| Empty: no search match (inventory) | §6 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Empty: Returns not connected | §6 | `app/[locale]/(app)/returns/page.tsx`, `components/data/EmptyState.tsx` | `screens.md §9` |
| Empty: Overview calm state | §6 | `app/[locale]/(app)/overview/page.tsx` | `screens.md §4` |
| Empty: Finance has no orders | §6 | `app/[locale]/(app)/finance/page.tsx` | `screens.md §5a` |
| Problem: Low/Out stock (inversion) | §6 | `app/[locale]/(app)/inventory/page.tsx`, `components/data/StatusChip.tsx`, `lib/stock.ts` | `screens.md §7`, `data-model.md §2` |
| Problem: Cancelled/Failed/Returned orders (inversion) | §6 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `components/data/StatusChip.tsx`, `lib/orders.ts` | `screens.md §5` |
| Problem: Finance at-risk/reversed/cancelled payout rows (inversion) | §6 | `app/[locale]/(app)/finance/page.tsx`, `lib/finance.ts` | `screens.md §5a`, `data-model.md §2` |
| Problem: non-zero variance (inversion, sorted to top) | §6 | `app/[locale]/(app)/variance/page.tsx`, `lib/variance.ts` | `screens.md §8` |
| Problem: Overview attention rows (GAP/OUT Chip) | §6 | `app/[locale]/(app)/overview/page.tsx`, `components/primitives/Chip.tsx` | `screens.md §4` |
| Loading: orders table skeleton | §6 | `app/[locale]/(app)/orders/loading.tsx`, `components/data/TableSkeleton.tsx`, `components/primitives/Skeleton.tsx` | `components.md Skeleton`, `screens.md §5` |
| Loading: inventory table skeleton | §6 | `app/[locale]/(app)/inventory/loading.tsx`, `components/data/TableSkeleton.tsx` | `components.md Skeleton`, `screens.md §7` |
| Loading: variance custom skeleton | §6 | `app/[locale]/(app)/variance/loading.tsx` | `screens.md §8` |
| Focus: visible keyboard focus on all interactive elements | §6 | `app/globals.css` (`--ring-warm: #0A0A0A`), all primitives via `focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)]` | `design-system.md §1` |
| Disabled: Onboarding Continue until both connected | §6 | `app/[locale]/(auth)/onboarding/page.tsx` | `screens.md §3` |
| Disabled: Phase 2 Inventory columns (opacity-60, SOON tag, — values) | §6 | `app/[locale]/(app)/inventory/page.tsx` | `screens.md §7` |
| Active row: drawer open — `data-active` stays in Wash | §6 | `app/[locale]/(app)/orders/OrdersInner.tsx`, `app/globals.css` | `screens.md §5`, `design-system.md §3b` |

---

## Reference §2 — Design tokens

| Token | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| Paper `#FFFFFF` (background) | §2 | `app/globals.css` (`--paper: #FFFFFF`), Tailwind `bg-paper` | `design-system.md §1` |
| Ink `#0A0A0A` (text/inverted fills) | §2 | `app/globals.css` (`--ink: #0A0A0A`), Tailwind `text-ink`, `bg-ink` | `design-system.md §1` |
| Muted `#6B6B6B` (secondary text) | §2 | `app/globals.css` (`--muted: #6B6B6B`), Tailwind `text-muted` | `design-system.md §1` |
| Faint `#9B9B9B` (tertiary text) | §2 | `app/globals.css` (`--faint: #9B9B9B`), Tailwind `text-faint` | `design-system.md §1` |
| Hairline `#E6E6E6` (borders) | §2 | `app/globals.css` (`--hairline: #E6E6E6`), Tailwind `border-hairline`, `divide-hairline` | `design-system.md §1` |
| Wash `#F6F6F5` (hover/subtle fills) | §2 | `app/globals.css` (`--wash: #F6F6F5`), Tailwind `bg-wash` | `design-system.md §1` |
| Motion token `--t-fast: 140ms` | §2 | `app/globals.css` (`:root`), all primitives via `duration-[140ms]` or `var(--t-fast)` | `design-system.md §7` |
| Inversion utility `.surface-inverted` | §2 | `app/globals.css` `@layer utilities` | `design-system.md §3` |
| `.interactive` hover utility | §2 | `app/globals.css` `@layer utilities` | `design-system.md §3a` |
| `tr[data-clickable]` nudge + `tr[data-active]` | §2 | `app/globals.css` `@layer utilities` | `design-system.md §3b` |
| `.xfade` cross-fade | §2 | `app/globals.css` `@layer utilities` | `design-system.md §3b` |
| 2px border-radius | §2 | `app/globals.css` (`--radius: 2px`), Tailwind `rounded-sm` | `design-system.md §6` |
| Space Grotesk (display font) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.display` | `design-system.md §4` |
| Inter (body font) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.sans` | `design-system.md §4` |
| JetBrains Mono (figures) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.mono` | `design-system.md §4` |
| IBM Plex Sans Arabic (ar locale) | §2 | `lib/fonts.ts`, `tailwind.config.ts` `fontFamily.arabic`, `app/[locale]/layout.tsx` | `design-system.md §4` |
| Tabular numbers | §2 | `app/globals.css` (`body` + `.nums`), all numeric cells | `design-system.md §4` |
| Dark grayscale mirror (`.dark`) | §2 | `app/globals.css` `.dark` block | `design-system.md §1` |

---

## Reference §7 — Responsive

| Requirement | Reference § | Implementing file(s) | Doc section |
|---|---|---|---|
| ≤768px: sidebar → off-canvas MobileNav | §7 | `app/[locale]/(app)/layout.tsx` (`hidden md:block`), `components/shell/MobileNav.tsx` | `screens.md` (all app screens), `components.md MobileNav` |
| Stat strip → 2 columns | §7 | `app/[locale]/(app)/overview/page.tsx` (`grid-cols-2 sm:grid-cols-4`) | `screens.md §4` |
| Variance row stacks (measure above figures) | §7 | `app/[locale]/(app)/variance/page.tsx` (`grid-cols-1 md:grid-cols-[1fr_2fr_auto]`) | `screens.md §8` |
| Tables scroll internally | §7 | `components/primitives/Table.tsx` (`overflow-x-auto` wrapper built in) | `components.md Table`, `screens.md §5`, `screens.md §7` |
| Content padding drops to 18px on mobile | §7 | All `(app)` pages (`p-[18px] md:p-7`) | `design-system.md §5` |

---

## Locale routing and i18n

| Requirement | Implementing file(s) | Doc section |
|---|---|---|
| `[locale]` routing, `<html lang dir>` | `app/[locale]/layout.tsx`, `i18n/routing.ts`, `proxy.ts` | `decisions.md D3`, `decisions.md D8` |
| EN + AR message catalogs | `messages/en.json`, `messages/ar.json` | `decisions.md D5` |
| Locale switcher | `components/shell/LocaleSwitcher.tsx` | `components.md LocaleSwitcher` |
| RTL logical properties | `components/shell/Sidebar.tsx` (border-e), `components/orders/Timeline.tsx` (border-s, ms-2), `components/data/Measure.tsx` (insetInlineStart), all primitives (`start-*`, `ps-*`, `ms-*`, `text-end`) | `decisions.md D5`, `components.md` |
| Mobile nav RTL side | `components/shell/MobileNav.tsx` | `decisions.md D12`, `components.md MobileNav` |
| FilterPills arrow-key RTL-aware roving | `components/primitives/SegmentedFilter.tsx` (`document.dir === "rtl"` check) | `components.md FilterPills` |
| Drawer RTL slide animation | `app/globals.css` (`@keyframes drawer-slide-in-rtl`) | `design-system.md §7`, `components.md Drawer` |

---

## Data model and tenant isolation

| Requirement | Implementing file(s) | Doc section |
|---|---|---|
| Typed data model | `lib/types.ts` | `data-model.md §1` |
| Variance derivation | `lib/variance.ts` | `data-model.md §2` |
| Stock status derivation | `lib/stock.ts` | `data-model.md §2` |
| Overview stats derivation | `lib/overview.ts` | `data-model.md §2` |
| Finance preview derivation | `lib/finance.ts` | `data-model.md §2` |
| Order helpers | `lib/orders.ts` | `data-model.md §2` |
| Money and gap formatting | `lib/format.ts` | `data-model.md §2` |
| 2-tenant seed | `lib/seed/tenant-acme.ts`, `lib/seed/tenant-nile.ts`, `lib/seed/index.ts` | `data-model.md §3` |
| Tenant isolation (context) | `lib/tenant-context.tsx` | `data-model.md §4` |
| Supabase mapping | `docs/data-model.md §5` | `data-model.md §5` |
| DERIVED values must not be stored | `docs/data-model.md §5` | `data-model.md §5` |

---

## De-shadcn migration map

Removed component → replacement.

| Removed (components/ui/) | Replaced by | Implementing file |
|---|---|---|
| `button.tsx` (Radix Slot + CVA) | `Button` (native button + variantMap) | `components/primitives/Button.tsx` |
| `badge.tsx` (CVA) | `Chip` (native span + variantMap) | `components/primitives/Chip.tsx` |
| `input.tsx` (shadcn) | `Input` (native input + forwardRef) | `components/primitives/Input.tsx` |
| `table.tsx` + `LedgerTable.tsx` | `Table` / `THead` / `TBody` / `TR` / `TH` / `TD` | `components/primitives/Table.tsx` |
| `toggle-group.tsx` (Radix Toggle) | `FilterPills` / `SegmentedFilter` | `components/primitives/SegmentedFilter.tsx` |
| `sheet.tsx` (Radix Dialog) | `Drawer` (native `<dialog>`) | `components/primitives/Drawer.tsx` |
| `dropdown-menu.tsx` (Radix DropdownMenu) | `Menu` (Popover API) | `components/primitives/Menu.tsx` |
| `skeleton.tsx` (shadcn) | `Skeleton` | `components/primitives/Skeleton.tsx` |
| lucide-react icons | Inline SVG components | `components/icons/index.tsx` |
| `lib/utils.ts` (`cn` = clsx + tailwind-merge) | `lib/cx.ts` (`cx` = minimal join) | `lib/cx.ts` |
