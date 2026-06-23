# Components

One row per component, then usage examples for the custom ones. Standing rule: no component ships without a row here and an entry in `traceability.md`.

> **Migration note (2026-06-21):** All shadcn/Radix primitives (`components/ui/`) have been removed. All interactive primitives are now hand-rolled in `components/primitives/` using native `<dialog>`, the Popover API, and `cx` from `lib/cx`. CVA, clsx, tailwind-merge, and lucide-react are gone. See ADR D21 in `decisions.md`.

---

## Component table

| Component | File | Purpose | Key props | A11y note | States | Reference § |
|---|---|---|---|---|---|---|
| **Button** | `components/primitives/Button.tsx` | Native `<button>` with variant + size maps | `variant: "primary" \| "ghost" \| "accent"`, `size: "sm" \| "md"`, all standard `ButtonHTMLAttributes` | `aria-disabled` on disabled; focus ring via `focus-visible:ring-2` with `--ring-warm`; keyboard-only ring | default, hover (opacity-85 / border-ink), active (translate-y-px), disabled (opacity-40) | §5 Button |
| **Chip** | `components/primitives/Chip.tsx` | Non-interactive `<span>` label/badge | `variant: "muted" \| "solid" \| "mono" \| "accent"`, standard `HTMLAttributes<HTMLSpanElement>` | Chips never animate on hover — they are information, not controls | muted (hairline outline), solid (inverted ink), mono (hairline, JetBrains Mono), accent (= solid alias) | §5 Chip |
| **Input** | `components/primitives/Input.tsx` | Native `<input>` with search variant | `variant: "default" \| "search"`, `icon?: ReactNode`, `onClear?: () => void`, standard input props; forwards ref | Placeholder uses `--faint`; focus moves border to ink (140ms); `aria-label` required from caller | default, focus (border → ink), disabled (opacity-40), search (Search icon prefix + × clear button shown when value non-empty) | §5 Search |
| **Table / THead / TBody / TR / TH / TD** | `components/primitives/Table.tsx` | Native semantic table elements with hairline dividers and interaction data attributes | `TR`: `data-clickable`, `data-active`; `TH`: `sortable`, `sortDir: "asc" \| "desc" \| null`, `onSort`; standard HTML props on all | `TH` with `sortable` sets `aria-sort`; use `text-end` (not `text-right`) for numeric columns; `Table` wraps in `overflow-x-auto` | normal, data-clickable (Wash hover + first-cell nudge), data-active (Wash hold), sortable TH (▴/▾/⬍ indicator) | §5 Table |
| **FilterPills** (also exported as `SegmentedFilter`) | `components/primitives/SegmentedFilter.tsx` | Accessible filter pill group with honest-count display | `options: FilterOption[]` (each: `value`, `label`, `count?`), `value: string`, `onChange: (value: string) => void`, `label?: string` | `role="group"` + `aria-label`; each pill has `aria-pressed`; arrow-key roving (RTL-aware: ArrowLeft/Right swapped under `document.dir === "rtl"`); Home/End; count===0 → disabled, not focusable | active (inverted), inactive-enabled (hover: border+text → ink, 120ms), zero-count (faint, disabled, opacity-60) | §4.4, §5 Filter |
| **Tooltip / TooltipWrap** | `components/primitives/Tooltip.tsx` | Plain-language anchored tooltip | `Tooltip`: `content: string`, `children: (triggerProps) => ReactNode`; `TooltipWrap`: `content: string`, wraps a single element | `role="tooltip"` on bubble; `aria-describedby` links trigger to bubble; shows on hover + keyboard focus; dismisses on leave/blur | visible (opacity-100, 150ms fade), hidden (opacity-0) | §5 Tooltip, §4.6 Variance |
| **Drawer** | `components/primitives/Drawer.tsx` | Off-canvas detail panel using native `<dialog>` | `open: boolean`, `onOpenChange: (open: boolean) => void`, `title?: string`, `children?: ReactNode` | Native `<dialog>` provides: focus trap, Escape-to-close, `::backdrop` scrim; `aria-modal="true"`; `aria-label` from `title`; backdrop click closes via `e.target === dialog` check | open (showModal, slide-in 220ms ease-out), closed (display:none via CSS) — RTL slide uses `translateX(-100%)` variant | §5 Drawer, §4.8 |
| **Menu** | `components/primitives/Menu.tsx` | Dropdown menu using native Popover API | `trigger: ReactNode`, `items: MenuItem[]` (each: `label`, `onSelect`, `active?`), `align?: "start" \| "end"` | Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`; popover: `role="menu"`; items: `role="menuitem"`, `tabIndex={-1}`; ArrowUp/Down/Home/End keyboard nav; Escape + outside-click via Popover API light-dismiss | closed, open (popover-open: fade + 6px rise, 150ms; reduced-motion: fade only) | §5 Tenant switcher |
| **Skeleton** | `components/primitives/Skeleton.tsx` | Loading placeholder with shimmer | Standard `HTMLAttributes<HTMLDivElement>` | `role="status"`, `aria-label="Loading…"` | shimmer (1.4s gradient animation under `prefers-reduced-motion: no-preference`), static wash fill (reduced-motion) | §6 Loading |
| **Icons** | `components/icons/index.tsx` | Inline SVG icons — no external library | `className?: string`, `size?: number` (default 16) | All icons: `aria-hidden="true"`, `currentColor` stroke, 1.5px | — | All screens |
| **StatCard** | `components/data/StatCard.tsx` | KPI card — label + big mono number + optional footnote | `label: string`, `value: string`, `foot?: string`, `feature?: boolean` | No interactive role; layout-only | normal (paper bg), feature (`surface-inverted` — inverted black, `feature=true`) | §4.3 |
| **Measure** | `components/data/Measure.tsx` | Variance visualisation: shared-scale track with expected/atBosta ticks and gap block | `expected: number`, `atBosta: number`, `scaleMax: number`, `inverted?: boolean` | Track is visual only; plain-language values rendered in sibling cells | normal, inverted (when row has gap — uses paper-coloured ticks/block) | §4.6, §5 Measure |
| **OrderStatusChip** | `components/data/StatusChip.tsx` | Order status badge; inverts for problem statuses | `status: OrderStatus` | Wraps `Chip`; no interactive role | normal (Chip variant="muted"), problem — Cancelled/Failed/Returned — (Chip variant="solid") | §4.4 |
| **StockStatusChip** | `components/data/StatusChip.tsx` | Stock level badge (OK / Low / Out); inverts for Low and Out | `inStock: number` | Same wrapper pattern as OrderStatusChip | OK (muted), Low or Out (solid inverted) | §4.5 |
| **EmptyState** | `components/data/EmptyState.tsx` | Dashed-border panel with glyph, title, optional body | `title: string`, `body?: string` | Items are centred directionally; `items-center` — no physical alignment | single empty state | §4.7, §6 Empty |
| **TableSkeleton** | `components/data/TableSkeleton.tsx` | Reusable skeleton loader for data tables | `rows?: number` (default 6), `cols?: number` (default 4) | `role="status"`, `aria-label="Loading"` | shimmer / static wash | §6 Loading |
| **Brandmark** | `components/brand/Brandmark.tsx` | App logo: solid 16×16 ink square + "Ledger" wordmark | `withWordmark?: boolean` (default true) | Do not mirror the square in RTL | — | §5 Brandmark |
| **Glyph** | `components/brand/Glyph.tsx` | Square box with a single letter (S / B) | `letter: string`, `inverted?: boolean` | Centred in a fixed box; no direction dependency | normal (paper bg, ink border), inverted (`surface-inverted`) | §4.2, §5 |
| **Timeline** | `components/orders/Timeline.tsx` | Vertical event list with dotted spine and filled dots | `events: TimelineEvent[]` — each `{ label: string; at: string; problem?: boolean }` | Uses logical properties (`border-s`, `ms-2`, `ps-5`) — RTL-safe | standard events, problem events (copy carries the meaning; dot styling does not currently differ) | §4.8, §5 Timeline |
| **OrderDrawer** | `components/orders/OrderDrawer.tsx` | Right-side detail drawer for a single order | `order: Order \| null`, `onOpenChange: (open: boolean) => void` | Wraps `Drawer` primitive; focus trap, Escape, backdrop click all handled by native `<dialog>` | open (`order !== null`), closed | §4.8 |
| **ConnectCard** | `components/onboarding/ConnectCard.tsx` | Service connection card; inverts to black when connected | `letter`, `name`, `desc`, `connected: boolean`, `onConnect`, `connectLabel`, `connectedLabel` | `min-w-0 flex-1` for text overflow | disconnected (paper), connected (`surface-inverted`) | §4.2, §5 Connect card |
| **ThemeProvider** | `components/theme/ThemeProvider.tsx` | Local theme context with persisted preference | `children: ReactNode` | Must be ancestor of any `useTheme()` consumer | system (default), light, dark | D13, D19 |
| **ThemeToggle** | `components/shell/ThemeToggle.tsx` | Light/dark toggle; uses `useSyncExternalStore` as hydration guard | No external props | SSR placeholder avoids hydration mismatch | light (Moon icon), dark (Sun icon), SSR placeholder (disabled) | D13 |
| **Sidebar** | `components/shell/Sidebar.tsx` | Full-height desktop nav — Brandmark + nav links + TenantSwitcher | No external props | `border-e` (logical RTL-safe); active link: `surface-inverted`; `hidden md:block` | active link (inverted), hover link (bg-wash) | §3 |
| **TopBar** | `components/shell/TopBar.tsx` | Page header — title + LocaleSwitcher + Export button + MobileNav hamburger | `title: string` | `justify-between` logical; title truncates on narrow widths | — | §3 |
| **MobileNav** | `components/shell/MobileNav.tsx` | Hamburger + off-canvas nav; RTL-aware (opens from `ar`→right, else left) | No external props | `side` from locale — see D12 | open, closed | §3, D12 |
| **TenantSwitcher** | `components/shell/TenantSwitcher.tsx` | Workspace switcher — wraps `Menu` primitive | No external props | `align="start"` logical | closed, open (Menu popover) | §3, §4.9 |
| **LocaleSwitcher** | `components/shell/LocaleSwitcher.tsx` | Toggle between `en` and `ar` locales | No external props | Swaps `/en` or `/ar` prefix in current URL | — | §3, §10 |

---

## Usage examples — custom and primitive components

### Button

```tsx
// Primary (solid ink)
<Button>Save</Button>

