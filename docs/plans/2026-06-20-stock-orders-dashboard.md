# Stock & Orders Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full frontend for a multi-tenant Stock & Orders dashboard — 8 screens, strict black/white "ledger" design system (state via inversion, never color), EN/AR with RTL, seed data with working interactions — plus a first-class handoff documentation set.

**Architecture:** Next.js App Router + TypeScript. Tailwind + shadcn/ui themed via CSS variables to the reference token table. `next-intl` for `[locale]` routing and RTL. Pure-function data layer (typed seed + derivations) that mirrors the future Supabase schema so wiring needs no rework. Filters/search in URL params; active tenant + locale in React context. A living `/styleguide` route renders every component in every state as visual evidence.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v3, shadcn/ui (Radix + CVA), next-intl v3, next/font (Space Grotesk, Inter, JetBrains Mono, IBM Plex Sans Arabic), Vitest + React Testing Library + jsdom (unit/component TDD), Playwright (responsive/RTL QA).

**Reference:** [`ui-ux-reference.md`](../../ui-ux-reference.md) · **Spec:** [`docs/spec.md`](../spec.md)

**Conventions for every task:** exact file paths; complete code in each code step; run the named command and confirm the expected output before moving on; commit at the end of each task with the shown message. Hex tokens in `ui-ux-reference.md §2` are the source of truth — HSL values below are their approximations for shadcn compatibility and are recorded in `docs/design-system.md`.

---

## File structure (decomposition)

```
app/
  [locale]/
    layout.tsx                     root locale layout: <html lang dir>, fonts, NextIntlClientProvider, TenantProvider
    globals.css                    Tailwind layers + token CSS variables + inversion utilities
    (auth)/
      login/page.tsx               4.1
      onboarding/page.tsx          4.2
    (app)/
      layout.tsx                   app shell: Sidebar + TopBar
      overview/page.tsx            4.3
      orders/page.tsx              4.4 (+ OrderDrawer)
      inventory/page.tsx           4.5
      variance/page.tsx            4.6 (signature)
      returns/page.tsx             4.7
      settings/page.tsx            4.9
    styleguide/page.tsx            living component/state gallery
  middleware.ts                    next-intl locale middleware (lives at project root)
components/
  ui/                              shadcn-generated primitives (button, badge, table, sheet, input, dropdown-menu, toggle-group, empty, skeleton)
  brand/Brandmark.tsx              custom SVG
  brand/Glyph.tsx                  custom S/B square glyphs
  data/StatCard.tsx                custom
  data/Measure.tsx                 custom (variance track)
  data/StatusChip.tsx             wraps Badge with order/stock status logic
  data/LedgerTable.tsx            thin wrapper styling shadcn Table as a ledger
  shell/Sidebar.tsx
  shell/TopBar.tsx
  shell/TenantSwitcher.tsx
  shell/LocaleSwitcher.tsx
  orders/OrderDrawer.tsx           Sheet + Timeline + items
  orders/Timeline.tsx              custom <ol> spine
  onboarding/ConnectCard.tsx       custom
lib/
  types.ts                         Tenant, Order, OrderStatus, Product, VarianceInput, VarianceRow, OverviewStats
  variance.ts                      computeVarianceRow / computeVariance / sortVariance
  stock.ts                         stockStatus
  overview.ts                      computeOverviewStats
  orders.ts                        order status helpers (isProblemStatus)
  seed/index.ts                    getTenants / getTenant
  seed/tenant-acme.ts
  seed/tenant-nile.ts
  tenant-context.tsx               TenantProvider + useTenant
  format.ts                        money/number formatting (Western digits, EGP)
i18n/
  routing.ts                       locales, defaultLocale
  request.ts                       getRequestConfig
messages/
  en.json
  ar.json
docs/
  design-system.md  components.md  screens.md  data-model.md  decisions.md  traceability.md
README.md
test setup: vitest.config.ts, vitest.setup.ts
```

---

## Phase 0 — Scaffold & tooling

### Task 0.1: Create the Next.js app

**Files:** whole project (run in the existing repo root `C:\Users\HP\Documents\lnnsy-grindctrl`).

- [ ] **Step 1: Scaffold into the current directory**

The directory already contains `docs/`, `ui-ux-reference.md`, `.gitignore`, `.git`. Scaffold into it without overwriting those.

Run:
```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```
When prompted that the directory is not empty, choose to proceed (it keeps existing files). If `create-next-app` refuses, scaffold in a temp dir and copy `app/`, `package.json`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, `postcss.config.*`, `next-env.d.ts` over.

Expected: `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json` exist; `next dev` is runnable.

- [ ] **Step 2: Verify it boots**

Run: `npm run dev` then stop it (Ctrl-C) after "Ready".
Expected: dev server starts on `http://localhost:3000` with no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app (App Router, TS, Tailwind)"
```

### Task 0.2: Test tooling (Vitest + RTL)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install dev deps**

Run:
```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Smoke test**

Create `lib/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("tooling", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```
Run: `npm test`
Expected: 1 passing test. Then delete `lib/smoke.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add vitest + react testing library"
```

---

## Phase 1 — Theme, tokens, fonts (the core visual rule)

### Task 1.1: Token layer + inversion utilities

**Files:**
- Modify: `app/globals.css` (replace the create-next-app default body of token vars), `tailwind.config.ts`

- [ ] **Step 1: Write token variables + inversion into `app/globals.css`**

Replace the file contents with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Reference tokens (hex source of truth in docs/design-system.md), as HSL channels for shadcn */
    --background: 0 0% 100%;        /* Paper #FFFFFF */
    --foreground: 0 0% 4%;          /* Ink #0A0A0A */
    --muted: 0 0% 96%;              /* Wash surface */
    --muted-foreground: 0 0% 42%;   /* Muted text #6B6B6B */
    --faint: 0 0% 61%;              /* Faint #9B9B9B */
    --border: 0 0% 90%;             /* Hairline #E6E6E6 */
    --input: 0 0% 90%;
    --ring: 0 0% 4%;                /* focus ring = ink */
    --accent: 0 0% 96%;             /* Wash #F6F6F5 */
    --accent-foreground: 0 0% 4%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 4%;
    --primary: 0 0% 4%;             /* solid ink */
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 96%;
    --secondary-foreground: 0 0% 4%;
    --destructive: 0 0% 4%;         /* no color: destructive == ink */
    --destructive-foreground: 0 0% 100%;
    --radius: 2px;
  }
  * { @apply border-border; }
  body { @apply bg-background text-foreground; font-feature-settings: "tnum" 1; }
}

