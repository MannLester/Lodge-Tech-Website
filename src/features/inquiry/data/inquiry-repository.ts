import "server-only";

import { getServerSupabaseClient } from "@/shared/supabase/server";

import type { InquirySubmission } from "@/shared/inquiries/schema";

export type InquiryRecord = Omit<InquirySubmission, "website">;

export interface InquiryRepository {
  create(inquiry: InquiryRecord): Promise<void>;
}

export const supabaseInquiryRepository: InquiryRepository = {
  async create(inquiry) {
    const { error } = await getServerSupabaseClient()
      .from("inquiries")
      .insert({
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
};
