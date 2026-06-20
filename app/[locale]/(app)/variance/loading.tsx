import { Skeleton } from "@/components/primitives/Skeleton";

/**
 * Next.js loading UI for the variance route.
 * Variance uses a custom measure-track layout (not a standard table),
 * so this skeleton mirrors the product-name + measure bar + figures structure.
 */
export default function VarianceLoading() {
  return (
    <div className="flex flex-col">
      {/* TopBar placeholder */}
      <div className="border-b px-4 md:px-7 py-4 h-[57px]" aria-hidden />

      <main className="p-[18px] md:p-7 space-y-6">
        {/* Legend placeholder */}
        <Skeleton className="h-4 max-w-xl rounded-none" />

        {/* Column header placeholder */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr_auto] gap-x-6 px-4 py-2 border-b">
          <Skeleton className="h-3 w-16 rounded-none" />
          <Skeleton className="h-3 w-20 rounded-none" />
          <Skeleton className="h-3 w-16 rounded-none" />
        </div>

        {/* Row placeholders */}
        <div className="space-y-px border" role="status" aria-label="Loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-x-6 gap-y-3 px-4 py-3 border-b last:border-b-0"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/3 rounded-none" />
              </div>
              <Skeleton className="h-4 w-full rounded-none self-center" />
              <div className="flex gap-4 justify-end">
                <Skeleton className="h-4 w-10 rounded-none" />
                <Skeleton className="h-4 w-10 rounded-none" />
                <Skeleton className="h-4 w-10 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
