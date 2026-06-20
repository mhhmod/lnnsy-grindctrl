import type { Tenant } from "@/lib/types";
import { acme } from "./tenant-acme";
import { nile } from "./tenant-nile";

export const TENANTS: Tenant[] = [acme, nile];
export const DEFAULT_TENANT_ID = acme.id;

export function getTenants(): Tenant[] { return TENANTS; }
export function getTenant(id: string): Tenant {
  return TENANTS.find((t) => t.id === id) ?? acme;
}
