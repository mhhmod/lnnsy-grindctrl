import type { Order, OrderStatus } from "@/lib/types";

export const FINANCE_ASSUMPTIONS = {
  paymobPercentFee: 0.0275,
  paymobFixedFee: 3,
  bostaDeliveryFee: 45,
  bostaExceptionFee: 30,
} as const;

export const FINANCE_RAILS = ["Paymob card", "Paymob wallet", "Bosta COD"] as const;
export type FinanceRail = (typeof FINANCE_RAILS)[number];

export type FinanceCollectionState =
  | "captured"
  | "collecting"
  | "pending"
  | "atRisk"
  | "reversed"
  | "cancelled";

export interface FinanceOrderRow {
  orderId: string;
  orderNumber: string;
  customer: string;
  orderStatus: OrderStatus;
  rail: FinanceRail;
  collectionState: FinanceCollectionState;
  payoutSource: "Paymob" | "Bosta";
  gross: number;
  paymobFee: number;
  bostaFee: number;
  totalFees: number;
  net: number;
  expectedPayoutDate: string;
  tracking: string;
}

export interface FinanceSummary {
  grossOrders: number;
  collected: number;
  openReceivable: number;
  atRisk: number;
  estimatedFees: number;
  netPreview: number;
  paymobGross: number;
  bostaCodGross: number;
}

export interface FinanceDashboard {
  rows: FinanceOrderRow[];
  summary: FinanceSummary;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function addDays(dateIso: string, days: number): string {
  const date = new Date(dateIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isPaymobRail(rail: FinanceRail): boolean {
  return rail === "Paymob card" || rail === "Paymob wallet";
}

export function deriveFinanceRail(order: Order, index: number): FinanceRail {
  if (order.status === "Shipped" || order.status === "Failed") return "Bosta COD";
  if (order.status === "New" || order.status === "Processing") {
    return index % 2 === 0 ? "Paymob wallet" : "Paymob card";
  }
  if (order.status === "Delivered" && index % 2 === 1) return "Bosta COD";
  return index % 3 === 0 ? "Paymob card" : "Paymob wallet";
}

export function deriveCollectionState(status: OrderStatus): FinanceCollectionState {
  switch (status) {
    case "Delivered":
      return "captured";
    case "Shipped":
      return "collecting";
    case "New":
    case "Processing":
      return "pending";
    case "Failed":
      return "atRisk";
    case "Returned":
      return "reversed";
    case "Cancelled":
      return "cancelled";
  }
}

export function computePaymobFee(gross: number, state: FinanceCollectionState): number {
  if (state === "cancelled") return 0;
  return roundMoney(gross * FINANCE_ASSUMPTIONS.paymobPercentFee + FINANCE_ASSUMPTIONS.paymobFixedFee);
}

export function computeBostaFee(state: FinanceCollectionState): number {
  if (state === "cancelled" || state === "pending") return 0;
  if (state === "atRisk" || state === "reversed") return FINANCE_ASSUMPTIONS.bostaExceptionFee;
  return FINANCE_ASSUMPTIONS.bostaDeliveryFee;
}

export function deriveFinanceRows(orders: Order[]): FinanceOrderRow[] {
  return orders.map((order, index) => {
    const rail = deriveFinanceRail(order, index);
    const collectionState = deriveCollectionState(order.status);
    const payoutSource = isPaymobRail(rail) ? "Paymob" : "Bosta";
    const paymobFee = isPaymobRail(rail) ? computePaymobFee(order.total, collectionState) : 0;
    const bostaFee = computeBostaFee(collectionState);
    const totalFees = roundMoney(paymobFee + bostaFee);
    const grossCountsTowardNet =
      collectionState === "captured" ||
      collectionState === "collecting" ||
      collectionState === "pending";
    const net = grossCountsTowardNet ? roundMoney(order.total - totalFees) : roundMoney(0 - totalFees);

    return {
      orderId: order.id,
      orderNumber: order.number,
      customer: order.customer,
      orderStatus: order.status,
      rail,
      collectionState,
      payoutSource,
      gross: order.total,
      paymobFee,
      bostaFee,
      totalFees,
      net,
      expectedPayoutDate: addDays(order.date, payoutSource === "Paymob" ? 2 : 5),
      tracking: order.tracking,
    };
  });
}

export function deriveFinanceDashboard(orders: Order[]): FinanceDashboard {
  const rows = deriveFinanceRows(orders);

  const summary = rows.reduce<FinanceSummary>(
    (acc, row) => {
      acc.grossOrders += row.gross;
      acc.estimatedFees += row.totalFees;
      if (isPaymobRail(row.rail)) acc.paymobGross += row.gross;
      else acc.bostaCodGross += row.gross;

      if (row.collectionState === "captured") acc.collected += row.gross;
      if (row.collectionState === "collecting" || row.collectionState === "pending") {
        acc.openReceivable += row.gross;
      }
      if (
        row.collectionState === "atRisk" ||
        row.collectionState === "reversed" ||
        row.collectionState === "cancelled"
      ) {
        acc.atRisk += row.gross;
      }
      acc.netPreview += row.net;
      return acc;
    },
    {
      grossOrders: 0,
      collected: 0,
      openReceivable: 0,
      atRisk: 0,
      estimatedFees: 0,
      netPreview: 0,
      paymobGross: 0,
      bostaCodGross: 0,
    }
  );

  return {
    rows,
    summary: {
      grossOrders: roundMoney(summary.grossOrders),
      collected: roundMoney(summary.collected),
      openReceivable: roundMoney(summary.openReceivable),
      atRisk: roundMoney(summary.atRisk),
      estimatedFees: roundMoney(summary.estimatedFees),
      netPreview: roundMoney(summary.netPreview),
      paymobGross: roundMoney(summary.paymobGross),
      bostaCodGross: roundMoney(summary.bostaCodGross),
    },
  };
}
