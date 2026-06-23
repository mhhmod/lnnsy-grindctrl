"use client";

import { useTranslations } from "next-intl";
import { TopBar } from "@/components/shell/TopBar";
import { Chip } from "@/components/primitives/Chip";
import { Table, TBody, TD, TH, THead, TR } from "@/components/primitives/Table";
import { useTenant } from "@/lib/tenant-context";
import { deriveFinanceDashboard, type FinanceCollectionState } from "@/lib/finance";
import { formatMoney } from "@/lib/format";
import { cx } from "@/lib/cx";

const STATE_KEYS: Record<FinanceCollectionState, string> = {
  captured: "captured",
  collecting: "collecting",
  pending: "pending",
  atRisk: "atRisk",
  reversed: "reversed",
  cancelled: "cancelled",
};

function isProblemState(state: FinanceCollectionState) {
  return state === "atRisk" || state === "reversed" || state === "cancelled";
}

export default function FinancePage() {
  const t = useTranslations("finance");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const dashboard = deriveFinanceDashboard(tenant.orders);
  const { summary, rows } = dashboard;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("finance")} />

      <main className="p-[18px] md:p-7 space-y-8">
        <section className="space-y-1">
          <h2 className="font-display text-[26px] font-semibold leading-tight text-ink">
            {t("title")}
          </h2>
          <p className="max-w-2xl font-sans text-[13px] leading-snug text-muted">
            {t("lead")}
          </p>
        </section>

        <section
          className="grid grid-cols-2 overflow-hidden rounded-[2px] border border-hairline sm:grid-cols-4"
          aria-label={t("summaryLabel")}
        >
          <StatItem
            label={t("collected")}
            value={formatMoney(summary.collected)}
            foot={t("collectedFoot")}
          />
          <StatItem
            label={t("openReceivable")}
            value={formatMoney(summary.openReceivable)}
            foot={t("openReceivableFoot")}
          />
          <StatItem
            label={t("atRisk")}
            value={formatMoney(summary.atRisk)}
            foot={t("atRiskFoot")}
            feature={summary.atRisk > 0}
          />
          <StatItem
            label={t("netPreview")}
            value={formatMoney(summary.netPreview)}
            foot={t("netPreviewFoot", { fees: formatMoney(summary.estimatedFees) })}
          />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-[14px] font-semibold leading-tight text-ink">
                {t("ledgerTitle")}
              </h2>
              <p className="mt-1 max-w-2xl font-sans text-[12px] leading-snug text-muted">
                {t("ledgerLead")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip variant="mono" className="nums">
                {t("paymobGross", { value: formatMoney(summary.paymobGross) })}
              </Chip>
              <Chip variant="mono" className="nums">
                {t("bostaGross", { value: formatMoney(summary.bostaCodGross) })}
              </Chip>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="border border-dashed border-hairline p-8">
              <p className="font-sans text-[13px] text-ink">{t("empty")}</p>
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>{t("order")}</TH>
                  <TH>{t("rail")}</TH>
                  <TH>{t("state")}</TH>
                  <TH className="text-end">{t("gross")}</TH>
                  <TH className="text-end">{t("fees")}</TH>
                  <TH className="text-end">{t("net")}</TH>
                  <TH>{t("payout")}</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((row) => {
                  const problem = isProblemState(row.collectionState);
                  return (
                    <TR
                      key={row.orderId}
                      className={cx("interactive", problem && "surface-inverted")}
                      data-clickable="true"
                    >
                      <TD>
                        <div className="font-mono text-[12px] nums">{row.orderNumber}</div>
                        <div className="mt-0.5 font-sans text-[12px] opacity-70">
                          {row.customer}
                        </div>
                      </TD>
                      <TD>
                        <div className="font-sans text-[13px]">{row.rail}</div>
                        <div className="mt-0.5 font-mono text-[11px] opacity-60 nums">
                          {row.tracking}
                        </div>
                      </TD>
                      <TD>
                        <Chip
                          variant={problem ? "solid" : "muted"}
                          className={problem ? "border-paper bg-transparent text-paper" : undefined}
                        >
                          {t(`stateMap.${STATE_KEYS[row.collectionState]}`)}
                        </Chip>
                      </TD>
                      <TD className="text-end font-mono text-[13px] nums">
                        {formatMoney(row.gross)}
                      </TD>
                      <TD className="text-end font-mono text-[13px] nums">
                        {formatMoney(row.totalFees)}
                      </TD>
                      <TD className="text-end font-mono text-[13px] nums">
                        {formatMoney(row.net)}
                      </TD>
                      <TD>
                        <div className="font-sans text-[13px]">{row.payoutSource}</div>
                        <div className="mt-0.5 font-mono text-[11px] opacity-60 nums">
                          {row.expectedPayoutDate}
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </section>
      </main>
    </div>
  );
}

function StatItem({
  label,
  value,
  foot,
  feature = false,
}: {
  label: string;
  value: string;
  foot: string;
  feature?: boolean;
}) {
  return (
    <div
      className={cx(
        "border-b border-e border-hairline p-4 sm:p-5",
        "even:border-e-0 sm:even:border-e sm:last:border-e-0",
        "sm:border-b-0",
        feature ? "surface-inverted" : "bg-paper"
      )}
    >
      <div
        className={cx(
          "font-sans text-[11px] uppercase tracking-widest leading-none",
          feature ? "text-paper opacity-60" : "text-faint"
        )}
      >
        {label}
      </div>
      <div
        className={cx(
          "mt-2 break-words font-mono text-[24px] leading-tight nums sm:text-[28px]",
          feature ? "text-paper" : "text-ink"
        )}
      >
        {value}
      </div>
      <div
        className={cx(
          "mt-2 font-sans text-[11px] leading-snug",
          feature ? "text-paper opacity-60" : "text-faint"
        )}
      >
        {foot}
      </div>
    </div>
  );
}
