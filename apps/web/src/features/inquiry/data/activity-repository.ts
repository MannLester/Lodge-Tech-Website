import "server-only";

import { getServerSupabaseClient } from "@/shared/supabase/server";
import type { Database } from "@lodging-technologies/types/database";

export type InquiryActivity =
  Database["public"]["Tables"]["inquiry_activities"]["Row"];

export const activityRepository = {
  async listByInquiry(inquiryId: string): Promise<InquiryActivity[]> {
    const { data, error } = await getServerSupabaseClient()
      .from("inquiry_activities")
      .select("*")
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: false });
    if (error)
      throw new Error("Supabase failed to load inquiry activity", {
        cause: error,
      });
    return data;
  },
  async addNote(inquiryId: string, body: string): Promise<void> {
    const { error } = await getServerSupabaseClient()
      .from("inquiry_activities")
      .insert({ activity_type: "note", body, inquiry_id: inquiryId });
    if (error)
      throw new Error("Supabase failed to add inquiry note", { cause: error });
  },
};
