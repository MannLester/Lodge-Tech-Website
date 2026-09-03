import "server-only";

import { readAdminSession } from "@/features/admin-auth/server/session";

import {
  supabaseInquiryRepository,
  type Inquiry,
  type InquiryRepository,
  type InquiryStatus,
} from "../data/inquiry-repository";

export type AdminInquiryResult =
  { ok: true; inquiries: Inquiry[] } | { ok: false; message: string };

async function requireAdmin() {
  const session = await readAdminSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
}

export async function loadAdminInquiries(
  repository: InquiryRepository = supabaseInquiryRepository,
): Promise<AdminInquiryResult> {
  try {
    await requireAdmin();
    if (!repository.list) throw new Error("Inquiry listing is unavailable");
    return { ok: true, inquiries: await repository.list() };
  } catch {
    return {
      ok: false,
      message:
        "Inquiries could not be loaded. Check the Supabase configuration.",
    };
  }
}

export async function changeInquiryStatus(
  id: string,
  status: InquiryStatus,
  repository: InquiryRepository = supabaseInquiryRepository,
) {
  await requireAdmin();
  if (!repository.updateStatus)
    throw new Error("Inquiry updates are unavailable");
  await repository.updateStatus(id, status);
}
