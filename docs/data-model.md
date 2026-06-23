# Data Model

Types, derivations, tenant isolation, and the proposed Supabase mapping. Values marked **DERIVED** must not be stored in the database — they are always computed from source fields.

---

## 1. Types (`lib/types.ts`)

### `OrderStatus` (union)

```ts
"New" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Failed" | "Returned"
```

Fixed set of 7 values. The filter row, status chips, and problem-detection all reference `ORDER_STATUSES` (the `as const` tuple) or this union. Adding a new status requires updating both.

### `OrderItem`

```ts
{ name: string; qty: number; price: number; }
```

Line item inside an order. `price` is per-unit in EGP.

### `TimelineEvent`

```ts
{ label: string; at: string; problem?: boolean; }
```

`at` is an ISO 8601 datetime string. `problem: true` marks an event as negative (failed delivery, cancellation, return). The `Timeline` component receives the `problem` field but currently renders all dots identically — the copy carries the meaning.

### `Order`

```ts
{
  id: string;           // unique identifier
  number: string;       // display string, e.g. "#1042" — monospace in UI
  customer: string;
  status: OrderStatus;
  total: number;        // EGP amount (float, always Western digits in display)
  date: string;         // ISO datetime string
  phone: string;
  tracking: string;     // Bosta tracking code, or "—" if not yet assigned
  items: OrderItem[];
  timeline: TimelineEvent[];
}
```

### `Product`

```ts
{ id: string; name: string; sku: string; inStock: number; }
```

`inStock` is the count at Shopify warehouse (not Bosta). Stock status is **DERIVED** — never stored.

### `StockStatus` (union)

```ts
"OK" | "Low" | "Out"
```

Always **DERIVED** by `stockStatus(inStock)`. Must not be stored as a column.

### `VarianceInput`

```ts
{ sku: string; name: string; expected: number; atBosta: number; }
```

`expected` = what the records say should be at Bosta. `atBosta` = what Bosta actually holds. Both are stored. `gap` is **DERIVED**.

### `VarianceRow`

```ts
VarianceInput & { gap: number }
```

`gap = atBosta - expected`. Always **DERIVED** from `VarianceInput`. Never stored.

### `Connection`

```ts
{ name: string; account: string; connected: boolean; }
```

One record per integration (Shopify, Bosta). `connected` will come from an auth token table in Supabase.

### `Tenant`

```ts
{
  id: string;
  name: string;
  plan: string;
  members: number;
  region: "Egypt";
  currency: "EGP";
  shopify: Connection;
  bosta: Connection;
  orders: Order[];
  products: Product[];
  variance: VarianceInput[];
}
```

The root data container. Each tenant is an isolated dataset. In the seed, two tenants exist: `acme` (id: `"acme"`) and `nile` (id: `"nile"`).

### `OverviewStats`

```ts
{
  ordersToday: number;        // count of orders where date.slice(0,10) === today
  lowStock: number;           // count of products with stockStatus === "Low"
  outOfStock: number;         // count of products with stockStatus === "Out"
  unexplainedUnits: number;   // sum of |gap| over variance rows where gap !== 0
}
```

Always **DERIVED** by `computeOverviewStats()`. Never stored.

---

## 2. Derivation functions

### `stockStatus(inStock: number): StockStatus` — `lib/stock.ts`

```
inStock <= 0  → "Out"
inStock <= 5  → "Low"
else          → "OK"
```

### `computeVarianceRow(input: VarianceInput): VarianceRow` — `lib/variance.ts`

```
gap = atBosta - expected
```

### `computeVariance(inputs: VarianceInput[]): VarianceRow[]` — `lib/variance.ts`

Maps `computeVarianceRow` over every input. Returns all rows including zero-gap rows.

### `sortVariance(rows: VarianceRow[]): VarianceRow[]` — `lib/variance.ts`

Sorts by `|gap|` descending — non-zero gaps float to the top. Rows with equal magnitude sort stably.

```
sort key: Math.abs(b.gap) - Math.abs(a.gap)
```

### `computeOverviewStats(args)` — `lib/overview.ts`

```
ordersToday      = count(orders where date.slice(0,10) === today)
lowStock         = count(products where stockStatus(inStock) === "Low")
outOfStock       = count(products where stockStatus(inStock) === "Out")
unexplainedUnits = sum(|gap|) for all VarianceRow where gap !== 0
```

