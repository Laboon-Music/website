import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocHeader, formatEffectiveDate } from "./_shared";

describe("DocHeader", () => {
  it("shows the version and the ISO date in French", () => {
    render(<DocHeader title="T" version="3" effectiveDate="2026-10-22" locale="fr" />);
    expect(
      screen.getByText("Version 3 — en vigueur à compter du 22 octobre 2026"),
    ).toBeInTheDocument();
  });

  it("shows the version and the ISO date in English", () => {
    render(<DocHeader title="T" version="3" effectiveDate="2026-10-22" locale="en" />);
    expect(
      screen.getByText("Version 3 — effective from October 22, 2026"),
    ).toBeInTheDocument();
  });

  it("keeps an already formatted date unchanged", () => {
    expect(formatEffectiveDate("22/10/2026", "fr")).toBe("22/10/2026");
  });

  it("does not shift the day with the time zone", () => {
    expect(formatEffectiveDate("2026-01-01", "fr")).toBe("1 janvier 2026");
  });
});
