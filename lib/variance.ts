import type { VarianceInput, VarianceRow } from "@/lib/types";

export function computeVarianceRow(input: VarianceInput): VarianceRow {
  return { ...input, gap: input.atBosta - input.expected };
}

export function computeVariance(inputs: VarianceInput[]): VarianceRow[] {
  return inputs.map(computeVarianceRow);
}

/** Non-zero gaps first (largest magnitude first), then zero-gap rows. */
export function sortVariance(rows: VarianceRow[]): VarianceRow[] {
  return [...rows].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
}
