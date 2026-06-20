"use client";
import { useTranslations } from "next-intl";
import { cx } from "@/lib/cx";
import { Button } from "@/components/primitives/Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function TopBar({ title }: { title: string }) {
  const t = useTranslations("common");
  return (
    <header
      className={cx(
        "flex items-center justify-between",
        "border-b border-hairline bg-paper",
        "px-4 md:px-7 py-4 gap-3"
      )}
    >
      {/* Left: hamburger (mobile) + screen title */}
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <h1 className="font-display text-[22px] font-semibold leading-tight text-ink truncate">
          {title}
        </h1>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        <LocaleSwitcher />
        <Button variant="ghost" size="sm">
          {t("export")}
        </Button>
      </div>
    </header>
  );
}