// Ghost (hairline border)
<Button variant="ghost">Cancel</Button>

// Small disabled
<Button size="sm" disabled>Not available</Button>
```

---

### Chip

```tsx
// Informational label (muted outline)
<Chip variant="muted">Shipped</Chip>

// Problem / active signal (inverted black)
<Chip variant="solid" className="font-mono nums">GAP −3</Chip>

// Count or numeric value (mono, outline)
<Chip variant="mono">12</Chip>
```

---

### Input (search variant)

```tsx
const [q, setQ] = useState("");

<Input
  variant="search"
  placeholder="Search orders…"
  value={q}
  onChange={(e) => setQ(e.target.value)}
  onClear={() => setQ("")}
  aria-label="Search orders"
/>
```

The × clear button appears automatically when `value` is non-empty. It calls `onClear`.

---

### Table primitives

```tsx
import { Table, THead, TBody, TR, TH, TD } from "@/components/primitives/Table";

<Table>
  <THead>
    <TR>
      <TH>Order #</TH>
      <TH sortable sortDir="desc" onSort={handleSort}>Date</TH>
      <TH className="text-end">Total</TH>
    </TR>
  </THead>
  <TBody>
    <TR data-clickable="true" data-active={isOpen ? "true" : undefined}
        className="cursor-pointer" onClick={() => openOrder(id)}>
      <TD className="nums font-mono text-[13px]">#1042</TD>
      <TD className="nums font-mono text-[11px] text-faint">2026-06-20</TD>
      <TD className="nums font-mono text-[13px] text-end">EGP 540</TD>
    </TR>
    {/* Problem row */}
    <TR className="surface-inverted">
      <TD className="nums font-mono text-[13px]">#1041</TD>
      <TD className="nums font-mono text-[11px] text-faint">2026-06-19</TD>
      <TD className="nums font-mono text-[13px] text-end">EGP 1,250</TD>
    </TR>
  </TBody>
