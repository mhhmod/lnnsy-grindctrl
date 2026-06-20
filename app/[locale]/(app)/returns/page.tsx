"use client";

import { useTranslations } from "next-intl";
import { TopBar } from "@/components/shell/TopBar";
import { GlyphB } from "@/components/icons";

export default function ReturnsPage() {
  const t = useTranslations("returns");
  const tNav = useTranslations("nav");

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("returns")} />
      <main className="p-[18px] md:p-7">
        {/* Dashed-border empty panel — an invitation, not a dead end */}
        <div
          className="flex flex-col items-center justify-center border border-dashed border-hairline p-12 text-center"
          role="status"
          aria-label={t("emptyTitle")}
        >
          <span className="mb-4 text-faint" aria-hidden="true">
            <GlyphB size={32} />
          </span>
          <h2 className="font-display text-[15px] font-semibold text-ink">
            {t("emptyTitle")}
          </h2>
          <p className="mt-2 max-w-xs font-sans text-[13px] text-muted2 leading-relaxed">
            {t("emptyBody")}
          </p>
        </div>
      </main>
    </div>
  );
}
