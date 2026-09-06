import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getOptionalPublicEnv,
  getPublicEnv,
  type PublicEnv,
} from "@/shared/config/env/public";

import type { Database } from "@lodging-technologies/types/database";

async function createAuthClient(env: PublicEnv) {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
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

export async function createSupabaseAuthServerClient() {
  return createAuthClient(getPublicEnv());
}

export async function createOptionalSupabaseAuthServerClient() {
  const env = getOptionalPublicEnv();

  return env ? createAuthClient(env) : null;
}
