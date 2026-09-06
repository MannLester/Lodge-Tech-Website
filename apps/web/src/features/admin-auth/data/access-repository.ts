import "server-only";

import {
  normalizeAdminEmail,
  type AdminSession,
} from "@/features/admin-auth/model/admin-session";
import {
  accessRoles,
  type AccessRole,
} from "@/features/admin-auth/model/permissions";
import { getServerSupabaseClient } from "@/shared/supabase/server";

import type { Database } from "@lodging-technologies/types/database";

export type CrmUser = Database["public"]["Tables"]["crm_users"]["Row"];
export type CrmUserStatus = CrmUser["status"];

export const accessRepository = {
  async findActiveAccountForAuthUser(
    email: string,
    authUserId: string,
  ): Promise<Pick<AdminSession, "crmUserId" | "role"> | null> {
    const normalizedEmail = normalizeAdminEmail(email);
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from("crm_users")
      .select("id, auth_user_id, role, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("Failed to check CRM access account", error);
      return null;
    }

    if (!data || data.status === "DISABLED") return null;
    if (data.auth_user_id && data.auth_user_id !== authUserId) return null;

    if (!data.auth_user_id || data.status === "INVITED") {
      const { data: activated, error: activationError } = await supabase
        .from("crm_users")
        .update({
          auth_user_id: authUserId,
          last_login_at: new Date().toISOString(),
          status: "ACTIVE",
        })
        .eq("id", data.id)
        .select("id, role")
        .single();

      if (activationError) {
        console.error("Failed to activate CRM access account", activationError);
        return null;
      }

      return {
        crmUserId: activated.id,
        role: activated.role,
      };
    }

    await supabase
      .from("crm_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.id);

    return {
      crmUserId: data.id,
      role: data.role,
    };
  },

  async list(): Promise<CrmUser[]> {
    const { data, error } = await getServerSupabaseClient()
      .from("crm_users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error)
      throw new Error("Supabase failed to load CRM access users", {
        cause: error,
      });
    return data;
  },

  async invite(email: string, role: AccessRole, actor: AdminSession) {
    const { error } = await getServerSupabaseClient()
      .from("crm_users")
      .insert({
        created_by: actor.crmUserId,
        email: normalizeAdminEmail(email),
        role,
        status: "INVITED",
        updated_by: actor.crmUserId,
      });
    if (error)
      throw new Error("Supabase failed to invite CRM user", { cause: error });
  },

  async updateRole(id: string, role: AccessRole, actor: AdminSession) {
    const { error } = await getServerSupabaseClient()
      .from("crm_users")
      .update({ role, updated_by: actor.crmUserId })
      .eq("id", id);
    if (error)
      throw new Error("Supabase failed to update CRM user role", {
        cause: error,
      });
  },

  async updateStatus(id: string, status: CrmUserStatus, actor: AdminSession) {
    const { error } = await getServerSupabaseClient()
      .from("crm_users")
      .update({
        disabled_at: status === "DISABLED" ? new Date().toISOString() : null,
        status,
        updated_by: actor.crmUserId,
      })
      .eq("id", id);
    if (error)
      throw new Error("Supabase failed to update CRM user status", {
        cause: error,
      });
  },

  async deleteInvited(id: string) {
    const { error } = await getServerSupabaseClient()
      .from("crm_users")
      .delete()
      .eq("id", id)
      .eq("status", "INVITED");
    if (error)
      throw new Error("Supabase failed to delete invited CRM user", {
        cause: error,
      });
  },
};

export function isValidAccessRole(value: unknown): value is AccessRole {
  return typeof value === "string" && accessRoles.includes(value as AccessRole);
}
