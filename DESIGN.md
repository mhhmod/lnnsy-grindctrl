# Design System: Stock & Orders Dashboard (Black-and-White Ledger)

> Source of truth for the rebuild. Derived from `ui-ux-reference.md` via `/stitch-design-taste`, governed by `/impeccable` (register = product). Where this product's spec deliberately overrides generic stitch defaults, it is noted as **[override]** — the user's reference wins.

## 1. Visual Theme & Atmosphere
A calm, monochrome **ledger**. Paper-and-ink restraint so the data is the loudest thing on screen. The mood is a quiet desk at 11pm, not a cockpit: nothing jumps, nothing blocks, everything reversible. Density "Daily-App Balanced" (tables are dense but roomy), Variance "Predictable / lightly offset" (editorial but orderly, not artsy-chaotic — a ledger is trustworthy because it is aligned), Motion "Restrained-to-fluid" (120–180ms ease-out, paper that settles, never glass that clicks). The single signature moment is the Variance gap block: "the missing units you can see."

North star, in order: **comfort → satisfaction → simplicity.** Test for any element: *would a tired shop owner at 11pm understand it instantly and feel relieved, not taxed?*

## 2. Color Palette & Roles
Monochrome only. **[override]** stitch normally requires one accent — this product is intentionally accent-free; *state is shown by inversion, never by color.* No red/green/amber. The restraint is the point.

- **Paper** (`#FFFFFF`) — background surface.
- **Ink** (`#0A0A0A`) — primary text and inverted-state fills. Off-black (satisfies "no pure #000").
- **Muted** (`#6B6B6B`) — secondary text.
- **Faint** (`#9B9B9B`) — tertiary text, captions, disabled.
- **Hairline** (`#E6E6E6`) — borders, dividers, 1px structural lines.
- **Wash** (`#F6F6F5`) — hover fills, subtle surfaces.
- **Inverted surface** — Ink background + Paper text. The ONLY way "problem / active" is signalled (low/out stock, failed/returned/cancelled order, non-zero variance, the active filter pill, the Unexplained-units stat). Calm, not alarming.
- A neutral dark theme may mirror this monochrome by swapping paper/ink lightness (kept grayscale, no hue); the light ledger is primary.

