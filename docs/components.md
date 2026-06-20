# Components

One row per component, then usage examples for the custom ones. Standing rule: no component ships without a row here and an entry in `traceability.md`.

---

## Component table

| Component | File | Purpose | Key props / API | shadcn or custom | States supported | RTL notes | Reference § |
|---|---|---|---|---|---|---|---|
| **Button** | `components/ui/button.tsx` | Primary solid ink button and ghost hairline variant | `variant: "default" \| "outline" \| "ghost" \| "link"`, `size: "default" \| "sm" \| "lg" \| "icon"`, `asChild` (Radix Slot) | shadcn (Radix Slot + CVA) | default, hover, focus-visible, disabled | Inherits logical layout; no physical direction | §5 Button |
| **Badge** | `components/ui/badge.tsx` | Inline chip/tag for status labels | `variant: "default" \| "secondary" \| "destructive" \| "outline"`, `className` | shadcn (CVA) | default, outline | No physical sides; text aligns with locale | §5 Chip |
| **Table / TableHeader / TableBody / TableRow / TableHead / TableCell** | `components/ui/table.tsx` | Semantic HTML table primitives styled with Tailwind | Standard table sub-element components; no custom props beyond `className` | shadcn | — | Text direction inherited; use `text-end` not `text-right` for numeric columns | §5 Table |
| **Input** | `components/ui/input.tsx` | Text / search field | Standard HTML input props (`type`, `placeholder`, `value`, `onChange`, etc.) | shadcn | default, focus (border→ink), disabled | `dir` inherits from locale | §5 Search |
| **Sheet / SheetContent / SheetHeader / SheetTitle / SheetClose** | `components/ui/sheet.tsx` | Off-canvas drawer panel with scrim | `open`, `onOpenChange`, `side: "left" \| "right" \| "top" \| "bottom"` (physical only — see D12) | shadcn (Radix Dialog) | open, closed, animated slide | Only physical sides; `MobileNav` picks side based on locale (see D12). `OrderDrawer` uses `side="right"` (not yet flipped for RTL — known gap). | §5 Drawer |
| **DropdownMenu / DropdownMenuTrigger / DropdownMenuContent / DropdownMenuItem** | `components/ui/dropdown-menu.tsx` | Popover menu for tenant switching | Standard Radix DropdownMenu API | shadcn (Radix DropdownMenu) | open/closed, hover item, keyboard | Radix handles RTL positioning | §5 Tenant switcher |
| **Skeleton** | `components/ui/skeleton.tsx` | Animated placeholder for loading states | `className` | shadcn | loading | No direction dependency | §6 Loading |
| **Toggle / ToggleGroup / ToggleGroupItem** | `components/ui/toggle.tsx`, `components/ui/toggle-group.tsx` | Filter pill row for orders status tabs | `type: "single" \| "multiple"`, `value`, `onValueChange`, `data-[state=on]` drives inversion | shadcn (Radix Toggle) | off (default), on (surface-inverted) | Flex-wrap; text direction inherited | §4.4, §5 Filter pill |
| **StatCard** | `components/data/StatCard.tsx` | KPI card with label, big mono number, optional footnote | `label: string`, `value: string`, `foot?: string`, `feature?: boolean` | Custom | normal (white), feature/inverted (black, `feature=true`) | No physical sides; logical spacing | §4.3, §5 Stat card |
| **Measure** | `components/data/Measure.tsx` | Variance visualization track: baseline, two ticks, gap block | `expected: number`, `atBosta: number`, `scaleMax: number`, `inverted?: boolean` | Custom | normal, inverted (when row has gap) | `insetInlineStart` for tick/block positions — RTL-safe | §4.6, §5 Measure, §9 |
| **OrderStatusChip** | `components/data/StatusChip.tsx` | Order status badge, inverts automatically for problem statuses | `status: OrderStatus` | Custom (wraps Badge) | normal (outline), problem (surface-inverted) for Cancelled/Failed/Returned | Badge inherits locale direction | §4.4 |
| **StockStatusChip** | `components/data/StatusChip.tsx` | Stock level badge (OK/Low/Out), inverts for Low and Out | `inStock: number` | Custom (wraps Badge) | normal (OK, outline), problem (Low or Out, surface-inverted) | Same as OrderStatusChip | §4.5 |
| **LedgerTable** | `components/data/LedgerTable.tsx` | Re-export of shadcn Table primitives with usage convention comments | Same as Table primitives | Thin re-export + conventions | Documented in-file comments | Usage: `text-end` for numeric cells, `cursor-pointer hover:bg-accent` for clickable rows | §5 Table |
| **EmptyState** | `components/data/EmptyState.tsx` | Dashed-border panel with glyph, title, optional body copy | `title: string`, `body?: string` | Custom | empty | `items-center` — direction-agnostic centering | §4.7, §5 Empty state, §6 Empty |
| **TableSkeleton** | `components/data/TableSkeleton.tsx` | Reusable skeleton loader for data tables | `rows?: number` (default 6), `cols?: number` (default 4) | Custom (wraps shadcn Skeleton) | loading | Grid widths are logical; no physical sides | §6 Loading |
| **Brandmark** | `components/brand/Brandmark.tsx` | App logo: solid 4×4 ink square + "Ledger" wordmark | `withWordmark?: boolean` (default true) | Custom | — | `inline-flex items-center gap-2` — logical gap; do not mirror the square | §5 Brandmark |
| **Glyph** | `components/brand/Glyph.tsx` | Square 9×9 box with a single letter (S for Shopify, B for Bosta) | `letter: string`, `inverted?: boolean` | Custom | normal (white background), inverted (surface-inverted) | Centered in a fixed box; no direction dependency | §4.2, §5 |
| **Timeline** | `components/orders/Timeline.tsx` | Vertical ordered event list with dotted spine and filled dots | `events: TimelineEvent[]` — each `{ label: string; at: string; problem?: boolean }` | Custom | standard events, problem events (note: `problem` field exists in type and seed but dot styling does not currently differ — copy carries the meaning) | Uses `ms-2`, `ps-5`, `border-s`, `-start-[26px]` — all logical properties, RTL-safe | §4.8, §5 Timeline |
| **OrderDrawer** | `components/orders/OrderDrawer.tsx` | Right-side detail drawer for a single order | `order: Order \| null`, `onOpenChange: (open: boolean) => void` | Custom (wraps Sheet, Timeline, OrderStatusChip, formatMoney) | open (order !== null), closed | `SheetContent side="right"` — physical; reads i18n via `useTranslations("orders")` | §4.8 |
| **ConnectCard** | `components/onboarding/ConnectCard.tsx` | Service connection card that inverts to black when connected | `letter: string`, `name: string`, `desc: string`, `connected: boolean`, `onConnect: () => void`, `connectLabel: string`, `connectedLabel: string` | Custom | disconnected (default white border), connected (surface-inverted) | `min-w-0 flex-1` for text overflow; `gap-4` logical | §4.2, §5 Connect card |
| **Sidebar** | `components/shell/Sidebar.tsx` | Full-height desktop side navigation with Brandmark + nav links + TenantSwitcher | No external props | Custom (uses Brandmark, TenantSwitcher) | active link (surface-inverted), hover link (bg-accent) | `border-e` (inline-end border — RTL-safe); `hidden md:block` wrapper | §3, §5 |
| **TopBar** | `components/shell/TopBar.tsx` | Page header with title, LocaleSwitcher, Export button, and MobileNav hamburger | `title: string` | Custom (uses MobileNav, LocaleSwitcher, Button) | — | `justify-between` logical; title truncates on narrow widths | §3 |
| **MobileNav** | `components/shell/MobileNav.tsx` | Hamburger button + off-canvas Sheet nav, RTL-aware side selection | No external props | Custom (uses Sheet, Brandmark, TenantSwitcher) | open (Sheet), closed | `side` picked from locale: `ar` → `"right"`, else `"left"` to achieve inline-start behavior (see D12) | §7, §3 |
| **TenantSwitcher** | `components/shell/TenantSwitcher.tsx` | Dropdown menu at sidebar bottom to switch active tenant | No external props; reads/writes `TenantProvider` via `useTenant()` | Custom (wraps DropdownMenu) | closed (default), open (popover) | `align="start"` — logical alignment; `text-start` on trigger | §3, §4.9 |
| **LocaleSwitcher** | `components/shell/LocaleSwitcher.tsx` | Toggle button that swaps locale between `en` and `ar` | No external props; uses `useLocale`, `useRouter`, `usePathname` | Custom | — | Replaces `/en` or `/ar` prefix in the current URL path | §3, §10 |

