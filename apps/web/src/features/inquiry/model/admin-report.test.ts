import { describe, expect, it } from "vitest";

import { summarizeInquiries } from "@/features/inquiry/model/admin-report";

const inquiry = (
  status: "New" | "Contacted" | "Closed",
  property_type: string,
) => ({
  id: crypto.randomUUID(),
  company: "Example",
  created_at: "2026-09-03",
  email: "test@example.com",
  message: "A valid inquiry message",
  name: "Test",
  phone: null,
  property_type,
  status,
  updated_at: "2026-09-03",
});

describe("summarizeInquiries", () => {
  it("calculates totals and property distribution", () => {
    expect(
      summarizeInquiries([
        inquiry("New", "hospitality"),
        inquiry("Closed", "hospitality"),
        inquiry("Contacted", "multifamily"),
      ]),
    ).toEqual({
      total: 3,
      open: 2,
      closed: 1,
      byPropertyType: { hospitality: 2, multifamily: 1 },
    });
  });
});
