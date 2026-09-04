"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { changeInquiryStatus } from "@/features/inquiry/server/admin-inquiries";

export async function updateInquiryStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");
  const validStatuses = ["New", "Contacted", "Closed"] as const;
  if (
    typeof id !== "string" ||
    typeof status !== "string" ||
    !validStatuses.includes(status as (typeof validStatuses)[number])
  ) {
    throw new Error("Invalid inquiry status update");
  }
  await changeInquiryStatus(id, status as (typeof validStatuses)[number]);
  revalidatePath("/admin");
  redirect("/admin?view=inquiries");
}
