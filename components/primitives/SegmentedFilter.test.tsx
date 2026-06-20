import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedFilter, FilterOption } from "./SegmentedFilter";

const OPTIONS: FilterOption[] = [
  { value: "all", label: "All", count: 12 },
  { value: "active", label: "Active", count: 5 },
  { value: "cancelled", label: "Cancelled", count: 3 },
];

describe("SegmentedFilter", () => {
  it("renders all options with their labels", () => {
    render(
      <SegmentedFilter options={OPTIONS} value="all" onChange={() => {}} />
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders counts when provided", () => {
    render(
      <SegmentedFilter options={OPTIONS} value="all" onChange={() => {}} />
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("marks the active option with aria-pressed=true", () => {
    render(
      <SegmentedFilter options={OPTIONS} value="active" onChange={() => {}} />
    );
    const activeBtn = screen.getByRole("button", { name: /Active/ });
    const allBtn = screen.getByRole("button", { name: /All/ });

    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
    expect(allBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option's value", () => {
    const onChange = vi.fn();
    render(
      <SegmentedFilter options={OPTIONS} value="all" onChange={onChange} />
    );
    fireEvent.click(screen.getByText("Active"));
    expect(onChange).toHaveBeenCalledWith("active");
  });

  it("active button has tabIndex=0, others have tabIndex=-1", () => {
    render(
      <SegmentedFilter options={OPTIONS} value="active" onChange={() => {}} />
    );
    const buttons = screen.getAllByRole("button");
    const activeBtn = buttons.find(
      (b) => b.getAttribute("aria-pressed") === "true"
    );
    const inactiveButtons = buttons.filter(
      (b) => b.getAttribute("aria-pressed") !== "true"
    );

    expect(activeBtn).toHaveAttribute("tabindex", "0");
    inactiveButtons.forEach((b) =>
      expect(b).toHaveAttribute("tabindex", "-1")
    );
  });

  it("uses role=group with the provided aria-label", () => {
    render(
      <SegmentedFilter
        options={OPTIONS}
        value="all"
        onChange={() => {}}
        label="Order status"
      />
    );
    expect(screen.getByRole("group", { name: "Order status" })).toBeInTheDocument();
  });
});
