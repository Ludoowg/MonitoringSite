import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("returns 'Never' when the value is null", () => {
    expect(formatDate(null)).toBe("Never");
  });

  it("returns 'Never' when the value is undefined", () => {
    expect(formatDate(undefined)).toBe("Never");
  });

  it("returns 'Never' when the value is an empty string", () => {
    expect(formatDate("")).toBe("Never");
  });

  it("formats a valid ISO string in fr-FR locale", () => {
    const result = formatDate("2026-06-18T14:30:00.000Z");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it("formats a Date object", () => {
    const date = new Date("2026-01-15T09:00:00.000Z");
    const result = formatDate(date.toISOString());
    expect(result).toContain("15/01/2026");
  });
});
