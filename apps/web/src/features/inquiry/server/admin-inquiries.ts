import "server-only";

import { readAdminSession } from "@/features/admin-auth";
import {
  followUpRepository,
  type FollowUp,
} from "@/features/inquiry/data/follow-up-repository";
import {
  activityRepository,
  type InquiryActivity,
} from "@/features/inquiry/data/activity-repository";

import {
  supabaseInquiryRepository,
  type Inquiry,
  type InquiryRepository,
  type InquiryStatus,
} from "@/features/inquiry/data/inquiry-repository";

export type AdminInquiryResult =
  { ok: true; inquiries: Inquiry[] } | { ok: false; message: string };
export type AdminFollowUpResult =
  { ok: true; followUps: FollowUp[] } | { ok: false; message: string };
export type AdminLeadResult =
  | {
      ok: true;
      inquiry: Inquiry;
      followUps: FollowUp[];
      activities: InquiryActivity[];
    }
  | { ok: false; message: string; notFound?: boolean };

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
  } catch (error) {
    console.error("Failed to load admin leads", error);
    return {
      ok: false,
      message: "Leads could not be loaded. Check the Supabase configuration.",
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

export async function loadAdminFollowUps(): Promise<AdminFollowUpResult> {
  try {
    await requireAdmin();
    return { ok: true, followUps: await followUpRepository.list() };
  } catch (error) {
    console.error("Failed to load admin tasks", error);
    return {
      ok: false,
      message: "Tasks could not be loaded. Check the Supabase configuration.",
    };
  }
}

export async function loadAdminLead(id: string): Promise<AdminLeadResult> {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  )
    return { ok: false, message: "Lead not found.", notFound: true };
  try {
    await requireAdmin();
    if (!supabaseInquiryRepository.findById)
      throw new Error("Lead lookup is unavailable");
    const inquiry = await supabaseInquiryRepository.findById(id);
    if (!inquiry)
      return { ok: false, message: "Lead not found.", notFound: true };
    const [followUps, activities] = await Promise.all([
      followUpRepository.listByInquiry(id),
      activityRepository.listByInquiry(id),
    ]);
    return { ok: true, inquiry, followUps, activities };
  } catch (error) {
    console.error("Failed to load admin lead", error);
    return {
      ok: false,
      message:
        "This lead could not be loaded. Check the Supabase configuration.",
    };
  }
}

export async function addInquiryNote(id: string, body: string) {
  await requireAdmin();
  await activityRepository.addNote(id, body);
}
