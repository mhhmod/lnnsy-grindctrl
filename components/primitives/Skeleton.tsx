import { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Use className to control width/height, e.g. "w-24 h-4" */
}

/**
 * Skeleton loading placeholder.
 *
 * Shimmer animation is defined in app/globals.css as @keyframes skeleton-shimmer,
 * gated by a @media (prefers-reduced-motion: no-preference) block so motion
 * is never shown when the user prefers reduced motion.
 * Under reduced-motion the div shows a static wash fill instead.
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={cx(
        "rounded-sm bg-wash",
        "skeleton-shimmer",
        className
      )}
      {...rest}
    />
  );
}
