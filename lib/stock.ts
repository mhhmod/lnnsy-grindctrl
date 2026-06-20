import type { StockStatus } from "@/lib/types";
export function stockStatus(inStock: number): StockStatus {
  if (inStock <= 0) return "Out";
  if (inStock <= 5) return "Low";
  return "OK";
}
