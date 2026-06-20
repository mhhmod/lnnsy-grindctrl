import type { Tenant } from "@/lib/types";

export const nile: Tenant = {
  id: "nile",
  name: "Nile Supply Co.",
  plan: "Starter",
  members: 2,
  region: "Egypt",
  currency: "EGP",
  shopify: { name: "Shopify", account: "nile-supply.myshopify.com", connected: true },
  bosta: { name: "Bosta", account: "Nile · Giza hub", connected: true },
  orders: [
    { id: "n1", number: "#3007", customer: "Hana Reda", status: "Delivered", total: 430,
      date: "2026-06-20T08:00:00Z", phone: "+20 120 111 2222", tracking: "BMX-90011",
      items: [{ name: "Water Bottle", qty: 2, price: 215 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T09:00:00Z" },
        { label: "Delivered", at: "2026-06-20T08:00:00Z" },
      ] },
    { id: "n2", number: "#3006", customer: "Amir Salah", status: "Shipped", total: 690,
      date: "2026-06-20T09:30:00Z", phone: "+20 122 333 4444", tracking: "BMX-90004",
      items: [{ name: "Backpack", qty: 1, price: 690 }],
      timeline: [
        { label: "Order placed", at: "2026-06-19T14:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-20T09:30:00Z" },
      ] },
    { id: "n3", number: "#3005", customer: "Nada Ashraf", status: "New", total: 150,
      date: "2026-06-20T05:00:00Z", phone: "+20 128 555 6666", tracking: "—",
      items: [{ name: "Notebook", qty: 3, price: 50 }], timeline: [{ label: "Order placed", at: "2026-06-20T05:00:00Z" }] },
  ],
  products: [
    { id: "q1", name: "Water Bottle", sku: "WTR-BTL-01", inStock: 60 },
    { id: "q2", name: "Backpack", sku: "BKP-DAY-02", inStock: 22 },
    { id: "q3", name: "Notebook", sku: "NTB-A5-03", inStock: 140 },
  ],
  variance: [
    { sku: "WTR-BTL-01", name: "Water Bottle", expected: 60, atBosta: 60 },
    { sku: "BKP-DAY-02", name: "Backpack", expected: 22, atBosta: 22 },
    { sku: "NTB-A5-03", name: "Notebook", expected: 140, atBosta: 140 },
  ],
};
