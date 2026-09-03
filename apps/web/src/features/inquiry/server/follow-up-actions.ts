"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/features/admin-auth/server/session";
import { followUpRepository } from "../data/follow-up-repository";

async function requireAdmin() {
  const session = await readAdminSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
}

export async function createFollowUp(formData: FormData) {
  await requireAdmin();
  const inquiryId = formData.get("inquiry_id");
  const title = formData.get("title");
  const notes = formData.get("notes");
  const dueAt = formData.get("due_at");
  if (
    typeof inquiryId !== "string" ||
    typeof title !== "string" ||
    !title.trim()
  )
    throw new Error("A follow-up title is required");
  await followUpRepository.create({
    inquiry_id: inquiryId,
    title: title.trim(),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    due_at: typeof dueAt === "string" && dueAt ? dueAt : null,
  });
  revalidatePath("/admin");
  redirect("/admin?view=follow-ups");
}

export async function completeFollowUp(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") throw new Error("Invalid follow-up");
  await followUpRepository.complete(id);
  revalidatePath("/admin");
  redirect("/admin?view=follow-ups");
}
