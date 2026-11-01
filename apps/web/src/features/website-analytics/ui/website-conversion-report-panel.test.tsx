import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  buildWebsiteConversionReport,
  createReportBlueprint,
  allReportIntervals,
} from "@/features/website-analytics/model/conversion-report";
import { WebsiteConversionReportPanel } from "@/features/website-analytics/ui/website-conversion-report-panel";

function report() {
  const now = new Date("2026-03-09T16:00:00Z");
  const blueprint = createReportBlueprint(now);
  return buildWebsiteConversionReport({
    blueprint,
    inquiries: [],
    now,
    sessionCounts: new Map(
      allReportIntervals(blueprint).map((item, index) => [item.key, index + 1]),
    ),
  });
}

describe("WebsiteConversionReportPanel", () => {
  afterEach(cleanup);
  it("connects a single recorded day to a labeled visual zero without altering report data", () => {
    const now = new Date("2026-11-01T16:00:00Z");
    const blueprint = createReportBlueprint(now);
    const last = blueprint.ranges.daily.at(-1)!;
    const single = buildWebsiteConversionReport({
      blueprint,
      inquiries: [],
      now,
      sessionCounts: new Map([[last.key, 5]]),
    });
    render(<WebsiteConversionReportPanel report={single} />);
    expect(
      screen
        .getByLabelText("Visual zero starting baseline connector")
        .getAttribute("d"),
    ).toMatch(/^M .* L /);
    expect(screen.getByText("0 baseline")).toBeInTheDocument();
    expect(screen.getByText("5 sessions")).toBeInTheDocument();
    expect(single.ranges.daily.points.at(-2)?.sessions).toBeNull();
    expect(single.ranges.daily.sessions).toBe(5);
  });
  it("uses only measured trend lines once multiple periods are available", () => {
    render(<WebsiteConversionReportPanel report={report()} />);
    expect(
      screen.queryByLabelText("Visual zero starting baseline connector"),
    ).not.toBeInTheDocument();
  });
  it("switches reporting ranges and exposes every chart point accessibly", () => {
    render(<WebsiteConversionReportPanel report={report()} />);

    expect(screen.getByRole("tab", { name: "Daily" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Weekly" }));
    expect(screen.getByRole("tab", { name: "Weekly" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("table", {
        name: "Website sessions and inquiry submissions by period",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /sessions.*inquiries/i }),
    ).toHaveLength(12);
  });

  it("shows an actionable analytics configuration state", () => {
    const unavailable = report();
    unavailable.availability = "unavailable";
    unavailable.availabilityMessage =
      "Session analytics is not configured yet.";
    for (const range of Object.values(unavailable.ranges)) {
      for (const point of range.points) point.sessions = null;
      range.sessions = null;
      range.conversionRate = null;
      range.availablePeriods = 0;
    }

    render(<WebsiteConversionReportPanel report={unavailable} />);
    expect(
      screen.getByText("Session analytics is not configured yet."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Session data unavailable/)).toBeInTheDocument();
  });
});
