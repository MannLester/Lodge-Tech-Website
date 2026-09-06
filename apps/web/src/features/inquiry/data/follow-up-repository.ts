import "server-only";

import { getServerSupabaseClient } from "@/shared/supabase/server";
import type { Database } from "@lodging-technologies/types/database";

export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"];
export type FollowUpInput = Pick<
  FollowUp,
  "inquiry_id" | "title" | "notes" | "due_at"
>;

export const followUpRepository = {
  async list(): Promise<FollowUp[]> {
    const { data, error } = await getServerSupabaseClient()
      .from("follow_ups")
      .select("*")
      .order("due_at", { ascending: true, nullsFirst: false });
    if (error)
      throw new Error("Supabase failed to load follow-ups", { cause: error });
    return data;
  },
  async create(input: FollowUpInput): Promise<FollowUp> {
    const { data, error } = await getServerSupabaseClient()
      .from("follow_ups")
      .insert(input)
      .select("*")
      .single();
    if (error)
      throw new Error("Supabase failed to create follow-up", { cause: error });
    return data;
  },
  async listByInquiry(inquiryId: string): Promise<FollowUp[]> {
    const { data, error } = await getServerSupabaseClient()
      .from("follow_ups")
      .select("*")
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: false });
    if (error)
      throw new Error("Supabase failed to load lead tasks", { cause: error });
    return data;
  },
  async complete(id: string): Promise<FollowUp | null> {
    const { data, error } = await getServerSupabaseClient()
      .from("follow_ups")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error)
      throw new Error("Supabase failed to complete follow-up", {
        cause: error,
      });
    return data;
  },
};
