import { describe, it, expect } from "vitest";
import { filterByStatus } from "@/lib/orders";
import { getTenants } from "@/lib/seed";

describe("orders filterByStatus", () => {
  it("filters orders by status, 'All' returns everything", () => {
    const acme = getTenants()[0];
    expect(filterByStatus(acme.orders, "All").length).toBe(acme.orders.length);
    expect(
      filterByStatus(acme.orders, "Failed").every((o) => o.status === "Failed")
    ).toBe(true);
  });
});
