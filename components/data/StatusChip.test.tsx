import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusChip, StockStatusChip } from "@/components/data/StatusChip";

describe("OrderStatusChip", () => {
  it("inverts on problem statuses", () => {
    render(<OrderStatusChip status="Failed" />);
    // Chip variant="solid" renders bg-ink (the inverted state)
    expect(screen.getByText("Failed")).toHaveClass("bg-ink");
  });
  it("does not invert on normal statuses", () => {
    render(<OrderStatusChip status="Delivered" />);
    // Chip variant="muted" — no bg-ink
    expect(screen.getByText("Delivered")).not.toHaveClass("bg-ink");
  });
});

describe("StockStatusChip", () => {
  it("inverts on Out and Low", () => {
    render(<StockStatusChip inStock={0} />);
    // Chip variant="solid" renders bg-ink (the inverted state)
    expect(screen.getByText("Out")).toHaveClass("bg-ink");
  });
  it("does not invert on OK", () => {
    render(<StockStatusChip inStock={20} />);
    // Chip variant="muted" — no bg-ink
    expect(screen.getByText("OK")).not.toHaveClass("bg-ink");
  });
});
