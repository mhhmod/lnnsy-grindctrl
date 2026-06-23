"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslations } from "next-intl";
import { Sun, Moon } from "@/components/icons";
import { cx } from "@/lib/cx";

// useSyncExternalStore-based hydration guard: returns true only on client.
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
        className={cx(
          "flex h-8 w-8 items-center justify-center rounded-sm",
          "border border-hairline text-muted-warm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1"
        )}
        aria-label={t("theme")}
        disabled
      >
        <span className="block h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cx(
        "flex h-8 w-8 items-center justify-center rounded-sm",
        "border border-hairline text-muted-warm",
        "hover:bg-wash hover:text-ink",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1"
      )}
      aria-label={t("theme")}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
