"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addInquiryNote,
  changeInquiryStatus,
} from "@/features/inquiry/server/admin-inquiries";

const validStatuses = ["New", "Contacted", "Qualified", "Won", "Lost"] as const;

function validUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export async function updateInquiryStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");
  if (
    !validUuid(id) ||
    typeof status !== "string" ||
    !validStatuses.includes(status as (typeof validStatuses)[number])
  ) {
    throw new Error("Invalid inquiry status update");
  }
  await changeInquiryStatus(id, status as (typeof validStatuses)[number]);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
  redirect(
    formData.get("context") === "detail"
      ? `/admin/leads/${id}`
      : "/admin?view=leads",
  );
}

export async function addInquiryNoteAction(formData: FormData) {
  const id = formData.get("inquiry_id");
  const body = formData.get("body");
  if (!validUuid(id) || typeof body !== "string")
    throw new Error("Invalid lead note");
  const note = body.trim();
  if (!note || note.length > 2000)
    throw new Error("A note between 1 and 2000 characters is required");
  await addInquiryNote(id, note);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
  redirect(`/admin/leads/${id}`);
}