For Acme: variance rows are CTN-TEE-02 (gap −3), DNM-JKT-01 (gap −2), SNK-RUN-03 (gap +1) — non-zero gaps sum to |−3| + |−2| + |+1| = **6**. `unexplainedUnits = 6`.

### Finance preview derivations — `lib/finance.ts`

The Finance screen is view-only. It does not call Paymob or Bosta APIs and does not store finance records. It derives a preview ledger from `Order[]`.

```ts
deriveFinanceRows(orders: Order[]): FinanceOrderRow[]
deriveFinanceDashboard(orders: Order[]): FinanceDashboard
deriveCollectionState(status: OrderStatus): FinanceCollectionState
```

Collection state is derived from order status:

```
Delivered  -> captured
Shipped    -> collecting
New        -> pending
Processing -> pending
Failed     -> atRisk
Returned   -> reversed
Cancelled  -> cancelled
```

Preview rails are deterministic until a real payment-method field exists:

- Shipped and Failed orders use `Bosta COD`.
- New and Processing orders alternate Paymob wallet/card by row index.
- Delivered orders can be Paymob or Bosta COD by row index.
- Returned and Cancelled orders keep the derived state but still use the preview rail for fee/payout display.

Fee assumptions are centralized in `FINANCE_ASSUMPTIONS`:

```
Paymob fee = gross * 0.0275 + 3
Bosta delivery fee = 45
Bosta exception fee = 30
```

These values are preview assumptions only. When real Paymob/Bosta data is wired, replace the rail, fee, payout source, and payout date derivations with provider records while keeping summary values derived.

### `isProblemStatus(s: OrderStatus): boolean` — `lib/orders.ts`

```
problem statuses: Cancelled, Failed, Returned
```

### `filterByStatus(orders: Order[], f: StatusFilter): Order[]` — `lib/orders.ts`

`StatusFilter = "All" | OrderStatus`. When `f === "All"` returns all orders unchanged.

### `formatMoney(amount: number): string` — `lib/format.ts`

```
"EGP " + Intl.NumberFormat("en-US").format(amount)
```

Always Western digits, even under `ar` locale.

### `formatGap(gap: number): string` — `lib/format.ts`

```
gap === 0  → "0"
gap < 0    → "−" + Math.abs(gap)   (U+2212 minus, not hyphen)
gap > 0    → "+" + gap
```

### `measureGeometry(args)` — `lib/components/data/Measure.tsx`

```
pct(n) = (max(0, n) / scaleMax) * 100
lo = min(expected, atBosta)
gap = atBosta - expected

expectedPct  = pct(expected)
atBostaPct   = pct(atBosta)
gapStartPct  = pct(lo)
gapWidthPct  = pct(|gap|)
solid        = gap < 0     (missing = solid, extra = 30% opacity)
```

---

## 3. Seed tenants (`lib/seed/`)

### Acme Goods (`lib/seed/tenant-acme.ts`)

- id: `"acme"`, plan: `"Growth"`, members: 4, region: Egypt.
- Shopify: `acme-goods.myshopify.com` (connected).
- Bosta: `Acme · Cairo hub` (connected).
- 8 orders covering all 7 statuses: New, Processing, Shipped, Delivered, Cancelled, Failed, Returned.
- 6 products: 1 Out of stock (Denim Jacket, inStock=0), 2 Low (Cotton Tee inStock=3, Sneakers inStock=5).
- 5 variance rows: Cotton Tee gap=−3 (worst), Denim Jacket gap=−2, Sneakers gap=+1, Tote Bag gap=0, Hoodie gap=0.
- **unexplainedUnits = 6** (|−3| + |−2| + |+1|).
- Today (2026-06-20): 5 orders with that date prefix → ordersToday=5.

### Nile Supply Co. (`lib/seed/tenant-nile.ts`)

- id: `"nile"`, plan: `"Starter"`, members: 2, region: Egypt.
- Shopify: `nile-supply.myshopify.com` (connected).
- Bosta: `Nile · Giza hub` (connected).
- 3 orders: Delivered, Shipped, New.
- 3 products: all healthy (inStock 60, 22, 140 — all well above 5).
- 3 variance rows: all gap=0. No unexplained units.
- Calm state demo: Overview shows calm message, no attention items.

### Seed index (`lib/seed/index.ts`)

```ts
export const TENANTS: Tenant[] = [acme, nile];
export const DEFAULT_TENANT_ID = acme.id;
export function getTenants(): Tenant[]
export function getTenant(id: string): Tenant  // falls back to acme if id not found
```

