"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTenant } from "@/lib/tenant-context";
import { filterByStatus, isProblemStatus } from "@/lib/orders";
import type { StatusFilter } from "@/lib/orders";
import { formatMoney } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/types";
import type { Order } from "@/lib/types";
import { TopBar } from "@/components/shell/TopBar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/data/LedgerTable";
import { OrderStatusChip } from "@/components/data/StatusChip";
import { EmptyState } from "@/components/data/EmptyState";
import { OrderDrawer } from "@/components/orders/OrderDrawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const ALL_FILTERS: StatusFilter[] = ["All", ...ORDER_STATUSES];

export function OrdersInner() {
  const t = useTranslations("orders");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status") as StatusFilter | null;
  const orderParam = searchParams.get("order");

  const activeFilter: StatusFilter =
    statusParam && ALL_FILTERS.includes(statusParam) ? statusParam : "All";

  const filteredOrders = filterByStatus(tenant.orders, activeFilter);

  const selectedOrder: Order | null =
    orderParam ? tenant.orders.find((o) => o.id === orderParam) ?? null : null;

  function setFilter(f: StatusFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (f === "All") {
      params.delete("status");
    } else {
      params.set("status", f);
    }
    params.delete("order");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function openOrder(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", id);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function closeDrawer(open: boolean) {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("order");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  function countForStatus(f: StatusFilter): number {
    return filterByStatus(tenant.orders, f).length;
  }

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("orders")} />

      <main className="p-[18px] md:p-7 space-y-5">
        {/* Filter row */}
        <div className="overflow-x-auto">
          <ToggleGroup
            type="single"
            value={activeFilter}
            onValueChange={(v) => v && setFilter(v as StatusFilter)}
            className="flex flex-wrap gap-1 justify-start"
            aria-label={t("filterLabel")}
          >
            {ALL_FILTERS.map((f) => (
              <ToggleGroupItem
                key={f}
                value={f}
                className={cn(
                  "border font-sans text-[12px] px-3 py-1 h-auto rounded-none gap-1",
                  "data-[state=on]:surface-inverted data-[state=on]:border-foreground"
                )}
              >
                {f === "All" ? t("all") : f}
                <span className="nums font-mono text-[11px]">
                  {countForStatus(f)}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            title={t("emptyStatus", {
              status: activeFilter === "All" ? t("all") : activeFilter,
            })}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("orderNumber")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("customer")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("status")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint text-end">
                    {t("total")}
                  </TableHead>
                  <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("date")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={cn(
                      "cursor-pointer hover:bg-accent",
                      isProblemStatus(order.status) && "surface-inverted hover:opacity-90"
                    )}
                    onClick={() => openOrder(order.id)}
                  >
                    <TableCell className="nums font-mono text-[13px]">
                      {order.number}
                    </TableCell>
                    <TableCell className="font-sans text-[13px]">
                      {order.customer}
                    </TableCell>
                    <TableCell>
                      <OrderStatusChip status={order.status} />
                    </TableCell>
                    <TableCell className="nums font-mono text-[13px] text-end">
                      {formatMoney(order.total)}
                    </TableCell>
                    <TableCell className="nums font-mono text-[11px] text-faint">
                      {order.date.slice(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <OrderDrawer order={selectedOrder} onOpenChange={closeDrawer} />
    </div>
  );
}
