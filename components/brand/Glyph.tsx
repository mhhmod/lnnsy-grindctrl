import { cx } from "@/lib/cx";

export function Glyph({
  letter,
  inverted = false,
}: {
  letter: string;
  inverted?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-9 w-9 items-center justify-center border font-mono text-sm",
        inverted
          ? "surface-inverted border-ink"
          : "bg-paper text-ink border-hairline"
      )}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
