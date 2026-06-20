"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Chip } from "@/components/primitives/Chip";
import { Input } from "@/components/primitives/Input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/primitives/Table";
import { FilterPills } from "@/components/primitives/SegmentedFilter";
import { TooltipWrap } from "@/components/primitives/Tooltip";
import { Drawer } from "@/components/primitives/Drawer";
import { Menu } from "@/components/primitives/Menu";
import { Skeleton } from "@/components/primitives/Skeleton";
import { Brandmark } from "@/components/brand/Brandmark";
import { Glyph } from "@/components/brand/Glyph";
import { Measure } from "@/components/data/Measure";
import { StatCard } from "@/components/data/StatCard";
import { EmptyState } from "@/components/data/EmptyState";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted2 border-b border-hairline pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function StyleguideBlock({ dir }: { dir: "ltr" | "rtl" }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div dir={dir} className="space-y-10 border border-hairline p-6 bg-paper text-ink">
      <h2 className="font-display text-base font-semibold text-muted2">
        Direction: {dir.toUpperCase()}
      </h2>

      {/* ── Button ── */}
      <Section title="Button">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">Small primary</Button>
          <Button variant="ghost" size="sm">Small ghost</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <p className="font-sans text-[12px] text-muted2">
          Hover: opacity 85% (primary) / border→ink (ghost). Press: 1px settle.
        </p>
      </Section>

      {/* ── Chip ── */}
      <Section title="Chip">
        <div className="flex flex-wrap gap-2">
          <Chip variant="muted">Muted</Chip>
          <Chip variant="solid">Solid</Chip>
          <Chip variant="mono">42</Chip>
          <Chip variant="muted">Pending</Chip>
          <Chip variant="solid">Out of stock</Chip>
          <Chip variant="mono">−3</Chip>
        </div>
      </Section>

      {/* ── Input ── */}
      <Section title="Input">
        <div className="max-w-sm space-y-3">
          <Input placeholder="Default input" />
          <Input
            variant="search"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </Section>

      {/* ── FilterPills ── */}
      <Section title="FilterPills (with zero-count disabled pill)">
        <FilterPills
          label="Order status filter"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: 48 },
            { value: "pending", label: "Pending", count: 12 },
            { value: "failed", label: "Failed", count: 3 },
            { value: "cancelled", label: "Cancelled", count: 0 },
          ]}
        />
      </Section>

      {/* ── Table ── */}
      <Section title="Table (clickable nudge row + inverted problem row)">
        <Table>
          <THead>
            <TR>
              <TH>Order</TH>
              <TH>SKU</TH>
              <TH className="text-end">Units</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            <TR data-clickable className="interactive cursor-pointer">
              <TD>ORD-001</TD>
              <TD>SKU-A</TD>
              <TD className="nums text-end">24</TD>
              <TD><Chip variant="muted">Delivered</Chip></TD>
            </TR>
            <TR data-clickable className="interactive cursor-pointer">
              <TD>ORD-002</TD>
              <TD>SKU-B</TD>
              <TD className="nums text-end">8</TD>
              <TD><Chip variant="muted">Pending</Chip></TD>
            </TR>
            <TR className="surface-inverted">
              <TD>ORD-003</TD>
              <TD>SKU-C</TD>
              <TD className="nums text-end">−5</TD>
              <TD><Chip variant="solid">Gap</Chip></TD>
            </TR>
          </TBody>
        </Table>
      </Section>

      {/* ── Tooltip ── */}
      <Section title="Tooltip">
        <div className="flex flex-wrap gap-4">
          <TooltipWrap content="3 units short — courier marked 5 returned, only 2 reached warehouse.">
            <Button variant="ghost" size="sm">Hover for tooltip</Button>
          </TooltipWrap>
          <TooltipWrap content="Extra units recorded above expected delivery.">
            <Chip variant="mono">+2</Chip>
          </TooltipWrap>
        </div>
      </Section>

      {/* ── Drawer ── */}
      <Section title="Drawer">
        <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Order detail">
          <div className="space-y-4 font-sans text-sm text-ink">
            <div className="space-y-1">
              <div className="text-muted2 text-[11px] uppercase tracking-wide">Order</div>
              <div className="font-mono">ORD-001</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted2 text-[11px] uppercase tracking-wide">SKU</div>
              <div>SKU-A — Black T-shirt XL</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted2 text-[11px] uppercase tracking-wide">Units</div>
              <div className="nums font-mono">24</div>
            </div>
            <Chip variant="muted">Delivered</Chip>
          </div>
        </Drawer>
      </Section>

      {/* ── Menu ── */}
      <Section title="Menu">
        <Menu
          trigger="Actions"
          items={[
            { label: "Export CSV", onSelect: () => {} },
            { label: "Mark as reviewed", onSelect: () => {}, active: true },
            { label: "Archive", onSelect: () => {} },
          ]}
        />
      </Section>

      {/* ── Skeleton ── */}
      <Section title="Skeleton">
        <div className="space-y-2 max-w-sm">
          <Skeleton className="h-4 w-3/4 rounded-none" />
          <Skeleton className="h-4 w-1/2 rounded-none" />
          <Skeleton className="h-4 w-5/6 rounded-none" />
        </div>
      </Section>

      {/* ── Brand ── */}
      <Section title="Brandmark + Glyph">
        <div className="flex items-center gap-4">
          <Brandmark />
          <Glyph letter="S" />
          <Glyph letter="B" inverted />
        </div>
      </Section>

      {/* ── StatCard ── */}
      <Section title="StatCard">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Orders today" value="12" foot="all channels" />
          <StatCard label="Unexplained units" value="5" feature foot="investigate" />
          <StatCard label="In transit" value="38" />
          <StatCard label="Failed deliveries" value="3" foot="last 7 days" />
        </div>
      </Section>

      {/* ── Measure ── */}
      <Section title="Measure (missing / extra / zero)">
        <div className="space-y-2 max-w-lg">
          <div className="font-sans text-[12px] text-muted2 mb-1">Missing (gap &lt; 0)</div>
          <Measure expected={55} atBosta={52} scaleMax={60} />
          <div className="font-sans text-[12px] text-muted2 mt-3 mb-1">Extra (gap &gt; 0)</div>
          <Measure expected={20} atBosta={21} scaleMax={60} />
          <div className="font-sans text-[12px] text-muted2 mt-3 mb-1">Zero gap (exact)</div>
          <Measure expected={18} atBosta={18} scaleMax={60} />
          <div className="font-sans text-[12px] text-muted2 mt-3 mb-1">Inverted surface</div>
          <div className="surface-inverted p-3">
            <Measure expected={30} atBosta={25} scaleMax={60} inverted />
          </div>
        </div>
      </Section>

      {/* ── EmptyState ── */}
      <Section title="EmptyState">
        <EmptyState title="No failed orders." body="When an order fails delivery it will appear here." />
      </Section>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-[1080px] space-y-8 p-7">
      <h1 className="font-display text-2xl">Styleguide — B&amp;W Primitives</h1>

      {/* Light mode */}
      <StyleguideBlock dir="ltr" />
      <StyleguideBlock dir="rtl" />

      {/* Dark mode */}
      <div className="dark bg-paper text-ink space-y-8 p-6">
        <h2 className="font-display text-lg">Dark theme</h2>
        <StyleguideBlock dir="ltr" />
        <StyleguideBlock dir="rtl" />
      </div>
    </main>
  );
}
