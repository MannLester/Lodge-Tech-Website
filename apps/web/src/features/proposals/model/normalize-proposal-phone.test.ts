import { describe, expect, it } from "vitest";

import { normalizeProposalPhone } from "./normalize-proposal-phone";

describe("normalizeProposalPhone", () => {
  it("removes an autofilled NANP country code", () => {
    expect(normalizeProposalPhone("+1 (540) 555-0123")).toBe("(540) 555-0123");
    expect(normalizeProposalPhone("1-540-555-0123")).toBe("540-555-0123");
  });

  it("preserves domestic input and international country codes", () => {
    expect(normalizeProposalPhone("540-555-0123")).toBe("540-555-0123");
    expect(normalizeProposalPhone("+886 (2) 5550-1234")).toBe(
      "+886 (2) 5550-1234",
    );
  });
});
