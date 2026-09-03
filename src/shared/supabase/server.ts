import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/shared/config/env/server";

import type { Database } from "./database.types";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getServerSupabaseClient() {
  if (!client) {
    const env = getServerEnv();

    client = createClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return client;
}
