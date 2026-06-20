"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon element */
  icon?: React.ReactNode;
}

/**
 * Styled native <input>.
 * - Hairline border, focus transitions to ink border
 * - Placeholder in faint-warm
 * - Supports all native type, aria-* props
 * - Forward ref for form library compatibility
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, icon, ...rest }, ref) {
    if (icon) {
      return (
        <span className="relative inline-flex items-center w-full">
          <span className="pointer-events-none absolute start-3 text-faint-warm">
            {icon}
          </span>
          <input
            ref={ref}
            className={cx(
              "w-full h-9 ps-9 pe-3 py-0",
              "bg-paper text-ink",
              "border border-hairline rounded-sm",
              "font-sans text-sm leading-none",
              "placeholder:text-faint-warm",
              "transition-colors duration-100",
              "focus:outline-none focus:border-ink",
              "focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-0",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className
            )}
            {...rest}
          />
        </span>
      );
    }

    return (
      <input
        ref={ref}
        className={cx(
          "w-full h-9 px-3 py-0",
          "bg-paper text-ink",
          "border border-hairline rounded-sm",
          "font-sans text-sm leading-none",
          "placeholder:text-faint-warm",
          "transition-colors duration-100",
          "focus:outline-none focus:border-ink",
          "focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-0",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          className
        )}
        {...rest}
      />
    );
  }
);