</Table>
```

Convention: use `text-end` (not `text-right`) for numeric columns — RTL-safe.

---

### FilterPills (SegmentedFilter)

```tsx
import { FilterPills } from "@/components/primitives/SegmentedFilter";

<FilterPills
  options={[
    { value: "All", label: "All", count: 42 },
    { value: "Shipped", label: "Shipped", count: 30 },
    { value: "Failed", label: "Failed", count: 0 },  // disabled — 0 count
  ]}
  value={activeFilter}
  onChange={setActiveFilter}
  label="Filter orders by status"
/>
```

Pills with `count === 0` are faint, disabled, and not in the roving tab order. The table body should be wrapped in `.xfade.xfade-in` (with a `key` that changes on filter/search change) for the 120ms cross-fade.

---

### Tooltip

```tsx
import { TooltipWrap } from "@/components/primitives/Tooltip";

// Simple wrapper form (most common)
<TooltipWrap content="3 units short — courier marked 5 returned, only 2 reached Bosta.">
  <span className="underline decoration-dotted cursor-help">−3</span>
</TooltipWrap>

// Render-prop form (when you need to control trigger props explicitly)
<Tooltip content="Shared scale: all rows use the same max.">
  {(props) => (
    <button {...props} className="relative">
      <InfoIcon size={14} />
    </button>
  )}
