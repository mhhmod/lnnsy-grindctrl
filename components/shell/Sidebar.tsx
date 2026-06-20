"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Brandmark } from "@/components/brand/Brandmark";
import { TenantSwitcher } from "./TenantSwitcher";

const ITEMS = ["overview", "orders", "inventory", "variance", "returns", "settings"] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-[236px] shrink-0 flex-col border-e p-4">
      <div className="px-2 py-3"><Brandmark /></div>
      <nav className="mt-4 flex-1 space-y-1">
        {ITEMS.map((key) => {
          const href = `/${locale}/${key}`;
          const active = pathname === href;
          return (
            <Link key={key} href={href}
              className={cn("block border px-3 py-2 font-sans text-[13px]",
                active ? "surface-inverted" : "border-transparent hover:bg-accent")}>
              {t(key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4"><TenantSwitcher /></div>
    </aside>
  );
}
