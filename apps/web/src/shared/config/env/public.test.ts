import { describe, expect, it } from "vitest";

import { publicEnvSchema } from "./public";

describe("publicEnvSchema", () => {
  it("accepts an absolute site URL", () => {
    expect(
      publicEnvSchema.parse({
        NEXT_PUBLIC_SITE_URL: "https://lodging-technologies.example",
      }),
    ).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://lodging-technologies.example",
    });
  });

  it("rejects a relative site URL", () => {
    expect(() =>
      publicEnvSchema.parse({ NEXT_PUBLIC_SITE_URL: "/contact" }),
    ).toThrow();
  });
});
