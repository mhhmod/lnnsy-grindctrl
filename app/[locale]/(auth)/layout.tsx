import type { ReactNode } from "react";

/** Auth routes render without the app shell (no sidebar). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      {children}
    </div>
  );
}
