"use client";

import { useTranslations } from "next-intl";
import { TopBar } from "@/components/shell/TopBar";
import { EmptyState } from "@/components/data/EmptyState";

export default function ReturnsPage() {
  const t = useTranslations("returns");
  const tNav = useTranslations("nav");

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("returns")} />
      <main className="p-[18px] md:p-7">
        <EmptyState
          title={t("emptyTitle")}
          body={t("emptyBody")}
        />
      </main>
    </div>
  );
}
