import { envSchema, type EnvConfig } from "@lodging-technologies/zod-schemas";

let cachedEnv: EnvConfig | undefined;

const parseEnv = (): EnvConfig => {
  // Explicit property access forces Next.js AST to inline NEXT_PUBLIC_ variables.
  const envValues = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };

  const result = envSchema.safeParse(envValues);

  if (!result.success) {
    console.error(
      "❌ Invalid Environment Variable Configuration:\n",
      JSON.stringify(result.error.format(), null, 2),
    );
    throw new Error(
      "Missing or invalid environment variables. Check Vercel build settings.",
    );
  }

  return result.data;
};

export function getEnv(): EnvConfig {
  cachedEnv ??= parseEnv();
  return cachedEnv;
}

export const env = new Proxy({} as EnvConfig, {
  get(_target, property) {
    const snapshot = getEnv();
    return Reflect.get(snapshot, property);
  },
  has(_target, property) {
    return property in getEnv();
  },
  ownKeys() {
    return Reflect.ownKeys(getEnv());
  },
  getOwnPropertyDescriptor(_target, property) {
    const descriptor = Object.getOwnPropertyDescriptor(getEnv(), property);
    return descriptor ?? undefined;
  },
});
