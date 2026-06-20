import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

/**
 * Styled native table elements — hairline dividers, faint uppercase TH.
 *
 * Convention for numeric columns:
 *   <TD className="nums text-end">  — apply .nums (tabular figures) + text-end (logical RTL-safe)
 *   <TH className="text-end">       — align header the same way
 *
 * TR accepts className for `.interactive` (hover cursor) or `.surface-accent` (ember bg for problem rows).
 */

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cx(
          "w-full border-collapse font-sans text-sm text-ink",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cx("border-b border-hairline", className)}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cx("divide-y divide-hairline", className)}
      {...props}
    />
  );
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cx("align-middle", className)}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cx(
        "px-3 py-2 text-start",
        "text-[11px] font-medium uppercase tracking-wide text-faint-warm",
        "font-sans whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cx(
        "px-3 py-2.5 text-start text-sm leading-snug",
        className
      )}
      {...props}
    />
  );
}
