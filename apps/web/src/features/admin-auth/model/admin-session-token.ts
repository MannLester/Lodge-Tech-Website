import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

import { type AdminSession as BaseAdminSession } from "@/features/admin-auth/model/admin-session";

export const adminSessionDurationMs = 8 * 60 * 60 * 1000;

export const adminSessionSchema = z.object({
  sub: z.literal("demo-admin"),
  role: z.literal("admin"),
  authMode: z.literal("demo"),
  expiresAt: z.number().int().positive(),
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

function toAdminSessionPayload(session: AdminSession) {
  return {
    authMode: session.authMode,
    expiresAt: session.expiresAt,
    role: session.role,
    sub: session.sub,
  };
}

async function createSecretKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"],
  );
}

export function createDemoAdminSession(now = new Date()): AdminSession {
  return {
    sub: "demo-admin",
    role: "admin",
    authMode: "demo",
    expiresAt: now.getTime() + adminSessionDurationMs,
  };
}

export async function signAdminSession(
  session: AdminSession,
  secret: string,
): Promise<string> {
  const key = await createSecretKey(secret);

  return new SignJWT(toAdminSessionPayload(session))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(session.expiresAt / 1000))
    .sign(key);
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
  now = new Date(),
): Promise<AdminSession | null> {
  try {
    const key = await createSecretKey(secret);
    const { payload } = await jwtVerify(token, key, { currentDate: now });
    const session = adminSessionSchema.safeParse(payload);
    return session.success ? session.data : null;
  } catch {
    return null;
  }
}

export type { BaseAdminSession as AdminAuthSession };
