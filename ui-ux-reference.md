# UI/UX Reference — Stock & Orders Dashboard (Multi-tenant SaaS)

A complete design reference for a designer to build from. It defines the visual system, every screen, components, states, and flows. It is a *reference*, not a build — but it's structured so the resulting UI wires cleanly to a backend later (Supabase + n8n + Shopify/Bosta).

Product in one line: a multi-tenant SaaS where each business connects its own Shopify and Bosta accounts, and the app shows stock, orders, and — the headline — the **variance** between what records expect and what Bosta actually holds.

---

## 1. Design Principles

1. **Black and white only.** No color anywhere. Paper, ink, and grays.
2. **State is shown by inversion, never by color.** A normal row is ink-on-paper. A problem (low stock, out of stock, failed/returned order, non-zero variance) flips to **paper-on-ink** — a solid black block. This is the core visual rule. No red, green, or amber.
3. **Numbers read like a ledger.** Every figure (SKU, quantity, money, variance, counts) is monospace. This is deliberate — the product is about numbers reconciling.
4. **One signature moment.** The Variance screen draws the gap between expected and actual as a visible solid block — "the missing units you can see." Everything else stays quiet so this lands.
5. **Plain language.** Label things by what the user controls ("At Bosta", "Gap", "In stock"), never by how the system is built. Buttons say what happens.

---

## 2. Design Tokens

**Color**
| Token | Hex | Use |
|---|---|---|
| Paper | `#FFFFFF` | Background |
| Ink | `#0A0A0A` | Text, inverted-state fills |
| Muted | `#6B6B6B` | Secondary text |
| Faint | `#9B9B9B` | Tertiary text, captions |
| Hairline | `#E6E6E6` | Borders, dividers |
| Wash | `#F6F6F5` | Hover, subtle fills |

**Type**
- Display / headings / nav: **Space Grotesk** (500–700)
- Body / labels: **Inter** (400–600)
- All figures / data / SKUs: **JetBrains Mono** (tabular numbers on)
- Scale: page title 18–26px, section title 14px, body 13–14px, caption 11–12px, big stat number 30px.

**Layout**
- Sidebar width ~236px, sticky full-height.
- Content max-width ~1080px, 28px padding (18px on mobile).
- Border-radius: near-zero (2px max). Precise, not rounded/friendly.
- Tables are the primary surface. Generous row padding (~11px), hairline dividers.

**Motion**
- Minimal. Drawer slides in; section changes are instant or a quick fade. Respect `prefers-reduced-motion`.

---

## 3. Information Architecture

```
Login ─▶ (no workspace?) ─▶ Onboarding (connect Shopify + Bosta) ─┐
   └────────────────────────────────────────────────▶ App shell ◀┘
App shell:
  Sidebar nav ─ Overview · Orders · Inventory · Variance · Returns · Settings
  Top bar ─ current screen + Export
  Tenant switcher (bottom of sidebar) ─ switch between workspaces
  Order detail ─ right-side drawer (from Orders)
```

Multi-tenant note: a tenant switcher lives at the bottom of the sidebar (avatar + workspace name + caret → menu). Every data screen is scoped to the active workspace. In the real build this maps to RLS; in design, treat each workspace as its own isolated dataset.

---

## 4. Screens

### 4.1 Login
Centered card, max ~380px. Brandmark (small solid square + wordmark) → "Sign in" (Space Grotesk) → one-line subtitle → Work email + Password fields → full-width black "Sign in" button → "No workspace yet? Create one" link.
Keep it sparse. Hairline inputs, focus state = border turns ink.

### 4.2 Onboarding — connect accounts
Same centered shell. Title "Connect your accounts", subtitle explaining Shopify = orders, Bosta = real stock.
Two **connect cards** stacked:
- Each: square glyph (S / B), name, one-line description, and a "Connect" button on the right.
- On connect, the whole card **inverts** (black) and the button becomes a small "CONNECTED" mono chip.
- A full-width "Continue to dashboard" button stays disabled (40% opacity) until *both* are connected.

This is the moment that demonstrates the per-tenant credential model.

### 4.3 Overview (landing)
- **Stat strip:** 4 cells in a hairline grid. Three plain (Orders today, Low stock, Out of stock). The fourth — **Unexplained units** — is the only inverted (black) card, because it's the product's reason to exist. Big mono number + small label + one-line foot note.
- **Needs attention** list (table): worst variance rows first (each with a `GAP −3` solid chip), then out-of-stock rows (`OUT` chip). Each row links to the relevant screen. If nothing's wrong, show a calm one-line "Nothing needs attention right now."

### 4.4 Orders
- Short intro line.
- **Filter row:** All · New · Processing · Shipped · Delivered · Cancelled · Failed · Returned. Each filter shows a mono count. Active filter is inverted.
- **Table:** Order # (mono) · Customer · Status · Total (mono, right) · Date. Problem statuses (Cancelled/Failed/Returned) render as solid inverted chips; others as muted outline chips. Rows are clickable.
- **Order detail = right drawer** (see 4.8).

