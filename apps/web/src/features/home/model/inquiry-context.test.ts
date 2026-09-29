import { describe, expect, it } from "vitest";

import { getInquiryPrefill } from "@/features/home/model/inquiry-context";

describe("getInquiryPrefill", () => {
  it("builds editable copy from allowlisted product and intent values", () => {
    expect(getInquiryPrefill("?product=gem-stat-et&intent=demo")).toBe(
      "We would like to request a product demo for GEM Stat™ ET.",
    );
    expect(getInquiryPrefill("?product=dhw-controls&intent=savings")).toBe(
      "We would like to request a savings analysis for GEM Link® Wireless – DHW Controls.",
    );
  });

  it("ignores unknown query values", () => {
    expect(getInquiryPrefill("?product=<script>&intent=demo")).toBe("");
    expect(getInquiryPrefill("?product=gem-stat-et&intent=unknown")).toBe("");
  });
});
