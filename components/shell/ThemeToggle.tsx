"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";

// useSyncExternalStore-based hydration guard: returns true only on client.
// This avoids the react-hooks/set-state-in-effect lint rule while still
// preventing the server/client mismatch that next-themes causes.
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");
  const mounted = useIsMounted();

  // Render a same-size neutral placeholder until mounted to avoid hydration mismatch.
  if (!mounted) {
    return (
      <button
        className="border px-2 py-1 font-mono text-[11px] uppercase"
        aria-label={t("theme")}
        disabled
      >
        <span className="block h-[11px] w-[11px]" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border px-2 py-1 font-mono text-[11px] uppercase"
      aria-label={t("theme")}
    >
      {isDark ? <Sun className="h-[11px] w-[11px]" /> : <Moon className="h-[11px] w-[11px]" />}
    </button>
  );
}
