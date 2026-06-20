import { TableSkeleton } from "@/components/data/TableSkeleton";

/**
 * Next.js loading UI for the inventory route.
 */
export default function InventoryLoading() {
  return (
    <div className="flex flex-col">
      {/* TopBar placeholder */}
      <div className="border-b px-4 md:px-7 py-4 h-[57px]" aria-hidden />

      <main className="p-[18px] md:p-7 space-y-5">
        {/* Search input placeholder */}
        <div className="h-9 max-w-sm animate-pulse bg-muted rounded-none" />

        {/* Table skeleton — 6 cols: product, in-stock, status, best-seller, slow-moving, stock-age */}
        <div className="overflow-x-auto">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </main>
    </div>
  );
}
