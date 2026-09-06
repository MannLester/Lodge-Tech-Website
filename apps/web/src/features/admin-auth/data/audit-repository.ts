import "server-only";

import type { AdminSession } from "@/features/admin-auth/model/admin-session";
import { getServerSupabaseClient } from "@/shared/supabase/server";

import type { Database } from "@lodging-technologies/types/database";

export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AuditData = Record<string, boolean | number | string | null>;

export type AuditEvent = {
  action: string;
  after?: AuditData | null;
  before?: AuditData | null;
  resourceId?: string | null;
  resourceType: string;
};

export const auditRepository = {
  async list(limit = 100): Promise<AuditLog[]> {
    const { data, error } = await getServerSupabaseClient()
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error)
      throw new Error("Supabase failed to load audit logs", { cause: error });
    return data;
  },

  async record(actor: AdminSession | null, event: AuditEvent): Promise<void> {
    const { error } = await getServerSupabaseClient()
      .from("audit_logs")
      .insert({
        action: event.action,
        actor_auth_user_id: actor?.sub ?? null,
        actor_crm_user_id: actor?.crmUserId ?? null,
        actor_email: actor?.email ?? null,
        actor_role: actor?.role ?? null,
        after_data: event.after ?? null,
        before_data: event.before ?? null,
        resource_id: event.resourceId ?? null,
        resource_type: event.resourceType,
      });
    if (error)
      throw new Error("Supabase failed to record audit log", { cause: error });
  },

  async recordBestEffort(
    actor: AdminSession | null,
    event: AuditEvent,
  ): Promise<void> {
    try {
      await auditRepository.record(actor, event);
    } catch (error) {
      console.error("Failed to record audit event", error);
    }
  },
};
