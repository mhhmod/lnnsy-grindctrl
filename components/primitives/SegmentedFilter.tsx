"use client";

import { useRef, KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

export interface FilterOption {
  value: string;
  label: string;
  /** Always shown in mono alongside the label. count===0 → faint + disabled. */
  count?: number;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible label for the group */
  label?: string;
  className?: string;
}

/**
 * FilterPills — accessible filter pill group with honest counts.
 *
 * Spec:
 * - Each option shows label + always-visible mono count.
 * - Inactive hover: border + text warm-up Hairline→Ink over ~120ms (count stays put).
 * - Active = inverted (ink bg, paper text).
 * - count===0 → Faint text, disabled (not clickable, not focusable in roving).
 * - role="group" + aria-pressed + arrow-key roving (RTL-aware).
 *
 * Named FilterPills; SegmentedFilter is a backward-compat re-export.
 */
export function FilterPills({
  options,
  value,
  onChange,
  label = "Filter options",
  className,
}: FilterPillsProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  /** All *enabled* buttons (count > 0 or count undefined) */
  function enabledButtons(): HTMLButtonElement[] {
    const buttons = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []
    );
    return buttons.filter((b) => !b.disabled);
  }

  function focusAt(index: number) {
    const buttons = enabledButtons();
    buttons[index]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, currentEnabledIndex: number) {
    const buttons = enabledButtons();
    const count = buttons.length;
    const isRtl = typeof document !== "undefined" && document.dir === "rtl";

    let next: number | null = null;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        next = isRtl
          ? (currentEnabledIndex + 1) % count
          : (currentEnabledIndex - 1 + count) % count;
        break;
      case "ArrowRight":
        e.preventDefault();
        next = isRtl
          ? (currentEnabledIndex - 1 + count) % count
          : (currentEnabledIndex + 1) % count;
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
      const targetOption = options.find(
        (o) => o.value === buttons[next!]?.dataset.value
      );
      if (targetOption) {
        onChange(targetOption.value);
        setTimeout(() => focusAt(next!), 0);
      }
    }
  }

  // Build an index map for enabled buttons for keyboard roving
  const enabledOptionValues = options
    .filter((o) => o.count === undefined || o.count > 0)
    .map((o) => o.value);

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      className={cx("inline-flex items-center flex-wrap gap-1.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        const zeroCount = option.count !== undefined && option.count === 0;
        const enabledIndex = enabledOptionValues.indexOf(option.value);
        const isInTabOrder = active && !zeroCount;

        return (
          <button
            key={option.value}
            type="button"
            role="button"
            aria-pressed={active}
            tabIndex={isInTabOrder ? 0 : zeroCount ? -1 : active ? 0 : -1}
            disabled={zeroCount}
            data-value={option.value}
            onClick={() => !zeroCount && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, enabledIndex)}
            className={cx(
              "inline-flex items-center gap-1.5 px-3 h-8",
              "text-sm font-sans rounded-sm border",
              "transition-colors duration-[140ms] ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-0",
              // Active = inverted
              active && !zeroCount && "bg-ink text-paper border-ink",
              // Inactive, enabled — hover warms border+text
              !active && !zeroCount &&
                "bg-paper text-[var(--muted)] border-hairline hover:border-ink hover:text-ink",
              // Zero count — faint, disabled appearance
              zeroCount &&
                "bg-paper text-[var(--faint)] border-hairline cursor-not-allowed opacity-60"
            )}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cx(
                  "nums text-[11px] leading-none font-mono",
                  active && !zeroCount ? "opacity-80" : "text-[var(--faint)]"
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

/** Backward-compat alias — screens and tests importing SegmentedFilter still work. */
export const SegmentedFilter = FilterPills;
export type SegmentedFilterProps = FilterPillsProps;
