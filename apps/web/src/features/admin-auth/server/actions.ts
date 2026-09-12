"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auditRepository } from "@/features/admin-auth/data/audit-repository";
import {
  readAdminSession,
  signOutAdmin,
} from "@/features/admin-auth/server/session";
import { getPublicEnv } from "@/shared/config/env/public";
import { createSupabaseAuthServerClient } from "@/shared/supabase/auth";

function sanitizeAdminNextPath(value: FormDataEntryValue | null): string {
  return typeof value === "string" &&
    (value === "/admin" ||
      value.startsWith("/admin/") ||
      value.startsWith("/admin?"))
    ? value
    : "/admin";
}

function parseHostHeader(value: string | null): string | null {
  if (!value) return null;
  const host = value.split(",", 1)[0]?.trim();
  return host || null;
}

function isLocalhostHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

async function resolveOAuthRedirectOrigin(configuredSiteUrl: string) {
  if (process.env.NODE_ENV === "production") return configuredSiteUrl;

  const requestHeaders = await headers();
  const host =
    parseHostHeader(requestHeaders.get("x-forwarded-host")) ??
    parseHostHeader(requestHeaders.get("host"));

  if (!host) return configuredSiteUrl;

  const forwardedProto = parseHostHeader(
    requestHeaders.get("x-forwarded-proto"),
  );
  const protocol =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : "http";

  try {
    const candidate = new URL(`${protocol}://${host}`);
    return isLocalhostHost(candidate.hostname)
      ? candidate.origin
      : configuredSiteUrl;
  } catch {
    return configuredSiteUrl;
  }
}

export async function loginWithGoogle(formData: FormData): Promise<void> {
  const next = sanitizeAdminNextPath(formData.get("next"));
  const supabase = await createSupabaseAuthServerClient();
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  const redirectOrigin = await resolveOAuthRedirectOrigin(NEXT_PUBLIC_SITE_URL);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${redirectOrigin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) throw new Error("Google sign-in could not start.");

  redirect(data.url);
}

export async function logoutAdmin(): Promise<void> {
  const session = await readAdminSession();
  await signOutAdmin();
  await auditRepository.recordBestEffort(session, {
    action: "auth.logout",
    resourceType: "auth_session",
  });
  redirect("/admin");
}
