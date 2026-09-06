import { describe, expect, it } from "vitest";

import { getOptionalPublicEnv, publicEnvSchema } from "./public";

describe("publicEnvSchema", () => {
  function restoreEnv(name: string, value: string | undefined) {
    if (value === undefined) {
      delete process.env[name];
      return;
    }

    process.env[name] = value;
  }

  it("accepts an absolute site URL", () => {
    expect(
      publicEnvSchema.parse({
        NEXT_PUBLIC_SITE_URL: "https://lodging-technologies.example",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://lodging-technologies.example",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    });
  });

  it("rejects a relative site URL", () => {
    expect(() =>
      publicEnvSchema.parse({
        NEXT_PUBLIC_SITE_URL: "/contact",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow();
  });

  it("returns null for optional public env when build-time auth vars are absent", () => {
    const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalPublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(getOptionalPublicEnv()).toBeNull();

    restoreEnv("NEXT_PUBLIC_SITE_URL", originalSiteUrl);
    restoreEnv("NEXT_PUBLIC_SUPABASE_URL", originalSupabaseUrl);
    restoreEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", originalPublishableKey);
  });
});
