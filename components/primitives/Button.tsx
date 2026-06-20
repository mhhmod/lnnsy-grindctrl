"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantMap: Record<ButtonVariant, string> = {
  /**
   * Primary — solid ink bg / paper text.
   * Hover: opacity ~85% (soft felt-dim). Press: 1px downward settle.
   */
  primary:
    "bg-ink text-paper border border-ink " +
    "hover:opacity-[0.85] active:translate-y-px " +
    "transition-opacity duration-[140ms] ease-out",

  /**
   * Ghost — paper fill / hairline border / ink text.
   * Hover: border → ink; fill stays paper. Calm.
   */
  ghost:
    "bg-paper text-ink border border-hairline " +
    "hover:border-ink " +
    "transition-colors duration-[140ms] ease-out",

  /**
   * Accent — neutralised (was ember; now maps to ink/paper = same as primary).
   * Batch B removes .accent usages; kept here so stray refs compile.
   */
  accent:
    "bg-ink text-paper border border-ink " +
    "hover:opacity-[0.85] active:translate-y-px " +
    "transition-opacity duration-[140ms] ease-out",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

/**
 * Accessible native <button> with variant + size maps.
 * No CVA, no clsx, no external deps.
 * Focus ring uses --ring-warm (= ink color), visible only on keyboard nav.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      type = "button",
      className,
      disabled,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cx(
          // Base
          "inline-flex items-center justify-center font-sans rounded-sm",
          "font-medium leading-none cursor-pointer",
          // Focus ring — ink outline, keyboard nav only
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-1",
          // Disabled
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          variantMap[variant],
          sizeMap[size],
          className
        )}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
