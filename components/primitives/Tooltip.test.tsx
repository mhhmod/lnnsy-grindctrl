import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip, TooltipWrap } from "./Tooltip";

describe("Tooltip (render-prop)", () => {
  it("renders the trigger content", () => {
    render(
      <Tooltip content="3 units short">
        {(props) => <button {...props}>hover me</button>}
      </Tooltip>
    );
    expect(screen.getByRole("button", { name: "hover me" })).toBeInTheDocument();
  });

  it("has role=tooltip on the tooltip element", () => {
    render(
      <Tooltip content="3 units short">
        {(props) => <button {...props}>hover me</button>}
      </Tooltip>
    );
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
  });

  it("tooltip content is rendered", () => {
    render(
      <Tooltip content="3 units short">
        {(props) => <button {...props}>hover me</button>}
      </Tooltip>
    );
    expect(screen.getByText("3 units short")).toBeInTheDocument();
  });

  it("tooltip becomes visible on mouseenter and hidden on mouseleave", () => {
    render(
      <Tooltip content="Variance explanation">
        {(props) => <button {...props}>trigger</button>}
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "trigger" });
    const tooltip = screen.getByRole("tooltip", { hidden: true });

    // Initially hidden
    expect(tooltip).toHaveAttribute("aria-hidden", "true");

    // Show on hover
    fireEvent.mouseEnter(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "false");

    // Hide on leave
    fireEvent.mouseLeave(trigger);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("trigger has aria-describedby pointing to the tooltip id", () => {
    render(
      <Tooltip content="some tip">
        {(props) => <button {...props}>trigger</button>}
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "trigger" });
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
  });
});

describe("TooltipWrap", () => {
  it("renders children and tooltip content", () => {
    render(<TooltipWrap content="tip text">label</TooltipWrap>);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("tip text")).toBeInTheDocument();
  });

  it("has role=tooltip", () => {
    render(<TooltipWrap content="tip text">label</TooltipWrap>);
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
  });

  it("shows tooltip on mouseenter, hides on mouseleave", () => {
    render(<TooltipWrap content="tip text">label</TooltipWrap>);
    const wrapper = screen.getByText("label").closest("span")!;
    const tooltip = screen.getByRole("tooltip", { hidden: true });

    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    fireEvent.mouseEnter(wrapper);
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    fireEvent.mouseLeave(wrapper);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });
});
