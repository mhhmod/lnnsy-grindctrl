"use client";

import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { TopBar } from "@/components/shell/TopBar";
import { Glyph } from "@/components/brand/Glyph";
import { cn } from "@/lib/utils";

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
    <div className={cn("border p-4", className)}>
      <div className="font-sans text-[11px] uppercase tracking-wide text-faint mb-1">
        {label}
      </div>
      <div className="font-sans text-[14px]">{value}</div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();

  const connections = [
    { key: "shopify", letter: "S", conn: tenant.shopify },
    { key: "bosta", letter: "B", conn: tenant.bosta },
  ] as const;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("settings")} />

      <main className="p-[18px] md:p-7 space-y-8">
        {/* Workspace grid — 2×2 hairline cells */}
        <section>
          <h2 className="font-display text-[13px] uppercase tracking-wide text-muted-foreground mb-3">
            {t("workspace")}
          </h2>
          <div className="grid grid-cols-2 border border-b-0 border-e-0">
            <InfoCell
              label={t("name")}
              value={tenant.name}
              className="border-b border-e"
            />
            <InfoCell
              label={t("plan")}
              value={tenant.plan}
              className="border-b border-e"
            />
            <InfoCell
              label={t("members")}
              value={String(tenant.members)}
              className="border-b border-e"
            />
            <InfoCell
              label={t("region")}
              value={`${tenant.region} · ${tenant.currency}`}
              className="border-b border-e"
            />
          </div>
        </section>

        {/* Connections list */}
        <section>
          <h2 className="font-display text-[13px] uppercase tracking-wide text-muted-foreground mb-3">
            {t("connections")}
          </h2>
          <div className="space-y-px border">
            {connections.map(({ key, letter, conn }) => (
              <div
                key={key}
                className="flex items-center gap-4 border-b last:border-b-0 px-4 py-3"
              >
                <Glyph letter={letter} />
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[13px] font-medium">
                    {conn.name}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground truncate">
                    {conn.account}
                  </div>
                </div>
                {/* Status chip — muted/outline, never colored */}
                <span className="border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("connected")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
