import { describe, expect, it } from "vitest";

import {
  demoAdminFallbackSessionSecret,
  resolveAdminAuthEnv,
} from "./admin-auth-env";

describe("admin auth env", () => {
  it("uses a fallback session secret in development", () => {
    expect(
      resolveAdminAuthEnv({
        NODE_ENV: "development",
        SESSION_SECRET: undefined,
      }),
    ).toEqual({
      NODE_ENV: "development",
      SESSION_SECRET: demoAdminFallbackSessionSecret,
    });
  });

  it("uses a fallback session secret in tests", () => {
    expect(
      resolveAdminAuthEnv({
        NODE_ENV: "test",
        SESSION_SECRET: undefined,
      }),
    ).toEqual({
      NODE_ENV: "test",
      SESSION_SECRET: demoAdminFallbackSessionSecret,
    });
  });

  it("uses the configured session secret when present", () => {
    const sessionSecret = "configured-demo-admin-secret-000000000";

    expect(
      resolveAdminAuthEnv({
        NODE_ENV: "development",
        SESSION_SECRET: sessionSecret,
      }).SESSION_SECRET,
    ).toBe(sessionSecret);
  });

  it("requires a configured session secret in production", () => {
    expect(() =>
      resolveAdminAuthEnv({
        NODE_ENV: "production",
        SESSION_SECRET: undefined,
      }),
    ).toThrow("SESSION_SECRET is required for production admin access.");
  });

  it("rejects short configured session secrets", () => {
    expect(() =>
      resolveAdminAuthEnv({
        NODE_ENV: "development",
        SESSION_SECRET: "short",
      }),
    ).toThrow();
  });
});
