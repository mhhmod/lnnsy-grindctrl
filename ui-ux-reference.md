# UI/UX Reference — Stock & Orders Dashboard (Multi-tenant SaaS)

A complete design reference to build from. It defines the feel, the visual system, every screen, how things move and respond, and — added in depth here — **hovering, filters, and data filtering**, all reframed around one north star: the user should feel calm, in control, and quietly delighted. This is the *vibe*, not code.

Product in one line: a multi-tenant SaaS where each business connects its own Shopify and Bosta accounts, and the app shows stock, orders, and — the headline — the **variance** between what records expect and what Bosta actually holds.

---

## 0. North Star — comfort, satisfaction, simplicity

Every decision below answers to three feelings, in this order:

1. **Comfort** — the user is never surprised, never lost, never punished for a wrong click. Nothing jumps. Nothing blocks. Everything is reversible. The screen feels like a quiet desk, not a cockpit.
2. **Satisfaction** — small moments feel good: a filter snaps in, a number lands, a row settles under the cursor. The product rewards attention without demanding it.
3. **Simplicity** — one job per screen, one obvious next action, plain words. If a feature needs explaining, the design isn't done.

A good test for any element: *would a tired shop owner at 11pm understand it instantly and feel relieved, not taxed?* If not, simplify.

---

## 1. Design Principles

1. **Black and white only.** No color. Paper, ink, grays. The restraint is the point — it makes the data the loudest thing on screen.
2. **State is shown by inversion, never by color.** Normal = ink-on-paper. Problem (low/out stock, failed/returned order, non-zero variance) = **paper-on-ink**, a solid black block. No red/green/amber. This keeps the UI calm even when something's wrong — it informs without alarming.
3. **Numbers read like a ledger.** Every figure is monospace, tabular. Columns of numbers line up perfectly — that alignment itself feels trustworthy.
4. **One signature moment.** The Variance screen draws the gap as a visible solid block — "the missing units you can see." Everything else stays quiet so this lands.
5. **Plain language.** Name things by what the user controls. Buttons say what happens.

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
- Scale: page title 18–26px, section title 14px, body 13–14px, caption 11–12px, big stat 30px.

**Layout**
- Sidebar ~236px, sticky. Content max ~1080px, 28px padding (18px mobile).
- Border-radius near-zero (≤2px). Precise, not bubbly.
- Tables are the primary surface; roomy rows, hairline dividers.

**Feel of motion (the timing that makes it comfortable)**
- Standard transition: **120–180ms, ease-out.** Fast enough to feel responsive, slow enough to feel gentle. Nothing instant (jarring), nothing over ~220ms (sluggish).
- Hovers fade, never pop. Panels slide, never snap. The whole app should feel like it's made of paper that settles, not glass that clicks.
- Respect `prefers-reduced-motion`: drop movement, keep the state change.

---

## 3. Hovering & Micro-interactions (in depth)

Hover is where "satisfaction" is won or lost. The rule: **every hoverable thing acknowledges the cursor within ~120ms, softly.** Nothing should ever feel dead, and nothing should ever shout.

**Rows (tables)**
- On hover: background eases to Wash (`#F6F6F5`), the whole row, edge to edge. The cursor becomes a pointer only if the row is clickable.
- A clickable row also nudges its first cell ~2px right on hover — a tiny lean that says "I'll open." Reverses on leave.
- Never change text color or weight on row hover (that flicker feels cheap). Only the background and the micro-nudge move.
- Active/opened row (its drawer is open): stays in Wash so the user remembers where they were.

**Buttons**
- Primary (solid ink): on hover, opacity to ~85% — a soft dim, like pressing felt. On press, a 1px downward settle.
- Ghost (hairline): on hover, border darkens hairline → ink; fill stays paper. Calm, not loud.
- Cursor always pointer. Focus ring is a clean ink outline (keyboard users get the same dignity as mouse users).

**Filter pills**
- Hover (inactive): border → ink, text → ink, over ~120ms. Feels like it's "warming up."
- The count inside each pill stays put — only the frame responds. Movement should feel like the pill is *ready*, not rearranging.

**Chips & status**
- Status chips do **not** animate on hover — they're information, not controls. Keeping them still reinforces "this is a fact, not a button."

**The variance measure (signature)**
- Hovering a variance row reveals a soft tooltip near the gap block in plain words: e.g. *"3 units short — courier marked 5 returned, only 2 reached Bosta."* This is the single most satisfying micro-moment in the app: the user hovers a mystery and gets the story. Tooltip fades in ~150ms, follows nothing (anchored, stable), dismisses on leave.
- The gap block itself does not resize on hover — stability is comfort. Only the explanation appears.

