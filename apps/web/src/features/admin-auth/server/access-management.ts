import "server-only";

import {
  accessRepository,
  type CrmUser,
} from "@/features/admin-auth/data/access-repository";
import {
  auditRepository,
  type AuditLog,
} from "@/features/admin-auth/data/audit-repository";
import { requirePermission } from "@/features/admin-auth/server/session";

export type AdminAccessResult =
  { ok: true; users: CrmUser[] } | { ok: false; message: string };

export type AdminAuditResult =
  { auditLogs: AuditLog[]; ok: true } | { message: string; ok: false };

export async function loadAdminAccessUsers(): Promise<AdminAccessResult> {
  try {
    await requirePermission("access.manage");
    return { ok: true, users: await accessRepository.list() };
  } catch (error) {
    console.error("Failed to load CRM access users", error);
    return {
      ok: false,
      message: "Access users could not be loaded.",
    };
  }
}

export async function loadAdminAuditLogs(): Promise<AdminAuditResult> {
  try {
    await requirePermission("audit.read");
    return { auditLogs: await auditRepository.list(), ok: true };
  } catch (error) {
    console.error("Failed to load CRM audit logs", error);
    return {
      message: "Audit logs could not be loaded.",
      ok: false,
    };
  }
}
