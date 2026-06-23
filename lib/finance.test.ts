import { describe, expect, it } from "vitest";
import { acme } from "@/lib/seed/tenant-acme";
import { nile } from "@/lib/seed/tenant-nile";
import {
  deriveCollectionState,
  deriveFinanceDashboard,
  deriveFinanceRows,
  isPaymobRail,
} from "@/lib/finance";

describe("finance preview derivations", () => {
  it("uses existing order totals for the gross finance ledger", () => {
    const dashboard = deriveFinanceDashboard(acme.orders);
    const orderGross = acme.orders.reduce((sum, order) => sum + order.total, 0);

    expect(dashboard.summary.grossOrders).toBe(orderGross);
    expect(dashboard.rows).toHaveLength(acme.orders.length);
  });

  it("groups delivered, open, and exception orders by collection state", () => {
    const dashboard = deriveFinanceDashboard(acme.orders);

    expect(dashboard.summary.collected).toBe(560);
    expect(dashboard.summary.openReceivable).toBe(1285);
    expect(dashboard.summary.atRisk).toBe(2390);
  });

  it("keeps Paymob and Bosta as preview rails without losing order identity", () => {
    const rows = deriveFinanceRows(nile.orders);

    expect(rows.map((row) => row.orderNumber)).toEqual(["#3007", "#3006", "#3005"]);
    expect(rows.some((row) => isPaymobRail(row.rail))).toBe(true);
    expect(rows.some((row) => row.payoutSource === "Bosta")).toBe(true);
  });

  it("maps order status to finance collection state", () => {
    expect(deriveCollectionState("Delivered")).toBe("captured");
    expect(deriveCollectionState("Shipped")).toBe("collecting");
    expect(deriveCollectionState("Processing")).toBe("pending");
    expect(deriveCollectionState("Failed")).toBe("atRisk");
    expect(deriveCollectionState("Returned")).toBe("reversed");
    expect(deriveCollectionState("Cancelled")).toBe("cancelled");
  });
});
