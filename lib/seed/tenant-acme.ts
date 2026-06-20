import type { Tenant } from "@/lib/types";

export const acme: Tenant = {
  id: "acme",
  name: "Acme Goods",
  plan: "Growth",
  members: 4,
  region: "Egypt",
  currency: "EGP",
  shopify: { name: "Shopify", account: "acme-goods.myshopify.com", connected: true },
  bosta: { name: "Bosta", account: "Acme · Cairo hub", connected: true },
  orders: [
    { id: "a1", number: "#1042", customer: "Mona Adel", status: "Failed", total: 540,
      date: "2026-06-20T09:12:00Z", phone: "+20 100 111 2233", tracking: "BMX-44821",
      items: [{ name: "Cotton Tee", qty: 2, price: 270 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T10:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-19T08:30:00Z" },
        { label: "Delivery attempt failed — no answer", at: "2026-06-20T09:12:00Z", problem: true },
      ] },
    { id: "a2", number: "#1041", customer: "Youssef Kamal", status: "Returned", total: 1250,
      date: "2026-06-20T07:40:00Z", phone: "+20 101 222 3344", tracking: "BMX-44799",
      items: [{ name: "Denim Jacket", qty: 1, price: 1250 }],
      timeline: [
        { label: "Order placed", at: "2026-06-15T12:00:00Z" },
        { label: "Delivered", at: "2026-06-17T15:00:00Z" },
        { label: "Returned by customer", at: "2026-06-20T07:40:00Z", problem: true },
      ] },
    { id: "a3", number: "#1040", customer: "Sara Tarek", status: "Delivered", total: 320,
      date: "2026-06-19T16:00:00Z", phone: "+20 102 333 4455", tracking: "BMX-44712",
      items: [{ name: "Tote Bag", qty: 1, price: 320 }],
      timeline: [
        { label: "Order placed", at: "2026-06-17T09:00:00Z" },
        { label: "Delivered", at: "2026-06-19T16:00:00Z" },
      ] },
    { id: "a4", number: "#1039", customer: "Omar Hany", status: "Shipped", total: 780,
      date: "2026-06-20T11:00:00Z", phone: "+20 103 444 5566", tracking: "BMX-44690",
      items: [{ name: "Sneakers", qty: 1, price: 780 }],
      timeline: [
        { label: "Order placed", at: "2026-06-19T18:00:00Z" },
        { label: "Shipped with Bosta", at: "2026-06-20T11:00:00Z" },
      ] },
    { id: "a5", number: "#1038", customer: "Laila Samir", status: "Processing", total: 410,
      date: "2026-06-20T06:30:00Z", phone: "+20 106 555 6677", tracking: "—",
      items: [{ name: "Cap", qty: 2, price: 205 }], timeline: [{ label: "Order placed", at: "2026-06-20T06:30:00Z" }] },
    { id: "a6", number: "#1037", customer: "Khaled Nabil", status: "New", total: 95,
      date: "2026-06-20T05:10:00Z", phone: "+20 109 666 7788", tracking: "—",
      items: [{ name: "Socks", qty: 1, price: 95 }], timeline: [{ label: "Order placed", at: "2026-06-20T05:10:00Z" }] },
    { id: "a7", number: "#1036", customer: "Dina Fouad", status: "Cancelled", total: 600,
      date: "2026-06-18T13:20:00Z", phone: "+20 111 777 8899", tracking: "—",
      items: [{ name: "Hoodie", qty: 1, price: 600 }],
      timeline: [
        { label: "Order placed", at: "2026-06-18T12:00:00Z" },
        { label: "Cancelled by customer", at: "2026-06-18T13:20:00Z", problem: true },
      ] },
    { id: "a8", number: "#1035", customer: "Tarek Aziz", status: "Delivered", total: 240,
      date: "2026-06-16T10:00:00Z", phone: "+20 112 888 9900", tracking: "BMX-44510",
      items: [{ name: "Belt", qty: 1, price: 240 }],
      timeline: [
        { label: "Order placed", at: "2026-06-14T10:00:00Z" },
        { label: "Delivered", at: "2026-06-16T10:00:00Z" },
      ] },
  ],
  products: [
    { id: "p1", name: "Denim Jacket", sku: "DNM-JKT-01", inStock: 0 },
    { id: "p2", name: "Cotton Tee", sku: "CTN-TEE-02", inStock: 3 },
    { id: "p3", name: "Sneakers", sku: "SNK-RUN-03", inStock: 5 },
    { id: "p4", name: "Tote Bag", sku: "TOT-BAG-04", inStock: 18 },
    { id: "p5", name: "Hoodie", sku: "HOD-FLC-05", inStock: 26 },
    { id: "p6", name: "Cap", sku: "CAP-CTN-06", inStock: 41 },
  ],
  variance: [
    { sku: "CTN-TEE-02", name: "Cotton Tee", expected: 55, atBosta: 52 }, // signature: Gap -3 (worst)
    { sku: "DNM-JKT-01", name: "Denim Jacket", expected: 12, atBosta: 10 }, // -2
    { sku: "SNK-RUN-03", name: "Sneakers", expected: 20, atBosta: 21 },     // +1 (extra)
    { sku: "TOT-BAG-04", name: "Tote Bag", expected: 18, atBosta: 18 },     // 0
    { sku: "HOD-FLC-05", name: "Hoodie", expected: 26, atBosta: 26 },       // 0
  ],
};
