import { envSchema, type EnvConfig } from "@lodging-technologies/zod-schemas";

const parseEnv = (): EnvConfig => {
  // Direct literal property access forces Next.js AST to inline values at build time
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

export const env: EnvConfig = parseEnv();
