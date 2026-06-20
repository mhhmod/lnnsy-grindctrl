"use client";

import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { TopBar } from "@/components/shell/TopBar";
import { Glyph } from "@/components/brand/Glyph";
import { Chip } from "@/components/primitives/Chip";
import { cx } from "@/lib/cx";

function InfoCell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cx("border-hairline p-4", className)}>
      <div className="font-sans text-[11px] uppercase tracking-wide text-faint mb-1">
        {label}
      </div>
      <div className="font-sans text-[14px] text-ink">{value}</div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();

  const connections = [
    { key: "shopify", letter: "S", conn: tenant.shopify },
    { key: "bosta",   letter: "B", conn: tenant.bosta  },
  ] as const;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("settings")} />

      <main className="p-[18px] md:p-7 space-y-8">
        {/* Workspace grid — 2×2 hairline cells */}
        <section>
          <h2 className="font-sans text-[11px] uppercase tracking-wide text-faint mb-3">
            {t("workspace")}
          </h2>
          {/* Outer border: start + top only; cells supply bottom + end */}
          <div className="grid grid-cols-2 border border-hairline border-b-0 border-e-0">
            <InfoCell
              label={t("name")}
              value={tenant.name}
              className="border-b border-e border-hairline"
            />
            <InfoCell
              label={t("plan")}
              value={tenant.plan}
              className="border-b border-e border-hairline"
            />
            <InfoCell
              label={t("members")}
              value={String(tenant.members)}
              className="border-b border-e border-hairline"
            />
            <InfoCell
              label={t("region")}
              value={`${tenant.region} · ${tenant.currency}`}
              className="border-b border-e border-hairline"
            />
          </div>
        </section>

        {/* Connections list */}
        <section>
          <h2 className="font-sans text-[11px] uppercase tracking-wide text-faint mb-3">
            {t("connections")}
          </h2>
          <div className="border border-hairline divide-y divide-hairline">
            {connections.map(({ key, letter, conn }) => (
              <div
                key={key}
                className="flex items-center gap-4 px-4 py-3"
              >
                <Glyph letter={letter} />
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[13px] font-medium text-ink">
                    {conn.name}
                  </div>
                  <div className="font-mono text-[11px] text-muted2 truncate">
                    {conn.account}
                  </div>
                </div>
                {/* Status chip — muted outline, a calm fact, never colored */}
                <Chip variant="muted">{t("connected")}</Chip>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
