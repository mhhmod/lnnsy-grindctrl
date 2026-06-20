"use client";

import { useRef, KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SegmentedFilterProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible label for the group */
  label?: string;
  className?: string;
}

/**
 * Accessible segmented control for status / category filters.
 *
 * A11y model:
 * - role="group" with aria-label on the container
 * - Each option is a <button> with aria-pressed={active}
 * - Roving tabindex: only the active button is in the tab order (tabIndex=0),
 *   all others tabIndex=-1. Arrow keys (Left/Right, Home/End) move focus
 *   between buttons and trigger onChange.
 * - RTL-aware: uses logical index arithmetic — ArrowLeft decrements visually
 *   left-to-right, but the DOM order is always LTR (RTL is handled by
 *   document.dir flip: in RTL, ArrowLeft moves to next index, ArrowRight to prev).
 */
export function SegmentedFilter({
  options,
  value,
  onChange,
  label = "Filter options",
  className,
}: SegmentedFilterProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  function focusAt(index: number) {
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (buttons && buttons[index]) {
      buttons[index].focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const count = options.length;
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";

    let next: number | null = null;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        next = isRtl
          ? (currentIndex + 1) % count
          : (currentIndex - 1 + count) % count;
        break;
      case "ArrowRight":
        e.preventDefault();
        next = isRtl
          ? (currentIndex - 1 + count) % count
          : (currentIndex + 1) % count;
        break;
      case "Home":
        e.preventDefault();
        next = 0;
        break;
      case "End":
        e.preventDefault();
        next = count - 1;
        break;
    }

    if (next !== null) {
      onChange(options[next].value);
      // Focus moves on next render after value update; use setTimeout to let
      // React re-render first so the tabIndex attributes update.
      setTimeout(() => focusAt(next!), 0);
    }
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      className={cx(
        "inline-flex items-center gap-0.5 p-0.5",
        "rounded-sm border border-hairline bg-wash",
        className
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="button"
            aria-pressed={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cx(
              "inline-flex items-center gap-1.5 px-3 h-7",
              "text-sm font-sans rounded-[1px]",
              "transition-colors duration-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-0",
              active
                ? "surface-ink font-medium"
                : "text-muted-warm hover:text-ink hover:bg-paper"
            )}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cx(
                  "nums text-[11px] leading-none",
                  active ? "opacity-80" : "text-faint-warm"
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
