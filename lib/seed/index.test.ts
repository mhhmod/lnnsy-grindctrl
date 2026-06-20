import { describe, it, expect } from "vitest";
import { getTenants } from "@/lib/seed";
import { ORDER_STATUSES } from "@/lib/types";
import { computeVariance, sortVariance } from "@/lib/variance";

describe("acme seed", () => {
  const acme = getTenants()[0];
  it("covers all 7 order statuses", () => {
    const present = new Set(acme.orders.map((o) => o.status));
    for (const s of ORDER_STATUSES) expect(present.has(s)).toBe(true);
  });
  it("has an Out (0) and a Low (<=5) product", () => {
    expect(acme.products.some((p) => p.inStock === 0)).toBe(true);
    expect(acme.products.some((p) => p.inStock > 0 && p.inStock <= 5)).toBe(true);
  });
  it("signature row Cotton Tee is the worst gap (-3) and sorts first", () => {
    const top = sortVariance(computeVariance(acme.variance))[0];
    expect(top.sku).toBe("CTN-TEE-02");
    expect(top.gap).toBe(-3);
  });
});

describe("nile seed", () => {
  const nile = getTenants()[1];
  it("is calm: no Out/Low stock and all gaps zero", () => {
    expect(nile.products.every((p) => p.inStock > 5)).toBe(true);
    expect(computeVariance(nile.variance).every((r) => r.gap === 0)).toBe(true);
  });
});
