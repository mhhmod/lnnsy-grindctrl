"use client";

import { cx } from "@/lib/cx";
import { Button } from "@/components/primitives/Button";
import { Chip } from "@/components/primitives/Chip";
import { Glyph } from "@/components/brand/Glyph";

export function ConnectCard({
  letter,
  name,
  desc,
  connected,
  onConnect,
  connectLabel,
  connectedLabel,
}: {
  letter: string;
  name: string;
  desc: string;
  connected: boolean;
  onConnect: () => void;
  connectLabel: string;
  connectedLabel: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center gap-4 border border-hairline p-4 transition-colors duration-[200ms]",
        connected ? "surface-inverted" : "bg-paper"
      )}
    >
      <Glyph letter={letter} inverted={connected} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-[14px] font-semibold">{name}</div>
        <div
          className={cx(
            "font-sans text-[12px]",
            connected ? "opacity-70" : "text-muted2"
          )}
        >
          {desc}
        </div>
      </div>
      {connected ? (
        <Chip variant="muted">{connectedLabel}</Chip>
      ) : (
        <Button size="sm" onClick={onConnect}>
          {connectLabel}
        </Button>
      )}
    </div>
  );
}