---

## 4. Tenant context (`lib/tenant-context.tsx`)

Client component provider wrapping all app routes via `app/[locale]/layout.tsx`.

```ts
interface TenantCtx {
  tenant: Tenant;
  tenants: Tenant[];
  setTenantId: (id: string) => void;
}
```

- `useTenant()` — hook for any client component to read the active tenant or switch to another.
- Throws if called outside `TenantProvider`.
- State lives in React `useState`; persists only for the browser session.
- When Supabase is wired: replace the seed call in `TenantProvider` with a Supabase query scoped by the authenticated user's org memberships.

---

## 5. Proposed Supabase mapping

This table maps each field to the proposed Supabase table and column. Fields marked **DERIVED** must never be stored — they are computed at query time or in the application layer.

### `tenants` table

| Tenant field | Supabase table | Column | Notes |
|---|---|---|---|
| `id` | `tenants` | `id` (uuid PK) | |
| `name` | `tenants` | `name` | |
| `plan` | `tenants` | `plan` | |
| `members` | `tenants` | `members` | Or derive from `tenant_memberships` count |
| `region` | `tenants` | `region` | |
| `currency` | `tenants` | `currency` | |
| `shopify.name` | `connections` | `provider` = `'shopify'` | |
| `shopify.account` | `connections` | `account_label` | |
| `shopify.connected` | `connections` | `connected_at IS NOT NULL` | |
| `bosta.name` | `connections` | `provider` = `'bosta'` | |
| `bosta.account` | `connections` | `account_label` | |
| `bosta.connected` | `connections` | `connected_at IS NOT NULL` | |

### `orders` table

| Order field | Supabase table | Column | Notes |
|---|---|---|---|
| `id` | `orders` | `id` (uuid PK) | |
| `number` | `orders` | `number` | Display string, e.g. "#1042" |
| `customer` | `orders` | `customer_name` | |
| `status` | `orders` | `status` | Enum: `new`, `processing`, `shipped`, `delivered`, `cancelled`, `failed`, `returned` |
| `total` | `orders` | `total_egp` | Numeric, EGP |
| `date` | `orders` | `ordered_at` | Timestamptz |
| `phone` | `orders` | `phone` | |
| `tracking` | `orders` | `tracking_code` | nullable |
| `items` | `order_items` | separate table | FK: `order_id` |
| `timeline` | `order_events` | separate table | FK: `order_id`, `problem` boolean |

### `order_items` table

| Field | Column |
|---|---|
| `name` | `product_name` |
| `qty` | `qty` |
| `price` | `unit_price_egp` |

### `order_events` table

| Field | Column |
|---|---|
| `label` | `label` |
| `at` | `occurred_at` (timestamptz) |
| `problem` | `problem` (boolean) |

### `products` table

| Product field | Column | Notes |
|---|---|---|
| `id` | `id` (uuid PK) | |
| `name` | `name` | |
| `sku` | `sku` | Unique within tenant |
| `inStock` | `in_stock` | Integer |
| `StockStatus` | — | **DERIVED**: `stockStatus(in_stock)` — never stored |

### `variance_inputs` table (or a Bosta-sync cache table)

| VarianceInput field | Column | Notes |
|---|---|---|
| `sku` | `sku` | FK → `products.sku` |
| `name` | `name` | Denormalized for display |
| `expected` | `expected` | Integer |
| `atBosta` | `at_bosta` | Integer |
| `gap` | — | **DERIVED**: `at_bosta - expected` — never stored |

### Overview stats

All four `OverviewStats` fields are **DERIVED** — they must not be stored:

| Stat | Derivation |
|---|---|
| `ordersToday` | `COUNT(orders) WHERE DATE(ordered_at) = CURRENT_DATE AND tenant_id = $1` |
| `lowStock` | `COUNT(products) WHERE in_stock > 0 AND in_stock <= 5 AND tenant_id = $1` |
| `outOfStock` | `COUNT(products) WHERE in_stock <= 0 AND tenant_id = $1` |
| `unexplainedUnits` | `SUM(ABS(at_bosta - expected)) FILTER (WHERE at_bosta <> expected) ... WHERE tenant_id = $1` |

### RLS isolation

Every table includes a `tenant_id uuid` column. Row-Level Security policies should enforce `tenant_id = auth.jwt() ->> 'tenant_id'` (or equivalent via a `tenant_memberships` join) so each authenticated session sees only its own rows.
