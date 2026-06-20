import type { OrderStatus } from "@/lib/types";
const PROBLEM: ReadonlySet<OrderStatus> = new Set(["Cancelled", "Failed", "Returned"]);
export function isProblemStatus(s: OrderStatus): boolean { return PROBLEM.has(s); }
