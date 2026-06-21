"use client";

import { useTranslations } from "next-intl";
import { Drawer } from "@/components/primitives/Drawer";
import { Timeline } from "@/components/orders/Timeline";
import { OrderStatusChip } from "@/components/data/StatusChip";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/lib/types";

interface OrderDrawerProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDrawer({ order, onOpenChange }: OrderDrawerProps) {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  return (
    <Drawer
      open={order !== null}
      onOpenChange={onOpenChange}
      title={order ? `${order.number} · ${order.customer}` : undefined}
      closeLabel={tCommon("close")}
    >
      {order && (
        <div className="space-y-6">
          {/* Meta 2×2 grid */}
          <div className="grid grid-cols-2 divide-x divide-y divide-hairline border border-hairline">
            <div className="p-3 space-y-1">
              <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                {t("status")}
              </div>
              <OrderStatusChip status={order.status} />
            </div>
            <div className="p-3 space-y-1">
              <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                {t("total")}
              </div>
              <div className="nums font-mono text-[14px] text-ink">
                {formatMoney(order.total)}
              </div>
            </div>
            <div className="p-3 space-y-1">
              <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                {t("drawerPhone")}
              </div>
              <div className="font-mono text-[13px] text-ink">{order.phone}</div>
            </div>
            <div className="p-3 space-y-1">
              <div className="font-sans text-[11px] uppercase tracking-wide text-faint">
                {t("drawerTracking")}
              </div>
              <div className="font-mono text-[13px] text-ink">{order.tracking}</div>
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
            <ul className="space-y-0 divide-y divide-hairline">
              {order.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-sans text-[13px] text-ink">
                    {item.name}
                    <span className="ms-2 font-mono text-[11px] text-faint">
                      {t("qty")} {item.qty}
                    </span>
                  </span>
                  <span className="nums font-mono text-[13px] text-ink">
                    {formatMoney(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Drawer>
  );
}
