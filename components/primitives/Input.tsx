"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Close, Search as SearchIcon } from "@/components/icons";

type InputVariant = "default" | "search";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon element (used for non-search variant) */
  icon?: React.ReactNode;
  /** "search" renders a Search icon prefix + inline × clear button */
  variant?: InputVariant;
  /** Called when the × clear button is clicked (search variant only) */
  onClear?: () => void;
}

const baseClasses = cx(
  "w-full h-9 py-0",
  "bg-paper text-ink",
  "border border-hairline rounded-sm",
  "font-sans text-sm leading-none",
  "placeholder:text-[var(--faint)]",
  "transition-colors duration-[140ms] ease-out",
  "focus:outline-none focus:border-ink",
  "focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-0",
  "disabled:opacity-40 disabled:cursor-not-allowed"
);

/**
 * Styled native <input>.
 * - Hairline border → ink on focus (140ms ease-out)
 * - Faint placeholder
 * - variant="search": Search icon prefix + inline × clear button (calls onClear)
 * - icon prop: arbitrary leading icon for non-search variant
 * - Forward ref for form library compatibility
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, icon, variant = "default", onClear, value, onChange, ...rest }, ref) {
    // For the search variant the × button always calls onClear instantly.
    const showClear = variant === "search" && value !== undefined && value !== "";

    if (variant === "search") {
      return (
        <span className="relative inline-flex items-center w-full">
          {/* Search icon prefix */}
          <span className="pointer-events-none absolute start-3 text-[var(--faint)]">
            <SearchIcon size={14} />
          </span>
          <input
            ref={ref}
            value={value}
            onChange={onChange}
            className={cx(
              baseClasses,
              "ps-9",
              showClear ? "pe-8" : "pe-3",
              className
            )}
            {...rest}
          />
          {/* Clear (×) button — only when there is a value */}
          {showClear && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={onClear}
              className={cx(
                "absolute end-2 flex h-5 w-5 items-center justify-center rounded-sm",
                "text-[var(--faint)] hover:text-ink",
                "transition-colors duration-[140ms] ease-out",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-warm)]"
              )}
            >
              <Close size={12} />
            </button>
          )}
        </span>
      );
    }

    if (icon) {
      return (
        <span className="relative inline-flex items-center w-full">
          <span className="pointer-events-none absolute start-3 text-[var(--faint)]">
            {icon}
          </span>
          <input
            ref={ref}
            value={value}
            onChange={onChange}
            className={cx(baseClasses, "ps-9 pe-3", className)}
            {...rest}
          />
        </span>
      );
    }

    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        className={cx(baseClasses, "px-3", className)}
        {...rest}
      />
    );
  }
);
