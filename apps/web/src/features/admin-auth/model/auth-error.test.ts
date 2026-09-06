import { describe, expect, it } from "vitest";

import { readAdminAuthErrorReason } from "@/features/admin-auth/model/auth-error";

describe("readAdminAuthErrorReason", () => {
  it.each(["exchange_failed", "missing_code"] as const)(
    "accepts the safe %s reason",
    (reason) => {
      expect(readAdminAuthErrorReason(reason)).toBe(reason);
    },
  );

  it("does not expose unknown callback values", () => {
    expect(readAdminAuthErrorReason("provider-secret")).toBeNull();
    expect(readAdminAuthErrorReason(undefined)).toBeNull();
  });
});
