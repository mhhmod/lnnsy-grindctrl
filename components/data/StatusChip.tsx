import { Chip } from "@/components/primitives/Chip";
import type { OrderStatus } from "@/lib/types";
import { isProblemStatus } from "@/lib/orders";
import { stockStatus } from "@/lib/stock";

/**
 * OrderStatusChip — problem statuses (Cancelled/Failed/Returned) invert;
 * all others use the muted variant. No hover animation (chips are facts).
 */
export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const problem = isProblemStatus(status);
  return (
    <Chip variant={problem ? "solid" : "muted"}>
      {status}
    </Chip>
  );
}

/**
 * StockStatusChip — Out and Low invert; OK is muted.
 */
export function StockStatusChip({ inStock }: { inStock: number }) {
  const s = stockStatus(inStock);
  const problem = s !== "OK";
  return (
    <Chip variant={problem ? "solid" : "muted"}>
      {s}
    </Chip>
  );
}
