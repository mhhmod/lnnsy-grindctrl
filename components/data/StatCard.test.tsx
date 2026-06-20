import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/data/StatCard";

describe("StatCard", () => {
  it("renders label, value, footnote", () => {
    render(<StatCard label="Orders today" value="12" foot="across all channels" />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Orders today")).toBeInTheDocument();
  });
  it("feature variant inverts", () => {
    const { container } = render(<StatCard label="Unexplained units" value="5" feature />);
    expect(container.firstChild).toHaveClass("surface-inverted");
  });
});
