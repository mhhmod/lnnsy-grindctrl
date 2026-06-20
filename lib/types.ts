export const ORDER_STATUSES = [
  "New", "Processing", "Shipped", "Delivered", "Cancelled", "Failed", "Returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem { name: string; qty: number; price: number; }
export interface TimelineEvent { label: string; at: string; problem?: boolean; }

export interface Order {
  id: string;
  number: string;          // mono display, e.g. "#1042"
  customer: string;
  status: OrderStatus;
  total: number;           // EGP
  date: string;            // ISO
  phone: string;
  tracking: string;
  items: OrderItem[];
  timeline: TimelineEvent[];
}

export interface Product { id: string; name: string; sku: string; inStock: number; }
export type StockStatus = "OK" | "Low" | "Out";

export interface VarianceInput { sku: string; name: string; expected: number; atBosta: number; }
export interface VarianceRow extends VarianceInput { gap: number; } // gap = atBosta - expected

export interface Connection { name: string; account: string; connected: boolean; }
export interface Tenant {
  id: string;
  name: string;
  plan: string;
  members: number;
  region: "Egypt";
  currency: "EGP";
  shopify: Connection;
  bosta: Connection;
  orders: Order[];
  products: Product[];
  variance: VarianceInput[];
}

export interface OverviewStats {
  ordersToday: number;
  lowStock: number;
  outOfStock: number;
  unexplainedUnits: number; // sum of |gap| over non-zero variance rows
}
