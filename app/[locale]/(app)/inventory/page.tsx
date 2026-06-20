"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useTenant } from "@/lib/tenant-context";
import { stockStatus } from "@/lib/stock";
import { TopBar } from "@/components/shell/TopBar";
import { Table, THead, TBody, TR, TH, TD } from "@/components/primitives/Table";
import { Input } from "@/components/primitives/Input";
import { StockStatusChip } from "@/components/data/StatusChip";
import { Button } from "@/components/primitives/Button";
import { cx } from "@/lib/cx";

/** Escape regex special chars for safe substring matching */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Highlight matched substring in text; returns array of React nodes */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const pattern = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function InventoryPage() {
  const t = useTranslations("inventory");
  const tNav = useTranslations("nav");
  const { tenant } = useTenant();
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  // Filter: case-insensitive, partial, trimmed; matches name OR SKU
  const filtered = useMemo(() => {
    const base = [...tenant.products].sort((a, b) => a.inStock - b.inStock); // lowest stock first
    if (!query) return base;
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );
  }, [tenant.products, query]);

  function clearSearch() {
    setSearch("");
  }

  return (
    <div className="flex flex-col">
      <TopBar title={tNav("inventory")} />

      <main className="p-[18px] md:p-7 space-y-5">
        {/* Search row */}
        <div className="max-w-sm">
          <Input
            variant="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={clearSearch}
            aria-label={t("searchPlaceholder")}
          />
        </div>

        {/* Empty state: no search match */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-3 border border-dashed border-hairline p-8">
            <p className="font-sans text-[13px] text-ink">
              {t("noMatch", { query: search.trim() })}
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              {t("clearSearch")}
            </Button>
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>{t("product")}</TH>
                <TH className="text-end">{t("inStock")}</TH>
                <TH>{t("status")}</TH>
                {/* Phase-2 disabled columns — greyed headers with SOON tag */}
                <TH className="opacity-50">
                  {t("bestSeller")}
                  <span className="ms-1.5 inline-flex items-center font-mono text-[9px] border border-current px-1 py-px leading-none">
                    {t("soon")}
                  </span>
                </TH>
                <TH className="opacity-50">
                  {t("slowMoving")}
                  <span className="ms-1.5 inline-flex items-center font-mono text-[9px] border border-current px-1 py-px leading-none">
                    {t("soon")}
                  </span>
                </TH>
                <TH className="opacity-50">
                  {t("stockAge")}
                  <span className="ms-1.5 inline-flex items-center font-mono text-[9px] border border-current px-1 py-px leading-none">
                    {t("soon")}
                  </span>
                </TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((product) => {
                const status = stockStatus(product.inStock);
                const problem = status !== "OK";
                return (
                  <TR
                    key={product.id}
                    className={cx(
                      // Wash hover on rows (no nudge — rows aren't clickable)
                      "transition-colors duration-[140ms] ease-out hover:bg-wash",
                      problem && "surface-inverted"
                    )}
                  >
                    <TD>
                      <div className="font-sans text-[13px] leading-snug">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--faint)] mt-0.5">
                        {highlightMatch(product.sku, query)}
                      </div>
                    </TD>
                    <TD className="nums font-mono text-[13px] text-end">
                      {product.inStock}
                    </TD>
                    <TD>
                      <StockStatusChip inStock={product.inStock} />
                    </TD>
                    {/* Phase-2 disabled cells */}
                    <TD className="font-mono text-[13px] text-[var(--faint)]">
                      —
                    </TD>
                    <TD className="font-mono text-[13px] text-[var(--faint)]">
                      —
                    </TD>
                    <TD className="font-mono text-[13px] text-[var(--faint)]">
                      —
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </main>
    </div>
  );
}
