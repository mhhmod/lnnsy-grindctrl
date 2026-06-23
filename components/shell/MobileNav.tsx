"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cx } from "@/lib/cx";
import { Drawer } from "@/components/primitives/Drawer";
import { TenantSwitcher } from "./TenantSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

const ITEMS = ["overview", "orders", "finance", "inventory", "variance", "returns", "settings"] as const;

/**
 * Hamburger button (shown md:hidden) that opens an off-canvas nav drawer.
 * Uses the new native-<dialog> Drawer primitive — no Radix, no lucide.
 * The native <dialog> provides focus trap, Escape, and ::backdrop scrim.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const activePath = pathname.replace(/\/$/, "");

  return (
    <>
      {/* Hamburger trigger — visible only on mobile */}
      <button
        className={cx(
          "md:hidden flex flex-col items-center justify-center gap-[5px]",
          "h-8 w-8 rounded-sm border border-hairline",
          "text-muted hover:bg-wash hover:text-ink",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-1"
        )}
        onClick={() => setOpen(true)}
        aria-label={t("openNav")}
        aria-expanded={open}
      >
        {/* Three-line hamburger icon */}
        <span className="block h-px w-4 bg-current" />
        <span className="block h-px w-4 bg-current" />
        <span className="block h-px w-4 bg-current" />
      </button>

      {/* Drawer — native <dialog>, no Radix */}
      <Drawer open={open} onOpenChange={setOpen} title="Ledger" closeLabel={t("closeNav")}>
        {/* Nav items fill the body */}
        <nav className="space-y-0.5 -mx-1" aria-label={t("mobileNavLabel")}>
          {ITEMS.map((key) => {
            const href = `/${locale}/${key}`;
            const active = activePath === href;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={cx(
                  "flex items-center px-3 py-2 rounded-[2px]",
                  "font-sans text-[13px] leading-snug",
                  "transition-colors duration-150",
                  active
                    ? "surface-inverted font-medium"
                    : "text-muted hover:bg-wash hover:text-ink",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-1"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="mt-8 pt-4 border-t border-hairline space-y-3">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <TenantSwitcher />
        </div>
      </Drawer>
    </>
  );
}
