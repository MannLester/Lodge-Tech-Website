import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

export const adminSessionDurationMs = 8 * 60 * 60 * 1000;

export const adminSessionSchema = z.object({
  sub: z.literal("demo-admin"),
  role: z.literal("admin"),
  authMode: z.literal("demo"),
  expiresAt: z.number().int().positive(),
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

const encoder = new TextEncoder();

async function getSecretKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
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
  return new SignJWT({
    role: session.role,
    authMode: session.authMode,
    expiresAt: session.expiresAt,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(session.expiresAt / 1000))
    .sign(await getSecretKey(secret));
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string,
  now = new Date(),
): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, await getSecretKey(secret), {
      algorithms: ["HS256"],
      currentDate: now,
      subject: "demo-admin",
    });
    const session = adminSessionSchema.parse(payload);

    if (session.expiresAt <= now.getTime()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
