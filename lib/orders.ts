import type { Order, OrderStatus } from "@/lib/types";

const PROBLEM: ReadonlySet<OrderStatus> = new Set(["Cancelled", "Failed", "Returned"]);
export function isProblemStatus(s: OrderStatus): boolean { return PROBLEM.has(s); }

export type StatusFilter = "All" | OrderStatus;
export function filterByStatus(orders: Order[], f: StatusFilter): Order[] {
  return f === "All" ? orders : orders.filter((o) => o.status === f);
}
