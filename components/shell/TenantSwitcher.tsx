"use client";
import { useTenant } from "@/lib/tenant-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function TenantSwitcher() {
  const { tenant, tenants, setTenantId } = useTenant();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 border p-3 text-start">
        <span className="inline-flex h-7 w-7 items-center justify-center bg-foreground font-mono text-[11px] text-background">
          {tenant.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1 truncate font-sans text-[13px]">{tenant.name}</span>
        <span aria-hidden>⌄</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {tenants.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTenantId(t.id)} className="font-sans text-[13px]">
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
