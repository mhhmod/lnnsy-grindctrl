"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { Tenant } from "@/lib/types";
import { getTenants, DEFAULT_TENANT_ID } from "@/lib/seed";

interface TenantCtx { tenant: Tenant; tenants: Tenant[]; setTenantId: (id: string) => void; }
const Ctx = createContext<TenantCtx | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const tenants = getTenants();
  const [tenantId, setTenantId] = useState(DEFAULT_TENANT_ID);
  const tenant = useMemo(() => tenants.find((t) => t.id === tenantId) ?? tenants[0], [tenants, tenantId]);
  const value = useMemo(() => ({ tenant, tenants, setTenantId }), [tenant, tenants]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTenant(): TenantCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
