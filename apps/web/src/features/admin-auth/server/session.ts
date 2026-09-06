import "server-only";

import {
  type AdminSession,
  createAdminSessionFromUser,
  normalizeAdminEmail,
} from "@/features/admin-auth/model/admin-session";
import { createSupabaseAuthServerClient } from "@/shared/supabase/auth";
import { getServerSupabaseClient } from "@/shared/supabase/server";

export async function isAllowedAdminEmail(email: string): Promise<boolean> {
  const { data, error } = await getServerSupabaseClient()
    .from("admin_users")
    .select("email")
    .eq("email", normalizeAdminEmail(email))
    .maybeSingle();

  if (error) {
    console.error("Failed to check admin allowlist", error);
    return false;
  }

  return Boolean(data);
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return createAdminSessionFromUser(user, isAllowedAdminEmail);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await readAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createSupabaseAuthServerClient();
  await supabase.auth.signOut();
}
