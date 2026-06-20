import type { OverviewStats, Order, Product, VarianceInput } from "@/lib/types";
import { stockStatus } from "@/lib/stock";
import { computeVariance } from "@/lib/variance";

export function computeOverviewStats(args: {
  products: Product[]; orders: Order[]; variance: VarianceInput[]; today: string; // YYYY-MM-DD
}): OverviewStats {
  const { products, orders, variance, today } = args;
  const lowStock = products.filter((p) => stockStatus(p.inStock) === "Low").length;
  const outOfStock = products.filter((p) => stockStatus(p.inStock) === "Out").length;
  const ordersToday = orders.filter((o) => o.date.slice(0, 10) === today).length;
  const unexplainedUnits = computeVariance(variance)
    .filter((r) => r.gap !== 0)
    .reduce((sum, r) => sum + Math.abs(r.gap), 0);
  return { ordersToday, lowStock, outOfStock, unexplainedUnits };
}
