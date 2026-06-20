import { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export type ChipVariant = "muted" | "accent" | "mono";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

const variantMap: Record<ChipVariant, string> = {
  /** Hairline outline, subtle secondary label */
  muted: "border border-hairline text-muted-warm bg-transparent",
  /** Ember outline surface — use only for meaningful signal (problem/gap status) */
  accent: "border border-ember bg-ember-weak text-ember",
  /** Geist Mono, for counts and numeric gap values */
  mono: "border border-hairline text-ink bg-transparent font-mono",
};

/**
 * Chip / badge — spans only (no interactive state).
 * Small uppercase tracking for status labels.
 * Use variant="accent" only when the chip carries problem/gap meaning.
 */
export function Chip({
  variant = "muted",
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center",
        "px-2 py-0.5 text-[11px] leading-none",
        "rounded-sm font-sans tracking-wide uppercase",
        variantMap[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
