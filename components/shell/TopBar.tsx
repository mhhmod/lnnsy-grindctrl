"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function TopBar({ title }: { title: string }) {
  const t = useTranslations("common");
  return (
    <header className="flex items-center justify-between border-b px-4 md:px-7 py-4 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <h1 className="font-display text-[18px] font-semibold truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        <LocaleSwitcher />
        <Button variant="outline" size="sm">{t("export")}</Button>
      </div>
    </header>
  );
}
