import { describe, it, expect } from "vitest";
import { formatMoney, formatGap } from "@/lib/format";

describe("formatMoney", () => {
  it("formats EGP with Western digits", () => {
    expect(formatMoney(1250)).toBe("EGP 1,250");
  });
});
describe("formatGap", () => {
  it("shows explicit sign", () => {
    expect(formatGap(-3)).toBe("−3");
    expect(formatGap(3)).toBe("+3");
    expect(formatGap(0)).toBe("0");
  });
});
