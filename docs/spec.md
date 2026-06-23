# Spec — Stock & Orders Dashboard

**Status:** Approved (brainstorm) · **Date:** 2026-06-20 · **Owner:** Mahmoud (digitivia)
**Source of truth (visual):** [`ui-ux-reference.md`](../ui-ux-reference.md)

This is the authoritative design spec. Any designer or full-stack engineer should be able to read this, then `docs/components.md` + `docs/screens.md`, and work without further context. Every decision here is traceable: see [§13 Evidence & documentation system](#13-evidence--documentation-system).

---

## 1. Product in one line

A multi-tenant SaaS where each business connects its own Shopify (orders) and Bosta (real stock) accounts, and the app surfaces stock, orders, and — the headline — the **variance** between what records expect and what Bosta actually holds.

## 2. What this build is

A **frontend** built in Next.js with **seed data and working interactions**. Backend (Supabase) wires in later; the data shapes and screen scoping are designed so that wiring needs no rework. This is not a throwaway mockup — it is the real frontend with a fake data source.

## 3. Goals & non-goals

**Goals**
- All 8 reference surfaces, fully interactive on seed data.
- The strict black/white "ledger" design system, where **state is shown by inversion, never color**.
- English + Arabic, RTL-aware from day one.
- First-class handoff documentation (the "evidence" — §13).

**Non-goals (this phase)**
- No real Shopify/Bosta/Paymob/Supabase calls. Seed data only.
- No auth backend (Login/Onboarding are UI flows over seed state).
- Returns table, best-seller / slow-mover / stock-age analytics — designed as **visible-but-inactive** Phase 2 surfaces.

## 4. Decisions (locked)

| # | Decision | Rationale (short) | Alternatives rejected |
|---|---|---|---|
| D1 | **Next.js (App Router) + TypeScript** | Closest to a real multi-tenant SaaS; routing + SSR-ready for Supabase later. | Single/multi-file vanilla; React+Vite (less routing/i18n native). |
| D2 | **Tailwind + shadcn/ui, themed to the token table** | shadcn is in-repo source over Tailwind/Radix/CVA — themes via CSS variables, so the whole B&W + inversion system lives in the theme, not one-off CSS. Radix gives accessible Sheet/Dropdown/Dialog. | CSS Modules + custom props (more hand-wiring of a11y primitives); premium ShadcnBlocks (marketing-shaped, fight a custom ledger look). |
| D3 | **next-intl, `[locale]` routing** | App-Router-native; `<html dir>` flips per locale; per-locale message catalogs. | react-i18next (less native); hand-rolled dictionary (boilerplate). |
| D4 | **No state library** | Seed data as typed TS modules; filters/search in URL params; tenant + locale in React context. Scope doesn't justify Redux/Zustand. | Redux/Zustand (overkill). |
| D5 | **English + Arabic now, RTL via logical properties** | Matches the user's global EN/AR default; logical CSS means the flip is free, no future refactor. | EN-only LTR (rework later); RTL-ready-but-EN-only (less than requested). |
| D6 | **Evidence-first docs + living `/styleguide` route** | Handoff requirement: any designer/engineer onboards cold; no screenshot rot. | Code comments only (not traceable). |

Full ADR form (context · decision · consequences) lives in `docs/decisions.md`.

## 5. Architecture & routing

```
app/[locale]/
  (auth)/
    login/                 4.1
    onboarding/            4.2  (connect Shopify + Bosta)
  (app)/
    layout.tsx             app shell: sidebar nav + topbar + tenant switcher
    overview/              4.3  (landing)
    orders/                4.4  (+ detail drawer 4.8)
    finance/               extension (view-only Paymob/Bosta payout preview)
    inventory/             4.5
    variance/              4.6  (signature)
    returns/               4.7  (Phase 2 empty state)
    settings/              4.9
  styleguide/              living component/state gallery (evidence)
```

- **Order detail** = client **Sheet** opened from the Orders table, synced to `?order=<id>` so it's shareable and refresh-safe.
- **Filters & search** = URL search params (shareable, refresh-safe).
- **Active tenant** + **locale** = React context (locale also drives routing/`dir`).
- Every `(app)` screen is **workspace-scoped** — it reads only the active tenant's dataset (maps to RLS later).

## 6. Theming — the core rule

Single source: a CSS-variable token layer consumed by Tailwind config and shadcn.

**Tokens** (from reference §2):

| Token | Hex | Use |
|---|---|---|
| Paper | `#FFFFFF` | Background |
| Ink | `#0A0A0A` | Text, inverted fills |
| Muted | `#6B6B6B` | Secondary text |
| Faint | `#9B9B9B` | Tertiary, captions |
| Hairline | `#E6E6E6` | Borders, dividers |
| Wash | `#F6F6F5` | Hover, subtle fills |

- **No color anywhere.** The theme literally has no red/green/amber to reach for.
- **Inversion = state.** A normal row is ink-on-paper. A problem (low/out stock, failed/returned/cancelled order, non-zero variance) flips to **paper-on-ink** — a solid black block — via a single `data-inverted` / `data-feature` utility that swaps `--background`↔`--foreground`. This is the one mechanism for all "something's wrong / active" signalling.
- **Radius:** 2px max. Precise, not friendly.

**Type** (next/font):
- **Space Grotesk** (500–700): display, headings, nav.
- **Inter** (400–600): body, labels.
- **JetBrains Mono** (`tabular-nums`): every figure — SKU, quantity, money, variance, counts.
- **IBM Plex Sans Arabic**: `ar` locale body/headings.
- Scale: page title 18–26 · section 14 · body 13–14 · caption 11–12 · big stat 30px.
- **Digits stay Western** even in Arabic (ledger reconciliation rule).

**Layout:** sidebar ~236px sticky; content max ~1080px, 28px pad (18 mobile); tables are the primary surface — generous ~11px row padding, hairline dividers.

**Motion:** minimal. Drawer slides; section changes instant/quick-fade. Respect `prefers-reduced-motion`.

## 7. Component map (reference → implementation)

shadcn-based (themed to tokens):

| Reference component | Built as |
|---|---|
| Button (primary solid / ghost hairline) | shadcn **Button** variants |
| Chip (muted outline / solid inverted / mono) | shadcn **Badge** + a mono variant |
| Order detail drawer | shadcn **Sheet** (`side` = inline-end, RTL-aware) + scrim |
| Tenant switcher | shadcn **DropdownMenu** |
| Tables | shadcn **Table** primitives, ledger-styled |
| Filter pills | shadcn **ToggleGroup**, active = inverted |
| Search | shadcn **Input** |
| Empty state | shadcn **Empty** |
| Loading | shadcn **Skeleton** rows |

Hand-built (same stack — React + Tailwind + tokens + CVA; Radix only where interaction needs it; **no foreign lib**):

| Custom component | Notes |
|---|---|
| **StatCard** | label + big mono number + footnote; `data-feature` = inverted variant. |
| **Measure** | variance track + two ticks + gap block; `<div>`/SVG, widths computed from data, CSS only. |
| **Brandmark** | inline SVG: solid square + wordmark. |
| **Timeline** | drawer event list: semantic `<ol>` + CSS dotted spine + filled dots. |
| **Connect card** | onboarding: `<div>` + Button; inverts to black + "CONNECTED" mono chip on connect. |
| **Glyphs (S / B)** | custom SVG squares, not icon-font. |

## 8. Data model (seed, typed, schema-shaped)

TypeScript modules under `lib/seed/`, typed in `lib/types.ts`. **2 tenants**, each an isolated dataset (RLS later).

- `Tenant { id, name, plan, members, region: 'Egypt', currency: 'EGP', shopify, bosta }`
- `Order { id, number, customer, status, total, date, phone, tracking, items[], timeline[] }`
  - `status` ∈ **fixed 7**: `New · Processing · Shipped · Delivered · Cancelled · Failed · Returned`.
  - Problem statuses (Cancelled/Failed/Returned) render inverted; others as muted outline.
- `Product { id, name, sku, inStock }`
  - Stock **status derived**: `0 → Out`, `≤5 → Low`, else `OK`. Out/Low invert.
- `VarianceRow` **derived** per SKU: `gap = atBosta − expected`. Never stored as a status — it's computed (`lib/variance.ts`).
- Overview stats (Orders today, Low stock, Out of stock, **Unexplained units**) derived from the above.

**Seeded signature case:** courier marked 5 returned (expected 55) but only 2 arrived at Bosta (52) → **Gap −3**. This is the top, inverted variance row.

`docs/data-model.md` documents each type, every derivation, and the field-by-field Supabase mapping for later.

## 9. Signature screen — Variance

- Legend: "Gap = what Bosta actually has − what your records expect. A non-zero gap is stock to investigate."
- **One row per SKU**, three parts: (1) name + SKU; (2) the **Measure** — a horizontal track on a **shared scale across all visible rows**, two ticks (expected / at Bosta), the span between filled as a solid block (the gap you can *see*); (3) three mono figures: Expected · At Bosta · **Gap** (bold).
- Negative gap (missing) = **solid** block; positive (extra) = **reduced-opacity** block.
- Rows with non-zero gap **invert** and **sort to the top**.
- Everything else on the app stays quiet so this lands.

## 10. i18n / RTL

- `[locale]` routing (`/en`, `/ar`); `<html lang dir>` set per locale; switcher in topbar.
- Per-locale message catalogs (`messages/en.json`, `messages/ar.json`). All user-facing copy keyed — no hardcoded strings.
- **Logical properties everywhere** (`margin-inline`, `padding-inline-start`, `inset-inline`, `text-start`) so the RTL flip is free; Sheet opens from the inline-end side; icon direction handled logically.
- Watch Arabic expansion/wrapping/truncation; do not mirror the brandmark or the Measure's numeric logic. Digits Western in both locales.
- Copy voice (both locales): user words not system words ("At Bosta", "Expected", "Gap", "In stock", "Unexplained units"); buttons say the action; empty/error text gives direction, never apologizes; sentence case except tiny uppercase eyebrow labels.

## 11. States (design every one)

| State | Where | Treatment |
|---|---|---|
| Empty | no orders for a filter, no search match, Returns not connected | direction copy ("No failed orders."), dashed panel for Returns |
| Problem | low/out stock, failed/returned/cancelled, non-zero variance | **inversion** only |
| Loading | tables | **Skeleton** rows, layout stays stable |
| Focus | every interactive element | visible focus, border → ink |
| Disabled | onboarding Continue (until both connected); Phase-2 Inventory columns | 40% opacity / greyed + "SOON" tag, values "—" |

## 12. Responsive

Breakpoints checked: **320 · 360 · 390 · 430 · 768 · 1024 · 1280 · 1440**.
At **≤860px**: sidebar → off-canvas Sheet behind a hamburger in the topbar; stat strip → 2 columns; Variance row stacks (Measure above figures); tables scroll internally rather than break; search shrinks. Check overflow, wrapping, tap targets, sticky headers, drawers, empty/loading states.

## 13. Evidence & documentation system

Handoff requirement: any designer or full-stack engineer onboards cold. **No component or screen ships without its doc row + traceability entry.** Decisions are captured as ADRs, not memory.

| Doc | Contains |
|---|---|
| `docs/spec.md` | this file — what + why, top level |
| `docs/design-system.md` | tokens, type, spacing, inversion rule — with each token's code location (Tailwind config / CSS var) |
| `docs/components.md` | per component: purpose · API/props · shadcn-or-custom · states · RTL notes · usage example · reference § it satisfies |
| `docs/screens.md` | per screen: purpose · data shape · components used · every state · reference § |
| `docs/data-model.md` | seed types, derivations, tenant isolation, → Supabase mapping |
| `docs/decisions.md` | ADRs: context · decision · rationale · alternatives rejected · consequences |
| `docs/traceability.md` | matrix: reference §(4.1–4.9, components, states) → file(s) → doc |
| `README.md` | run, structure, add-a-screen/component, wire-Supabase-later |

Plus a **living `/styleguide` route**: renders every component in every state (normal / problem / empty / loading / focus / disabled) in **LTR + RTL**. Real code, so it can't rot.

## 14. Success criteria

1. All 8 surfaces reachable and interactive on seed data; tenant switch swaps datasets cleanly.
2. Zero color in the rendered output; all state via inversion. Verified at the `/styleguide` route.
3. Variance screen shows the seeded **Gap −3** as the top inverted row with a visible gap block on a shared scale.
4. Full EN ⇄ AR flip with correct `dir`, logical layout intact, Western digits preserved, no overflow at any checked breakpoint.
5. Every component + screen has a doc row and a traceability entry; every locked decision has an ADR.
6. Data shapes match the documented Supabase mapping (no derived "status" stored).

## 15. Open items / future phases

- **Phase 2:** Returns table (split courier vs customer, partial returns); Inventory best-seller / slow-mover / stock-age columns; real Shopify/Bosta sync; Supabase + RLS + auth.
- Auth is currently a UI flow only — real session handling deferred.
