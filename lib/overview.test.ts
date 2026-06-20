import { describe, it, expect } from "vitest";
import { computeOverviewStats } from "@/lib/overview";
import type { Product, Order, VarianceInput } from "@/lib/types";

const products: Product[] = [
  { id: "1", name: "a", sku: "A", inStock: 0 },   // Out
  { id: "2", name: "b", sku: "B", inStock: 3 },   // Low
  { id: "3", name: "c", sku: "C", inStock: 9 },   // OK
];
const orders: Order[] = [
  { id: "o1", number: "#1", customer: "x", status: "New", total: 10, date: "2026-06-20T08:00:00Z",
    phone: "", tracking: "", items: [], timeline: [] },
];
const variance: VarianceInput[] = [
  { sku: "A", name: "a", expected: 55, atBosta: 52 }, // |gap| 3
  { sku: "B", name: "b", expected: 10, atBosta: 12 }, // |gap| 2
  { sku: "C", name: "c", expected: 4, atBosta: 4 },   // 0
];

describe("computeOverviewStats", () => {
  it("counts low/out stock and sums unexplained units", () => {
    const s = computeOverviewStats({ products, orders, variance, today: "2026-06-20" });
    expect(s.outOfStock).toBe(1);
    expect(s.lowStock).toBe(1);
    expect(s.unexplainedUnits).toBe(5); // 3 + 2
    expect(s.ordersToday).toBe(1);
  });
});
