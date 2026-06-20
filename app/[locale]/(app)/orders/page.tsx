import { Suspense } from "react";
import { OrdersInner } from "./OrdersInner";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col">
          <div className="border-b px-7 py-4 h-[57px]" />
          <div className="p-[18px] md:p-7 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <OrdersInner />
    </Suspense>
  );
}
