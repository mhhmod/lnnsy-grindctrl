import { TableSkeleton } from "@/components/data/TableSkeleton";

/**
 * Next.js loading UI for the orders route.
 * Shown while OrdersInner suspends (Supabase fetch, hydration, etc.).
 */
export default function OrdersLoading() {
  return (
    <div className="flex flex-col">
      {/* TopBar placeholder — matches the real header height */}
      <div className="border-b px-4 md:px-7 py-4 h-[57px]" aria-hidden />

      <main className="p-[18px] md:p-7 space-y-5">
        {/* Filter strip placeholder */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-16 animate-pulse bg-wash rounded-none" />
          ))}
        </div>

        {/* Table skeleton — 5 cols: order#, customer, status, total, date */}
        <div className="overflow-x-auto">
          <TableSkeleton rows={8} cols={5} />
        </div>
      </main>
    </div>
  );
}
