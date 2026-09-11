import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CheckHistoryTable from "./CheckHistoryTable";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import PageHeader from "./PageHeader";
import RecentChecksTable from "./RecentChecksTable";
import StatCard from "./StatCard";

describe("presentation components", () => {
  it("renders page headings, statistics, and state messages", () => {
    const { rerender } = render(
      <PageHeader
        title="Dashboard"
        subtitle="Monitoring overview"
        action={<button>Refresh</button>}
      />
    );
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Monitoring overview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();

    rerender(<StatCard label="UP" value={4} />);
    expect(screen.getByText("UP")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    rerender(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    rerender(<ErrorState />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();

    rerender(<EmptyState />);
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders recent checks including fallback values", () => {
    render(
      <RecentChecksTable
        checks={[
          {
            id: 1,
            status: "UP",
            statusCode: 200,
            responseTimeMs: 80,
            checkedAt: "2026-01-15T09:00:00.000Z",
            monitor: { name: "Example" },
          },
          {
            id: 2,
            status: "DOWN",
            statusCode: null,
            responseTimeMs: null,
            checkedAt: null,
          },
        ]}
      />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Unknown monitor")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("80 ms")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("- ms")).toBeInTheDocument();
  });

  it("renders detailed check history and errors", () => {
    render(
      <CheckHistoryTable
        checks={[
          {
            id: 3,
            status: "DOWN",
            statusCode: 503,
            responseTimeMs: 900,
            errorMessage: "Service unavailable",
            checkedAt: "2026-01-15T09:00:00.000Z",
          },
        ]}
      />
    );

    expect(screen.getByText("DOWN")).toBeInTheDocument();
    expect(screen.getByText("503")).toBeInTheDocument();
    expect(screen.getByText("900 ms")).toBeInTheDocument();
    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
  });
});
