import { describe, expect, it } from "vitest";

import {
  adminSessionDurationMs,
  createDemoAdminSession,
  signAdminSession,
  verifyAdminSessionToken,
} from "./admin-session-token";

const secret = "0123456789abcdefghijklmnopqrstuvwxyz-demo-secret";
const now = new Date("2026-09-03T08:00:00.000Z");

describe("admin session tokens", () => {
  it("verifies a valid demo admin session", async () => {
    const session = createDemoAdminSession(now);
    const token = await signAdminSession(session, secret);

    await expect(verifyAdminSessionToken(token, secret, now)).resolves.toEqual(
      session,
    );
  });

  it("rejects expired sessions", async () => {
    const session = createDemoAdminSession(now);
    const token = await signAdminSession(session, secret);
    const afterExpiry = new Date(now.getTime() + adminSessionDurationMs + 1000);

    await expect(
      verifyAdminSessionToken(token, secret, afterExpiry),
    ).resolves.toBeNull();
  });

  it("rejects altered tokens", async () => {
    const session = createDemoAdminSession(now);
    const token = await signAdminSession(session, secret);
    const [header, payload, signature] = token.split(".");
    const alteredSignature = `${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`;
    const alteredToken = [header, payload, alteredSignature].join(".");

    await expect(
      verifyAdminSessionToken(alteredToken, secret, now),
    ).resolves.toBeNull();
  });

  it("rejects malformed tokens", async () => {
    await expect(
      verifyAdminSessionToken("not-a-session", secret, now),
    ).resolves.toBeNull();
  });

  it("rejects incorrectly claimed sessions", async () => {
    const badSession = {
      ...createDemoAdminSession(now),
      role: "viewer",
    };
    const token = await signAdminSession(
      badSession as Parameters<typeof signAdminSession>[0],
      secret,
    );

    await expect(
      verifyAdminSessionToken(token, secret, now),
    ).resolves.toBeNull();
  });
});
