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
