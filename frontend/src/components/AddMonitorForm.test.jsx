import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AddMonitorForm from "./AddMonitorForm";

describe("AddMonitorForm", () => {
  it("shows required errors when submitted empty", () => {
    const onSubmit = vi.fn();
    render(<AddMonitorForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Add monitor" }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("URL is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a URL without an HTTP protocol", () => {
    render(<AddMonitorForm onSubmit={vi.fn()} isLoading={false} />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "My site" },
    });
    fireEvent.change(screen.getByPlaceholderText("https://example.com"), {
      target: { value: "example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add monitor" }));

    expect(
      screen.getByText("URL must start with http:// or https://")
    ).toBeInTheDocument();
  });

  it("submits trimmed values and clears the form", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AddMonitorForm onSubmit={onSubmit} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText("Name");
    const urlInput = screen.getByPlaceholderText("https://example.com");

    fireEvent.change(nameInput, { target: { value: "  My site  " } });
    fireEvent.change(urlInput, {
      target: { value: "  https://example.com  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add monitor" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "My site",
        url: "https://example.com",
      })
    );
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(urlInput).toHaveValue("");
    });
  });

  it("disables the button while a monitor is being added", () => {
    render(<AddMonitorForm onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole("button", { name: "Adding..." })).toBeDisabled();
  });
});
