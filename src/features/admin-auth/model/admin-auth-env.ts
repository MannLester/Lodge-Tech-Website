import { z } from "zod";

const adminAuthEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SESSION_SECRET: z.string().min(32).optional(),
});

export const demoAdminFallbackSessionSecret =
  "local-demo-admin-session-secret-fallback-000000";

export type AdminAuthEnv = Omit<
  z.infer<typeof adminAuthEnvSchema>,
  "SESSION_SECRET"
> & {
  SESSION_SECRET: string;
};

export function resolveAdminAuthEnv(input: {
  NODE_ENV: string | undefined;
  SESSION_SECRET: string | undefined;
}): AdminAuthEnv {
  const env = adminAuthEnvSchema.parse(input);

  if (!env.SESSION_SECRET && env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required for production admin access.");
  }

  return {
    NODE_ENV: env.NODE_ENV,
    SESSION_SECRET: env.SESSION_SECRET ?? demoAdminFallbackSessionSecret,
  };
}
