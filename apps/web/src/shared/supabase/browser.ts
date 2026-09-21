import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/shared/config/env/public";

import type { Database } from "@lodging-technologies/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getBrowserSupabaseClient(): ReturnType<
  typeof createBrowserClient<Database>
> {
  const env = getPublicEnv();

  client ??= createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        experimental: {
          appendPkceFlowIdToRedirects: true,
        },
      },
    },
  );

  return client;
}
