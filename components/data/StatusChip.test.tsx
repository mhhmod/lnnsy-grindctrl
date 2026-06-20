import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusChip, StockStatusChip } from "@/components/data/StatusChip";

describe("OrderStatusChip", () => {
  it("inverts on problem statuses", () => {
    render(<OrderStatusChip status="Failed" />);
    expect(screen.getByText("Failed")).toHaveClass("surface-inverted");
  });
  it("does not invert on normal statuses", () => {
    render(<OrderStatusChip status="Delivered" />);
    expect(screen.getByText("Delivered")).not.toHaveClass("surface-inverted");
  });
});

describe("StockStatusChip", () => {
  it("inverts on Out and Low", () => {
    render(<StockStatusChip inStock={0} />);
    expect(screen.getByText("Out")).toHaveClass("surface-inverted");
  });
  it("does not invert on OK", () => {
    render(<StockStatusChip inStock={20} />);
    expect(screen.getByText("OK")).not.toHaveClass("surface-inverted");
  });
});
