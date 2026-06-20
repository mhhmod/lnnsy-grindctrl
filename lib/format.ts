// Always Western digits ("en-US"), even under the ar locale (ledger rule).
export function formatMoney(amount: number): string {
  return `EGP ${new Intl.NumberFormat("en-US").format(amount)}`;
}
export function formatGap(gap: number): string {
  if (gap === 0) return "0";
  const sign = gap < 0 ? "−" : "+"; // U+2212 minus for negatives
  return `${sign}${Math.abs(gap)}`;
}
