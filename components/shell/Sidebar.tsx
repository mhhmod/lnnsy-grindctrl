"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cx } from "@/lib/cx";
import { Brandmark } from "@/components/brand/Brandmark";
import { TenantSwitcher } from "./TenantSwitcher";

const ITEMS = ["overview", "orders", "finance", "inventory", "variance", "returns", "settings"] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const activePath = pathname.replace(/\/$/, "");
  return (
    <aside
      className={cx(
        "flex h-full w-[236px] shrink-0 flex-col",
        "border-e border-hairline bg-paper",
        "px-3 py-4"
      )}
    >
      {/* Brandmark */}
      <div className="px-2 py-3 mb-2">
        <Brandmark />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5" aria-label={t("sidebarLabel")}>
        {ITEMS.map((key) => {
          const href = `/${locale}/${key}`;
          const active = activePath === href;
          return (
            <Link
              key={key}
              href={href}
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

      {/* Hairline divider */}
      <div className="my-3 border-t border-hairline" />

      {/* Tenant switcher pinned at bottom */}
      <div>
        <TenantSwitcher />
      </div>
    </aside>
  );
}
