import { describe, it, expect } from "vitest";
import axiosClient from "./axiosClient";

describe("axiosClient", () => {
  it("has a configured baseURL", () => {
    expect(axiosClient.defaults.baseURL).toBeDefined();
    expect(typeof axiosClient.defaults.baseURL).toBe("string");
  });

  it("has a 10s timeout", () => {
    expect(axiosClient.defaults.timeout).toBe(10000);
  });

  it("has a response interceptor registered", () => {
    expect(axiosClient.interceptors.response.handlers.length).toBeGreaterThan(0);
  });
});

describe("axiosClient response error interceptor", () => {
  const getErrorInterceptor = () =>
    axiosClient.interceptors.response.handlers[0].rejected;

  it("extracts the message from error.response.data.error.message", async () => {
    const errorInterceptor = getErrorInterceptor();
    const incomingError = {
      response: { data: { error: { message: "Validation failed" } } },
      message: "Request failed",
    };

    await expect(errorInterceptor(incomingError)).rejects.toThrow(
      "Validation failed"
    );
  });

  it("falls back to error.response.data.message", async () => {
    const errorInterceptor = getErrorInterceptor();
    const incomingError = {
      response: { data: { message: "Something broke" } },
      message: "Request failed",
    };

    await expect(errorInterceptor(incomingError)).rejects.toThrow(
      "Something broke"
    );
  });

  it("falls back to error.message", async () => {
    const errorInterceptor = getErrorInterceptor();
    const incomingError = { message: "Network Error" };

    await expect(errorInterceptor(incomingError)).rejects.toThrow(
      "Network Error"
    );
  });

  it("falls back to 'Unexpected error' when nothing is available", async () => {
    const errorInterceptor = getErrorInterceptor();

    await expect(errorInterceptor({})).rejects.toThrow("Unexpected error");
  });
});