### 4.5 Inventory
- Intro line.
- Search box (filters by name or SKU).
- **Table:** Product (name + mono SKU beneath) · In stock (mono, right) · Status. Status chip: "OK" (muted) / "Low" (inverted, ≤5) / "Out" (inverted, 0).
- **Phase 2 columns shown but disabled:** Best seller, Slow moving, Stock age — rendered greyed with a small "SOON" tag, values as "—". This signals the structure is ready without faking data.

### 4.6 Variance (the signature screen)
- Legend at top: "Gap = what Bosta actually has − what your records expect. A non-zero gap is stock to investigate."
- **One row per SKU**, three parts:
  1. Product name + SKU.
  2. **The measure** (signature): a horizontal track on a shared scale across all rows. Two ticks — "expected" and "at Bosta" — and the span between them filled as a **solid block** (the gap you can see). A positive gap (extra) renders the block at reduced opacity; a negative gap (missing) renders it solid.
  3. Three mono figures: Expected · At Bosta · **Gap** (bold).
- Rows with a non-zero gap **invert** (white-on-black) and sort to the top.
- Seed the reference example so the worst row mirrors the real scenario: courier marked 5 returned (expected 55) but only 2 arrived at Bosta (52) → **Gap −3**. Make it the top row.

### 4.7 Returns (Phase 2 — empty state only)
Do not design a table yet. A clean empty state: dashed-border panel, small glyph, "Returns aren't connected yet", and direction: "Once Bosta sync is live, returns and exchanges show here — split by courier vs. customer, including partial returns." An empty screen is an invitation, not a dead end.

### 4.8 Order detail (right drawer)
Slides from the right over a dim scrim.
- Header: order # (mono) + customer name + close ×.
- Meta grid (2×2): Status · Total · Phone · Tracking.
- **Timeline:** vertical, dotted spine. Each event = filled dot + label + mono timestamp. Problem events (failed/cancelled) use a filled marker too — the copy carries the meaning ("Delivery attempt failed — no answer"), not color.
- **Items:** name × qty (mono) and price (mono).

### 4.9 Settings
- Workspace grid (2×2 hairline cells): Workspace name · Plan · Members · Region (Egypt · EGP).
- **Connections** list: Shopify and Bosta rows, each with glyph, name, the connected shop/account (mono), and a status chip. This is where a tenant manages its own credentials.

---

## 5. Components Inventory

- **Brandmark** — solid square + wordmark.
- **Button** — primary (solid ink), ghost (hairline border). Small variant for inline actions.
- **Chip** — `muted` (outline) for normal, `solid` (inverted) for problem/active states. Mono variant for gap/count chips.
- **Stat card** — label + big mono number + footnote; `feature` variant is inverted.
- **Filter pill** — label + mono count; active = inverted.
- **Table** — uppercase faint headers, hairline dividers, clickable rows with wash hover.
- **Measure** (variance) — track + two ticks + gap block on a shared scale.
- **Drawer** — right-side panel + scrim.
- **Empty state** — dashed panel, glyph, title, directional copy.
- **Tenant switcher** — avatar + name + popover menu.

---

## 6. States to Design (don't skip)

- **Empty:** no orders for a filter ("No failed orders."), no search matches, Returns not connected.
- **Problem:** low/out stock, failed/returned/cancelled orders, non-zero variance — all via inversion.
- **Loading (for the real build):** skeleton rows in tables; keep layout stable.
- **Focus:** visible keyboard focus on every interactive element (border → ink).
- **Disabled:** onboarding "Continue" until both connected; Phase 2 columns.

---

## 7. Responsive

- ≤860px: sidebar becomes an off-canvas drawer behind a hamburger in the top bar. Stat strip → 2 columns. Variance row stacks (measure above the figures). Tables scroll internally rather than break layout. Search inputs shrink.

---

## 8. Copy Rules (for the designer to follow)

- "At Bosta", "Expected", "Gap", "In stock", "Unexplained units" — user words, not system words.
- Buttons: "Sign in", "Connect", "Continue to dashboard", "Export" — say the action.
- Empty/error text gives direction in the interface's voice, never an apology.
- Sentence case everywhere except tiny uppercase eyebrow labels.

---

## 9. Backend-wiring readiness (so design choices don't block engineering)

- Every data screen is **workspace-scoped** — design assumes one tenant's data at a time (maps to RLS).
- Variance is **derived** (At Bosta − Expected) — the designer shouldn't invent a separate "status"; it's computed.
- Order status is a fixed set: New · Processing · Shipped · Delivered · Cancelled · Failed · Returned. Design the filter + chips around exactly these.
- Phase 2 surfaces (Returns, best-seller/slow-mover/aging) are designed as visible-but-inactive, ready to switch on.

---

*A clickable HTML preview of this reference exists as a companion if a visual walkthrough helps — ask for `dashboard-preview.html`.*
