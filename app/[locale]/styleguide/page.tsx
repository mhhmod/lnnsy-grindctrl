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
      <div className="dark bg-background text-foreground p-6 space-y-8">
        <h2 className="font-display text-lg">Dark theme</h2>
        <Block dir="ltr" />
        <Block dir="rtl" />
      </div>
    </main>
  );
}
