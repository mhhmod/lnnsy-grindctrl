import { describe, it, expect } from "vitest";
import { measureGeometry } from "@/components/data/Measure";

describe("measureGeometry", () => {
  it("positions ticks on a shared scale (0..scaleMax)", () => {
    const g = measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 });
    expect(g.expectedPct).toBeCloseTo((55 / 60) * 100, 3);
    expect(g.atBostaPct).toBeCloseTo((52 / 60) * 100, 3);
  });
  it("gap block spans between the two ticks", () => {
    const g = measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 });
    expect(g.gapStartPct).toBeCloseTo((52 / 60) * 100, 3);
    expect(g.gapWidthPct).toBeCloseTo((3 / 60) * 100, 3);
  });
  it("missing gap is solid, extra gap is faded", () => {
    expect(measureGeometry({ expected: 55, atBosta: 52, scaleMax: 60 }).solid).toBe(true);  // missing
    expect(measureGeometry({ expected: 20, atBosta: 21, scaleMax: 60 }).solid).toBe(false); // extra
  });
});
