"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useTenant } from "@/lib/tenant-context";
import { computeOverviewStats } from "@/lib/overview";
import { computeVariance, sortVariance } from "@/lib/variance";
import { stockStatus } from "@/lib/stock";
import { formatGap } from "@/lib/format";
import { cx } from "@/lib/cx";
import { TopBar } from "@/components/shell/TopBar";
import { Chip } from "@/components/primitives/Chip";
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "@/components/primitives/Table";

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

      <main className="p-[18px] md:p-7 space-y-10">

        {/* ── Editorial header ─────────────────────────────────────────────── */}
        <div className="space-y-1">
          <h2 className="font-display text-[26px] font-semibold leading-tight text-ink">
            {tNav("overview")}
          </h2>
          <p className="font-sans text-[14px] text-muted-warm leading-snug">
            {t("lead")}
          </p>
        </div>

        {/* ── Stat strip ───────────────────────────────────────────────────── */}
        {/*
          Four stats in a 2×2 → 4×1 grid separated by hairline dividers.
          "Unexplained units" is the ember feature stat: ember-weak bg,
          ember number — the visual hero. Others are quiet ink-on-paper.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-hairline border border-hairline rounded-[2px] overflow-hidden">
          {/* Stat: Orders today */}
          <StatItem
            label={t("ordersToday")}
            value={String(stats.ordersToday)}
            foot={t("ordersTodayFoot")}
          />
          {/* Stat: Low stock */}
          <StatItem
            label={t("lowStock")}
            value={String(stats.lowStock)}
            foot={t("lowStockFoot")}
          />
          {/* Stat: Out of stock */}
          <StatItem
            label={t("outOfStock")}
            value={String(stats.outOfStock)}
            foot={t("outOfStockFoot")}
          />
          {/* Stat: Unexplained units — ember feature, the visual hero */}
          <StatItem
            label={t("unexplainedUnits")}
            value={String(stats.unexplainedUnits)}
            foot={t("unexplainedUnitsFoot")}
            feature
          />
        </div>

        {/* ── Needs attention ──────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-[13px] uppercase tracking-widest text-faint-warm mb-4">
            {t("needsAttention")}
          </h2>

          {hasAttentionItems ? (
            <Table>
              <THead>
                <TR>
                  <TH>{t("colItem")}</TH>
                  <TH className="w-40">{t("colIssue")}</TH>
                </TR>
              </THead>
              <TBody>
                {varianceRows.map((row) => (
                  <TR key={row.sku} className="interactive">
                    <TD>
                      <Link
                        href={`/${locale}/variance`}
                        className="flex items-center gap-2 focus-visible:outline-none focus-visible:underline"
                        tabIndex={-1}
                      >
                        <span className="font-sans text-[13px] text-ink">
                          {row.name}
                        </span>
                        <span className="font-mono text-[11px] text-faint-warm nums">
                          {row.sku}
                        </span>
                      </Link>
                    </TD>
                    <TD>
                      <Link
                        href={`/${locale}/variance`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1 rounded-[2px]"
                      >
                        <Chip variant="accent" className="font-mono nums">
                          {t("gapChip")} {formatGap(row.gap)}
                        </Chip>
                      </Link>
                    </TD>
                  </TR>
                ))}
                {outOfStockProducts.map((product) => (
                  <TR key={product.id} className="interactive">
                    <TD>
                      <Link
                        href={`/${locale}/inventory`}
                        className="flex items-center gap-2 focus-visible:outline-none focus-visible:underline"
                        tabIndex={-1}
                      >
                        <span className="font-sans text-[13px] text-ink">
                          {product.name}
                        </span>
                        <span className="font-mono text-[11px] text-faint-warm nums">
                          {product.sku}
                        </span>
                      </Link>
                    </TD>
                    <TD>
                      <Link
                        href={`/${locale}/inventory`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1 rounded-[2px]"
                      >
                        <Chip variant="accent" className="font-mono nums">
                          {t("outChip")}
                        </Chip>
                      </Link>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          ) : (
            <p className="font-sans text-[13px] text-muted-warm py-6">
              {t("calm")}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── Inline stat item component ─────────────────────────────────────────── */
function StatItem({
  label,
  value,
  foot,
  feature = false,
}: {
  label: string;
  value: string;
  foot?: string;
  feature?: boolean;
}) {
  return (
    <div
      className={cx(
        "p-4 sm:p-5 flex flex-col gap-2",
        feature
          ? "bg-ember-weak" // ember-weak tint — visual hero, legible at any contrast
          : "bg-paper"
      )}
    >
      <div className="font-sans text-[11px] uppercase tracking-widest text-faint-warm leading-none">
        {label}
      </div>
      <div
        className={cx(
          "font-mono nums text-[34px] leading-none font-normal",
          feature ? "text-ember" : "text-ink"
        )}
      >
        {value}
      </div>
      {foot && (
        <div className="font-sans text-[11px] text-faint-warm leading-snug">
          {foot}
        </div>
      )}
    </div>
  );
}
