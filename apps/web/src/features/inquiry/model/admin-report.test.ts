import { describe, expect, it } from "vitest";

import type { FollowUp } from "@/features/inquiry/data/follow-up-repository";
import type { InquiryStatus } from "@/features/inquiry/data/inquiry-repository";
import {
  filterInquiries,
  groupFollowUps,
  summarizeInquiries,
} from "@/features/inquiry/model/admin-report";

const inquiry = (status: InquiryStatus, property_type: string) => ({
  id: crypto.randomUUID(),
  company: "Example",
  created_at: "2026-09-03T00:00:00Z",
  email: "test@example.com",
  message: "A valid inquiry message",
  name: "Test",
  phone: null,
  property_type,
  status,
  updated_at: "2026-09-03T00:00:00Z",
});

describe("summarizeInquiries", () => {
  it("calculates outcomes without treating legacy Closed as a decision", () => {
    expect(
      summarizeInquiries(
        [
          inquiry("New", "hospitality"),
          inquiry("Won", "hospitality"),
          inquiry("Lost", "multifamily"),
          inquiry("Closed", "senior-living"),
        ],
        new Date("2026-09-05T12:00:00Z"),
      ),
    ).toMatchObject({
      total: 4,
      open: 1,
      won: 1,
      lost: 1,
      legacyClosed: 1,
      conversionRate: 50,
      byPropertyType: {
        hospitality: 2,
        multifamily: 1,
        "senior-living": 1,
      },
    });
  });

  it("filters leads using search and structured filters", () => {
    const leads = [
      { ...inquiry("New", "hospitality"), name: "Alex", company: "North" },
      { ...inquiry("Won", "multifamily"), name: "Sam", company: "South" },
    ];
    expect(
      filterInquiries(leads, {
        propertyType: "hospitality",
        query: "north",
        status: "New",
      }),
    ).toEqual([leads[0]]);
  });
});

describe("groupFollowUps", () => {
  const task = (due_at: string | null, completed_at: string | null = null) =>
    ({
      completed_at,
      created_at: "2026-09-01T00:00:00Z",
      due_at,
      id: crypto.randomUUID(),
      inquiry_id: crypto.randomUUID(),
      notes: null,
      title: "Call lead",
    }) satisfies FollowUp;

  it("groups open and completed tasks by date", () => {
    const groups = groupFollowUps(
      [
        task("2026-09-04"),
        task("2026-09-05"),
        task("2026-09-06"),
        task(null),
        task("2026-09-01", "2026-09-02T00:00:00Z"),
      ],
      "2026-09-05",
    );
    expect(Object.values(groups).map((group) => group.length)).toEqual([
      1, 1, 1, 1, 1,
    ]);
  });
});
