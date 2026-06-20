"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useTenant } from "@/lib/tenant-context";
import { computeOverviewStats } from "@/lib/overview";
import { computeVariance, sortVariance } from "@/lib/variance";
import { stockStatus } from "@/lib/stock";
import { formatGap } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import { StatCard } from "@/components/data/StatCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/data/LedgerTable";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const t = useTranslations("overview");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const { tenant } = useTenant();

  const stats = computeOverviewStats({
    products: tenant.products,
    orders: tenant.orders,
    variance: tenant.variance,
    today: "2026-06-20",
  });

  const varianceRows = sortVariance(computeVariance(tenant.variance)).filter(
    (r) => r.gap !== 0
  );
  const outOfStockProducts = tenant.products.filter(
    (p) => stockStatus(p.inStock) === "Out"
  );

  const hasAttentionItems =
    varianceRows.length > 0 || outOfStockProducts.length > 0;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("overview")} />

      <main className="p-[18px] md:p-7 space-y-8">
        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border bg-border">
          <StatCard
            label={t("ordersToday")}
            value={String(stats.ordersToday)}
            foot={t("ordersTodayFoot")}
          />
          <StatCard
            label={t("lowStock")}
            value={String(stats.lowStock)}
            foot={t("lowStockFoot")}
          />
          <StatCard
            label={t("outOfStock")}
            value={String(stats.outOfStock)}
            foot={t("outOfStockFoot")}
          />
          <StatCard
            label={t("unexplainedUnits")}
            value={String(stats.unexplainedUnits)}
            foot={t("unexplainedUnitsFoot")}
            feature
          />
        </div>

        {/* Needs attention */}
        <section>
          <h2 className="font-display text-[13px] uppercase tracking-wide text-muted-foreground mb-3">
            {t("needsAttention")}
          </h2>

          {hasAttentionItems ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                      Item
                    </TableHead>
                    <TableHead className="font-sans text-[11px] uppercase tracking-wide text-faint">
                      Issue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varianceRows.map((row) => (
                    <TableRow
                      key={row.sku}
                      className="surface-inverted"
                    >
                      <TableCell className="font-sans text-[13px]">
                        {row.name}
                        <span className="ms-2 font-mono text-[11px] opacity-60">
                          {row.sku}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/${locale}/variance`}
                          className="font-mono text-[11px] uppercase tracking-wide border px-2 py-0.5 hover:opacity-80"
                        >
                          {t("gapChip")} {formatGap(row.gap)}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {outOfStockProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="surface-inverted"
                    >
                      <TableCell className="font-sans text-[13px]">
                        {product.name}
                        <span className="ms-2 font-mono text-[11px] opacity-60">
                          {product.sku}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/${locale}/inventory`}
                          className="font-mono text-[11px] uppercase tracking-wide border px-2 py-0.5 hover:opacity-80"
                        >
                          {t("outChip")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="font-sans text-[13px] text-muted-foreground py-6">
              {t("calm")}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
