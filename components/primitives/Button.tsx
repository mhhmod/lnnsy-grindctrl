"use client";

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** When provided, renders a Next.js <Link> (i.e. an <a>) instead of <button>. */
  href?: string;
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

/** Shared visual classes for button/link rendering */
function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean | undefined,
  className: string | undefined
) {
  return cx(
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
  );
}

/**
 * Accessible native <button> (or Next.js <Link> when `href` is provided) with variant + size maps.
 * When `href` is set, renders an <a> element — never nests a <button> inside another interactive.
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
      href,
      ...rest
    },
    ref
  ) {
    const classes = buttonClasses(variant, size, disabled, className);

    if (href) {
      // Render as a Next Link (anchor) — safe for navigation, never nested in <a>
      return (
        <Link
          href={href}
          className={classes}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classes}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
