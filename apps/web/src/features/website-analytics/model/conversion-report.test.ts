import { describe, expect, it } from "vitest";

import type { Inquiry } from "@/features/inquiry";
import {
  allReportIntervals,
  buildWebsiteConversionReport,
  createReportBlueprint,
  easternMidnight,
  percentageChange,
} from "@/features/website-analytics/model/conversion-report";

const inquiry = (created_at: string): Inquiry => ({
  company: "Example",
  created_at,
  email: "lead@example.com",
  id: crypto.randomUUID(),
  message: "Please contact me about the property.",
  name: "Test Lead",
  phone: null,
  property_type: "hospitality",
  status: "New",
  updated_at: created_at,
});

describe("website conversion reporting", () => {
  it("uses Eastern calendar boundaries across daylight-saving changes", () => {
    expect(
      easternMidnight({ year: 2026, month: 3, day: 7 }).toISOString(),
    ).toBe("2026-03-07T05:00:00.000Z");
    expect(
      easternMidnight({ year: 2026, month: 3, day: 9 }).toISOString(),
    ).toBe("2026-03-09T04:00:00.000Z");

    const blueprint = createReportBlueprint(new Date("2026-03-09T16:00:00Z"));
    expect(blueprint.ranges.daily).toHaveLength(14);
    expect(blueprint.ranges.weekly).toHaveLength(12);
    expect(blueprint.ranges.monthly).toHaveLength(12);
    expect(blueprint.ranges.weekly.at(-1)).toMatchObject({
      start: "2026-03-09T04:00:00.000Z",
      end: "2026-03-16T04:00:00.000Z",
    });
  });

  it("combines visitor counts and successful submissions without treating missing traffic as zero", () => {
    const now = new Date("2026-03-09T16:00:00Z");
    const blueprint = createReportBlueprint(now);
    const visitorCounts = new Map<string, number | null>(
      allReportIntervals(blueprint).map((item) => [item.key, 100]),
    );
    const today = blueprint.ranges.daily.at(-1)!;
    const yesterday = blueprint.ranges.daily.at(-2)!;
    visitorCounts.set(today.key, null);
    visitorCounts.set(yesterday.key, 50);

    const report = buildWebsiteConversionReport({
      blueprint,
      inquiries: [
        inquiry("2026-03-08T16:00:00Z"),
        inquiry("2026-03-09T12:00:00Z"),
      ],
      now,
      visitorCounts,
    });

    expect(report.availability).toBe("partial");
    expect(report.ranges.daily.points.at(-1)).toMatchObject({
      visitors: null,
      inquiries: 1,
      conversionRate: null,
    });
    expect(report.ranges.daily.points.at(-2)).toMatchObject({
      visitors: 50,
      inquiries: 1,
      conversionRate: 2,
    });
    expect(report.ranges.daily.availablePeriods).toBe(13);
  });

  it("calculates count changes and handles a zero baseline", () => {
    expect(percentageChange(15, 10)).toEqual({ direction: "up", value: 50 });
    expect(percentageChange(5, 10)).toEqual({ direction: "down", value: 50 });
    expect(percentageChange(1, 0)).toEqual({ direction: "new", value: null });
    expect(percentageChange(0, 0)).toEqual({ direction: "flat", value: 0 });
  });
});
