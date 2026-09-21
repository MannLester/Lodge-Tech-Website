import { describe, expect, it, vi } from "vitest";

import {
  createAdminSessionFromUser,
  hasMicrosoftIdentity,
  normalizeAdminEmail,
} from "@/features/admin-auth/model/admin-session";

import type { User, UserIdentity } from "@supabase/supabase-js";

const baseUser = {
  app_metadata: { provider: "azure" },
  email: "Admin@Outlook.com",
  email_confirmed_at: "2026-09-06T00:00:00Z",
  id: "user-123",
  identities: [],
} satisfies Pick<
  User,
  "app_metadata" | "email" | "email_confirmed_at" | "id" | "identities"
>;

describe("admin session", () => {
  it("normalizes allowlist emails", () => {
    expect(normalizeAdminEmail(" Admin@Gmail.COM ")).toBe("admin@gmail.com");
  });

  it("accepts users with a Microsoft provider identity", () => {
    expect(hasMicrosoftIdentity(baseUser)).toBe(true);
    expect(
      hasMicrosoftIdentity({
        app_metadata: {},
        identities: [{ provider: "azure" } as UserIdentity],
      }),
    ).toBe(true);
  });

  it("creates an admin session for verified, allowlisted Microsoft users", async () => {
    const lookup = vi.fn().mockResolvedValue({
      crmUserId: "crm-user-123",
      role: "ADMIN",
    });

    await expect(createAdminSessionFromUser(baseUser, lookup)).resolves.toEqual(
      {
        authMode: "microsoft",
        crmUserId: "crm-user-123",
        email: "admin@outlook.com",
        role: "ADMIN",
        sub: "user-123",
      },
    );
    expect(lookup).toHaveBeenCalledWith("admin@outlook.com", "user-123");
  });

  it("denies users who are not on the allowlist", async () => {
    await expect(
      createAdminSessionFromUser(baseUser, vi.fn().mockResolvedValue(null)),
    ).resolves.toBeNull();
  });

  it("denies unverified or non-Microsoft users before checking the allowlist", async () => {
    const lookup = vi.fn().mockResolvedValue(true);

    await expect(
      createAdminSessionFromUser(
        { ...baseUser, email_confirmed_at: undefined },
        lookup,
      ),
    ).resolves.toBeNull();
    await expect(
      createAdminSessionFromUser(
        { ...baseUser, app_metadata: {}, identities: [] },
        lookup,
      ),
    ).resolves.toBeNull();
    expect(lookup).not.toHaveBeenCalled();
  });
});
