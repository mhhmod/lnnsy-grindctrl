"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function TopBar({ title }: { title: string }) {
  const t = useTranslations("common");
  return (
    <header className="flex items-center justify-between border-b px-7 py-4">
      <h1 className="font-display text-[18px] font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <Button variant="outline" size="sm">{t("export")}</Button>
      </div>
    </header>
  );
}
