"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  accessRepository,
  isValidAccessRole,
  type CrmUserStatus,
} from "@/features/admin-auth/data/access-repository";
import { auditRepository } from "@/features/admin-auth/data/audit-repository";
import { requirePermission } from "@/features/admin-auth/server/session";

const statuses = ["INVITED", "ACTIVE", "DISABLED"] as const;

function validUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function normalizeEmailInput(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") throw new Error("Email is required");
  const email = value.trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email))
    throw new Error("A valid email is required");
  return email;
}

export async function inviteCrmUser(formData: FormData) {
  const actor = await requirePermission("access.manage");
  const email = normalizeEmailInput(formData.get("email"));
  const role = formData.get("role");
  if (!isValidAccessRole(role)) throw new Error("A valid role is required");

  await accessRepository.invite(email, role, actor);
  await auditRepository.record(actor, {
    action: "access.invite",
    after: { email, role, status: "INVITED" },
    resourceType: "crm_user",
  });
  revalidatePath("/admin");
  redirect("/admin?view=access");
}

export async function updateCrmUserRole(formData: FormData) {
  const actor = await requirePermission("access.manage");
  const id = formData.get("id");
  const role = formData.get("role");
  if (!validUuid(id) || !isValidAccessRole(role))
    throw new Error("Invalid access role update");

  const before = (await accessRepository.list()).find((user) => user.id === id);
  await accessRepository.updateRole(id, role, actor);
  await auditRepository.record(actor, {
    action: "access.role_updated",
    after: { role },
    before: before ? { role: before.role } : null,
    resourceId: id,
    resourceType: "crm_user",
  });
  revalidatePath("/admin");
  redirect("/admin?view=access");
}

export async function updateCrmUserStatus(formData: FormData) {
  const actor = await requirePermission("access.manage");
  const id = formData.get("id");
  const status = formData.get("status");
  if (
    !validUuid(id) ||
    typeof status !== "string" ||
    !statuses.includes(status as CrmUserStatus)
  )
    throw new Error("Invalid access status update");

  const before = (await accessRepository.list()).find((user) => user.id === id);
  await accessRepository.updateStatus(id, status as CrmUserStatus, actor);
  await auditRepository.record(actor, {
    action: "access.status_updated",
    after: { status },
    before: before ? { status: before.status } : null,
    resourceId: id,
    resourceType: "crm_user",
  });
  revalidatePath("/admin");
  redirect("/admin?view=access");
}

export async function deleteInvitedCrmUser(formData: FormData) {
  const actor = await requirePermission("access.manage");
  const id = formData.get("id");
  if (!validUuid(id)) throw new Error("Invalid invited user");

  const before = (await accessRepository.list()).find((user) => user.id === id);
  if (before?.status !== "INVITED")
    throw new Error("Only invited users can be deleted");

  await accessRepository.deleteInvited(id);
  await auditRepository.record(actor, {
    action: "access.invite_deleted",
    before: { email: before.email, role: before.role, status: before.status },
    resourceId: id,
    resourceType: "crm_user",
  });
  revalidatePath("/admin");
  redirect("/admin?view=access");
}
