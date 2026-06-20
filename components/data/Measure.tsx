import { cn } from "@/lib/utils";

export interface MeasureGeometry {
  expectedPct: number; atBostaPct: number;
  gapStartPct: number; gapWidthPct: number; solid: boolean;
}
export function measureGeometry(args: { expected: number; atBosta: number; scaleMax: number }): MeasureGeometry {
  const { expected, atBosta } = args;
  const scaleMax = Math.max(args.scaleMax, 1);
  const pct = (n: number) => (Math.max(0, n) / scaleMax) * 100;
  const lo = Math.min(expected, atBosta);
  const gap = atBosta - expected;
  return {
    expectedPct: pct(expected),
    atBostaPct: pct(atBosta),
    gapStartPct: pct(lo),
    gapWidthPct: pct(Math.abs(gap)),
    solid: gap < 0, // missing units render solid; extra renders faded
  };
}

/** Visual track. `scaleMax` must be shared across all rows (passed by the screen). */
export function Measure({ expected, atBosta, scaleMax, inverted = false }: {
  expected: number; atBosta: number; scaleMax: number; inverted?: boolean;
}) {
  const g = measureGeometry({ expected, atBosta, scaleMax });
  return (
    <div className="relative h-6 w-full" aria-hidden>
      {/* baseline track */}
      <div className={cn("absolute inset-x-0 top-1/2 h-px -translate-y-1/2",
        inverted ? "bg-background/40" : "bg-border")} />
      {/* gap block */}
      <div
        className={cn("absolute top-1/2 h-3 -translate-y-1/2",
          inverted ? "bg-background" : "bg-foreground", !g.solid && "opacity-30")}
        style={{ insetInlineStart: `${g.gapStartPct}%`, width: `${g.gapWidthPct}%` }}
      />
      {/* expected tick */}
      <div className={cn("absolute top-1/2 h-4 w-px -translate-y-1/2",
        inverted ? "bg-background" : "bg-foreground")}
        style={{ insetInlineStart: `${g.expectedPct}%` }} />
      {/* at-Bosta tick */}
      <div className={cn("absolute top-1/2 h-4 w-px -translate-y-1/2",
        inverted ? "bg-background" : "bg-foreground")}
        style={{ insetInlineStart: `${g.atBostaPct}%` }} />
    </div>
  );
}