## 3. Typography Rules
- **Display / headings / nav:** **Space Grotesk** (500–700). Track-tight, weight-driven hierarchy, not screaming size.
- **Body / labels:** **Inter** (400–600). **[override]** stitch bans Inter for premium contexts; the product reference explicitly specifies Inter for body — honored deliberately. Relaxed leading, ~65ch max for prose.
- **All figures / SKUs / money / counts:** **JetBrains Mono**, tabular numbers on. Columns of numbers align perfectly — alignment itself reads as trustworthy. (Satisfies stitch's high-density "numbers are monospace" rule.)
- **Arabic (AR locale):** IBM Plex Sans Arabic. Western digits preserved in both locales (ledger rule).
- Scale: page title 18–26 / section 14 / body 13–14 / caption 11–12 / big stat 30 (px). Hierarchy via weight + scale, never color.
- **Banned:** generic serifs; emoji as icons; decorative gradient text.

## 4. Component Stylings
Radius ≤2px everywhere (precise, not bubbly). Inline-SVG icons in `currentColor`. No outer glows, no custom cursors.

- **Button — Primary (solid Ink):** Paper text. Hover: opacity → ~85% (a soft felt-dim). Press: 1px downward settle (`translateY(1px)`). Always `cursor: pointer`. Focus: clean Ink outline ring.
- **Button — Ghost (hairline):** Paper fill, Hairline border, Ink text. Hover: border Hairline → Ink, fill stays Paper. Calm.
- **Button — Small:** same language, tighter padding, for inline actions.
- **Chip — muted:** Hairline outline, Ink/Muted text — a fact, not a control; **does not animate on hover.**
- **Chip — solid (problem/active):** inverted (Ink fill, Paper text). Mono variant for counts/gap (`GAP −3`, `OUT`).
- **Stat card:** label (caption) + big mono number + plain footnote, in a Hairline grid cell. **Feature variant** = inverted (the Unexplained-units card).
- **Filter pill (with count):** label + always-visible mono count. Inactive hover: border+text Hairline → Ink over ~120ms (the count stays put — only the frame "warms up"). Active = inverted. **Zero-count = Faint + disabled (not clickable).** Only one active at a time on Orders; "All" shows the grand total and is the reset.
- **Table:** Hairline dividers, roomy rows, uppercase Faint headers. **Row hover:** background eases to Wash edge-to-edge over ~120ms; a clickable row also nudges its first cell ~2px in the inline-start→end direction. Never recolor/reweight row text on hover. Opened row stays Wash. Sortable headers (only useful columns) toggle asc/desc with a mono ▴/▾; re-sort settles softly.
- **Variance measure (signature):** a horizontal track on a shared scale across rows; two ticks (expected / at Bosta); the gap is a solid Ink block (reduced opacity for an "extra" gap). The block does **not** resize on hover — instead a plain-language **Tooltip** fades in (~150ms, anchored/stable): *"3 units short — courier marked 5 returned, only 2 reached Bosta."*
- **Drawer + scrim:** slides from the inline-end edge ~220ms ease-out; dim scrim behind is **click-to-close** (always an easy way out). Header carries order # + customer + ×.
- **Tenant switcher:** trigger border darkens on hover; menu fades + rises ~6px over 150ms; rows get Wash hover; closes instantly on outside-click.
- **Input:** label above (or clear placeholder naming scope), Ink focus border, no floating labels. Search has an inline × that instantly restores the full list.
- **Loaders:** skeleton rows matching layout dimensions, stable layout. No blocking spinners.
- **Empty states:** dashed/quiet panel with a glyph and a **directional way out** (e.g. "No delivered orders match 'Mariam.' Clear search or show all orders." with inline actions). Never a dead end, never an apology.

## 5. Layout Principles
- Sidebar ~236px sticky; content max ~1080px; 28px padding (18px mobile). CSS Grid for structure; logical properties throughout (EN/AR RTL: `padding-inline`, `inset-inline`, `text-start`). No `calc()` percentage hacks.
- Tables are the primary surface. Filters sit directly above the table they control, left-aligned, wrapping on narrow screens (never a horizontal scroll of pills); search on the same row pushed to the inline-end. One mental zone for "narrowing."
- Reserve space so hover/focus never reflows the page. No overlapping elements; each owns its spatial zone.
- Responsive ≤860px: sidebar → off-canvas drawer behind a hamburger; stat strip → 2 cols; Variance row stacks (measure above figures); tables scroll inside their panel; touch targets ≥40px.

## 6. Motion & Interaction
- Standard transition **120–180ms ease-out**. Nothing instant (jarring); nothing >~220ms (sluggish). Drawer ~220ms. Tooltip/menu ~150ms.
- **One thing moves at a time.** Pick the smallest gesture that says "I heard you." Hovers fade (never pop); panels slide (never snap).
- Filtering is **immediate** and **cross-fades** the table body (~120ms) instead of blank-repaint, so the eye stays anchored. Search is live/forgiving/instant (case-insensitive, partial, trims, multi-field; gently bolds the matched substring). Sorting re-orders with a soft settle.
- Animate **transform/opacity only**. Honor `prefers-reduced-motion`: drop movement, keep the state change.
- Filter choice persists per screen within a session (not across logins).

## 7. Anti-Patterns (Banned)
- No color of any kind (no red/green/amber, no accent, no neon/glow, no gradient text). State = inversion only.
- No pure black `#000000` (Ink is `#0A0A0A`).
- No emojis as icons; inline SVG only.
- No hover that shifts layout or recolors row text; no element that lifts+shadows+recolors+scales at once.
- No "Apply" button / spinner for local filtering; no blanking-and-repainting the table.
- No zero-count filter that's tappable into an empty void; no filtered dead-end without a way out.
- No motion >220ms for routine UI; no instant 0ms state slams; no bounce/elastic easing.
- No AI copy clichés ("Elevate", "Seamless", "Unleash"); no em dashes in UI copy; sentence case; never apologize or blame in empty/error text.
- No component-library dependency (shadcn/Radix/etc.) — primitives are hand-rolled and accessible.
