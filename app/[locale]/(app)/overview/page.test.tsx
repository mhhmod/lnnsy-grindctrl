import { describe, it, expect } from "vitest";
import { computeOverviewStats } from "@/lib/overview";
import { getTenants } from "@/lib/seed";

describe("overview stats wiring", () => {
  it("acme reports 5 unexplained units", () => {
    const acme = getTenants()[0];
    const s = computeOverviewStats({
      products: acme.products,
      orders: acme.orders,
      variance: acme.variance,
      today: "2026-06-20",
    });
    expect(s.unexplainedUnits).toBe(6); // Cotton Tee |−3| + Denim Jacket |−2| + Sneakers |+1| = 6
    expect(s.outOfStock).toBe(1);
  });
});
