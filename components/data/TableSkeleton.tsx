import { Skeleton } from "@/components/primitives/Skeleton";

interface TableSkeletonProps {
  /** Number of placeholder rows to render. Defaults to 6. */
  rows?: number;
  /** Number of columns per row. Defaults to 4. */
  cols?: number;
}

/**
 * Reusable skeleton loader for data tables.
 * Renders placeholder rows using the hand-rolled Skeleton primitive.
 */
export function TableSkeleton({ rows = 6, cols = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-px border" role="status" aria-label="Loading">
      {/* Header row */}
      <div
        className="grid gap-4 border-b px-4 py-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20 rounded-none" />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 px-4 py-3 border-b last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 rounded-none"
              style={{ width: colIdx === 0 ? "75%" : colIdx === cols - 1 ? "50%" : "60%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
