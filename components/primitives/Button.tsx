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
  /** ink bg / paper text */
  primary: "bg-ink text-paper border border-ink hover:opacity-90",
  /** transparent + hairline border, hover wash */
  ghost: "bg-transparent text-ink border border-hairline hover:bg-wash",
  /** ember bg / on-ember text */
  accent: "bg-ember text-on-ember border border-ember hover:opacity-90",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

/**
 * Accessible native <button> with variant + size maps.
 * No CVA, no clsx, no external deps.
 * Focus ring uses ring-warm (= ink color), visible only on keyboard nav.
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
          "font-medium leading-none",
          "transition-colors duration-100",
          // Focus ring — visible on keyboard nav only
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1",
          // Disabled
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          // Reduced motion
          "@media (prefers-reduced-motion: reduce) { transition: none }",
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
