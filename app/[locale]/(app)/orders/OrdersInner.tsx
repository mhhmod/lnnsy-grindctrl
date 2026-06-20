"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { filterByStatus, isProblemStatus } from "@/lib/orders";
import type { StatusFilter } from "@/lib/orders";
import { formatMoney } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/types";
import type { Order } from "@/lib/types";
import { cx } from "@/lib/cx";
import { TopBar } from "@/components/shell/TopBar";
import { FilterPills } from "@/components/primitives/SegmentedFilter";
import type { FilterOption } from "@/components/primitives/SegmentedFilter";
import { Input } from "@/components/primitives/Input";
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "@/components/primitives/Table";
import { OrderStatusChip } from "@/components/data/StatusChip";
import { OrderDrawer } from "@/components/orders/OrderDrawer";

const ALL_FILTERS: StatusFilter[] = ["All", ...ORDER_STATUSES];
const SESSION_KEY = "orders.filter";

/** Escape user input so it can safely be embedded in a RegExp. */
function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Bold-highlight the first match of `query` inside `text`.
 * Returns a ReactNode array: [before, <strong>match</strong>, after].
 * Safe: input is escaped before use in RegExp.
 */
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const re = new RegExp(`(${escapeRe(query)})`, "i");
  const parts = text.split(re);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    re.test(part) ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export function OrdersInner() {
  const t = useTranslations("orders");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL params ──────────────────────────────────────────────────────────────
  const orderParam = searchParams.get("order");

  // ── Active filter (session-persisted) ──────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState<StatusFilter>(() => {
    try {
      const saved = typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(SESSION_KEY)
        : null;
      if (saved && (ALL_FILTERS as string[]).includes(saved)) {
        return saved as StatusFilter;
      }
    } catch {
      // sessionStorage blocked (SSR or private mode)
    }
    return "All";
  });

  // ── Search query ────────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");

  // ── Cross-fade key — changes when filter or query changes ──────────────────
  const fadeKey = `${activeFilter}|${query}`;

  // ── Selected order (from URL) ───────────────────────────────────────────────
  const selectedOrder: Order | null =
    orderParam
      ? tenant.orders.find((o) => o.id === orderParam) ?? null
      : null;

  // ── Persist filter to sessionStorage ───────────────────────────────────────
  const handleFilterChange = useCallback((f: string) => {
    const next = f as StatusFilter;
    setActiveFilter(next);
    try {
      sessionStorage.setItem(SESSION_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────
  /** Counts computed from the FULL unfiltered list (honest counts). */
  const countsMap = useMemo(() => {
    const map: Record<string, number> = {};
    map["All"] = tenant.orders.length;
    for (const s of ORDER_STATUSES) {
      map[s] = tenant.orders.filter((o) => o.status === s).length;
    }
    return map;
  }, [tenant.orders]);

  /** Filter options with honest counts. */
  const filterOptions: FilterOption[] = ALL_FILTERS.map((f) => ({
    value: f,
    label: f === "All" ? t("all") : f,
    count: countsMap[f],
  }));

  /** Orders after status filter, then search, then newest-first sort. */
  const visibleOrders = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const afterFilter = filterByStatus(tenant.orders, activeFilter);
    const afterSearch = trimmed
      ? afterFilter.filter(
          (o) =>
            o.number.toLowerCase().includes(trimmed) ||
            o.customer.toLowerCase().includes(trimmed)
        )
      : afterFilter;
    // Newest-first (ISO date sort, descending)
    return [...afterSearch].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
  }, [tenant.orders, activeFilter, query]);

  // ── URL helpers ─────────────────────────────────────────────────────────────
  function openOrder(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", id);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function closeDrawer(open: boolean) {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("order");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  // ── Empty state helpers ─────────────────────────────────────────────────────
  const isFiltered = activeFilter !== "All";
  const hasQuery = query.trim().length > 0;
  const isEmpty = visibleOrders.length === 0;

  // ── Result count string ─────────────────────────────────────────────────────
  const totalCount = tenant.orders.length;
  const shownCount = visibleOrders.length;

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("orders")} />

      <main className="p-[18px] md:p-7 space-y-5">

        {/* ── Filter + search row ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterPills
            options={filterOptions}
            value={activeFilter}
            onChange={handleFilterChange}
            label={t("filterLabel")}
          />
          <div className="ms-auto w-full sm:w-64">
            <Input
              variant="search"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              aria-label={t("searchPlaceholder")}
            />
          </div>
        </div>

        {/* ── Result count ────────────────────────────────────────────────────── */}
        <div className="font-mono nums text-[11px] text-faint">
          {t("resultCount", { shown: shownCount, total: totalCount })}
        </div>

        {/* ── Table or empty state ─────────────────────────────────────────────── */}
        {isEmpty ? (
          <div className="py-10 text-center space-y-3">
            <p className="font-sans text-[14px] text-ink">
              {hasQuery && isFiltered
                ? t("emptySearch", {
                    status: activeFilter,
                    query: query.trim(),
                  })
                : hasQuery
                ? t("emptySearch", {
                    status: t("all"),
                    query: query.trim(),
                  })
                : t("emptyFilter", { status: activeFilter === "All" ? t("all") : activeFilter })}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={cx(
                    "font-sans text-[13px] text-ink underline underline-offset-2",
                    "hover:opacity-70 transition-opacity duration-[140ms] ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)]"
                  )}
                >
                  {t("clearSearch")}
                </button>
              )}
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => handleFilterChange("All")}
                  className={cx(
                    "font-sans text-[13px] text-ink underline underline-offset-2",
                    "hover:opacity-70 transition-opacity duration-[140ms] ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)]"
                  )}
                >
                  {t("showAll")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>{t("orderNumber")}</TH>
                <TH>{t("customer")}</TH>
                <TH>{t("status")}</TH>
                <TH className="text-end">{t("total")}</TH>
                <TH>{t("date")}</TH>
              </TR>
            </THead>
            {/* key triggers React remount → CSS xfade transition kicks in */}
            <TBody key={fadeKey} className="xfade xfade-in">
              {visibleOrders.map((order) => {
                const active = order.id === orderParam;
                const trimmedQ = query.trim();
                return (
                  <TR
                    key={order.id}
                    data-clickable="true"
                    data-active={active ? "true" : undefined}
                    className={cx(
                      "cursor-pointer",
                      isProblemStatus(order.status) && "surface-inverted"
                    )}
                    onClick={() => openOrder(order.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openOrder(order.id);
                      }
                    }}
                    role="button"
                    aria-pressed={active}
                  >
                    <TD className="nums font-mono text-[13px]">
                      {highlight(order.number, trimmedQ)}
                    </TD>
                    <TD className="font-sans text-[13px]">
                      {highlight(order.customer, trimmedQ)}
                    </TD>
                    <TD>
                      <OrderStatusChip status={order.status} />
                    </TD>
                    <TD className="nums font-mono text-[13px] text-end">
                      {formatMoney(order.total)}
                    </TD>
                    <TD className="nums font-mono text-[11px] text-faint">
                      {order.date.slice(0, 10)}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </main>

      <OrderDrawer order={selectedOrder} onOpenChange={closeDrawer} />
    </div>
  );
}
