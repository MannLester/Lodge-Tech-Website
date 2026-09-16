import "server-only";

import { getServerSupabaseClient } from "@/shared/supabase/server";

import type { Database } from "@lodging-technologies/types/database";

type AdminUserUpdate = Database["public"]["Tables"]["admin_users"]["Update"];

export async function findAdminAccountByEmail(email: string) {
  return getServerSupabaseClient()
    .from("admin_users")
    .select("email, display_name, job_title, phone, avatar_path, updated_at")
    .eq("email", email)
    .maybeSingle();
}

export async function updateAdminAccountByEmail(
  email: string,
  update: AdminUserUpdate,
) {
  return getServerSupabaseClient()
    .from("admin_users")
    .update(update)
    .eq("email", email)
    .select("email")
    .single();
}
