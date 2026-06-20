export function Brandmark({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-4 w-4 bg-foreground" aria-hidden />
      {withWordmark && <span className="font-display text-[15px] font-semibold tracking-tight">Ledger</span>}
    </span>
  );
}