---

## Usage examples — custom components

### StatCard

```tsx
// Normal card
<StatCard label="Orders today" value="12" foot="across all channels" />

// Feature card (inverted — used for Unexplained units)
<StatCard label="Unexplained units" value="6" foot="investigate variance" feature />
```

`feature={true}` applies `surface-inverted` to the card, making it the only black card in the stat strip.

---

### Measure

```tsx
// Called from VariancePage. scaleMax must be shared across all rows.
const scaleMax = Math.max(...rows.flatMap((r) => [r.expected, r.atBosta]), 1);

<Measure
  expected={55}
  atBosta={52}
  scaleMax={scaleMax}
  inverted={true}   // pass true when the row is surface-inverted
/>
```

`measureGeometry()` is also exported for tests. It returns `{ expectedPct, atBostaPct, gapStartPct, gapWidthPct, solid }`. Negative gap → `solid=true` (fully opaque block); positive gap → `solid=false` (30% opacity).

---

### OrderStatusChip / StockStatusChip

```tsx
<OrderStatusChip status="Failed" />   // renders surface-inverted
<OrderStatusChip status="Shipped" />  // renders outline

<StockStatusChip inStock={0} />  // "OUT" — surface-inverted
<StockStatusChip inStock={3} />  // "Low" — surface-inverted
<StockStatusChip inStock={20} /> // "OK" — outline
```

