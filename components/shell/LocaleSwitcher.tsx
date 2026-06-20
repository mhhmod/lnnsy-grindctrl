"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { cx } from "@/lib/cx";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "en" ? "ar" : "en";
  const swap = () => router.push(pathname.replace(/^\/(en|ar)/, `/${other}`));
  return (
    <button
      onClick={swap}
      className={cx(
        "h-8 px-3 rounded-sm",
        "font-mono text-[11px] uppercase tracking-widest",
        "border border-hairline text-muted-warm",
        "hover:bg-wash hover:text-ink",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1"
      )}
    >
      {other}
    </button>
  );
}
