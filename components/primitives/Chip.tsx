import { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export type ChipVariant = "muted" | "solid" | "mono" | "accent";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

const variantMap: Record<ChipVariant, string> = {
  /**
   * Muted — hairline outline, muted text.
   * Used for informational labels (e.g. status). Does NOT animate on hover —
   * chips are facts, not controls. Keeping them still reinforces this.
   */
  muted: "border border-hairline text-[var(--muted)] bg-transparent",

  /**
   * Solid — inverted (ink fill, paper text).
   * The primary problem/active signal — e.g. GAP −3, OUT.
   */
  solid: "border border-ink bg-ink text-paper",

  /**
   * Mono — hairline outline, ink text, JetBrains Mono.
   * For counts, numeric gap values.
   */
  mono: "border border-hairline text-ink bg-transparent font-mono",

  /**
   * Accent — neutralised alias for solid (was ember; Batch B purges usages).
   */
  accent: "border border-ink bg-ink text-paper",
};

/**
 * Chip / badge — non-interactive <span>.
 * Small uppercase tracking for status labels.
 * Chips never animate on hover (they are information, not controls).
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
