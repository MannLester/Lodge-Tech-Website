import { describe, expect, it, vi } from "vitest";

import {
  createAdminSessionFromUser,
  hasGoogleIdentity,
  normalizeAdminEmail,
} from "@/features/admin-auth/model/admin-session";

import type { User, UserIdentity } from "@supabase/supabase-js";

const baseUser = {
  app_metadata: { provider: "google" },
  email: "Admin@Gmail.com",
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

  it("accepts users with a Google provider identity", () => {
    expect(hasGoogleIdentity(baseUser)).toBe(true);
    expect(
      hasGoogleIdentity({
        app_metadata: {},
        identities: [{ provider: "google" } as UserIdentity],
      }),
    ).toBe(true);
  });

  it("creates an admin session for verified, allowlisted Google users", async () => {
    const lookup = vi.fn().mockResolvedValue(true);

    await expect(createAdminSessionFromUser(baseUser, lookup)).resolves.toEqual(
      {
        authMode: "google",
        email: "admin@gmail.com",
        role: "admin",
        sub: "user-123",
      },
    );
    expect(lookup).toHaveBeenCalledWith("admin@gmail.com");
  });

  it("denies users who are not on the allowlist", async () => {
    await expect(
      createAdminSessionFromUser(baseUser, vi.fn().mockResolvedValue(false)),
    ).resolves.toBeNull();
  });

  it("denies unverified or non-Google users before checking the allowlist", async () => {
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
