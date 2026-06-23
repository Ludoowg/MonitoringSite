import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the UP label with the right color", () => {
    render(<StatusBadge status="UP" />);
    const badge = screen.getByText("UP");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("emerald");
  });

  it("renders the DOWN label with the right color", () => {
    render(<StatusBadge status="DOWN" />);
    const badge = screen.getByText("DOWN");
    expect(badge.className).toContain("rose");
  });

  it("renders the SLOW label with the right color", () => {
    render(<StatusBadge status="SLOW" />);
    const badge = screen.getByText("SLOW");
    expect(badge.className).toContain("amber");
  });

  it("falls back to UNKNOWN when the status is invalid", () => {
    render(<StatusBadge status="WAT" />);
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
  });
});
