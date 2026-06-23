"use client";

import {
  useRef,
  useId,
  useEffect,
  KeyboardEvent,
  ReactNode,
} from "react";
import { cx } from "@/lib/cx";
import { ChevronDown } from "@/components/icons";

export interface MenuItem {
  label: string;
  onSelect: () => void;
  active?: boolean;
}

interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  /** "start" | "end" — which side of the trigger to align the popover */
  align?: "start" | "end";
  className?: string;
}

/**
 * Dropdown menu using the native Popover API.
 *
 * A11y:
 * - Trigger: <button popovertarget="..."> with aria-haspopup="menu" and aria-expanded
 * - Popover: role="menu" with role="menuitem" buttons inside
 * - Keyboard: ArrowUp/ArrowDown moves focus; Enter/Space activates;
 *   Escape and outside-click close via Popover API light-dismiss
 *
 * Animation: menu content fades + rises ~6px over 150ms on open.
 * Reduced-motion: @starting-style / opacity only, no transform.
 *
 * SSR/client parity: always renders popover="auto" so SSR and hydration match.
 * jsdom guard: showPopover / hidePopover feature-detected before calling.
 */
export function Menu({ trigger, items, align = "end", className }: MenuProps) {
  const id = useId();
  const popoverId = `menu-popover-${id.replace(/:/g, "")}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isExpandedRef = useRef(false);

  function popoverApi() {
    const el = popoverRef.current as unknown as {
      showPopover?: () => void;
      hidePopover?: () => void;
    } | null;
    if (el && typeof el.showPopover === "function") return el;
    return null;
  }

  function positionPopover() {
    if (!triggerRef.current || !popoverRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const el = popoverRef.current;
    const viewportGap = 8;
    el.style.position = "fixed";
    el.style.maxWidth = `calc(100vw - ${viewportGap * 2}px)`;
    el.style.margin = "0";

    const popoverHeight = el.offsetHeight;
    const popoverWidth = el.offsetWidth;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow >= popoverHeight + 4
        ? rect.bottom + 4
        : Math.max(viewportGap, rect.top - popoverHeight - 4);

    el.style.top = `${top}px`;

    // RTL-aware: "end" means the logical inline-end edge.
    // In RTL documents, inline-end is the left side; in LTR it's the right side.
    const isRtl = document.documentElement.dir === "rtl";

    if (align === "end") {
      // Align to the logical inline-end of the trigger.
      if (isRtl) {
        // In RTL, inline-end is physical left: align popover's left to trigger's left.
        el.style.left = `${rect.left}px`;
        el.style.right = "auto";
      } else {
        // In LTR, inline-end is physical right: pin popover's right to trigger's right.
        el.style.right = `${window.innerWidth - rect.right}px`;
        el.style.left = "auto";
      }
    } else {
      // align === "start" — align to the logical inline-start of the trigger.
      if (isRtl) {
        // In RTL, inline-start is physical right.
        el.style.right = `${window.innerWidth - rect.right}px`;
        el.style.left = "auto";
      } else {
        // In LTR, inline-start is physical left.
        el.style.left = `${rect.left}px`;
        el.style.right = "auto";
      }
    }

    const preferredLeft =
      align === "end"
        ? isRtl
          ? rect.left
          : rect.right - popoverWidth
        : isRtl
          ? rect.right - popoverWidth
          : rect.left;
    const left = Math.min(
      Math.max(viewportGap, preferredLeft),
      Math.max(viewportGap, window.innerWidth - popoverWidth - viewportGap)
    );

    el.style.left = `${left}px`;
    el.style.right = "auto";
  }

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    function onToggle(e: Event) {
      const ev = e as ToggleEvent;
      const expanded = ev.newState === "open";
      isExpandedRef.current = expanded;
      if (triggerRef.current) {
        triggerRef.current.setAttribute("aria-expanded", String(expanded));
      }
      if (expanded) positionPopover();
    }

    popover.addEventListener("toggle", onToggle);
    return () => popover.removeEventListener("toggle", onToggle);
  // positionPopover uses only refs (always current) and stable `align` prop.
  // Re-attaching on every render would undo the mount-once intent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const repositionOpenPopover = () => {
      if (isExpandedRef.current) positionPopover();
    };

    window.addEventListener("resize", repositionOpenPopover);
    return () => window.removeEventListener("resize", repositionOpenPopover);
  // positionPopover uses only refs (always current) and stable `align` prop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTriggerClick() {
    const api = popoverApi();
    if (!api) return;
    if (isExpandedRef.current) api.hidePopover!();
    else api.showPopover!();
  }

  function handleItemKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const menuItems = popoverRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]'
    );
    if (!menuItems) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        menuItems[(index + 1) % menuItems.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        menuItems[(index - 1 + menuItems.length) % menuItems.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        menuItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  }

  function handleItemSelect(item: MenuItem) {
    item.onSelect();
    popoverApi()?.hidePopover!();
  }

  return (
    <div className={cx("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls={popoverId}
        onClick={handleTriggerClick}
        className={cx(
          "inline-flex items-center gap-1.5 h-9 px-3",
          "font-sans text-sm text-ink",
          "border border-hairline rounded-sm bg-paper",
          "hover:border-ink transition-colors duration-[140ms] ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-warm)] focus-visible:ring-offset-1"
        )}
      >
        {trigger}
        <ChevronDown size={14} className="text-[var(--faint)]" />
      </button>

      {/* Popover — light-dismiss + top-layer + Escape via browser */}
      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        role="menu"
        aria-label={typeof trigger === "string" ? trigger : "Menu"}
        className={cx(
          "min-w-[180px] p-1",
          "bg-paper border border-hairline rounded-sm",
          "shadow-sm",
          // Fade + rise animation: uses CSS @starting-style where supported.
          // The style block below (in the component's style tag) handles animation.
          "menu-popover"
        )}
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => handleItemSelect(item)}
            onKeyDown={(e) => handleItemKeyDown(e, index)}
            className={cx(
              "flex w-full items-center px-3 h-8",
              "font-sans text-sm text-start rounded-[1px]",
              "transition-colors duration-[140ms] ease-out",
              "hover:bg-wash focus:outline-none focus:bg-wash",
              item.active && "text-ink font-medium"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Inline styles for menu open animation (fade + rise 6px, 150ms) */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .menu-popover:popover-open {
            animation: menu-open 150ms ease-out both;
          }
          @keyframes menu-open {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .menu-popover:popover-open {
            animation: menu-open-reduced 150ms ease-out both;
          }
          @keyframes menu-open-reduced {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
