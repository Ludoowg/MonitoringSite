import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosClient from "./axiosClient";
import { getLatestChecks } from "./checkApi";
import { getHealth } from "./healthApi";
import {
  createMonitor,
  deleteMonitor,
  getMonitorById,
  getMonitorChecks,
  getMonitors,
  runMonitorCheck,
  updateMonitor,
} from "./monitorApi";

vi.mock("./axiosClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("API modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches monitors and returns response data", async () => {
    const monitors = [{ id: 1, name: "Example" }];
    axiosClient.get.mockResolvedValue({ data: monitors });

    await expect(getMonitors()).resolves.toEqual(monitors);
    expect(axiosClient.get).toHaveBeenCalledWith("/monitors");
  });

  it("fetches one monitor and its checks", async () => {
    axiosClient.get
      .mockResolvedValueOnce({ data: { id: 3 } })
      .mockResolvedValueOnce({ data: [{ id: 9 }] });

    await expect(getMonitorById(3)).resolves.toEqual({ id: 3 });
    await expect(getMonitorChecks(3)).resolves.toEqual([{ id: 9 }]);
    expect(axiosClient.get).toHaveBeenNthCalledWith(1, "/monitors/3");
    expect(axiosClient.get).toHaveBeenNthCalledWith(2, "/monitors/3/checks");
  });

  it("creates and updates a monitor", async () => {
    const payload = { name: "Example", url: "https://example.com" };
    axiosClient.post.mockResolvedValue({ data: { id: 1, ...payload } });
    axiosClient.patch.mockResolvedValue({
      data: { id: 1, ...payload, name: "Updated" },
    });

    await expect(createMonitor(payload)).resolves.toMatchObject(payload);
    await expect(updateMonitor(1, { name: "Updated" })).resolves.toMatchObject({
      name: "Updated",
    });
    expect(axiosClient.post).toHaveBeenCalledWith("/monitors", payload);
    expect(axiosClient.patch).toHaveBeenCalledWith("/monitors/1", {
      name: "Updated",
    });
  });

  it("deletes a monitor and runs a check", async () => {
    axiosClient.delete.mockResolvedValue({ data: { deleted: true } });
    axiosClient.post.mockResolvedValue({ data: { status: "UP" } });

    await expect(deleteMonitor(4)).resolves.toEqual({ deleted: true });
    await expect(runMonitorCheck(4)).resolves.toEqual({ status: "UP" });
    expect(axiosClient.delete).toHaveBeenCalledWith("/monitors/4");
    expect(axiosClient.post).toHaveBeenCalledWith("/monitors/4/check");
  });

  it("fetches latest checks and API health", async () => {
    axiosClient.get
      .mockResolvedValueOnce({ data: [{ id: 2, status: "UP" }] })
      .mockResolvedValueOnce({ data: { status: "ok" } });

    await expect(getLatestChecks()).resolves.toEqual([{ id: 2, status: "UP" }]);
    await expect(getHealth()).resolves.toEqual({ status: "ok" });
    expect(axiosClient.get).toHaveBeenNthCalledWith(1, "/checks");
    expect(axiosClient.get).toHaveBeenNthCalledWith(2, "/health");
  });
});