**Tenant switcher**
- Hover: border darkens. Open: menu fades+rises ~6px over 150ms. Each menu row gets a Wash hover. Closing is instant on outside-click (no lingering).

**Drawer (order detail)**
- Slides from the right ~220ms ease-out, scrim dims behind. Closing reverses. The scrim is clickable to close — comfort = always an easy way out, no hunting for an ×.

**General restraint**
- One thing moves at a time. No row that simultaneously lifts, shadows, recolors, and scales. Pick the smallest gesture that confirms "I heard you."
- No hover effects that shift layout (no borders that appear and push content). Reserve space so hovering never reflows the page — reflow is the opposite of comfort.

---

## 4. Filters (in depth)

Filters are how the user *narrows the world to their question.* They must feel light, honest, and instantly reversible.

**Behavior & feel**
- Filtering is **immediate** — tap a filter, the table updates in place. No "Apply" button, no reload, no spinner for local data. The result should feel like it was already there.
- Switching filters cross-fades the table body softly (~120ms) rather than blanking and repainting — so the user's eye stays anchored.
- The active filter is **inverted** (solid ink). Only ever one primary status filter active at a time on Orders — single, obvious state. (Simplicity over power-user multi-select here; see "honest counts" below.)

**Honest counts (this is a comfort feature)**
- Every filter shows its count in mono, always visible: `Failed 1`, `Delivered 6`. The user knows *before* clicking whether it's worth clicking. A `0` count filter is dimmed and unclickable — never let someone tap into an empty void.
- "All" always shows the grand total so the user has an anchor.

**Clearing & resetting**
- The "All" pill is the reset — always present, always one tap. The user is never stranded inside a filtered view wondering how to get back.
- If a filter + search combine to show nothing, the empty state says exactly that and offers the way out: *"No delivered orders match 'Mariam.' Clear search or show all orders."* with the actions inline.

**Persistence (quiet helpfulness)**
- Remember the user's last filter per screen within a session, so flipping between Orders and Inventory and back doesn't dump them. Don't persist across logins — a fresh session starts clean and calm.

**Placement & rhythm**
- Filters sit directly above the table they control, left-aligned, wrapping to a second line on narrow screens (never a horizontal scroll of pills — that hides options).
- Search sits on the same row, pushed to the right. One mental zone: "this is where I narrow things."

---

## 5. Data filtering, search & sort (in depth)

The deeper layer: how the user *finds the specific thing.*

**Search**
- One search box per data screen. Placeholder names the scope in plain words: "Search products…", "Search orders or customers…".
- **Live, forgiving, instant:** filters as they type, matches across the obvious fields (product name *and* SKU; order number *and* customer name). Case-insensitive, partial, trims stray spaces. The user should never need to know "which field" — they type what they remember.
- Matched text can gently bold within results so the eye lands on *why* a row matched. Subtle, not highlighter.
- Clearing search (× inside the box, or empty field) instantly restores the full list. No confirmation.
- Empty result is directional, never a dead end (see above).

**Sort**
- Default sorts are chosen *for* the user so they rarely need to touch sorting — comfort = good defaults:
  - Orders → newest first.
  - Inventory → lowest stock first (the things that need action float up).
  - Variance → biggest gap first (the problem is already on top).
- Where sorting is offered, clicking a column header toggles asc/desc with a small mono ▴/▾. Only numeric/most-useful columns are sortable; don't make everything sortable just because you can — too many affordances is its own stress.
- Sorting re-orders with a soft settle, not a hard jump.

**Combining filter + search + sort**
- They stack predictably: status filter narrows the set, search narrows further, sort orders what remains. State the combined truth in the result count: "3 of 12 orders."
- Any single control can be cleared without touching the others. Nothing is a trap.

**Phase-2 filters (designed, dormant)**
- Inventory's "best seller / slow moving / stock age" columns appear greyed with a "SOON" tag. When they switch on later, they become additional quiet filters ("Show slow movers"), following the exact same pill behavior — so the user learns the pattern once and it never changes.

**The feeling to protect**
- Filtering and search must feel like *wiping fog off glass* — the data was always there, the user is just clearing their view. Never like *running a query and waiting.* Local-first, instant, reversible.

---

## 6. Information Architecture

```
Login ─▶ (no workspace?) ─▶ Onboarding (connect Shopify + Bosta) ─┐
   └────────────────────────────────────────────────▶ App shell ◀┘
App shell:
  Sidebar ─ Overview · Orders · Inventory · Variance · Returns · Settings
  Top bar ─ current screen + Export
  Tenant switcher (bottom of sidebar)
  Order detail ─ right-side drawer (from Orders)
```

