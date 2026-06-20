import { describe, it, expect } from "vitest";
import { computeVarianceRow, computeVariance, sortVariance } from "@/lib/variance";

describe("computeVarianceRow", () => {
  it("gap is atBosta minus expected (missing => negative)", () => {
    const row = computeVarianceRow({ sku: "A", name: "A", expected: 55, atBosta: 52 });
    expect(row.gap).toBe(-3);
  });
  it("gap positive when extra stock at Bosta", () => {
    expect(computeVarianceRow({ sku: "B", name: "B", expected: 10, atBosta: 13 }).gap).toBe(3);
  });
  it("gap zero when matched", () => {
    expect(computeVarianceRow({ sku: "C", name: "C", expected: 10, atBosta: 10 }).gap).toBe(0);
  });
});

describe("sortVariance", () => {
  it("non-zero gaps sort above zero gaps, largest magnitude first", () => {
    const rows = computeVariance([
      { sku: "ok", name: "ok", expected: 10, atBosta: 10 },
      { sku: "small", name: "small", expected: 10, atBosta: 9 },
      { sku: "big", name: "big", expected: 55, atBosta: 52 },
    ]);
    const sorted = sortVariance(rows).map((r) => r.sku);
    expect(sorted).toEqual(["big", "small", "ok"]);
  });
});
