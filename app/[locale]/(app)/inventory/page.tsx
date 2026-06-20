"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { stockStatus } from "@/lib/stock";
import { TopBar } from "@/components/shell/TopBar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/data/LedgerTable";
import { StockStatusChip } from "@/components/data/StatusChip";
import { EmptyState } from "@/components/data/EmptyState";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const t = useTranslations("inventory");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? tenant.products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      )
    : tenant.products;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("inventory")} />

      <main className="p-[18px] md:p-7 space-y-5">
        {/* Search */}
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm font-sans text-[13px]"
          aria-label={t("searchPlaceholder")}
        />

        {/* Table */}
        {filteredProducts.length === 0 ? (
          <EmptyState title={t("noMatch")} body={t("noMatchBody")} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("product")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint text-end">
                    {t("inStock")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("status")}
                  </TableHead>
                  {/* Phase-2 disabled columns */}
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint opacity-60">
                    {t("bestSeller")}
                    <span className="ms-1 font-mono text-[9px] border px-1">
                      {t("soon")}
                    </span>
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint opacity-60">
                    {t("slowMoving")}
                    <span className="ms-1 font-mono text-[9px] border px-1">
                      {t("soon")}
                    </span>
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint opacity-60">
                    {t("stockAge")}
                    <span className="ms-1 font-mono text-[9px] border px-1">
                      {t("soon")}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = stockStatus(product.inStock);
                  const problem = status !== "OK";
                  return (
                    <TableRow
                      key={product.id}
                      className={cn("interactive", problem && "surface-inverted")}
                    >
                      <TableCell className="font-sans text-[13px]">
                        <div>{product.name}</div>
                        <div className="font-mono text-[11px] opacity-60">
                          {product.sku}
                        </div>
                      </TableCell>
                      <TableCell className="nums font-mono text-[13px] text-end">
                        {product.inStock}
                      </TableCell>
                      <TableCell>
                        <StockStatusChip inStock={product.inStock} />
                      </TableCell>
                      {/* Phase-2 disabled cells */}
                      <TableCell className="text-faint opacity-60 font-mono text-[13px]">
                        —
                      </TableCell>
                      <TableCell className="text-faint opacity-60 font-mono text-[13px]">
                        —
                      </TableCell>
                      <TableCell className="text-faint opacity-60 font-mono text-[13px]">
                        —
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