</Tooltip>
```

---

### Drawer

```tsx
import { Drawer } from "@/components/primitives/Drawer";

<Drawer open={isOpen} onOpenChange={setOpen} title="Order #1042 — Ali Hassan">
  <p>Drawer content here.</p>
</Drawer>
```

`Drawer` uses a native `<dialog>`: focus trap, Escape close, and backdrop scrim are all handled by the browser. The `::backdrop` is styled in `app/globals.css` (35% ink opacity). Slide animation is RTL-aware.

---

### Menu (Popover API)

```tsx
import { Menu } from "@/components/primitives/Menu";

<Menu
  trigger={<span>Switch workspace</span>}
  items={[
    { label: "Acme Ltd", active: true, onSelect: () => switchTo("acme") },
    { label: "Nile Co",  active: false, onSelect: () => switchTo("nile") },
  ]}
  align="start"
/>
```

Uses `popover="auto"`: the browser handles light-dismiss (outside click) and Escape. Arrow-key navigation is implemented in the component.

---

### Skeleton

```tsx
import { Skeleton } from "@/components/primitives/Skeleton";

// Simple placeholder block
<Skeleton className="h-4 w-32" />

// Via TableSkeleton (wraps Skeleton)
<TableSkeleton rows={8} cols={5} />
```

---

### Icons

```tsx
import { ChevronDown, Close, Search, Sun, Moon, GlyphS, GlyphB } from "@/components/icons";

<Search size={14} className="text-[var(--faint)]" />
<Close size={16} />
<ChevronDown size={14} className="text-[var(--faint)]" />
```

All icons: `aria-hidden="true"`, `currentColor` stroke (1.5px), props `{ className?, size? }`.

---

### StatCard

```tsx
// Normal card
<StatCard label="Orders today" value="12" foot="across all channels" />

// Feature card (inverted black — Unexplained units)
<StatCard label="Unexplained units" value="6" foot="investigate variance" feature />
```

`feature={true}` applies `surface-inverted`. Always the last card in the strip.

---

### Measure

```tsx
const scaleMax = Math.max(...rows.flatMap((r) => [r.expected, r.atBosta]), 1);

<Measure
  expected={55}
  atBosta={52}
  scaleMax={scaleMax}
  inverted={true}   // pass true when the row is surface-inverted
/>
```

`measureGeometry()` is also exported for tests. Returns `{ expectedPct, atBostaPct, gapStartPct, gapWidthPct, solid }`.

---

### OrderStatusChip / StockStatusChip

```tsx
<OrderStatusChip status="Failed" />   // solid inverted (Chip variant="solid")
<OrderStatusChip status="Shipped" />  // muted outline (Chip variant="muted")

<StockStatusChip inStock={0} />  // "OUT" — solid inverted
<StockStatusChip inStock={3} />  // "Low" — solid inverted
<StockStatusChip inStock={20} /> // "OK" — muted outline
```

---

### EmptyState

```tsx
<EmptyState title="No failed orders." />

<EmptyState
  title="Returns aren't connected yet"
  body="Once Bosta sync is live, returns and exchanges show here."
/>
```

Ink square glyph renders automatically. Body capped at `max-w-sm`.

---

### OrderDrawer

```tsx
<OrderDrawer order={selectedOrder} onOpenChange={closeDrawer} />
```

Wraps `Drawer` primitive. When `order !== null` the drawer opens; when `null` it stays closed. The title is rendered as `"{order.number} — {order.customer}"`. Timeline, meta grid, and items list are rendered inside.
