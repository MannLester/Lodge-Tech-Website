import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getOptionalPublicEnv,
  getPublicEnv,
  type PublicEnv,
} from "@/shared/config/env/public";

import type { Database } from "@lodging-technologies/types/database";

type AuthClientOptions = {
  fetch?: typeof fetch;
};

async function createAuthClient(env: PublicEnv, options?: AuthClientOptions) {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        experimental: {
          appendPkceFlowIdToRedirects: true,
        },
      },
      global: options?.fetch ? { fetch: options.fetch } : undefined,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, options, value }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies. Route handlers, actions,
            // and the request proxy handle refresh writes.
          }
        },
      },
    },
  );
}

export async function createSupabaseAuthServerClient(
  options?: AuthClientOptions,
) {
  return createAuthClient(getPublicEnv(), options);
}

export async function createOptionalSupabaseAuthServerClient() {
  const env = getOptionalPublicEnv();

  return env ? createAuthClient(env) : null;
}
