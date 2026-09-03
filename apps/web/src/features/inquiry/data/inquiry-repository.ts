import "server-only";

import { getServerSupabaseClient } from "@/shared/supabase/server";

import type { InquirySubmission } from "@lodging-technologies/zod-schemas/inquiries";
import type { Database } from "@lodging-technologies/types/database";

export type InquiryRecord = Omit<InquirySubmission, "website">;
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type InquiryStatus = Inquiry["status"];

export interface InquiryRepository {
  create(inquiry: InquiryRecord): Promise<void>;
  list?(): Promise<Inquiry[]>;
  updateStatus?(id: string, status: InquiryStatus): Promise<void>;
}

export const supabaseInquiryRepository: InquiryRepository = {
  async create(inquiry) {
    const { error } = await getServerSupabaseClient().from("inquiries").insert({
      company: inquiry.company,
      email: inquiry.email,
      message: inquiry.message,
      name: inquiry.name,
      phone: inquiry.phone,
      property_type: inquiry.propertyType,
    });

    if (error) {
      throw new Error("Supabase failed to persist the inquiry", {
        cause: error,
      });
    }
  },
  async list() {
    const { data, error } = await getServerSupabaseClient()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error)
      throw new Error("Supabase failed to load inquiries", { cause: error });
    return data;
  },
  async updateStatus(id, status) {
    const { error } = await getServerSupabaseClient()
      .from("inquiries")
      .update({ status })
      .eq("id", id);
    if (error)
      throw new Error("Supabase failed to update inquiry status", {
        cause: error,
      });
  },
};
