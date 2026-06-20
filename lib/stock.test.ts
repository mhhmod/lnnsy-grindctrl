import { describe, it, expect } from "vitest";
import { stockStatus } from "@/lib/stock";

describe("stockStatus", () => {
  it("0 is Out", () => expect(stockStatus(0)).toBe("Out"));
  it("<=5 is Low", () => { expect(stockStatus(1)).toBe("Low"); expect(stockStatus(5)).toBe("Low"); });
  it(">5 is OK", () => expect(stockStatus(6)).toBe("OK"));
});
