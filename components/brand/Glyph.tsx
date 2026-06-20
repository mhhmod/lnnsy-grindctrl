import { cn } from "@/lib/utils";
export function Glyph({ letter, inverted = false }: { letter: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex h-9 w-9 items-center justify-center border font-mono text-sm",
      inverted ? "surface-inverted" : "bg-background")}>{letter}</span>
  );
}
