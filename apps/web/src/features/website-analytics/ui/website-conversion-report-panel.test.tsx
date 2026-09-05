import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
    visitorCounts: new Map(
      allReportIntervals(blueprint).map((item, index) => [item.key, index + 1]),
    ),
  });
}

describe("WebsiteConversionReportPanel", () => {
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
        name: "Website visitors and inquiry submissions by period",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /visitors.*inquiries/i }),
    ).toHaveLength(12);
  });

  it("shows an actionable analytics configuration state", () => {
    const unavailable = report();
    unavailable.availability = "unavailable";
    unavailable.availabilityMessage =
      "Visitor analytics is not configured yet.";
    for (const range of Object.values(unavailable.ranges)) {
      for (const point of range.points) point.visitors = null;
      range.visitors = null;
      range.conversionRate = null;
      range.availablePeriods = 0;
    }

    render(<WebsiteConversionReportPanel report={unavailable} />);
    expect(
      screen.getByText("Visitor analytics is not configured yet."),
    ).toBeInTheDocument();
    expect(screen.getByText("Visitor data unavailable")).toBeInTheDocument();
  });
});
