"use client";
import { useTenant } from "@/lib/tenant-context";
import { Menu } from "@/components/primitives/Menu";
import { cx } from "@/lib/cx";

export function TenantSwitcher() {
  const { tenant, tenants, setTenantId } = useTenant();

  const trigger = (
    <span className="inline-flex items-center gap-2 min-w-0">
      {/* Workspace avatar — first letter, ink bg / paper text */}
      <span
        className={cx(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px]",
          "surface-ink font-mono text-[11px] font-medium"
        )}
        aria-hidden
      >
        {tenant.name.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate font-sans text-[13px] text-ink">
        {tenant.name}
      </span>
    </span>
  );

  const items = tenants.map((t) => ({
    label: t.name,
    active: t.id === tenant.id,
    onSelect: () => setTenantId(t.id),
  }));

  return (
    <Menu
      trigger={trigger}
      items={items}
      align="start"
      className="w-full"
    />
  );
}
