"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { computeVariance, sortVariance } from "@/lib/variance";
import { formatGap } from "@/lib/format";
import type { VarianceRow } from "@/lib/types";
import { TopBar } from "@/components/shell/TopBar";
import { Measure } from "@/components/data/Measure";
import { cx } from "@/lib/cx";

/**
 * Single variance row with an anchored tooltip.
 * We keep the tooltip span inside the row div (which has `relative`) so
 * `absolute` positioning is scoped correctly — works in RTL too since
 * `insetInlineStart` is used for the tooltip offset.
 */
function VarianceRowItem({
  row,
  scaleMax,
  t,
}: {
  row: VarianceRow;
  scaleMax: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  const hasGap = row.gap !== 0;
  const n = Math.abs(row.gap);

  const tooltipContent = hasGap
    ? row.gap < 0
      ? t("storyShort", { n, expected: row.expected, atBosta: row.atBosta })
      : t("storyExtra", { n, expected: row.expected, atBosta: row.atBosta })
    : "";

  return (
    <div
      tabIndex={hasGap ? 0 : undefined}
      aria-describedby={hasGap ? tooltipId : undefined}
      onMouseEnter={hasGap ? () => setVisible(true) : undefined}
      onMouseLeave={hasGap ? () => setVisible(false) : undefined}
      onFocus={hasGap ? () => setVisible(true) : undefined}
      onBlur={hasGap ? () => setVisible(false) : undefined}
      className={cx(
        "relative grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-x-6 gap-y-2 px-4 py-3",
        "transition-colors duration-[140ms] ease-out",
        "focus:outline-none",
        hasGap
          ? "surface-inverted focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-0"
          : "hover:bg-wash focus-visible:ring-2 focus-visible:ring-ink"
      )}
    >
      {/* Tooltip bubble — anchored above the row, stable (does not resize row) */}
      {hasGap && (
        <span
          id={tooltipId}
          role="tooltip"
          aria-hidden={!visible}
          className={cx(
            "pointer-events-none absolute bottom-full mb-1.5 start-4 z-50",
            "px-3 py-2 text-[12px] leading-snug font-sans",
            "bg-ink text-paper rounded-sm",
            "max-w-[280px] whitespace-normal",
            "transition-opacity duration-150 ease-out",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          {tooltipContent}
        </span>
      )}

      {/* (1) Product name + SKU */}
      <div className="flex flex-col justify-center gap-0.5">
        <span className="font-sans text-[13px] font-medium leading-tight">
          {row.name}
        </span>
        <span className="font-mono text-[11px] opacity-60">
          {row.sku}
        </span>
      </div>

      {/* (2) Shared-scale measure track — stacks above figures below md */}
      <div className="flex items-center">
        <Measure
          expected={row.expected}
          atBosta={row.atBosta}
          scaleMax={scaleMax}
          inverted={hasGap}
        />
      </div>

      {/* (3) Three figures: Expected · At Bosta · Gap */}
      <div className="flex flex-wrap items-center gap-4 justify-end nums font-mono text-[13px]">
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
          <span className="font-sans text-[10px] font-normal uppercase tracking-wide me-1 opacity-70">
            {t("gap")}
          </span>
          {formatGap(row.gap)}
        </span>
      </div>
    </div>
  );
}

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
        <p className="font-sans text-[13px] text-[var(--muted)] max-w-xl">
          {t("legend")}
        </p>

        {/* Column headers (desktop only) */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr_auto] gap-x-6 px-4 py-2 border-b border-hairline">
          <span className="font-sans text-[11px] uppercase tracking-wide text-[var(--faint)]">
            {t("colProduct")}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wide text-[var(--faint)]">
            {t("colMeasure")}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wide text-[var(--faint)] text-end">
            {t("colFigures")}
          </span>
        </div>

        {/* Rows — biggest gap first (already sorted by sortVariance) */}
        <div className="space-y-px border border-hairline">
          {rows.map((row) => (
            <VarianceRowItem key={row.sku} row={row} scaleMax={scaleMax} t={t} />
          ))}
        </div>
      </main>
    </div>
  );
}
