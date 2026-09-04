import "server-only";

import { cookies } from "next/headers";

import {
  type AdminSession,
  createDemoAdminSession,
  signAdminSession,
  verifyAdminSessionToken,
} from "@/features/admin-auth/model/admin-session-token";

import { getAdminAuthEnv } from "@/features/admin-auth/server/env";

export const adminSessionCookieName = "lodge_admin_session";

function getCookieOptions(expires: Date) {
  const { NODE_ENV } = getAdminAuthEnv();

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function createAdminSessionCookie(): Promise<void> {
  const { SESSION_SECRET } = getAdminAuthEnv();
  const session = createDemoAdminSession();
  const token = await signAdminSession(session, SESSION_SECRET);
  const cookieStore = await cookies();

  cookieStore.set({
    name: adminSessionCookieName,
    value: token,
    ...getCookieOptions(new Date(session.expiresAt)),
  });
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  if (!token) return null;

  const { SESSION_SECRET } = getAdminAuthEnv();

  return verifyAdminSessionToken(token, SESSION_SECRET);
}

export async function deleteAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: adminSessionCookieName,
    value: "",
    ...getCookieOptions(new Date(0)),
    maxAge: 0,
  });
}
