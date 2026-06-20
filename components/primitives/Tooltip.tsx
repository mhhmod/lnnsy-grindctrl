"use client";

import {
  useId,
  useState,
  ReactNode,
  HTMLAttributes,
} from "react";
import { cx } from "@/lib/cx";

interface TooltipProps {
  /** The plain-language tooltip text shown on hover. */
  content: string;
  /** The element that triggers the tooltip on hover/focus. */
  children: (props: {
    "aria-describedby": string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  }) => ReactNode;
  /** Additional className on the tooltip bubble. */
  className?: string;
}

/**
 * Anchored plain-language tooltip.
 *
 * A11y:
 * - role="tooltip" on the tooltip element
 * - aria-describedby on the trigger (linked via shared id)
 * - Shows on hover and keyboard focus; dismisses on leave/blur
 *
 * Motion:
 * - Fades in ~150ms, dismisses instantly on leave
 * - prefers-reduced-motion: no fade, state change only
 *
 * Usage:
 *   <Tooltip content="3 units short — courier marked 5 returned, only 2 reached Bosta.">
 *     {(props) => <button {...props}>hover me</button>}
 *   </Tooltip>
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  function show() { setVisible(true); }
  function hide() { setVisible(false); }

  return (
    <>
      {children({
        "aria-describedby": tooltipId,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      })}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        className={cx(
          "pointer-events-none absolute z-50",
          "px-3 py-2 text-[12px] leading-snug font-sans",
          "bg-ink text-paper rounded-sm",
          "max-w-[240px] whitespace-normal",
          // Fade in transition (reduced-motion handled in globals.css)
          "transition-opacity duration-150 ease-out",
          visible ? "opacity-100" : "opacity-0",
          className
        )}
      >
        {content}
      </span>
    </>
  );
}

/**
 * Simpler wrapper: wraps a single HTMLElement trigger without render props.
 * Useful for inline elements where you can pass className yourself.
 */
interface TooltipWrapProps extends HTMLAttributes<HTMLSpanElement> {
  content: string;
  children: ReactNode;
}

export function TooltipWrap({ content, children, className, ...rest }: TooltipWrapProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={cx("relative inline-block", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      {...rest}
    >
      {children}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        className={cx(
          "pointer-events-none absolute bottom-full mb-1.5 start-0 z-50",
          "px-3 py-2 text-[12px] leading-snug font-sans",
          "bg-ink text-paper rounded-sm",
          "max-w-[240px] whitespace-normal",
          "transition-opacity duration-150 ease-out",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {content}
      </span>
    </span>
  );
}
