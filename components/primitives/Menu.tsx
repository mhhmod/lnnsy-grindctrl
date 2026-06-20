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
 *   (updated via the popover toggle event)
 * - Popover: role="menu" with role="menuitem" buttons inside
 * - Keyboard: ArrowUp/ArrowDown moves focus between items; Enter/Space activates;
 *   Escape and click-outside close via the Popover API's built-in light-dismiss
 *
 * jsdom guard: showPopover / hidePopover are not implemented in jsdom.
 * We feature-detect HTMLElement.prototype.showPopover before calling it,
 * so tests do not crash. The trigger button still renders correctly in tests.
 *
 * RTL: the popover is positioned below the trigger. Alignment respects the
 * "start"/"end" prop using logical CSS values via JavaScript (inline style).
 */
export function Menu({ trigger, items, align = "end", className }: MenuProps) {
  const id = useId();
  const popoverId = `menu-popover-${id.replace(/:/g, "")}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isExpandedRef = useRef(false);

  /** Call-time feature check (never during render) so SSR and client markup match. */
  function popoverApi() {
    const el = popoverRef.current as unknown as {
      showPopover?: () => void;
      hidePopover?: () => void;
    } | null;
    if (el && typeof el.showPopover === "function") return el;
    return null;
  }

  /** Position the popover beneath the trigger button */
  function positionPopover() {
    if (!triggerRef.current || !popoverRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const el = popoverRef.current;
    el.style.position = "fixed";
    el.style.top = `${rect.bottom + 4}px`;
    el.style.margin = "0";

    if (align === "end") {
      el.style.right = `${window.innerWidth - rect.right}px`;
      el.style.left = "auto";
    } else {
      el.style.left = `${rect.left}px`;
      el.style.right = "auto";
    }
  }

  /** Update aria-expanded when popover toggles */
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
  });

  function handleTriggerClick() {
    const api = popoverApi();
    if (!api) return; // unsupported env (e.g. jsdom) — no-op
    // showPopover() / hidePopover() — light-dismiss and Escape handled by browser
    if (isExpandedRef.current) api.hidePopover!();
    else api.showPopover!();
  }

  function handleItemKeyDown(
    e: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
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
          "hover:bg-wash transition-colors duration-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-1"
        )}
      >
        {trigger}
        <ChevronDown size={14} className="text-faint-warm" />
      </button>

      {/* The popover div — Popover API: light-dismiss + top-layer + Escape built-in */}
      <div
        ref={popoverRef}
        id={popoverId}
        // Always declare the popover attribute so SSR and client markup match.
        // Browsers default [popover] to display:none until shown; unsupported
        // envs (jsdom) simply ignore it. No render-time feature branch.
        popover="auto"
        role="menu"
        aria-label={typeof trigger === "string" ? trigger : "Menu"}
        className={cx(
          "min-w-[180px] p-1",
          "bg-paper border border-hairline rounded-sm",
          "shadow-sm"
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
              "transition-colors duration-100",
              "hover:bg-wash",
              "focus:outline-none focus:bg-wash",
              item.active && "text-ink font-medium"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
