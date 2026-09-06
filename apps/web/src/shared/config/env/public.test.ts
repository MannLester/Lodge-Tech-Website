import { describe, expect, it } from "vitest";

import { publicEnvSchema } from "./public";

describe("publicEnvSchema", () => {
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
});
