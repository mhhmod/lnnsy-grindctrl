import { cx } from "@/lib/cx";

export function StatCard({ label, value, foot, feature = false }: {
  label: string; value: string; foot?: string; feature?: boolean;
}) {
  return (
    <div className={cx("border p-4 sm:p-5", feature && "surface-inverted")}>
      <div className="font-sans text-[11px] uppercase tracking-wide text-muted2">{label}</div>
      <div className="nums mt-2 font-mono text-[30px] leading-none">{value}</div>
      {foot && <div className="mt-2 font-sans text-[12px] text-faint">{foot}</div>}
    </div>
  );
}
