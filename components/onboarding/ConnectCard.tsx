"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Glyph } from "@/components/brand/Glyph";

export function ConnectCard({ letter, name, desc, connected, onConnect, connectLabel, connectedLabel }: {
  letter: string; name: string; desc: string; connected: boolean;
  onConnect: () => void; connectLabel: string; connectedLabel: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 border p-4", connected && "surface-inverted")}>
      <Glyph letter={letter} inverted={connected} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-[14px] font-semibold">{name}</div>
        <div className={cn("font-sans text-[12px]", connected ? "opacity-80" : "text-muted-foreground")}>{desc}</div>
      </div>
      {connected
        ? <span className="font-mono text-[11px] tracking-wide">{connectedLabel}</span>
        : <Button size="sm" onClick={onConnect}>{connectLabel}</Button>}
    </div>
  );
}
