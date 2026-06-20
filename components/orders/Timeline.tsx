import { cx } from "@/lib/cx";
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ms-2 border-s border-hairline ps-5">
      {events.map((e, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span
            className={cx(
              "absolute -start-[26px] top-1 h-2 w-2 rounded-full",
              e.problem ? "bg-ink" : "bg-ink opacity-30"
            )}
            aria-hidden
          />
          <div className="font-sans text-[13px] text-ink">{e.label}</div>
          <div className="nums mt-0.5 font-mono text-[11px] text-faint">{e.at}</div>
        </li>
      ))}
    </ol>
  );
}
