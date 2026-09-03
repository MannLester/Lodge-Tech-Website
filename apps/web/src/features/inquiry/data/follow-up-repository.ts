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
  async create(input: FollowUpInput) {
    const { error } = await getServerSupabaseClient()
      .from("follow_ups")
      .insert(input);
    if (error)
      throw new Error("Supabase failed to create follow-up", { cause: error });
  },
  async complete(id: string) {
    const { error } = await getServerSupabaseClient()
      .from("follow_ups")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", id);
    if (error)
      throw new Error("Supabase failed to complete follow-up", {
        cause: error,
      });
  },
};
