import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MonitorCard from "./MonitorCard";

const monitor = {
  id: 7,
  name: "Example",
  url: "https://example.com",
  status: "UP",
  lastStatusCode: 200,
  lastResponseTimeMs: 125,
  lastCheckedAt: "2026-01-15T09:00:00.000Z",
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <MonitorCard
        monitor={monitor}
        onRunCheck={vi.fn()}
        onDelete={vi.fn()}
        runningCheckId={null}
        {...props}
      />
    </MemoryRouter>
  );

describe("MonitorCard", () => {
  it("renders monitor details and the details link", () => {
    renderCard();

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("Status code: 200")).toBeInTheDocument();
    expect(screen.getByText("Response: 125 ms")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/monitors/7"
    );
  });

  it("forwards run and delete actions with the monitor id", () => {
    const onRunCheck = vi.fn();
    const onDelete = vi.fn();
    renderCard({ onRunCheck, onDelete });

    fireEvent.click(screen.getByRole("button", { name: "Run check" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onRunCheck).toHaveBeenCalledWith(7);
    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it("disables the run button while this monitor is running", () => {
    renderCard({ runningCheckId: 7 });

    expect(screen.getByRole("button", { name: "Running..." })).toBeDisabled();
  });

  it("shows fallbacks when no previous check exists", () => {
    renderCard({
      monitor: {
        ...monitor,
        status: "UNKNOWN",
        lastStatusCode: null,
        lastResponseTimeMs: null,
        lastCheckedAt: null,
      },
    });

    expect(screen.getByText("Status code: -")).toBeInTheDocument();
    expect(screen.getByText("Response: - ms")).toBeInTheDocument();
    expect(screen.getByText("Last check: Never")).toBeInTheDocument();
  });
});
