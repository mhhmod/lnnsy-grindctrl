"use client";

import { useTranslations, useLocale } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { computeVariance, sortVariance } from "@/lib/variance";
import { formatGap } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import { Measure } from "@/components/data/Measure";
import { cn } from "@/lib/utils";

export default function VariancePage() {
  const t = useTranslations("variance");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();

  const rows = sortVariance(computeVariance(tenant.variance));

  // Shared scale: all rows use the same maximum so bars are comparable.
  const scaleMax = Math.max(...rows.flatMap((r) => [r.expected, r.atBosta]), 1);

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("variance")} />

      <main className="p-[18px] md:p-7 space-y-6">
        {/* Legend */}
        <p className="font-sans text-[12px] text-muted-foreground max-w-xl">
          {t("legend")}
        </p>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr_auto] gap-x-6 px-4 py-2 border-b">
          <span className="font-sans text-[11px] uppercase tracking-wide text-faint">
            {t("colProduct")}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wide text-faint">
            {t("colMeasure")}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wide text-faint text-end">
            {t("colFigures")}
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-px border">
          {rows.map((row) => {
            const hasGap = row.gap !== 0;
            return (
              <div
                key={row.sku}
                className={cn(
                  "grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-x-6 gap-y-2 px-4 py-3",
                  hasGap && "surface-inverted"
                )}
              >
                {/* (1) Product name + SKU */}
                <div className="flex flex-col justify-center gap-0.5">
                  <span className="font-sans text-[13px] font-medium leading-tight">
                    {row.name}
                  </span>
                  <span className="font-mono text-[11px] opacity-60">
                    {row.sku}
                  </span>
                </div>

                {/* (2) Shared-scale measure track */}
                <div className="flex items-center">
                  <Measure
                    expected={row.expected}
                    atBosta={row.atBosta}
                    scaleMax={scaleMax}
                    inverted={hasGap}
                  />
                </div>

                {/* (3) Three figures: Expected · At Bosta · Gap */}
                <div className="flex items-center gap-4 justify-end nums font-mono text-[13px]">
                  <span className="opacity-60">
                    <span className="font-sans text-[10px] uppercase tracking-wide me-1 opacity-70">
                      {t("expected")}
                    </span>
                    {row.expected}
                  </span>
                  <span className="opacity-60">
                    <span className="font-sans text-[10px] uppercase tracking-wide me-1 opacity-70">
                      {t("atBosta")}
                    </span>
                    {row.atBosta}
                  </span>
                  <span className="font-bold">
                    <span className="font-sans text-[10px] uppercase tracking-wide me-1 opacity-70">
                      {t("gap")}
                    </span>
                    {formatGap(row.gap)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
