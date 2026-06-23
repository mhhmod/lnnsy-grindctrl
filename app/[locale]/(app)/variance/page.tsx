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

function VarianceRowItem({
  row,
  scaleMax,
  t,
}: {
  row: VarianceRow;
  scaleMax: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const detailId = useId();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hasGap = row.gap !== 0;
  const open = hasGap && (hovered || pinned);
  const n = Math.abs(row.gap);
  const detail = hasGap
    ? row.gap < 0
      ? t("storyShort", { n, expected: row.expected, atBosta: row.atBosta })
      : t("storyExtra", { n, expected: row.expected, atBosta: row.atBosta })
    : "";

  function handleToggle() {
    setPinned((current) => !current);
  }

  const rowContent = (
    <>
      <div className="flex flex-col justify-center gap-0.5">
        <span className="font-sans text-[13px] font-medium leading-tight">{row.name}</span>
        <span className="font-mono text-[11px] opacity-60">{row.sku}</span>
      </div>

      <div className="flex items-center">
        <Measure
          expected={row.expected}
          atBosta={row.atBosta}
          scaleMax={scaleMax}
          inverted={hasGap}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 font-mono text-[13px] nums">
        <span className="opacity-60">
          <span className="me-1 font-sans text-[10px] uppercase tracking-wide opacity-70">
            {t("expected")}
          </span>
          {row.expected}
        </span>
        <span className="opacity-60">
          <span className="me-1 font-sans text-[10px] uppercase tracking-wide opacity-70">
            {t("atBosta")}
          </span>
          {row.atBosta}
        </span>
        <span className="font-bold">
          <span className="me-1 font-sans text-[10px] font-normal uppercase tracking-wide opacity-70">
            {t("gap")}
          </span>
          {formatGap(row.gap)}
        </span>
      </div>
    </>
  );

  return (
    <div
      className={cx(
        "border-b border-hairline last:border-b-0 transition-colors duration-[140ms] ease-out",
        hasGap ? "surface-inverted" : "hover:bg-wash"
      )}
      onPointerEnter={hasGap ? (event) => {
        if (event.pointerType === "mouse") setHovered(true);
      } : undefined}
      onPointerLeave={hasGap ? (event) => {
        if (event.pointerType === "mouse") setHovered(false);
      } : undefined}
    >
      {hasGap ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={handleToggle}
          className="grid w-full grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 text-start md:grid-cols-[1fr_2fr_auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-paper"
        >
          {rowContent}
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-3 md:grid-cols-[1fr_2fr_auto]">
          {rowContent}
        </div>
      )}

      {hasGap && open && (
        <div
          id={detailId}
          className="border-t border-paper/30 px-4 pb-3 pt-2 font-sans text-[12px] leading-snug text-paper"
        >
          {detail}
        </div>
      )}
    </div>
  );
}

export default function VariancePage() {
  const t = useTranslations("variance");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const rows = sortVariance(computeVariance(tenant.variance));
  const scaleMax = Math.max(...rows.flatMap((row) => [row.expected, row.atBosta]), 1);

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("variance")} />

      <main className="space-y-6 p-[18px] md:p-7">
        <p className="max-w-xl font-sans text-[13px] text-[var(--muted)]">{t("legend")}</p>

        <div className="hidden border-b border-hairline px-4 py-2 md:grid md:grid-cols-[1fr_2fr_auto] md:gap-x-6">
          <span className="font-sans text-[11px] uppercase tracking-wide text-[var(--faint)]">
            {t("colProduct")}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wide text-[var(--faint)]">
            {t("colMeasure")}
          </span>
          <span className="text-end font-sans text-[11px] uppercase tracking-wide text-[var(--faint)]">
            {t("colFigures")}
          </span>
        </div>

        <div className="border border-hairline">
          {rows.map((row) => (
            <VarianceRowItem key={row.sku} row={row} scaleMax={scaleMax} t={t} />
          ))}
        </div>
      </main>
    </div>
  );
}