@layer utilities {
  /* Inversion = state. Flip surface to paper-on-ink. */
  .surface-inverted {
    background-color: hsl(var(--foreground));
    color: hsl(var(--background));
    border-color: hsl(var(--foreground));
  }
  .surface-inverted *::selection { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
  /* tabular figures helper for any data cell */
  .nums { font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums; }
}
```

- [ ] **Step 2: Map tokens + fonts + 2px radius in `tailwind.config.ts`**

Replace `theme.extend` (keep `content` globs from scaffold; ensure they include `./components/**/*`):
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        faint: "hsl(var(--faint))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "var(--radius)", sm: "var(--radius)" },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (no Tailwind/PostCSS errors).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(theme): black/white token layer, 2px radius, inversion utility"
```

### Task 1.2: Fonts via next/font

**Files:**
- Create: `lib/fonts.ts`
- Modify: `app/[locale]/layout.tsx` (created in Phase 3 Task 3.6 — for now stage fonts in `lib/fonts.ts` and wire when the layout exists)

- [ ] **Step 1: Define fonts in `lib/fonts.ts`**

```ts
import { Space_Grotesk, Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

export const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
export const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });
export const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-arabic" });

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`;
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/fonts.ts`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(theme): load Space Grotesk, Inter, JetBrains Mono, IBM Plex Arabic"
```

---

## Phase 2 — Data layer (TDD)

This is the correctness core. Build it before any UI so screens render real, computed values.

### Task 2.1: Domain types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write `lib/types.ts`**

```ts
export const ORDER_STATUSES = [
  "New", "Processing", "Shipped", "Delivered", "Cancelled", "Failed", "Returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem { name: string; qty: number; price: number; }
export interface TimelineEvent { label: string; at: string; problem?: boolean; }

export interface Order {
  id: string;
  number: string;          // mono display, e.g. "#1042"
  customer: string;
  status: OrderStatus;
  total: number;           // EGP
  date: string;            // ISO
  phone: string;
  tracking: string;
  items: OrderItem[];
  timeline: TimelineEvent[];
}

export interface Product { id: string; name: string; sku: string; inStock: number; }
export type StockStatus = "OK" | "Low" | "Out";

export interface VarianceInput { sku: string; name: string; expected: number; atBosta: number; }
export interface VarianceRow extends VarianceInput { gap: number; } // gap = atBosta - expected

export interface Connection { name: string; account: string; connected: boolean; }
export interface Tenant {
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

export interface OverviewStats {
  ordersToday: number;
  lowStock: number;
  outOfStock: number;
  unexplainedUnits: number; // sum of |gap| over non-zero variance rows
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(data): domain types"
```

### Task 2.2: Variance computation

**Files:**
- Create: `lib/variance.ts`, `lib/variance.test.ts`

- [ ] **Step 1: Write the failing test (`lib/variance.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { computeVarianceRow, computeVariance, sortVariance } from "@/lib/variance";

describe("computeVarianceRow", () => {
  it("gap is atBosta minus expected (missing => negative)", () => {
    const row = computeVarianceRow({ sku: "A", name: "A", expected: 55, atBosta: 52 });
    expect(row.gap).toBe(-3);
  });
  it("gap positive when extra stock at Bosta", () => {
    expect(computeVarianceRow({ sku: "B", name: "B", expected: 10, atBosta: 13 }).gap).toBe(3);
  });
  it("gap zero when matched", () => {
    expect(computeVarianceRow({ sku: "C", name: "C", expected: 10, atBosta: 10 }).gap).toBe(0);
  });
});

describe("sortVariance", () => {
  it("non-zero gaps sort above zero gaps, largest magnitude first", () => {
    const rows = computeVariance([
      { sku: "ok", name: "ok", expected: 10, atBosta: 10 },
      { sku: "small", name: "small", expected: 10, atBosta: 9 },
      { sku: "big", name: "big", expected: 55, atBosta: 52 },
    ]);
    const sorted = sortVariance(rows).map((r) => r.sku);
    expect(sorted).toEqual(["big", "small", "ok"]);
  });
});
```

- [ ] **Step 2: Run, verify it fails**

Run: `npx vitest run lib/variance.test.ts`
Expected: FAIL — `computeVarianceRow` not exported / module not found.

- [ ] **Step 3: Implement `lib/variance.ts`**

```ts
import type { VarianceInput, VarianceRow } from "@/lib/types";

export function computeVarianceRow(input: VarianceInput): VarianceRow {
  return { ...input, gap: input.atBosta - input.expected };
}

export function computeVariance(inputs: VarianceInput[]): VarianceRow[] {
  return inputs.map(computeVarianceRow);
}

/** Non-zero gaps first (largest magnitude first), then zero-gap rows. */
export function sortVariance(rows: VarianceRow[]): VarianceRow[] {
  return [...rows].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run lib/variance.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(data): variance computation + sorting (TDD)"
```

### Task 2.3: Stock status + overview stats

**Files:**
- Create: `lib/stock.ts`, `lib/stock.test.ts`, `lib/overview.ts`, `lib/overview.test.ts`, `lib/orders.ts`

- [ ] **Step 1: Failing tests for stock (`lib/stock.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { stockStatus } from "@/lib/stock";

describe("stockStatus", () => {
  it("0 is Out", () => expect(stockStatus(0)).toBe("Out"));
  it("<=5 is Low", () => { expect(stockStatus(1)).toBe("Low"); expect(stockStatus(5)).toBe("Low"); });
  it(">5 is OK", () => expect(stockStatus(6)).toBe("OK"));
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx vitest run lib/stock.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/stock.ts`**

```ts
import type { StockStatus } from "@/lib/types";
export function stockStatus(inStock: number): StockStatus {
  if (inStock <= 0) return "Out";
  if (inStock <= 5) return "Low";
  return "OK";
}
```

- [ ] **Step 4: Implement `lib/orders.ts` (helper used by UI + overview)**

```ts
import type { OrderStatus } from "@/lib/types";
const PROBLEM: ReadonlySet<OrderStatus> = new Set(["Cancelled", "Failed", "Returned"]);
export function isProblemStatus(s: OrderStatus): boolean { return PROBLEM.has(s); }
```

- [ ] **Step 5: Failing tests for overview (`lib/overview.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { computeOverviewStats } from "@/lib/overview";
import type { Product, Order, VarianceInput } from "@/lib/types";

const products: Product[] = [
  { id: "1", name: "a", sku: "A", inStock: 0 },   // Out
  { id: "2", name: "b", sku: "B", inStock: 3 },   // Low
  { id: "3", name: "c", sku: "C", inStock: 9 },   // OK
];
const orders: Order[] = [
  { id: "o1", number: "#1", customer: "x", status: "New", total: 10, date: "2026-06-20T08:00:00Z",
    phone: "", tracking: "", items: [], timeline: [] },
];
const variance: VarianceInput[] = [
  { sku: "A", name: "a", expected: 55, atBosta: 52 }, // |gap| 3
  { sku: "B", name: "b", expected: 10, atBosta: 12 }, // |gap| 2
  { sku: "C", name: "c", expected: 4, atBosta: 4 },   // 0
];

describe("computeOverviewStats", () => {
  it("counts low/out stock and sums unexplained units", () => {
    const s = computeOverviewStats({ products, orders, variance, today: "2026-06-20" });
    expect(s.outOfStock).toBe(1);
    expect(s.lowStock).toBe(1);
    expect(s.unexplainedUnits).toBe(5); // 3 + 2
    expect(s.ordersToday).toBe(1);
  });
});
```

- [ ] **Step 6: Run, verify fail**

Run: `npx vitest run lib/overview.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `lib/overview.ts`**

```ts
import type { OverviewStats, Order, Product, VarianceInput } from "@/lib/types";
import { stockStatus } from "@/lib/stock";
import { computeVariance } from "@/lib/variance";

export function computeOverviewStats(args: {
  products: Product[]; orders: Order[]; variance: VarianceInput[]; today: string; // YYYY-MM-DD
}): OverviewStats {
  const { products, orders, variance, today } = args;
  const lowStock = products.filter((p) => stockStatus(p.inStock) === "Low").length;
  const outOfStock = products.filter((p) => stockStatus(p.inStock) === "Out").length;
  const ordersToday = orders.filter((o) => o.date.slice(0, 10) === today).length;
  const unexplainedUnits = computeVariance(variance)
    .filter((r) => r.gap !== 0)
    .reduce((sum, r) => sum + Math.abs(r.gap), 0);
  return { ordersToday, lowStock, outOfStock, unexplainedUnits };
}
```

- [ ] **Step 8: Run all data tests, verify pass**

Run: `npx vitest run lib/`
Expected: PASS (variance, stock, overview).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(data): stock status, order helpers, overview stats (TDD)"
```

### Task 2.4: Formatting helpers

**Files:**
- Create: `lib/format.ts`, `lib/format.test.ts`

- [ ] **Step 1: Failing test (`lib/format.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { formatMoney, formatGap } from "@/lib/format";

describe("formatMoney", () => {
  it("formats EGP with Western digits", () => {
    expect(formatMoney(1250)).toBe("EGP 1,250");
  });
});
describe("formatGap", () => {
  it("shows explicit sign", () => {
    expect(formatGap(-3)).toBe("−3");
    expect(formatGap(3)).toBe("+3");
    expect(formatGap(0)).toBe("0");
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx vitest run lib/format.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `lib/format.ts`**

```ts
// Always Western digits ("en-US"), even under the ar locale (ledger rule).
export function formatMoney(amount: number): string {
  return `EGP ${new Intl.NumberFormat("en-US").format(amount)}`;
}
export function formatGap(gap: number): string {
  if (gap === 0) return "0";
  const sign = gap < 0 ? "−" : "+"; // U+2212 minus for negatives
  return `${sign}${Math.abs(gap)}`;
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run lib/format.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(data): money + gap formatting (Western digits)"
```

### Task 2.5: Seed data (2 tenants) + accessors

**Files:**
- Create: `lib/seed/tenant-acme.ts`, `lib/seed/tenant-nile.ts`, `lib/seed/index.ts`, `lib/seed/index.test.ts`

- [ ] **Step 1: Write `lib/seed/tenant-acme.ts`**

Provide a full dataset. Must include: ≥8 orders spanning all 7 statuses (≥1 dated `2026-06-20` for "orders today"), ≥6 products including at least one `inStock: 0` (Out) and one `inStock <= 5` (Low), and a `variance` array whose worst row is the seeded signature case.

```ts
import type { Tenant } from "@/lib/types";

export const acme: Tenant = {
  id: "acme",
  name: "Acme Goods",
  plan: "Growth",
  members: 4,
  region: "Egypt",
  currency: "EGP",
  shopify: { name: "Shopify", account: "acme-goods.myshopify.com", connected: true },
  bosta: { name: "Bosta", account: "Acme · Cairo hub", connected: true },
  orders: [
    { id: "a1", number: "#1042", customer: "Mona Adel", status: "Failed", total: 540,
      date: "2026-06-20T09:12:00Z", phone: "+20 100 111 2233", tracking: "BMX-44821",
      items: [{ name: "Cotton Tee", qty: 2, price: 270 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T10:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-19T08:30:00Z" },
        { label: "Delivery attempt failed — no answer", at: "2026-06-20T09:12:00Z", problem: true },
      ] },
    { id: "a2", number: "#1041", customer: "Youssef Kamal", status: "Returned", total: 1250,
      date: "2026-06-20T07:40:00Z", phone: "+20 101 222 3344", tracking: "BMX-44799",
      items: [{ name: "Denim Jacket", qty: 1, price: 1250 }],
      timeline: [
        { label: "Order placed", at: "2026-06-15T12:00:00Z" },
        { label: "Delivered", at: "2026-06-17T15:00:00Z" },
        { label: "Returned by customer", at: "2026-06-20T07:40:00Z", problem: true },
      ] },
    { id: "a3", number: "#1040", customer: "Sara Tarek", status: "Delivered", total: 320,
      date: "2026-06-19T16:00:00Z", phone: "+20 102 333 4455", tracking: "BMX-44712",
      items: [{ name: "Tote Bag", qty: 1, price: 320 }],
      timeline: [
        { label: "Order placed", at: "2026-06-17T09:00:00Z" },
        { label: "Delivered", at: "2026-06-19T16:00:00Z" },
      ] },
    { id: "a4", number: "#1039", customer: "Omar Hany", status: "Shipped", total: 780,
      date: "2026-06-20T11:00:00Z", phone: "+20 103 444 5566", tracking: "BMX-44690",
      items: [{ name: "Sneakers", qty: 1, price: 780 }],
      timeline: [
        { label: "Order placed", at: "2026-06-19T18:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-20T11:00:00Z" },
      ] },
    { id: "a5", number: "#1038", customer: "Laila Samir", status: "Processing", total: 410,
      date: "2026-06-20T06:30:00Z", phone: "+20 106 555 6677", tracking: "—",
      items: [{ name: "Cap", qty: 2, price: 205 }], timeline: [{ label: "Order placed", at: "2026-06-20T06:30:00Z" }] },
    { id: "a6", number: "#1037", customer: "Khaled Nabil", status: "New", total: 95,
      date: "2026-06-20T05:10:00Z", phone: "+20 109 666 7788", tracking: "—",
      items: [{ name: "Socks", qty: 1, price: 95 }], timeline: [{ label: "Order placed", at: "2026-06-20T05:10:00Z" }] },
    { id: "a7", number: "#1036", customer: "Dina Fouad", status: "Cancelled", total: 600,
      date: "2026-06-18T13:20:00Z", phone: "+20 111 777 8899", tracking: "—",
      items: [{ name: "Hoodie", qty: 1, price: 600 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T12:00:00Z" },
        { label: "Cancelled by customer", at: "2026-06-18T13:20:00Z", problem: true },
      ] },
    { id: "a8", number: "#1035", customer: "Tarek Aziz", status: "Delivered", total: 240,
      date: "2026-06-16T10:00:00Z", phone: "+20 112 888 9900", tracking: "BMX-44510",
      items: [{ name: "Belt", qty: 1, price: 240 }],
      timeline: [
        { label: "Order placed", at: "2026-06-14T10:00:00Z" },
        { label: "Delivered", at: "2026-06-16T10:00:00Z" },
      ] },
  ],
  products: [
    { id: "p1", name: "Denim Jacket", sku: "DNM-JKT-01", inStock: 0 },
    { id: "p2", name: "Cotton Tee", sku: "CTN-TEE-02", inStock: 3 },
    { id: "p3", name: "Sneakers", sku: "SNK-RUN-03", inStock: 5 },
    { id: "p4", name: "Tote Bag", sku: "TOT-BAG-04", inStock: 18 },
    { id: "p5", name: "Hoodie", sku: "HOD-FLC-05", inStock: 26 },
    { id: "p6", name: "Cap", sku: "CAP-CTN-06", inStock: 41 },
  ],
  variance: [
    { sku: "CTN-TEE-02", name: "Cotton Tee", expected: 55, atBosta: 52 }, // signature: Gap -3 (worst)
    { sku: "DNM-JKT-01", name: "Denim Jacket", expected: 12, atBosta: 10 }, // -2
    { sku: "SNK-RUN-03", name: "Sneakers", expected: 20, atBosta: 21 },     // +1 (extra)
    { sku: "TOT-BAG-04", name: "Tote Bag", expected: 18, atBosta: 18 },     // 0
    { sku: "HOD-FLC-05", name: "Hoodie", expected: 26, atBosta: 26 },       // 0
  ],
};
```

- [ ] **Step 2: Write `lib/seed/tenant-nile.ts`**

A clearly distinct second tenant (different name, accounts, and notably **a calm state**: all variance gaps `0`, no Out/Low stock) so switching tenants visibly changes the data and exercises the "nothing needs attention" path.

```ts
import type { Tenant } from "@/lib/types";

export const nile: Tenant = {
  id: "nile",
  name: "Nile Supply Co.",
  plan: "Starter",
  members: 2,
  region: "Egypt",
  currency: "EGP",
  shopify: { name: "Shopify", account: "nile-supply.myshopify.com", connected: true },
  bosta: { name: "Bosta", account: "Nile · Giza hub", connected: true },
  orders: [
    { id: "n1", number: "#3007", customer: "Hana Reda", status: "Delivered", total: 430,
      date: "2026-06-20T08:00:00Z", phone: "+20 120 111 2222", tracking: "BMX-90011",
      items: [{ name: "Water Bottle", qty: 2, price: 215 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T09:00:00Z" },
        { label: "Delivered", at: "2026-06-20T08:00:00Z" },
      ] },
    { id: "n2", number: "#3006", customer: "Amir Salah", status: "Shipped", total: 690,
      date: "2026-06-20T09:30:00Z", phone: "+20 122 333 4444", tracking: "BMX-90004",
      items: [{ name: "Backpack", qty: 1, price: 690 }],
      timeline: [
        { label: "Order placed", at: "2026-06-19T14:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-20T09:30:00Z" },
      ] },
    { id: "n3", number: "#3005", customer: "Nada Ashraf", status: "New", total: 150,
      date: "2026-06-20T05:00:00Z", phone: "+20 128 555 6666", tracking: "—",
      items: [{ name: "Notebook", qty: 3, price: 50 }], timeline: [{ label: "Order placed", at: "2026-06-20T05:00:00Z" }] },
  ],
  products: [
    { id: "q1", name: "Water Bottle", sku: "WTR-BTL-01", inStock: 60 },
    { id: "q2", name: "Backpack", sku: "BKP-DAY-02", inStock: 22 },
    { id: "q3", name: "Notebook", sku: "NTB-A5-03", inStock: 140 },
  ],
  variance: [
    { sku: "WTR-BTL-01", name: "Water Bottle", expected: 60, atBosta: 60 },
    { sku: "BKP-DAY-02", name: "Backpack", expected: 22, atBosta: 22 },
    { sku: "NTB-A5-03", name: "Notebook", expected: 140, atBosta: 140 },
  ],
};
```

- [ ] **Step 3: Write `lib/seed/index.ts`**

```ts
import type { Tenant } from "@/lib/types";
import { acme } from "./tenant-acme";
import { nile } from "./tenant-nile";

export const TENANTS: Tenant[] = [acme, nile];
export const DEFAULT_TENANT_ID = acme.id;

export function getTenants(): Tenant[] { return TENANTS; }
export function getTenant(id: string): Tenant {
  return TENANTS.find((t) => t.id === id) ?? acme;
}
```

- [ ] **Step 4: Write seed integrity test (`lib/seed/index.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { getTenants } from "@/lib/seed";
import { ORDER_STATUSES } from "@/lib/types";
import { computeVariance, sortVariance } from "@/lib/variance";

describe("acme seed", () => {
  const acme = getTenants()[0];
  it("covers all 7 order statuses", () => {
    const present = new Set(acme.orders.map((o) => o.status));
    for (const s of ORDER_STATUSES) expect(present.has(s)).toBe(true);
  });
  it("has an Out (0) and a Low (<=5) product", () => {
    expect(acme.products.some((p) => p.inStock === 0)).toBe(true);
    expect(acme.products.some((p) => p.inStock > 0 && p.inStock <= 5)).toBe(true);
  });
  it("signature row Cotton Tee is the worst gap (-3) and sorts first", () => {
    const top = sortVariance(computeVariance(acme.variance))[0];
    expect(top.sku).toBe("CTN-TEE-02");
    expect(top.gap).toBe(-3);
  });
});

describe("nile seed", () => {
  const nile = getTenants()[1];
  it("is calm: no Out/Low stock and all gaps zero", () => {
    expect(nile.products.every((p) => p.inStock > 5)).toBe(true);
    expect(computeVariance(nile.variance).every((r) => r.gap === 0)).toBe(true);
  });
});
```

- [ ] **Step 5: Run, verify pass**

Run: `npx vitest run lib/seed/index.test.ts`
Expected: PASS. (Fix the seed data, not the test, if anything fails.)

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(data): seed two tenants (acme problem-state, nile calm-state)"
```

---

## Phase 3 — i18n, tenant context, root layout, shell

### Task 3.1: Install + configure next-intl

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/en.json`, `messages/ar.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Install**

Run: `npm i next-intl`

- [ ] **Step 2: `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});
export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 3: `i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  return { locale, messages: (await import(`@/messages/${locale}.json`)).default };
});
```

- [ ] **Step 4: `middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
export default createMiddleware(routing);
export const config = { matcher: ["/", "/(en|ar)/:path*"] };
```

- [ ] **Step 5: Wire the plugin in `next.config.ts`**

```ts
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Seed message catalogs**

`messages/en.json` (start minimal; grow per screen):
```json
{
  "nav": { "overview": "Overview", "orders": "Orders", "inventory": "Inventory", "variance": "Variance", "returns": "Returns", "settings": "Settings" },
  "common": { "export": "Export", "search": "Search", "signIn": "Sign in", "connect": "Connect", "connected": "CONNECTED", "continue": "Continue to dashboard" }
}
```
`messages/ar.json`:
```json
{
  "nav": { "overview": "نظرة عامة", "orders": "الطلبات", "inventory": "المخزون", "variance": "الفروقات", "returns": "المرتجعات", "settings": "الإعدادات" },
  "common": { "export": "تصدير", "search": "بحث", "signIn": "تسجيل الدخول", "connect": "ربط", "connected": "تم الربط", "continue": "المتابعة إلى لوحة التحكم" }
}
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: compiles (no next-intl config errors).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat(i18n): next-intl routing, middleware, en/ar catalogs"
```

### Task 3.2: Tenant context

**Files:**
- Create: `lib/tenant-context.tsx`

- [ ] **Step 1: Write `lib/tenant-context.tsx`**

```tsx
"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { Tenant } from "@/lib/types";
import { getTenants, DEFAULT_TENANT_ID } from "@/lib/seed";

interface TenantCtx { tenant: Tenant; tenants: Tenant[]; setTenantId: (id: string) => void; }
const Ctx = createContext<TenantCtx | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const tenants = getTenants();
  const [tenantId, setTenantId] = useState(DEFAULT_TENANT_ID);
  const tenant = useMemo(() => tenants.find((t) => t.id === tenantId) ?? tenants[0], [tenants, tenantId]);
  const value = useMemo(() => ({ tenant, tenants, setTenantId }), [tenant, tenants]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTenant(): TenantCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(shell): tenant context provider"
```

### Task 3.3: Root locale layout

**Files:**
- Create: `app/[locale]/layout.tsx`
- Delete: any default `app/layout.tsx` / `app/page.tsx` from the scaffold (move content under `[locale]`).

- [ ] **Step 1: Write `app/[locale]/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVars } from "@/lib/fonts";
import { TenantProvider } from "@/lib/tenant-context";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} className={fontVars}>
      <body className={locale === "ar" ? "font-arabic" : "font-sans"}>
        <NextIntlClientProvider messages={messages}>
          <TenantProvider>{children}</TenantProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Move globals import**

Ensure `app/globals.css` exists (Task 1.1) and the scaffold's root `app/layout.tsx`/`app/page.tsx` are removed so only `app/[locale]/...` renders. Add a root redirect `app/page.tsx`? Not needed — middleware redirects `/` to `/en`.

- [ ] **Step 3: Verify dev boot + dir flips**

Run: `npm run dev`, visit `/en` and `/ar`.
Expected: `/en` renders `<html dir="ltr">`, `/ar` renders `<html dir="rtl">` (inspect element). No runtime errors. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(shell): locale root layout with fonts, intl + tenant providers, dir flip"
```

---

## Phase 4 — Primitives & components

### Task 4.1: Initialize shadcn + add base primitives

**Files:** `components.json`, `components/ui/*`, `lib/utils.ts`

- [ ] **Step 1: Init shadcn (non-interactive defaults)**

Run: `npx shadcn@latest init -d`
Expected: creates `components.json` and `lib/utils.ts` (the `cn` helper). If it offers to overwrite `globals.css`/`tailwind.config`, **decline** — our theme (Task 1.1/1.2) is the source of truth. If it rewrites them anyway, restore those two files from git (`git checkout -- app/globals.css tailwind.config.ts`) and keep only `components.json` + `lib/utils.ts`.

- [ ] **Step 2: Add primitives**

Run:
```bash
npx shadcn@latest add button badge table input sheet dropdown-menu toggle-group skeleton
```
Expected: files under `components/ui/`. (`empty` may not exist in the registry; if `npx shadcn@latest add empty` fails, the custom `EmptyState` in Task 4.6 covers it.)

- [ ] **Step 3: Verify primitives use theme tokens**

Open `components/ui/button.tsx`: confirm variants reference `bg-primary text-primary-foreground` (solid ink) and an outline/ghost variant uses `border` / `bg-transparent`. They should already, via tokens. No color literals.

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: compiles.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(ui): init shadcn + base primitives themed to tokens"
```

### Task 4.2: StatusChip (orders + stock)

**Files:**
- Create: `components/data/StatusChip.tsx`, `components/data/StatusChip.test.tsx`

- [ ] **Step 1: Failing test (`components/data/StatusChip.test.tsx`)**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusChip, StockStatusChip } from "@/components/data/StatusChip";

describe("OrderStatusChip", () => {
  it("inverts on problem statuses", () => {
    render(<OrderStatusChip status="Failed" />);
    expect(screen.getByText("Failed")).toHaveClass("surface-inverted");
  });
  it("does not invert on normal statuses", () => {
    render(<OrderStatusChip status="Delivered" />);
    expect(screen.getByText("Delivered")).not.toHaveClass("surface-inverted");
  });
});

describe("StockStatusChip", () => {
  it("inverts on Out and Low", () => {
    render(<StockStatusChip inStock={0} />);
    expect(screen.getByText("Out")).toHaveClass("surface-inverted");
  });
  it("does not invert on OK", () => {
    render(<StockStatusChip inStock={20} />);
    expect(screen.getByText("OK")).not.toHaveClass("surface-inverted");
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx vitest run components/data/StatusChip.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/data/StatusChip.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";
import { isProblemStatus } from "@/lib/orders";
import { stockStatus } from "@/lib/stock";

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const problem = isProblemStatus(status);
  return (
    <Badge variant="outline" className={cn("rounded-[2px] font-sans text-[11px] uppercase tracking-wide",
      problem && "surface-inverted")}>
      {status}
    </Badge>
  );
}

export function StockStatusChip({ inStock }: { inStock: number }) {
  const s = stockStatus(inStock);
  const problem = s !== "OK";
  return (
    <Badge variant="outline" className={cn("rounded-[2px] font-sans text-[11px] uppercase tracking-wide",
      problem && "surface-inverted")}>
      {s}
    </Badge>
  );
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run components/data/StatusChip.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(ui): StatusChip with inversion on problem states (TDD)"
```

### Task 4.3: StatCard

**Files:**
- Create: `components/data/StatCard.tsx`, `components/data/StatCard.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/data/StatCard";

describe("StatCard", () => {
  it("renders label, value, footnote", () => {
    render(<StatCard label="Orders today" value="12" foot="across all channels" />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Orders today")).toBeInTheDocument();
  });
  it("feature variant inverts", () => {
    const { container } = render(<StatCard label="Unexplained units" value="5" feature />);
    expect(container.firstChild).toHaveClass("surface-inverted");
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npx vitest run components/data/StatCard.test.tsx` → FAIL.

- [ ] **Step 3: Implement `components/data/StatCard.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function StatCard({ label, value, foot, feature = false }: {
  label: string; value: string; foot?: string; feature?: boolean;
}) {
  return (
    <div className={cn("border p-4 sm:p-5", feature && "surface-inverted")}>
      <div className="font-sans text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="nums mt-2 font-mono text-[30px] leading-none">{value}</div>
      {foot && <div className="mt-2 font-sans text-[12px] text-faint">{foot}</div>}
    </div>
  );
}
```
Note: under `.surface-inverted`, `text-muted-foreground`/`text-faint` still read as muted on black — acceptable; if contrast is poor, the inverted card may override foot/label color via `[&_*]:text-current`. Keep simple unless the styleguide review (Task 7) flags it.

- [ ] **Step 4: Run, verify pass** — PASS.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): StatCard with inverted feature variant (TDD)"`

### Task 4.4: Measure (signature variance track)

**Files:**
- Create: `components/data/Measure.tsx`, `components/data/Measure.test.tsx`

- [ ] **Step 1: Failing test (geometry is pure, so test the computed widths via a helper)**

```tsx
import { describe, it, expect } from "vitest";
import { measureGeometry } from "@/components/data/Measure";

describe("measureGeometry", () => {
  it("positions ticks on a shared scale (0..scaleMax)", () => {
    const g = measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 });
    expect(g.expectedPct).toBeCloseTo((55 / 60) * 100, 3);
    expect(g.atBostaPct).toBeCloseTo((52 / 60) * 100, 3);
  });
  it("gap block spans between the two ticks", () => {
    const g = measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 });
    expect(g.gapStartPct).toBeCloseTo((52 / 60) * 100, 3);
    expect(g.gapWidthPct).toBeCloseTo((3 / 60) * 100, 3);
  });
  it("missing gap is solid, extra gap is faded", () => {
    expect(measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 }).solid).toBe(true);  // missing
    expect(measureGeometry({ expected: 20, atBosta: 21, scaleMax: 60 }).solid).toBe(false); // extra
  });
});
```

- [ ] **Step 2: Run, verify fail** — FAIL.

- [ ] **Step 3: Implement `components/data/Measure.tsx`**

```tsx
import { cn } from "@/lib/utils";

export interface MeasureGeometry {
  expectedPct: number; atBostaPct: number;
  gapStartPct: number; gapWidthPct: number; solid: boolean;
}
export function measureGeometry(args: { expected: number; atBosta: number; scaleMax: number }): MeasureGeometry {
  const { expected, atBosta } = args;
  const scaleMax = Math.max(args.scaleMax, 1);
  const pct = (n: number) => (Math.max(0, n) / scaleMax) * 100;
  const lo = Math.min(expected, atBosta);
  const gap = atBosta - expected;
  return {
    expectedPct: pct(expected),
    atBostaPct: pct(atBosta),
    gapStartPct: pct(lo),
    gapWidthPct: pct(Math.abs(gap)),
    solid: gap < 0, // missing units render solid; extra renders faded
  };
}

/** Visual track. `scaleMax` must be shared across all rows (passed by the screen). */
export function Measure({ expected, atBosta, scaleMax, inverted = false }: {
  expected: number; atBosta: number; scaleMax: number; inverted?: boolean;
}) {
  const g = measureGeometry({ expected, atBosta, scaleMax });
  return (
    <div className="relative h-6 w-full" aria-hidden>
      {/* baseline track */}
      <div className={cn("absolute inset-x-0 top-1/2 h-px -translate-y-1/2",
        inverted ? "bg-background/40" : "bg-border")} />
      {/* gap block */}
      <div
        className={cn("absolute top-1/2 h-3 -translate-y-1/2",
          inverted ? "bg-background" : "bg-foreground", !g.solid && "opacity-30")}
        style={{ insetInlineStart: `${g.gapStartPct}%`, width: `${g.gapWidthPct}%` }}
      />
      {/* expected tick */}
      <div className={cn("absolute top-1/2 h-4 w-px -translate-y-1/2",
        inverted ? "bg-background" : "bg-foreground")}
        style={{ insetInlineStart: `${g.expectedPct}%` }} />
      {/* at-Bosta tick */}
      <div className={cn("absolute top-1/2 h-4 w-px -translate-y-1/2",
        inverted ? "bg-background" : "bg-foreground")}
        style={{ insetInlineStart: `${g.atBostaPct}%` }} />
    </div>
  );
}
```
Note `insetInlineStart` keeps the track correct under RTL automatically.

- [ ] **Step 4: Run, verify pass** — PASS.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(ui): Measure variance track on shared scale (TDD)"`

### Task 4.5: Brandmark, Glyph, Timeline, ConnectCard, LedgerTable

**Files:**
- Create: `components/brand/Brandmark.tsx`, `components/brand/Glyph.tsx`, `components/orders/Timeline.tsx`, `components/onboarding/ConnectCard.tsx`, `components/data/LedgerTable.tsx`

- [ ] **Step 1: `components/brand/Brandmark.tsx`**

```tsx
export function Brandmark({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-4 w-4 bg-foreground" aria-hidden />
      {withWordmark && <span className="font-display text-[15px] font-semibold tracking-tight">Ledger</span>}
    </span>
  );
}
```

- [ ] **Step 2: `components/brand/Glyph.tsx`**

```tsx
import { cn } from "@/lib/utils";
export function Glyph({ letter, inverted = false }: { letter: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex h-9 w-9 items-center justify-center border font-mono text-sm",
      inverted ? "surface-inverted" : "bg-background")}>{letter}</span>
  );
}
```

- [ ] **Step 3: `components/orders/Timeline.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ms-2 border-s ps-5">
      {events.map((e, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span className={cn("absolute -start-[26px] top-1 h-2 w-2 rounded-full",
            "bg-foreground")} aria-hidden />
          <div className="font-sans text-[13px]">{e.label}</div>
          <div className="nums mt-0.5 font-mono text-[11px] text-faint">{e.at}</div>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: `components/onboarding/ConnectCard.tsx`**

```tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Glyph } from "@/components/brand/Glyph";

export function ConnectCard({ letter, name, desc, connected, onConnect, connectLabel, connectedLabel }: {
  letter: string; name: string; desc: string; connected: boolean;
  onConnect: () => void; connectLabel: string; connectedLabel: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 border p-4", connected && "surface-inverted")}>
      <Glyph letter={letter} inverted={connected} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-[14px] font-semibold">{name}</div>
        <div className={cn("font-sans text-[12px]", connected ? "opacity-80" : "text-muted-foreground")}>{desc}</div>
      </div>
      {connected
        ? <span className="font-mono text-[11px] tracking-wide">{connectedLabel}</span>
        : <Button size="sm" onClick={onConnect}>{connectLabel}</Button>}
    </div>
  );
}
```

- [ ] **Step 5: `components/data/LedgerTable.tsx`** (thin styling wrapper re-exporting shadcn Table parts with ledger defaults)

```tsx
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
// Usage convention (documented in components.md):
//  - <TableHead> text: uppercase, faint, 11px
//  - numeric <TableCell>: add className="nums font-mono text-end"
//  - clickable <TableRow>: add className="cursor-pointer hover:bg-accent"
//  - problem <TableRow>: add className="surface-inverted"
```

- [ ] **Step 6: Type-check** — `npx tsc --noEmit` → no errors.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(ui): Brandmark, Glyph, Timeline, ConnectCard, LedgerTable"`

### Task 4.6: EmptyState

**Files:** `components/data/EmptyState.tsx`

- [ ] **Step 1: Implement**

```tsx
export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed p-12 text-center">
      <span className="mb-3 inline-block h-5 w-5 bg-foreground" aria-hidden />
      <div className="font-display text-[14px] font-semibold">{title}</div>
      {body && <p className="mt-2 max-w-sm font-sans text-[13px] text-muted-foreground">{body}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Type-check** → no errors.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(ui): EmptyState (dashed panel, directional copy)"`

### Task 4.7: Styleguide route (living evidence)

**Files:** `app/[locale]/styleguide/page.tsx`

- [ ] **Step 1: Implement a page that renders every component in every state**

Render, with section headings: Buttons (primary/ghost/disabled/focus), Chips (each order status + each stock status), StatCard (plain + feature), Measure (missing/extra/zero rows on a shared scaleMax), Brandmark, Glyph (normal/inverted), Timeline (with a problem event), ConnectCard (connected + not), EmptyState, Skeleton rows, a LedgerTable with a normal row and a `surface-inverted` problem row. Wrap the whole page once in `<div dir="ltr">` and again in `<div dir="rtl">` so both directions are visible.

```tsx
import { Measure } from "@/components/data/Measure";
import { StatCard } from "@/components/data/StatCard";
import { OrderStatusChip, StockStatusChip } from "@/components/data/StatusChip";
import { Button } from "@/components/ui/button";
import { Brandmark } from "@/components/brand/Brandmark";
import { Glyph } from "@/components/brand/Glyph";
import { Timeline } from "@/components/orders/Timeline";
import { EmptyState } from "@/components/data/EmptyState";
import { ORDER_STATUSES } from "@/lib/types";

function Block({ dir }: { dir: "ltr" | "rtl" }) {
  return (
    <div dir={dir} className="space-y-8 border p-6">
      <h2 className="font-display text-lg">Direction: {dir.toUpperCase()}</h2>
      <div className="flex gap-3"><Button>Sign in</Button><Button variant="outline">Export</Button><Button disabled>Disabled</Button></div>
      <div className="flex flex-wrap gap-2">{ORDER_STATUSES.map((s) => <OrderStatusChip key={s} status={s} />)}</div>
      <div className="flex gap-2"><StockStatusChip inStock={0} /><StockStatusChip inStock={3} /><StockStatusChip inStock={20} /></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Orders today" value="12" foot="all channels" />
        <StatCard label="Unexplained units" value="5" feature foot="investigate" />
      </div>
      <div className="space-y-2">
        <Measure expected={55} atBosta={52} scaleMax={60} />
        <Measure expected={20} atBosta={21} scaleMax={60} />
        <Measure expected={18} atBosta={18} scaleMax={60} />
      </div>
      <div className="flex items-center gap-4"><Brandmark /><Glyph letter="S" /><Glyph letter="B" inverted /></div>
      <Timeline events={[{ label: "Order placed", at: "2026-06-18" }, { label: "Delivery attempt failed — no answer", at: "2026-06-20", problem: true }]} />
      <EmptyState title="No failed orders." body="When an order fails delivery it will appear here." />
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-[1080px] space-y-8 p-7">
      <h1 className="font-display text-2xl">Styleguide</h1>
      <Block dir="ltr" />
      <Block dir="rtl" />
    </main>
  );
}
```

- [ ] **Step 2: Visual check**

Run: `npm run dev`, open `/en/styleguide`. Confirm: no color anywhere; problem chips and the feature StatCard are solid black; the missing-gap Measure block is solid and the extra-gap block is faded; RTL block mirrors layout but Measure ticks still read correctly. Stop server.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(ui): living styleguide route (all components, all states, LTR+RTL)"`

---

## Phase 5 — App shell

### Task 5.1: Sidebar, TopBar, switchers, app layout

**Files:**
- Create: `components/shell/Sidebar.tsx`, `components/shell/TopBar.tsx`, `components/shell/TenantSwitcher.tsx`, `components/shell/LocaleSwitcher.tsx`, `app/[locale]/(app)/layout.tsx`

- [ ] **Step 1: `components/shell/TenantSwitcher.tsx`**

```tsx
"use client";
import { useTenant } from "@/lib/tenant-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function TenantSwitcher() {
  const { tenant, tenants, setTenantId } = useTenant();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 border p-3 text-start">
        <span className="inline-flex h-7 w-7 items-center justify-center bg-foreground font-mono text-[11px] text-background">
          {tenant.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1 truncate font-sans text-[13px]">{tenant.name}</span>
        <span aria-hidden>⌄</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {tenants.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTenantId(t.id)} className="font-sans text-[13px]">
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 2: `components/shell/LocaleSwitcher.tsx`**

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "en" ? "ar" : "en";
  const swap = () => router.push(pathname.replace(/^\/(en|ar)/, `/${other}`));
  return (
    <button onClick={swap} className="border px-2 py-1 font-mono text-[11px] uppercase">
      {other}
    </button>
  );
}
```

- [ ] **Step 3: `components/shell/Sidebar.tsx`** (nav links + TenantSwitcher pinned bottom)

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Brandmark } from "@/components/brand/Brandmark";
import { TenantSwitcher } from "./TenantSwitcher";

const ITEMS = ["overview", "orders", "inventory", "variance", "returns", "settings"] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-[236px] shrink-0 flex-col border-e p-4">
      <div className="px-2 py-3"><Brandmark /></div>
      <nav className="mt-4 flex-1 space-y-1">
        {ITEMS.map((key) => {
          const href = `/${locale}/${key}`;
          const active = pathname === href;
          return (
            <Link key={key} href={href}
              className={cn("block border px-3 py-2 font-sans text-[13px]",
                active ? "surface-inverted" : "border-transparent hover:bg-accent")}>
              {t(key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4"><TenantSwitcher /></div>
    </aside>
  );
}
```

- [ ] **Step 4: `components/shell/TopBar.tsx`** (screen title + Export + LocaleSwitcher; hamburger on mobile)

```tsx
"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function TopBar({ title }: { title: string }) {
  const t = useTranslations("common");
  return (
    <header className="flex items-center justify-between border-b px-7 py-4">
      <h1 className="font-display text-[18px] font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <Button variant="outline" size="sm">{t("export")}</Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: `app/[locale]/(app)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
```
(Off-canvas mobile sidebar via Sheet is added in Task 7.2 responsive pass.)

- [ ] **Step 6: Verify** — `npm run dev`, visit `/en/overview` (will 404 until Task 5.2; instead temporarily check `/en/styleguide` still renders and the app layout compiles via `npm run build`). Expected: build compiles.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(shell): sidebar, topbar, tenant + locale switchers, app layout"`

---

## Phase 6 — Screens

> Each screen task: build the page, wire it to `useTenant()` data + the relevant `lib/` derivations, render all its states, add a component/render test for the key state, then commit. All copy goes through `next-intl` keys (extend `messages/en.json` + `messages/ar.json` in the same task; Arabic strings must be real translations, not English).

### Task 6.1: Overview (4.3)

**Files:** `app/[locale]/(app)/overview/page.tsx`, `app/[locale]/(app)/overview/page.test.tsx`; extend `messages/*`.

- [ ] **Step 1: Build the page**

Client component. Use `useTenant()`. Compute stats with `computeOverviewStats({ products, orders, variance, today: "2026-06-20" })`. Render:
- `<TopBar title={t('nav.overview')} />`
- **Stat strip:** 4 `StatCard`s in a hairline grid (`grid grid-cols-2 sm:grid-cols-4`): Orders today, Low stock, Out of stock, and **Unexplained units** with `feature` (the only inverted one).
- **Needs attention** list using `LedgerTable`: build rows from `sortVariance(computeVariance(variance)).filter(r => r.gap !== 0)` (each with a mono `GAP −n` chip → links to `/variance`) followed by `products.filter(p => stockStatus(p.inStock)==='Out')` (`OUT` chip → links to `/inventory`). Problem rows use `surface-inverted`.
- If there are zero attention items (the `nile` tenant), render `EmptyState`-style calm line: "Nothing needs attention right now."

- [ ] **Step 2: Render test (`overview/page.test.tsx`)**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { computeOverviewStats } from "@/lib/overview";
import { getTenants } from "@/lib/seed";

describe("overview stats wiring", () => {
  it("acme reports 5 unexplained units", () => {
    const acme = getTenants()[0];
    const s = computeOverviewStats({ products: acme.products, orders: acme.orders, variance: acme.variance, today: "2026-06-20" });
    expect(s.unexplainedUnits).toBe(5);
    expect(s.outOfStock).toBe(1);
  });
});
```
(Full page render needs intl/tenant providers — the data assertion above is the meaningful guard; a provider-wrapped render is optional.)

- [ ] **Step 3: Run tests** — `npx vitest run` → PASS.

- [ ] **Step 4: Visual check** — `/en/overview`: feature card inverted, attention rows inverted, switch tenant to Nile → calm line shows. Stop server.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(screen): Overview — stat strip + needs-attention"`

### Task 6.2: Orders + detail drawer (4.4 / 4.8)

**Files:** `app/[locale]/(app)/orders/page.tsx`, `components/orders/OrderDrawer.tsx`, `orders/page.test.tsx`; extend `messages/*`.

- [ ] **Step 1: Build `OrderDrawer.tsx`** (shadcn Sheet)

Props: `order: Order | null`, `onOpenChange`. When `order` set, open a right (`side` inline-end) Sheet. Header: `order.number` (mono) + customer + close. Meta 2×2 grid: Status (`OrderStatusChip`), Total (`formatMoney`), Phone, Tracking. `<Timeline events={order.timeline} />`. Items list: `name × qty` (mono) and `formatMoney(price)`.

- [ ] **Step 2: Build the Orders page**

Client component using `useTenant()`. Read `?status=` and `?order=` from `useSearchParams()`.
- **Filter row:** `ToggleGroup` of `All · New · Processing · Shipped · Delivered · Cancelled · Failed · Returned`, each with a mono count (`orders.filter(...).length`). Active filter = inverted (ToggleGroup item `data-state=on` → `surface-inverted` via className). Selecting updates `?status=` via `router.replace`.
- **Table** (`LedgerTable`): Order # (mono) · Customer · Status (`OrderStatusChip`) · Total (mono, `text-end`) · Date. Rows clickable → set `?order=<id>`. Filter by `?status` (All shows everything).
- Empty filter → `EmptyState title="No {status} orders."`.
- Drawer opens from `?order` and reads the order by id.

- [ ] **Step 3: Render test (`orders/page.test.tsx`)** — assert filtering logic via a pure helper. Add `lib/orders.ts` helper `filterByStatus(orders, status)`:

```tsx
import { describe, it, expect } from "vitest";
import { filterByStatus } from "@/lib/orders";
import { getTenants } from "@/lib/seed";

it("filters orders by status, 'All' returns everything", () => {
  const acme = getTenants()[0];
  expect(filterByStatus(acme.orders, "All").length).toBe(acme.orders.length);
  expect(filterByStatus(acme.orders, "Failed").every((o) => o.status === "Failed")).toBe(true);
});
```
Add to `lib/orders.ts`:
```ts
import type { Order, OrderStatus } from "@/lib/types";
export type StatusFilter = "All" | OrderStatus;
export function filterByStatus(orders: Order[], f: StatusFilter): Order[] {
  return f === "All" ? orders : orders.filter((o) => o.status === f);
}
```

- [ ] **Step 4: Run tests** — PASS.

- [ ] **Step 5: Visual check** — `/en/orders`: problem-status chips inverted; click a row → drawer slides from inline-end; `/ar/orders` opens drawer from the left. Stop server.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(screen): Orders table + filters + detail drawer"`

### Task 6.3: Inventory (4.5)

**Files:** `app/[locale]/(app)/inventory/page.tsx`; extend `messages/*`.

- [ ] **Step 1: Build the page**

Client component using `useTenant()`. Search `Input` filters by name or SKU (controlled state). Table: Product (name + mono SKU beneath) · In stock (mono, `text-end`) · Status (`StockStatusChip`). Out/Low rows: `surface-inverted`. **Phase-2 columns shown disabled:** Best seller, Slow moving, Stock age — headers rendered with a small `SOON` tag, cells `—`, all greyed (`text-faint opacity-60`). No search match → `EmptyState`.

- [ ] **Step 2: Visual check** — `/en/inventory`: Denim Jacket (0) and Cotton Tee (3) rows inverted; Phase-2 columns greyed with SOON; search "denim" filters. Stop server.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(screen): Inventory — search, stock status, Phase-2 columns disabled"`

### Task 6.4: Variance — the signature (4.6)

**Files:** `app/[locale]/(app)/variance/page.tsx`; extend `messages/*`.

- [ ] **Step 1: Build the page**

Client component using `useTenant()`.
- Compute `rows = sortVariance(computeVariance(tenant.variance))`.
- Compute the **shared scale**: `scaleMax = Math.max(...rows.flatMap(r => [r.expected, r.atBosta]), 1)`. Pass the same `scaleMax` to every `Measure` so all rows share one scale.
- Legend line at top (from messages): "Gap = what Bosta actually has − what your records expect. A non-zero gap is stock to investigate."
- One row per SKU (use a grid, not necessarily a table): (1) name + mono SKU; (2) `<Measure expected atBosta scaleMax inverted={gap!==0} />`; (3) three mono figures Expected · At Bosta · **Gap** (bold, `formatGap`). Rows with `gap !== 0` get `surface-inverted` and already sort to the top.

- [ ] **Step 2: Visual check** — `/en/variance`: Cotton Tee top row inverted, gap block solid showing the −3 span on a scale shared with all rows; Sneakers (+1) faded block; zero-gap rows not inverted, no block. Switch to Nile → all calm. `/ar/variance`: blocks read correctly RTL. Stop server.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(screen): Variance signature — shared-scale measure, inverted gap rows"`

### Task 6.5: Returns (4.7), Settings (4.9)

**Files:** `app/[locale]/(app)/returns/page.tsx`, `app/[locale]/(app)/settings/page.tsx`; extend `messages/*`.

- [ ] **Step 1: Returns — empty state only**

`EmptyState title="Returns aren't connected yet" body="Once Bosta sync is live, returns and exchanges show here — split by courier vs. customer, including partial returns."` No table.

- [ ] **Step 2: Settings**

Workspace grid (2×2 hairline cells) from `useTenant()`: Workspace name · Plan · Members · Region (Egypt · EGP). **Connections** list: Shopify and Bosta rows, each `Glyph` + name + connected account (mono) + a status chip ("Connected" muted, never colored).

- [ ] **Step 3: Visual check** — both render; tenant switch updates Settings values. Stop server.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat(screen): Returns empty state + Settings workspace & connections"`

### Task 6.6: Login (4.1), Onboarding (4.2)

**Files:** `app/[locale]/(auth)/login/page.tsx`, `app/[locale]/(auth)/onboarding/page.tsx`; extend `messages/*`.

- [ ] **Step 1: Login**

Centered card max ~380px. `Brandmark` → "Sign in" (display) → subtitle → Work email + Password `Input`s (focus border → ink, from token `--ring`) → full-width primary Button "Sign in" → "No workspace yet? Create one" link → `/[locale]/onboarding`. No real auth — link "Sign in" to `/[locale]/overview`.

- [ ] **Step 2: Onboarding**

Centered shell. Title "Connect your accounts" + subtitle (Shopify = orders, Bosta = real stock). Two `ConnectCard`s (S / B) with local `useState` connected flags; on connect the card inverts + shows "CONNECTED". Full-width "Continue to dashboard" Button disabled (40% opacity) until **both** connected; enabled → links to `/[locale]/overview`.

- [ ] **Step 3: Visual check** — `/en/login` centered & sparse; `/en/onboarding`: connect each card → inverts; Continue enables only when both done. Stop server.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat(screen): Login + Onboarding connect flow"`

---

## Phase 7 — i18n completeness, responsive, RTL QA, docs

### Task 7.1: Translation completeness

**Files:** `messages/en.json`, `messages/ar.json`

- [ ] **Step 1: Audit for hardcoded strings**

Run: `npx grep -Rn ">[A-Z]" app/ components/` is unreliable; instead manually scan each `page.tsx` and component for literal user-facing strings. Move every one to a message key. Confirm `en.json` and `ar.json` have identical key sets.

- [ ] **Step 2: Key-parity test (`messages/parity.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

function keys(obj: any, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]);
}
describe("i18n parity", () => {
  it("en and ar have the same keys", () => {
    expect(keys(en).sort()).toEqual(keys(ar).sort());
  });
});
```

- [ ] **Step 3: Run** — `npx vitest run messages/parity.test.ts` → PASS. Fix missing Arabic keys (real translations).

- [ ] **Step 4: Commit** — `git add -A && git commit -m "i18n: complete en/ar catalogs, key parity test"`

### Task 7.2: Responsive — off-canvas sidebar + breakpoints

**Files:** `components/shell/TopBar.tsx`, `components/shell/MobileNav.tsx`, `app/[locale]/(app)/layout.tsx`

- [ ] **Step 1: Add `MobileNav.tsx`** — a Sheet (side inline-start) holding the same nav links + TenantSwitcher, triggered by a hamburger button shown only `md:hidden` in `TopBar`. Pass a way to open it (lift state into the app layout or use a small context).

- [ ] **Step 2: Apply responsive rules** — stat strip `grid-cols-2 sm:grid-cols-4`; Variance row stacks below `md` (measure above the three figures); tables wrapped in `overflow-x-auto`; content padding `p-[18px] md:p-7`.

- [ ] **Step 3: QA with Playwright MCP / manual** — check 320 · 360 · 390 · 430 · 768 · 1024 · 1280 · 1440 for: no horizontal overflow, wrapping, tap targets ≥40px, sticky header, drawer/sheet behavior, empty + loading states. Record findings; fix overflows.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat(responsive): off-canvas mobile nav + breakpoint pass"`

### Task 7.3: Loading states

**Files:** `app/[locale]/(app)/*/loading.tsx` (or inline Skeleton usage)

- [ ] **Step 1:** Add `Skeleton` table rows for Orders, Inventory, Variance via per-route `loading.tsx` or a `<TableSkeleton rows={6} />` component so layout stays stable. (Seed data is synchronous, so these mainly serve the future Supabase wiring + the styleguide.)

- [ ] **Step 2: Commit** — `git add -A && git commit -m "feat(ui): skeleton loading rows for data tables"`

### Task 7.4: Documentation set (the evidence)

**Files:** `docs/design-system.md`, `docs/components.md`, `docs/screens.md`, `docs/data-model.md`, `docs/decisions.md`, `docs/traceability.md`, `README.md`

- [ ] **Step 1: `docs/design-system.md`** — the token table (hex source of truth + the HSL approximations and where each lives: `app/globals.css` var, `tailwind.config.ts` mapping), type scale + the 4 fonts and their `--font-*` vars, spacing/layout numbers, the inversion rule with the `.surface-inverted` utility, radius, motion + reduced-motion.

- [ ] **Step 2: `docs/components.md`** — one row per component (every file in `components/`): purpose · props/API · shadcn-or-custom · states it supports · RTL notes · usage example · which reference § it satisfies. Point readers to `/styleguide` for the live view.

- [ ] **Step 3: `docs/screens.md`** — one section per screen: purpose · data shape consumed · `lib/` derivations used · components used · every state (empty/problem/loading/focus/disabled) · reference §.

- [ ] **Step 4: `docs/data-model.md`** — each type in `lib/types.ts`; the derivations (`variance.ts`, `stock.ts`, `overview.ts`) with formulas; tenant isolation model; and a field-by-field "→ Supabase" mapping table (tables, columns, which fields are derived and must NOT be stored: stock status, variance gap).

- [ ] **Step 5: `docs/decisions.md`** — ADRs D1–D6 from the spec in full form: context · decision · rationale · alternatives rejected · consequences. Plus any new decisions made during build (e.g., HSL token approximation, no-auth-backend).

- [ ] **Step 6: `docs/traceability.md`** — matrix: reference §(4.1–4.9, components inventory §5, states §6) → file(s) implementing it → doc section. Every reference requirement must map to at least one file.

- [ ] **Step 7: `README.md`** — what it is, run (`npm i`, `npm run dev`, `npm test`), project structure, "add a screen" + "add a component" recipes, and the "wire Supabase later" pointer to `docs/data-model.md`. Note the doc rule: no component/screen ships without a row in `components.md`/`screens.md` and an entry in `traceability.md`.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "docs: design-system, components, screens, data-model, decisions, traceability, README"`

### Task 7.5: Final verification

- [ ] **Step 1: Full test run** — `npm test` → all green.
- [ ] **Step 2: Lint** — `npm run lint` → no errors.
- [ ] **Step 3: Production build** — `npm run build` → succeeds.
- [ ] **Step 4: Manual success-criteria pass** (spec §14): all 8 screens reachable; zero color (verify at `/styleguide`); variance shows Gap −3 top inverted; full EN⇄AR flip with correct `dir`, Western digits, no overflow at checked breakpoints; tenant switch swaps datasets; every component/screen has a doc + traceability entry.
- [ ] **Step 5: Commit any fixes** — `git add -A && git commit -m "chore: final verification fixes"`
- [ ] **Step 6: Push** — `git push origin main` (use a credential helper / one-off token; do not store the PAT in `.git/config`).

---

## Self-review notes (author)

- **Spec coverage:** every reference screen (4.1–4.9) has a task (6.1–6.6); components inventory (§5) → Phase 4; tokens/theme (§2) → Phase 1; i18n/RTL (§6/§10) → Phase 3 + 7.1; states (§6/§11) → built per screen + styleguide; responsive (§7/§12) → 7.2; evidence docs (§13) → 7.4. The signature variance shared-scale + inversion + seeded Gap −3 is covered in 2.2, 2.5, 6.4.
- **Type consistency:** `Tenant`, `Order`, `OrderStatus`, `Product`, `VarianceInput`/`VarianceRow`, `OverviewStats`, `StatusFilter` defined in 2.1/6.2 and used consistently; `computeVariance`/`sortVariance`/`computeVarianceRow`/`stockStatus`/`computeOverviewStats`/`isProblemStatus`/`filterByStatus`/`measureGeometry`/`formatMoney`/`formatGap` names match across tasks.
- **No placeholders:** logic tasks carry full test + impl code; UI tasks carry component code or exact structure + states; screen copy routed through message keys.
- **Risk to watch:** `create-next-app` into a non-empty dir (0.1) and shadcn init overwriting theme files (4.1) — both have explicit guard steps.
