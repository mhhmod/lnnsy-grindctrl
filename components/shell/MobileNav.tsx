"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Brandmark } from "@/components/brand/Brandmark";
import { TenantSwitcher } from "./TenantSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

const ITEMS = ["overview", "orders", "inventory", "variance", "returns", "settings"] as const;

/**
 * Hamburger button (shown md:hidden) that opens an off-canvas nav sheet.
 * RTL-aware: Arabic locales slide in from the right; LTR from the left.
 * Self-contained — holds its own open state to avoid cross-component wiring.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // Arabic is RTL — slide the sheet in from the inline-start (right in RTL, left in LTR).
  // The shadcn Sheet only supports physical "left" | "right" sides, so we pick based on locale.
  const isRtl = locale === "ar";
  const side = isRtl ? "right" : "left";

  return (
    <>
      <button
        className="md:hidden flex items-center justify-center p-2 border hover:bg-accent"
        onClick={() => setOpen(true)}
        aria-label={t("overview")}
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} className="flex flex-col p-0 w-[236px]">
          <SheetHeader className="px-4 pt-5 pb-3 border-b">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Brandmark />
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {ITEMS.map((key) => {
              const href = `/${locale}/${key}`;
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block border px-3 py-2 font-sans text-[13px]",
                    active ? "surface-inverted" : "border-transparent hover:bg-accent"
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-3">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
            <TenantSwitcher />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
