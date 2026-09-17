import { describe, expect, it } from "vitest";

import {
  adminProfileSchema,
  fallbackAdminAccount,
  getAdminInitials,
  maxAdminAvatarBytes,
} from "@/features/admin-account/model/admin-account";

describe("admin account model", () => {
  it("normalizes editable profile fields and enforces their limits", () => {
    expect(
      adminProfileSchema.parse({
        displayName: "  Taylor Admin  ",
        jobTitle: "  Operations Manager ",
        phone: "  +1 555 0100 ",
      }),
    ).toEqual({
      displayName: "Taylor Admin",
      jobTitle: "Operations Manager",
      phone: "+1 555 0100",
    });

    expect(
      adminProfileSchema.safeParse({
        displayName: "",
        jobTitle: "",
        phone: "",
      }).success,
    ).toBe(false);
  });

  it("provides stable fallback identity details and avatar constraints", () => {
    expect(fallbackAdminAccount("test.user@gmail.com").displayName).toBe(
      "Test User",
    );
    expect(getAdminInitials("Taylor Admin")).toBe("TA");
    expect(maxAdminAvatarBytes).toBe(2_097_152);
  });
});
