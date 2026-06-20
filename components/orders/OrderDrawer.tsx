"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Timeline } from "@/components/orders/Timeline";
import { OrderStatusChip } from "@/components/data/StatusChip";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/lib/types";
import { X } from "lucide-react";

interface OrderDrawerProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDrawer({ order, onOpenChange }: OrderDrawerProps) {
  const t = useTranslations("orders");
  const locale = useLocale();
  // Arabic is RTL — drawer should open from the inline-end edge.
  // shadcn Sheet uses physical sides, so we map locale to "left" | "right".
  const side = locale === "ar" ? "left" : "right";

  return (
    <Sheet open={order !== null} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-full sm:max-w-md overflow-y-auto p-0">
        {order && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="flex flex-row items-start justify-between border-b p-5 space-y-0">
              <div className="flex flex-col gap-1 min-w-0">
                <SheetTitle className="font-mono text-[15px] font-medium">
                  {order.number}
                </SheetTitle>
                <span className="font-sans text-[13px] text-muted-foreground">
                  {order.customer}
                </span>
              </div>
              <SheetClose className="border p-1 hover:bg-accent shrink-0 ms-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Meta 2×2 grid */}
              <div className="grid grid-cols-2 gap-px border bg-border">
                <div className="bg-background p-3 space-y-1">
                  <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("status")}
                  </div>
                  <OrderStatusChip status={order.status} />
                </div>
                <div className="bg-background p-3 space-y-1">
                  <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("total")}
                  </div>
                  <div className="nums font-mono text-[14px]">
                    {formatMoney(order.total)}
                  </div>
                </div>
                <div className="bg-background p-3 space-y-1">
                  <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("drawerPhone")}
                  </div>
                  <div className="font-mono text-[13px]">{order.phone}</div>
                </div>
                <div className="bg-background p-3 space-y-1">
                  <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                    {t("drawerTracking")}
                  </div>
                  <div className="font-mono text-[13px]">{order.tracking}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                  {t("drawerTimeline")}
                </div>
                <Timeline events={order.timeline} />
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                  {t("drawerItems")}
                </div>
                <ul className="space-y-1">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b py-2 last:border-b-0"
                    >
                      <span className="font-sans text-[13px]">
                        {item.name}
                        <span className="ms-2 font-mono text-[11px] text-faint">
                          {t("qty")} {item.qty}
                        </span>
                      </span>
                      <span className="nums font-mono text-[13px]">
                        {formatMoney(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
