import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

/**
 * Styled native table elements — hairline dividers, uppercase faint TH.
 *
 * Row hover & interaction:
 *   - TR with data-clickable gets the .interactive Wash hover (via globals.css)
 *     and a first-cell 2px inline nudge on hover (also via globals.css).
 *     Pass `cursor-pointer` on TR if needed, or rely on .interactive.
 *   - TR with data-active stays in Wash (drawer is open for that row).
 *
 * Numeric column convention:
 *   <TD className="nums text-end">  — tabular figures + logical-RTL-safe align
 *   <TH className="text-end">       — align header the same way
 *
 * Sortable TH:
 *   Pass sortable + sortDir + onSort props to TH for a mono ▴/▾ affordance.
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

interface TRProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Enables Wash hover + first-cell nudge via globals.css */
  "data-clickable"?: boolean | string;
  /** Keeps Wash background while its drawer is open */
  "data-active"?: boolean | string;
}

export function TR({ className, ...props }: TRProps) {
  return (
    <tr
      className={cx("align-middle", className)}
      {...props}
    />
  );
}

type SortDir = "asc" | "desc" | null;

interface THProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Adds a mono ▴/▾ sort indicator and click affordance */
  sortable?: boolean;
  sortDir?: SortDir;
  onSort?: () => void;
}

export function TH({
  className,
  sortable,
  sortDir,
  onSort,
  children,
  ...props
}: THProps) {
  const indicator = sortable
    ? sortDir === "asc"
      ? " ▴"
      : sortDir === "desc"
      ? " ▾"
      : " ⬍"
    : null;

  if (sortable) {
    return (
      <th
        className={cx(
          "px-3 py-2 text-start",
          "text-[11px] font-medium uppercase tracking-wide text-[var(--faint)]",
          "font-sans whitespace-nowrap",
          "cursor-pointer select-none",
          "transition-colors duration-[140ms] ease-out hover:text-ink",
          className
        )}
        onClick={onSort}
        aria-sort={
          sortDir === "asc"
            ? "ascending"
            : sortDir === "desc"
            ? "descending"
            : "none"
        }
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {indicator && (
            <span className="font-mono text-[10px]">{indicator}</span>
          )}
        </span>
      </th>
    );
  }

  return (
    <th
      className={cx(
        "px-3 py-2 text-start",
        "text-[11px] font-medium uppercase tracking-wide text-[var(--faint)]",
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
