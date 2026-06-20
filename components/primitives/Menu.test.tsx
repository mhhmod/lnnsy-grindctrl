/**
 * Menu.test.tsx
 *
 * jsdom does NOT implement the Popover API (HTMLElement.prototype.showPopover).
 * The Menu component feature-detects `showPopover` before calling it, so no
 * crash occurs. The popover <div> renders with `hidden` class in jsdom
 * (because supportsPopover=false), but trigger + items are still queryable.
 *
 * We test: trigger attributes, items rendering, onSelect called on click.
 * We do NOT test the popover open/close visual state (that requires a real browser).
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Menu, MenuItem } from "./Menu";

const ITEMS: MenuItem[] = [
  { label: "Option A", onSelect: vi.fn() },
  { label: "Option B", onSelect: vi.fn(), active: true },
];

describe("Menu", () => {
  it("renders the trigger button", () => {
    render(<Menu trigger="Open menu" items={ITEMS} />);
    expect(screen.getByRole("button", { name: /Open menu/ })).toBeInTheDocument();
  });

  it("trigger has aria-haspopup=menu", () => {
    render(<Menu trigger="Open menu" items={ITEMS} />);
    const trigger = screen.getByRole("button", { name: /Open menu/ });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  });

  it("trigger has aria-expanded=false initially", () => {
    render(<Menu trigger="Open menu" items={ITEMS} />);
    const trigger = screen.getByRole("button", { name: /Open menu/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders all menu item labels", () => {
    render(<Menu trigger="Open menu" items={ITEMS} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("calls onSelect when a menu item is clicked", () => {
    const onSelectA = vi.fn();
    const onSelectB = vi.fn();
    const testItems: MenuItem[] = [
      { label: "Option A", onSelect: onSelectA },
      { label: "Option B", onSelect: onSelectB },
    ];
    render(<Menu trigger="Open menu" items={testItems} />);

    // Items are in the DOM even in jsdom (popover div is hidden via class, but the buttons exist)
    fireEvent.click(screen.getByText("Option A"));
    expect(onSelectA).toHaveBeenCalledTimes(1);
    expect(onSelectB).not.toHaveBeenCalled();
  });

  it("items have role=menuitem", () => {
    render(<Menu trigger="Open menu" items={ITEMS} />);
    // The popover container is hidden from the accessibility tree in jsdom
    // (popover="auto" makes the element inaccessible until opened).
    // Query with hidden:true so we can still assert the role attribute is present.
    const menuItems = screen.getAllByRole("menuitem", { hidden: true });
    expect(menuItems).toHaveLength(2);
  });
});
