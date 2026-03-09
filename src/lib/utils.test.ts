import { describe, it, expect } from "vitest";
import { cn, formatDate } from "./utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("returns empty string with no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats ISO date for Spanish locale", () => {
    expect(formatDate("2024-03-15", "es")).toBe("15/03/2024");
  });

  it("formats ISO date for English locale (mm/dd/yyyy)", () => {
    expect(formatDate("2024-03-15", "en")).toBe("03/15/2024");
  });

  it("formats ISO date for French locale (dd/mm/yyyy)", () => {
    expect(formatDate("2024-03-15", "fr")).toBe("15/03/2024");
  });

  it("handles dd/mm/yyyy input for Spanish", () => {
    expect(formatDate("15/03/2024", "es")).toBe("15/03/2024");
  });

  it("handles dd/mm/yyyy input for English (swaps to mm/dd)", () => {
    expect(formatDate("15/03/2024", "en")).toBe("03/15/2024");
  });

  it("returns unrecognized format as-is", () => {
    expect(formatDate("March 15, 2024", "es")).toBe("March 15, 2024");
  });
});
