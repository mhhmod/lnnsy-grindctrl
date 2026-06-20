import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
