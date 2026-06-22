import { describe, it, expect } from "vitest";
import { getStatusLabel, getStatusClassName } from "./formatStatus";

describe("getStatusLabel", () => {
  it.each([
    ["UP", "UP"],
    ["DOWN", "DOWN"],
    ["SLOW", "SLOW"],
    ["UNKNOWN", "UNKNOWN"],
  ])("returns '%s' for status '%s'", (status, expected) => {
    expect(getStatusLabel(status)).toBe(expected);
  });

  it("falls back to 'UNKNOWN' for an invalid status", () => {
    expect(getStatusLabel("WAT")).toBe("UNKNOWN");
  });

  it("falls back to 'UNKNOWN' for null", () => {
    expect(getStatusLabel(null)).toBe("UNKNOWN");
  });
});

describe("getStatusClassName", () => {
  it("returns the emerald classes for UP", () => {
    expect(getStatusClassName("UP")).toContain("emerald");
  });

  it("returns the rose classes for DOWN", () => {
    expect(getStatusClassName("DOWN")).toContain("rose");
  });

  it("returns the amber classes for SLOW", () => {
    expect(getStatusClassName("SLOW")).toContain("amber");
  });

  it("returns the slate classes for UNKNOWN", () => {
    expect(getStatusClassName("UNKNOWN")).toContain("slate");
  });

  it("falls back to UNKNOWN classes for an invalid status", () => {
    expect(getStatusClassName("WAT")).toContain("slate");
  });
});
