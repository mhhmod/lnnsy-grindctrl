"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "en" ? "ar" : "en";
  const swap = () => router.push(pathname.replace(/^\/(en|ar)/, `/${other}`));
  return (
    <button onClick={swap} className="border px-2 py-1 font-mono text-[11px] uppercase">
      {other}
    </button>
  );
}