Both wrap `Badge variant="outline"` and conditionally add `surface-inverted` via `cn`.

---

### ConnectCard

```tsx
const [connected, setConnected] = useState(false);

<ConnectCard
  letter="S"
  name="Shopify"
  desc="Sync orders and product catalog"
  connected={connected}
  onConnect={() => setConnected(true)}
  connectLabel="Connect"
  connectedLabel="CONNECTED"
/>
```

When `connected=true`: the card becomes `surface-inverted` (black), the `Glyph` also inverts, and the button is replaced by the `connectedLabel` mono chip.

---

### EmptyState

```tsx
// Minimal (just title)
<EmptyState title="No failed orders." />

// With directional body copy
<EmptyState
  title="Returns aren't connected yet"
  body="Once Bosta sync is live, returns and exchanges show here — split by courier vs. customer, including partial returns."
/>
```

The small solid ink square glyph renders automatically. Body copy is capped at `max-w-sm`.

---

### Timeline

```tsx
<Timeline events={[
  { label: "Order placed", at: "2026-06-18T10:00:00Z" },
  { label: "Shipped with Bosta", at: "2026-06-19T08:30:00Z" },
  { label: "Delivery attempt failed — no answer", at: "2026-06-20T09:12:00Z", problem: true },
]} />
```

The `problem` field exists on `TimelineEvent` and is seeded, but the current rendering does not visually distinguish problem dots — the copy carries the meaning. This is intentional per the reference design.

---

### LedgerTable

```tsx
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/data/LedgerTable";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">Order #</TableHead>
      <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint text-end">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="cursor-pointer hover:bg-accent">
      <TableCell className="nums font-mono text-[13px]">#1042</TableCell>
      <TableCell className="nums font-mono text-[13px] text-end">EGP 540</TableCell>
    </TableRow>
    {/* Problem row */}
    <TableRow className="surface-inverted">
      <TableCell className="nums font-mono text-[13px]">#1041</TableCell>
      <TableCell className="nums font-mono text-[13px] text-end">EGP 1,250</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Convention: use `text-end` (not `text-right`) for right-aligned numeric columns so RTL works correctly.

---

### TableSkeleton

```tsx
// Default: 6 rows, 4 cols
<TableSkeleton />

// Inventory: 8 rows, 6 cols (matches the 6-column inventory table)
<TableSkeleton rows={8} cols={6} />

// Orders: 8 rows, 5 cols
<TableSkeleton rows={8} cols={5} />
```

Renders with `role="status" aria-label="Loading"` for screen readers.

---

### Brandmark

```tsx
// Full (square + wordmark)
<Brandmark />

// Square only (no wordmark)
<Brandmark withWordmark={false} />
```

The square is a `16×16` `bg-foreground` block. The wordmark is `font-display text-[15px] font-semibold tracking-tight` "Ledger". Do not mirror this in RTL.

---

### Glyph

```tsx
// Normal (white background, ink border)
<Glyph letter="S" />

// Inverted (ink background, white letter)
<Glyph letter="B" inverted />
```

Used on the Onboarding and Settings screens to represent Shopify and Bosta.
