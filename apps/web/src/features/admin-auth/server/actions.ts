"use server";

import { redirect } from "next/navigation";

import { signOutAdmin } from "@/features/admin-auth/server/session";
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

export async function loginWithGoogle(formData: FormData): Promise<void> {
  const next = sanitizeAdminNextPath(formData.get("next"));
  const supabase = await createSupabaseAuthServerClient();
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) throw new Error("Google sign-in could not start.");

  redirect(data.url);
}

export async function logoutAdmin(): Promise<void> {
  await signOutAdmin();
  redirect("/admin");
}
