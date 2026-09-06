"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auditRepository, requirePermission } from "@/features/admin-auth";
import { followUpRepository } from "@/features/inquiry/data/follow-up-repository";

function validUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export async function createFollowUp(formData: FormData) {
  const session = await requirePermission("crm.write");
  const inquiryId = formData.get("inquiry_id");
  const title = formData.get("title");
  const notes = formData.get("notes");
  const dueAt = formData.get("due_at");
  if (
    !validUuid(inquiryId) ||
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 160
  )
    throw new Error("A follow-up title is required");
  if (typeof notes === "string" && notes.trim().length > 2000)
    throw new Error("Follow-up notes must be 2000 characters or fewer");
  if (
    typeof dueAt !== "string" ||
    (dueAt !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dueAt))
  )
    throw new Error("Invalid follow-up due date");
  const followUp = await followUpRepository.create({
    inquiry_id: inquiryId,
    title: title.trim(),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    due_at: typeof dueAt === "string" && dueAt ? dueAt : null,
  });
  await auditRepository.record(session, {
    action: "follow_up.created",
    after: {
      due_at: followUp.due_at,
      inquiry_id: followUp.inquiry_id,
      title_length: followUp.title.length,
    },
    resourceId: followUp.id,
    resourceType: "follow_up",
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${inquiryId}`);
  redirect(
    formData.get("context") === "detail"
      ? `/admin/leads/${inquiryId}`
      : "/admin?view=tasks",
  );
}

export async function completeFollowUp(formData: FormData) {
  const session = await requirePermission("crm.write");
  const id = formData.get("id");
  const inquiryId = formData.get("inquiry_id");
  if (!validUuid(id)) throw new Error("Invalid follow-up");
  const followUp = await followUpRepository.complete(id);
  await auditRepository.record(session, {
    action: "follow_up.completed",
    after: followUp
      ? { completed_at: followUp.completed_at, inquiry_id: followUp.inquiry_id }
      : null,
    resourceId: id,
    resourceType: "follow_up",
  });
  revalidatePath("/admin");
  if (validUuid(inquiryId)) revalidatePath(`/admin/leads/${inquiryId}`);
  redirect(
    formData.get("context") === "detail" && validUuid(inquiryId)
      ? `/admin/leads/${inquiryId}`
      : "/admin?view=tasks",
  );
}
