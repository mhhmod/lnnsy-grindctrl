import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ms-2 border-s ps-5">
      {events.map((e, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span className={cn("absolute -start-[26px] top-1 h-2 w-2 rounded-full",
            "bg-foreground")} aria-hidden />
          <div className="font-sans text-[13px]">{e.label}</div>
          <div className="nums mt-0.5 font-mono text-[11px] text-faint">{e.at}</div>
        </li>
      ))}
    </ol>
  );
}