Multi-tenant: a tenant switcher at the sidebar's foot (avatar + workspace + caret → menu). Every data screen is scoped to the active workspace (maps to RLS later). Switching workspaces should feel like turning to a clean page — same calm layout, this tenant's numbers.

---

## 7. Screens (with comfort notes)

### 7.1 Login
Centered card (~380px). Brandmark → "Sign in" → one-line subtitle → email + password → full-width ink button → "No workspace yet? Create one." Sparse, unhurried. Inputs focus to an ink border. Nothing else competing for attention.

### 7.2 Onboarding — connect accounts
Title "Connect your accounts"; subtitle: Shopify = your orders, Bosta = your real stock.
Two stacked connect cards (glyph, name, one-line purpose, "Connect"). On connect the card **inverts** and shows a "CONNECTED" chip — an immediate, satisfying confirmation. "Continue" stays gently disabled (40%) until both are done, with a quiet line "Connect both accounts to continue" so the disabled state explains itself rather than frustrating.

### 7.3 Overview (landing)
- **Stat strip** (4 hairline cells): Orders today, Low stock, Out of stock, and the one inverted card — **Unexplained units** — the product's reason to exist. Big mono number + plain footnote.
- **Needs attention** table: worst variance first (`GAP −3` chip), then out-of-stock (`OUT`). Each row hover-nudges and links onward. If all clear: a calm "Nothing needs attention right now" — reassurance is a feature.

### 7.4 Orders
Intro line. Filter row (All + 7 statuses, each with honest count). Search ("orders or customers"). Table: Order # · Customer · Status · Total · Date. Problem statuses invert. Rows hover to Wash + nudge, click → drawer.

### 7.5 Inventory
Intro line. Search ("products"). Table: Product (name + SKU) · In stock · Status (OK/Low/Out, problem states invert). Phase-2 columns greyed with "SOON". Default sort: lowest stock first.

### 7.6 Variance (signature)
Legend in plain words. One row per SKU: name+SKU · the **measure** (shared-scale track, two ticks "expected"/"at Bosta", gap as a solid block) · three mono figures (Expected · At Bosta · **Gap**). Non-zero gaps invert and sort to top. Hover a row → the plain-language story of the gap. Seed worst row to the real scenario: expected 55, at Bosta 52, **Gap −3**.

### 7.7 Returns (Phase 2 — empty state)
Dashed panel, glyph, "Returns aren't connected yet", and direction about what will appear. An invitation, not a dead page.

### 7.8 Order detail (right drawer)
Slides in over a dim, click-to-close scrim. Header (order # + customer + ×). Meta grid (Status · Total · Phone · Tracking). Vertical timeline (filled dots + mono timestamps; problem events carry meaning in the words). Items (name × qty · price). Easy to open, easier to leave.

### 7.9 Settings
Workspace grid (Workspace · Plan · Members · Region). Connections list (Shopify, Bosta with connected shop/account + status chip) — where a tenant manages its own credentials.

---

## 8. Component Inventory
Brandmark · Button (primary / ghost / small) · Chip (muted / solid) · Stat card (+ feature variant) · Filter pill (with count) · Table (sortable headers, hover rows) · Variance measure · Drawer + scrim · Empty state · Tenant switcher · Tooltip (plain-language, used on variance).

---

## 9. States to Design (never skipped)
- **Empty:** no orders for a filter, no search matches, Returns not connected — each with a directional way out.
- **Problem:** low/out, failed/returned/cancelled, non-zero variance — all via inversion, all calm.
- **Loading (real build):** skeleton rows, stable layout, no spinners that block.
- **Focus:** visible ink focus ring on every control.
- **Disabled:** explains itself (onboarding Continue, Phase-2 columns) — a disabled thing always says why.

---

## 10. Responsive
≤860px: sidebar → off-canvas drawer behind a hamburger. Stat strip → 2 columns. Variance row stacks (measure above figures). Tables scroll inside their panel, never breaking the page. Filter pills wrap; search shrinks. Touch targets stay ≥40px — comfort on a phone means nothing is fiddly.

---

## 11. Copy Rules
User words ("At Bosta", "Gap", "In stock", "Unexplained units"). Buttons say the action and keep the name through the flow. Empty/error text gives direction in the interface's voice, never apologizes, never blames. Sentence case throughout.

---

## 12. Backend-wiring readiness (so the vibe doesn't block engineering)
- Every data screen is workspace-scoped (maps to RLS).
- Variance is derived (At Bosta − Expected); not a stored status.
- Order status is a fixed set: New · Processing · Shipped · Delivered · Cancelled · Failed · Returned — design filters/chips around exactly these.
- Filtering/search/sort are local-first and instant; design assumes the data for the current view is already loaded.
- Phase-2 surfaces are visible-but-dormant, ready to switch on without re-teaching the user anything.
